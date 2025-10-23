-- ============================================
-- VIEWS PARA FACILITAR QUERIES - SISTEMA BRACELL
-- ============================================

-- ============================================
-- VIEW 1: Visão Completa das Fazendas com Status Operacional
-- ============================================
CREATE OR REPLACE VIEW vw_fazendas_status AS
SELECT 
    f.id,
    f.nome,
    f.codigo,
    f.estado_id,
    e.sigla as estado_sigla,
    e.nome as estado_nome,
    f.latitude,
    f.longitude,
    f.produtividade,
    f.distancia_fabrica_km,
    f.estoque_toneladas,
    f.tipo_via,
    f.janela_operacao_inicio,
    f.janela_operacao_fim,
    f.area_hectares,
    f.ativo,
    
    -- Status operacional atual
    sof.status as operation_state,
    sof.flag_ativa,
    sof.tpc_dias,
    sof.toneladas_colhidas,
    sof.meta_toneladas,
    sof.data_inicio as operacao_data_inicio,
    
    -- Progresso de colheita (se houver)
    cc.id as colheita_id,
    cc.modulo_corte_id,
    cc.volume_cortado_toneladas as colhido_t,
    cc.meta_toneladas as colheita_meta_t,
    cc.progresso_percentual as colheita_progresso_pct,
    
    -- Módulo atual (se houver)
    m.id as modulo_atual_id,
    m.nome as modulo_atual_nome,
    m.tipo as modulo_tipo
    
FROM fazendas f
LEFT JOIN estados e ON f.estado_id = e.id
LEFT JOIN status_operacional_fazenda sof ON f.id = sof.fazenda_id AND sof.data_fim IS NULL
LEFT JOIN colheita_corte cc ON f.id = cc.fazenda_id AND cc.status = 'ativo'
LEFT JOIN modulos m ON cc.modulo_corte_id = m.id
WHERE f.ativo = true;

-- ============================================
-- VIEW 2: Módulos com Localização e Fazenda Atual
-- ============================================
CREATE OR REPLACE VIEW vw_modulos_detalhados AS
SELECT 
    m.id,
    m.nome,
    m.codigo,
    m.tipo,
    m.mobilidade,
    m.status,
    m.latitude_atual,
    m.longitude_atual,
    m.limite_trocas_dia,
    m.trocas_hoje,
    m.capacidade_diaria_toneladas,
    m.ativo,
    
    -- Fazenda atual
    f.id as fazenda_atual_id,
    f.nome as fazenda_atual_nome,
    
    -- Estado
    e.id as estado_id,
    e.sigla as estado_sigla,
    e.nome as estado_nome,
    
    -- Viagens ativas no módulo
    (SELECT COUNT(*) 
     FROM ordens_carga oc 
     WHERE oc.modulo_id = m.id 
     AND oc.status IN ('planejada', 'em_andamento')) as viagens_ativas
     
FROM modulos m
LEFT JOIN fazendas f ON m.fazenda_atual_id = f.id
LEFT JOIN estados e ON m.estado_id = e.id
WHERE m.ativo = true;

-- ============================================
-- VIEW 3: Ordens de Carga Completas
-- ============================================
CREATE OR REPLACE VIEW vw_ordens_completas AS
SELECT 
    oc.id,
    oc.numero_ordem,
    oc.status,
    oc.volume_toneladas,
    oc.distancia_km,
    oc.tempo_estimado_minutos,
    oc.data_agendamento,
    oc.data_inicio,
    oc.data_conclusao,
    oc.custo_estimado,
    oc.custo_real,
    oc.observacoes,
    
    -- Fazenda
    f.id as fazenda_id,
    f.nome as fazenda_nome,
    f.produtividade,
    f.codigo as fazenda_codigo,
    e.sigla as fazenda_estado,
    
    -- Caminhão
    c.id as caminhao_id,
    c.placa as caminhao_placa,
    c.tipo as caminhao_tipo,
    c.capacidade_toneladas as caminhao_capacidade,
    
    -- Motorista
    mot.id as motorista_id,
    mot.nome as motorista_nome,
    mot.telefone as motorista_telefone,
    
    -- Módulo
    m.id as modulo_id,
    m.nome as modulo_nome,
    m.tipo as modulo_tipo,
    
    oc.created_at
    
FROM ordens_carga oc
LEFT JOIN fazendas f ON oc.fazenda_id = f.id
LEFT JOIN estados e ON f.estado_id = e.id
LEFT JOIN caminhoes c ON oc.caminhao_id = c.id
LEFT JOIN motoristas mot ON oc.motorista_id = mot.id
LEFT JOIN modulos m ON oc.modulo_id = m.id;

-- ============================================
-- VIEW 4: KPIs Dashboard (dia atual)
-- ============================================
CREATE OR REPLACE VIEW vw_kpis_hoje AS
SELECT 
    COALESCE(kd.volume_transportado_m3, 0) as volume_transportado_m3,
    COALESCE(kd.taxa_utilizacao_frota, 0) as taxa_utilizacao_frota,
    COALESCE(kd.custo_por_m3, 0) as custo_por_m3,
    COALESCE(kd.eficiencia_operacional, 0) as eficiencia_operacional,
    COALESCE(kd.aderencia_planejamento, 0) as aderencia_planejamento,
    COALESCE(kd.total_viagens, 0) as total_viagens,
    COALESCE(kd.total_trocas_modulo, 0) as total_trocas_modulo,
    
    -- Estatísticas calculadas em tempo real
    (SELECT COUNT(*) FROM ordens_carga WHERE DATE(data_agendamento) = CURRENT_DATE) as ordens_hoje,
    (SELECT COUNT(*) FROM ordens_carga WHERE status = 'em_andamento') as ordens_em_andamento,
    (SELECT COUNT(*) FROM ordens_carga WHERE status = 'planejada' AND DATE(data_agendamento) = CURRENT_DATE) as ordens_planejadas,
    (SELECT COUNT(*) FROM ordens_carga WHERE status = 'concluida' AND DATE(data_conclusao) = CURRENT_DATE) as ordens_concluidas,
    
    (SELECT COUNT(*) FROM caminhoes WHERE status = 'disponivel' AND ativo = true) as caminhoes_disponiveis,
    (SELECT COUNT(*) FROM caminhoes WHERE status = 'em_viagem') as caminhoes_em_viagem,
    (SELECT COUNT(*) FROM caminhoes WHERE ativo = true) as total_caminhoes,
    
    (SELECT COUNT(*) FROM motoristas WHERE status = 'disponivel' AND ativo = true) as motoristas_disponiveis,
    
    (SELECT COUNT(*) FROM modulos WHERE status = 'ativo' AND tipo = 'colheita') as modulos_colheita_ativos,
    (SELECT COUNT(*) FROM modulos WHERE status = 'ativo' AND tipo = 'carregamento') as modulos_carregamento_ativos,
    
    (SELECT COUNT(*) FROM fazendas WHERE ativo = true) as total_fazendas,
    (SELECT COUNT(*) FROM status_operacional_fazenda WHERE status = 'colheita' AND data_fim IS NULL) as fazendas_colheita,
    (SELECT COUNT(*) FROM status_operacional_fazenda WHERE status = 'carregamento' AND data_fim IS NULL) as fazendas_carregamento,
    (SELECT COUNT(*) FROM status_operacional_fazenda WHERE status = 'cto_baldeio' AND data_fim IS NULL) as fazendas_cto
    
FROM kpis_diarios kd
WHERE kd.data = CURRENT_DATE
LIMIT 1;

-- ============================================
-- VIEW 5: Alertas Ativos
-- ============================================
CREATE OR REPLACE VIEW vw_alertas_ativos AS
SELECT 
    a.id,
    a.tipo,
    a.prioridade,
    a.mensagem,
    a.data_alerta,
    a.resolvido,
    
    -- Fazenda relacionada
    f.nome as fazenda_nome,
    f.codigo as fazenda_codigo,
    
    -- Módulo relacionado
    m.nome as modulo_nome,
    m.tipo as modulo_tipo,
    
    -- Caminhão relacionado
    c.placa as caminhao_placa,
    
    a.created_at
    
FROM alertas a
LEFT JOIN fazendas f ON a.fazenda_id = f.id
LEFT JOIN modulos m ON a.modulo_id = m.id
LEFT JOIN caminhoes c ON a.caminhao_id = c.id
WHERE a.resolvido = false
ORDER BY 
    CASE a.prioridade
        WHEN 'alta' THEN 1
        WHEN 'media' THEN 2
        WHEN 'baixa' THEN 3
        ELSE 4
    END,
    a.data_alerta DESC;

-- ============================================
-- VIEW 6: Estatísticas por Estado
-- ============================================
CREATE OR REPLACE VIEW vw_estatisticas_por_estado AS
SELECT 
    e.id as estado_id,
    e.sigla,
    e.nome,
    
    COUNT(DISTINCT f.id) as total_fazendas,
    COUNT(DISTINCT m.id) as total_modulos,
    
    COUNT(DISTINCT CASE WHEN sof.status = 'colheita' AND sof.data_fim IS NULL THEN f.id END) as fazendas_colheita,
    COUNT(DISTINCT CASE WHEN sof.status = 'carregamento' AND sof.data_fim IS NULL THEN f.id END) as fazendas_carregamento,
    COUNT(DISTINCT CASE WHEN sof.status = 'cto_baldeio' AND sof.data_fim IS NULL THEN f.id END) as fazendas_cto,
    
    COALESCE(SUM(f.estoque_toneladas), 0) as estoque_total,
    COALESCE(AVG(f.distancia_fabrica_km), 0) as distancia_media,
    
    COUNT(DISTINCT CASE WHEN oc.status IN ('planejada', 'em_andamento') AND DATE(oc.data_agendamento) = CURRENT_DATE THEN oc.id END) as viagens_hoje
    
FROM estados e
LEFT JOIN fazendas f ON e.id = f.estado_id AND f.ativo = true
LEFT JOIN modulos m ON e.id = m.estado_id AND m.ativo = true
LEFT JOIN status_operacional_fazenda sof ON f.id = sof.fazenda_id
LEFT JOIN ordens_carga oc ON f.id = oc.fazenda_id
WHERE e.ativo = true
GROUP BY e.id, e.sigla, e.nome;

-- ============================================
-- VIEW 7: Histórico de Trocas (última semana)
-- ============================================
CREATE OR REPLACE VIEW vw_historico_trocas_recente AS
SELECT 
    htm.id,
    htm.data_troca,
    htm.motivo,
    htm.custo_operacional,
    
    m.nome as modulo_nome,
    m.tipo as modulo_tipo,
    
    fo.nome as fazenda_origem_nome,
    fd.nome as fazenda_destino_nome,
    
    eo.sigla as estado_origem,
    ed.sigla as estado_destino,
    
    htm.created_at
    
FROM historico_trocas_modulo htm
LEFT JOIN modulos m ON htm.modulo_id = m.id
LEFT JOIN fazendas fo ON htm.fazenda_origem_id = fo.id
LEFT JOIN fazendas fd ON htm.fazenda_destino_id = fd.id
LEFT JOIN estados eo ON fo.estado_id = eo.id
LEFT JOIN estados ed ON fd.estado_id = ed.id
WHERE htm.data_troca >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY htm.data_troca DESC;

-- ============================================
-- VIEW 8: Fazendas Prontas para Carregar (TPC >= 60)
-- ============================================
CREATE OR REPLACE VIEW vw_fazendas_prontas_carregar AS
SELECT 
    f.id,
    f.nome,
    f.codigo,
    e.sigla as estado,
    f.latitude,
    f.longitude,
    f.distancia_fabrica_km,
    f.estoque_toneladas,
    f.produtividade,
    
    sof.tpc_dias,
    sof.toneladas_colhidas,
    sof.data_inicio as data_colheita,
    
    -- Dias desde a colheita
    CURRENT_DATE - DATE(sof.data_inicio) as dias_desde_colheita,
    
    -- Prioridade (quanto maior TPC, maior prioridade)
    CASE 
        WHEN sof.tpc_dias >= 90 THEN 'muito_alta'
        WHEN sof.tpc_dias >= 75 THEN 'alta'
        WHEN sof.tpc_dias >= 60 THEN 'media'
        ELSE 'baixa'
    END as prioridade
    
FROM fazendas f
JOIN estados e ON f.estado_id = e.id
JOIN status_operacional_fazenda sof ON f.id = sof.fazenda_id
WHERE f.ativo = true
    AND sof.status = 'cto_baldeio'
    AND sof.data_fim IS NULL
    AND sof.tpc_dias >= 60
ORDER BY sof.tpc_dias DESC, f.produtividade DESC;

-- ============================================
-- COMENTÁRIOS SOBRE AS VIEWS
-- ============================================

-- Uso das Views:

-- vw_fazendas_status: 
--   Para o mapa interativo e lista de fazendas
--   SELECT * FROM vw_fazendas_status WHERE estado_sigla = 'SP';

-- vw_modulos_detalhados:
--   Para gestão de módulos e planejamento
--   SELECT * FROM vw_modulos_detalhados WHERE tipo = 'colheita';

-- vw_ordens_completas:
--   Para lista de ordens de carga e rotas
--   SELECT * FROM vw_ordens_completas WHERE status = 'em_andamento';

-- vw_kpis_hoje:
--   Para dashboard principal
--   SELECT * FROM vw_kpis_hoje;

-- vw_alertas_ativos:
--   Para sistema de alertas
--   SELECT * FROM vw_alertas_ativos WHERE prioridade = 'alta';

-- vw_estatisticas_por_estado:
--   Para análises por região
--   SELECT * FROM vw_estatisticas_por_estado;

-- vw_historico_trocas_recente:
--   Para histórico de operações
--   SELECT * FROM vw_historico_trocas_recente WHERE modulo_tipo = 'colheita';

-- vw_fazendas_prontas_carregar:
--   Para planejamento de carregamento
--   SELECT * FROM vw_fazendas_prontas_carregar WHERE prioridade = 'alta';
