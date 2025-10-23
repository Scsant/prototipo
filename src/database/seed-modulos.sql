-- ============================================
-- SEED DE MÓDULOS DE CARREGAMENTO - BRACELL
-- Distribuição real: 8 em SP (fixos) + 3 móveis (MS, MG, PR)
-- ============================================

-- IMPORTANTE: Execute este script no SQL Editor do Supabase

-- ============================================
-- MÓDULOS FIXOS EM SÃO PAULO (8 MÓDULOS)
-- ============================================

-- MC-001: São Paulo (Região Leste)
INSERT INTO modulos (
  nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje,
  status, ativo, latitude_atual, longitude_atual, horas_operacao
)
SELECT 
  'MC-001 Carregamento SP Leste',
  'MC-001',
  'carregamento',
  'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1 OFFSET 0),
  850,
  1,
  0,
  'operacional',
  true,
  -22.5,
  -48.5,
  2400
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- MC-002: São Paulo (Região Central)
INSERT INTO modulos (
  nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje,
  status, ativo, latitude_atual, longitude_atual, horas_operacao
)
SELECT 
  'MC-002 Carregamento SP Central',
  'MC-002',
  'carregamento',
  'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1 OFFSET 1),
  820,
  1,
  0,
  'operacional',
  true,
  -22.3,
  -48.7,
  2200
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- MC-003: São Paulo (Região Oeste)
INSERT INTO modulos (
  nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje,
  status, ativo, latitude_atual, longitude_atual, horas_operacao
)
SELECT 
  'MC-003 Carregamento SP Oeste',
  'MC-003',
  'carregamento',
  'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1 OFFSET 2),
  800,
  1,
  0,
  'operacional',
  true,
  -22.7,
  -48.3,
  2100
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- MC-004: São Paulo (Região Norte)
INSERT INTO modulos (
  nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje,
  status, ativo, latitude_atual, longitude_atual, horas_operacao
)
SELECT 
  'MC-004 Carregamento SP Norte',
  'MC-004',
  'carregamento',
  'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1 OFFSET 3),
  870,
  1,
  0,
  'operacional',
  true,
  -22.1,
  -48.6,
  2500
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- MC-005: São Paulo (Região Sul)
INSERT INTO modulos (
  nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje,
  status, ativo, latitude_atual, longitude_atual, horas_operacao
)
SELECT 
  'MC-005 Carregamento SP Sul',
  'MC-005',
  'carregamento',
  'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1 OFFSET 4),
  830,
  1,
  0,
  'operacional',
  true,
  -22.8,
  -48.4,
  2300
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- MC-006: São Paulo (Região Nordeste)
INSERT INTO modulos (
  nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje,
  status, ativo, latitude_atual, longitude_atual, horas_operacao
)
SELECT 
  'MC-006 Carregamento SP Nordeste',
  'MC-006',
  'carregamento',
  'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1 OFFSET 5),
  810,
  1,
  0,
  'operacional',
  true,
  -22.2,
  -48.8,
  2000
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- MC-007: São Paulo (Região Sudeste)
INSERT INTO modulos (
  nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje,
  status, ativo, latitude_atual, longitude_atual, horas_operacao
)
SELECT 
  'MC-007 Carregamento SP Sudeste',
  'MC-007',
  'carregamento',
  'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1 OFFSET 6),
  840,
  1,
  0,
  'operacional',
  true,
  -22.6,
  -48.2,
  2150
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- MC-008: São Paulo (Região Noroeste)
INSERT INTO modulos (
  nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje,
  status, ativo, latitude_atual, longitude_atual, horas_operacao
)
SELECT 
  'MC-008 Carregamento SP Noroeste',
  'MC-008',
  'carregamento',
  'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1 OFFSET 7),
  860,
  1,
  0,
  'operacional',
  true,
  -22.4,
  -48.9,
  2350
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- ============================================
-- MÓDULOS MÓVEIS - OUTROS ESTADOS (3 MÓDULOS)
-- ============================================

-- MC-009: Mato Grosso do Sul (MÓVEL)
INSERT INTO modulos (
  nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje,
  status, ativo, latitude_atual, longitude_atual, horas_operacao
)
SELECT 
  'MC-009 Carregamento MS (Móvel)',
  'MC-009',
  'carregamento',
  'movel',
  (SELECT id FROM estados WHERE sigla = 'MS' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'MS') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1),
  780,
  3,
  0,
  'operacional',
  true,
  -20.5,
  -54.6,
  1800
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'MS')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'MS'));

-- MC-010: Minas Gerais (MÓVEL)
INSERT INTO modulos (
  nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje,
  status, ativo, latitude_atual, longitude_atual, horas_operacao
)
SELECT 
  'MC-010 Carregamento MG (Móvel)',
  'MC-010',
  'carregamento',
  'movel',
  (SELECT id FROM estados WHERE sigla = 'MG' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'MG') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1),
  790,
  3,
  0,
  'operacional',
  true,
  -19.5,
  -46.5,
  1650
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'MG')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'MG'));

-- MC-011: Paraná (MÓVEL)
INSERT INTO modulos (
  nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje,
  status, ativo, latitude_atual, longitude_atual, horas_operacao
)
SELECT 
  'MC-011 Carregamento PR (Móvel)',
  'MC-011',
  'carregamento',
  'movel',
  (SELECT id FROM estados WHERE sigla = 'PR' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'PR') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1),
  770,
  3,
  0,
  'operacional',
  true,
  -24.3,
  -50.8,
  1500
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'PR')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'PR'));

-- ============================================
-- VERIFICAR MÓDULOS CRIADOS
-- ============================================

SELECT 
  m.codigo,
  m.nome,
  m.tipo,
  m.mobilidade,
  m.status,
  m.capacidade_diaria_toneladas,
  e.sigla as estado,
  f.nome as fazenda_atual,
  f.estoque_toneladas as estoque_fazenda_atual,
  m.horas_operacao
FROM modulos m
LEFT JOIN estados e ON m.estado_id = e.id
LEFT JOIN fazendas f ON m.fazenda_atual_id = f.id
WHERE m.tipo = 'carregamento'
  AND m.ativo = true
ORDER BY m.codigo;

-- ============================================
-- ESTATÍSTICAS DOS MÓDULOS
-- ============================================

SELECT 
  e.sigla as estado,
  m.mobilidade,
  COUNT(*) as total_modulos,
  SUM(m.capacidade_diaria_toneladas) as capacidade_total_dia,
  AVG(m.capacidade_diaria_toneladas)::int as capacidade_media,
  SUM(f.estoque_toneladas) as estoque_total_atual
FROM modulos m
LEFT JOIN estados e ON m.estado_id = e.id
LEFT JOIN fazendas f ON m.fazenda_atual_id = f.id
WHERE m.tipo = 'carregamento' AND m.ativo = true
GROUP BY e.sigla, m.mobilidade
ORDER BY total_modulos DESC, e.sigla;
