import { supabase } from './supabase';

// ============================================
// DASHBOARD QUERIES
// ============================================

export const dashboardQueries = {
  // Buscar KPIs do dia
  async getKPIsHoje() {
    const { data, error } = await supabase
      .from('vw_kpis_hoje')
      .select('*')
      .maybeSingle();
    
    // Se não houver dados, retornar estrutura padrão
    if (error || !data) {
      return {
        total_volume_toneladas: 0,
        total_viagens: 0,
        total_caminhoes: 0,
        caminhoes_disponiveis: 0,
        caminhoes_em_viagem: 0,
        caminhoes_em_manutencao: 0,
        motoristas_disponiveis: 0,
        total_ordens: 0,
        ordens_pendentes: 0,
        ordens_em_andamento: 0,
        ordens_concluidas: 0,
        total_fazendas_ativas: 0,
        trocas_modulo_dia: 0,
        meta_diaria_toneladas: 35000,
        percentual_meta: 0
      };
    }
    return data;
  },

  // Buscar alertas prioritários (compatibilidade)
  async getAlertas() {
    const { data, error } = await supabase
      .from('vw_alertas_prioritarios')
      .select('*')
      .limit(5);
    
    if (error || !data) return [];
    return data;
  },

  // Buscar alertas ativos (usado pelo Dashboard)
  async getAlertasAtivos(limit = 5) {
    const { data, error } = await supabase
      .from('vw_alertas_prioritarios')
      .select('*')
      .limit(limit);
    
    if (error || !data) return [];
    return data;
  },

  // Buscar ordens recentes
  async getOrdensRecentes(limit = 5) {
    const { data, error } = await supabase
      .from('ordens_carga')
      .select(`
        *,
        fazenda:fazendas(nome, estado:estados(sigla)),
        caminhao:caminhoes(placa),
        motorista:motoristas(nome)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error || !data) return [];
    return data;
  }
};

// ============================================
// MAP QUERIES
// ============================================

export const mapQueries = {
  // Buscar todas as fazendas com localização
  async getFazendasMapa(filtros?: { estado?: string }) {
    let query = supabase
      .from('fazendas')
      .select(`
        *,
        estado:estados(sigla, nome),
        modulos:modulos(id, tipo, status)
      `)
      .eq('ativo', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);
    
    if (filtros?.estado) {
      query = query.eq('estado_id', filtros.estado);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  // Buscar fazendas com status operacional (para o mapa interativo)
  async getFazendasComStatus() {
    const { data, error } = await supabase
      .from('fazendas')
      .select(`
        *,
        estado:estados(sigla, nome),
        modulos:modulos(id, tipo, status)
      `)
      .eq('ativo', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);
    
    if (error) throw error;
    return data;
  },

  // Buscar módulos com localização
  async getModulosMapa() {
    const { data, error } = await supabase
      .from('modulos')
      .select(`
        *,
        fazenda_atual:fazendas!fazenda_atual_id(nome, latitude, longitude, estado:estados(sigla))
      `)
      .eq('ativo', true);
    
    if (error) throw error;
    return data;
  },

  // Buscar módulos com localização (alias para compatibilidade)
  async getModulosComLocalizacao() {
    const { data, error } = await supabase
      .from('modulos')
      .select(`
        *,
        fazenda_atual:fazendas!fazenda_atual_id(nome, latitude, longitude, estado:estados(sigla))
      `)
      .eq('ativo', true)
      .not('latitude_atual', 'is', null)
      .not('longitude_atual', 'is', null);
    
    if (error || !data) return [];
    return data;
  },

  // Buscar estatísticas por estado
  async getEstatisticasEstados() {
    const { data, error } = await supabase
      .from('vw_estatisticas_estados')
      .select('*');
    
    if (error) throw error;
    return data;
  }
};

// ============================================
// ORDERS QUERIES
// ============================================

export const ordersQueries = {
  // Buscar ordens de carga
  async getOrdens(filtros?: { status?: string; data?: string }) {
    let query = supabase
      .from('ordens_carga')
      .select(`
        *,
        fazenda:fazendas(nome, distancia_fabrica_km, estado:estados(sigla)),
        caminhao:caminhoes(placa, capacidade_toneladas),
        motorista:motoristas(nome, telefone)
      `);
    
    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros?.data) {
      query = query.gte('created_at', filtros.data);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Buscar ordens de hoje (usado pelo Dashboard)
  async getOrdensHoje() {
    const hoje = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('ordens_carga')
      .select(`
        *,
        fazenda:fazendas(nome, distancia_fabrica_km, estado:estados(sigla)),
        caminhao:caminhoes(placa, capacidade_toneladas),
        motorista:motoristas(nome, telefone)
      `)
      .gte('created_at', hoje)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Buscar estatísticas das ordens
  async getEstatisticasOrdens() {
    const { data, error } = await supabase
      .from('vw_kpis_hoje')
      .select('total_ordens, ordens_concluidas, ordens_em_andamento')
      .maybeSingle();
    
    if (error || !data) {
      return {
        total_ordens: 0,
        ordens_concluidas: 0,
        ordens_em_andamento: 0
      };
    }
    return data;
  }
};

// ============================================
// FARMS QUERIES
// ============================================

export const farmsQueries = {
  // Buscar todas as fazendas
  async getFazendas(filtros?: { estado?: string; produtividade?: string }) {
    let query = supabase
      .from('fazendas')
      .select(`
        *,
        estado:estados(sigla, nome),
        modulos:modulos(id, tipo, status)
      `)
      .eq('ativo', true);
    
    if (filtros?.estado) {
      query = query.eq('estado_id', filtros.estado);
    }
    
    if (filtros?.produtividade) {
      query = query.eq('produtividade', filtros.produtividade);
    }
    
    const { data, error } = await query.order('nome');
    
    if (error) throw error;
    return data;
  },

  // Buscar módulos de uma fazenda
  async getModulosDaFazenda(fazendaId: string) {
    const { data, error } = await supabase
      .from('modulos')
      .select('*')
      .eq('fazenda_atual_id', fazendaId)
      .eq('ativo', true);
    
    if (error) throw error;
    return data;
  },

  // Buscar histórico de trocas
  async getHistoricoTrocas(limit = 50) {
    const { data, error } = await supabase
      .from('vw_historico_trocas_recente')
      .select('*')
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
};

// ============================================
// FROTA QUERIES
// ============================================

export const fleetQueries = {
  // Buscar todos os caminhões
  async getCaminhoes(filtros?: { status?: string; tipo?: string }) {
    let query = supabase
      .from('caminhoes')
      .select(`
        *,
        motorista:motoristas(nome, telefone, status)
      `)
      .eq('ativo', true);
    
    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }
    
    if (filtros?.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }
    
    const { data, error } = await query.order('placa');
    
    if (error) throw error;
    return data;
  },

  // Buscar todos os motoristas
  async getMotoristas(filtros?: { status?: string }) {
    let query = supabase
      .from('motoristas')
      .select('*')
      .eq('ativo', true);
    
    if (filtros?.status) {
      query = query.eq('status', filtros.status);
    }
    
    const { data, error } = await query.order('nome');
    
    if (error) throw error;
    return data;
  },

  // Buscar estatísticas da frota
  async getEstatisticasFrota() {
    const { data, error } = await supabase
      .from('vw_kpis_hoje')
      .select('total_caminhoes, caminhoes_disponiveis, caminhoes_em_viagem, motoristas_disponiveis')
      .maybeSingle();
    
    if (error || !data) {
      return {
        total_caminhoes: 0,
        caminhoes_disponiveis: 0,
        caminhoes_em_viagem: 0,
        motoristas_disponiveis: 0
      };
    }
    return data;
  }
};

// ============================================
// CENÁRIOS QUERIES
// ============================================

export const scenariosQueries = {
  // Buscar todos os cenários
  async getCenarios() {
    const { data, error } = await supabase
      .from('cenarios_simulacao')
      .select('*')
      .order('data_criacao', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Salvar novo cenário
  async salvarCenario(cenario: {
    nome: string;
    descricao?: string;
    configuracao: any;
    resultados?: any;
  }) {
    const { data, error } = await supabase
      .from('cenarios_simulacao')
      .insert({
        ...cenario,
        aplicado: false
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Aplicar cenário
  async aplicarCenario(id: string) {
    // Desmarcar outros cenários aplicados
    await supabase
      .from('cenarios_simulacao')
      .update({ aplicado: false })
      .eq('aplicado', true);
    
    // Marcar este como aplicado
    const { data, error } = await supabase
      .from('cenarios_simulacao')
      .update({ aplicado: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Deletar cenário
  async deletarCenario(id: string) {
    const { error } = await supabase
      .from('cenarios_simulacao')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// ============================================
// RELATÓRIOS QUERIES
// ============================================

export const reportsQueries = {
  // Buscar KPIs de um período
  async getKPIsPeriodo(dataInicio: string, dataFim: string) {
    const { data, error } = await supabase
      .from('kpis_diarios')
      .select('*')
      .gte('data', dataInicio)
      .lte('data', dataFim)
      .order('data', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Buscar relatório de trocas de módulo
  async getRelatorioTrocasModulo(dataInicio: string, dataFim: string) {
    const { data, error } = await supabase
      .from('historico_trocas_modulo')
      .select(`
        *,
        modulo:modulos(tipo, capacidade_diaria_toneladas),
        fazenda_origem:fazendas!fazenda_origem_id(nome, estado:estados(sigla)),
        fazenda_destino:fazendas!fazenda_destino_id(nome, estado:estados(sigla))
      `)
      .gte('data_troca', dataInicio)
      .lte('data_troca', dataFim)
      .order('data_troca', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Buscar relatório de produtividade por fazenda
  async getRelatorioProdutividadeFazendas(dataInicio: string, dataFim: string) {
    const { data, error } = await supabase
      .from('ordens_carga')
      .select(`
        fazenda_id,
        fazenda:fazendas(nome, produtividade, estado:estados(sigla)),
        volume_toneladas,
        data_conclusao,
        custo_real
      `)
      .eq('status', 'concluida')
      .gte('data_conclusao', dataInicio)
      .lte('data_conclusao', dataFim);
    
    if (error) throw error;
    
    // Agrupar por fazenda
    const grouped = (data || []).reduce((acc: any, item: any) => {
      const key = item.fazenda_id;
      if (!acc[key]) {
        acc[key] = {
          fazenda: item.fazenda,
          total_volume: 0,
          total_custo: 0,
          total_viagens: 0
        };
      }
      acc[key].total_volume += item.volume_toneladas;
      acc[key].total_custo += item.custo_real || 0;
      acc[key].total_viagens += 1;
      return acc;
    }, {});
    
    return Object.values(grouped);
  }
};

// ============================================
// OPTIMIZATION QUERIES
// ============================================

export const optimizationQueries = {
  // Buscar parâmetros de otimização
  async getParametros() {
    const { data, error } = await supabase
      .from('parametros_otimizacao')
      .select('*')
      .eq('ativo', true)
      .single();
    
    if (error) {
      // Se não encontrar, retornar valores padrão
      return {
        alfa_distancia: 0.3,
        beta_tempo: 0.2,
        gamma_troca_modulo: 0.4,
        delta_prioridade_produtiva: 0.1,
        demanda_diaria_toneladas: 35000,
        meta_toneladas_hora: 1458
      };
    }
    return data;
  },

  // Salvar parâmetros de otimização
  async salvarParametros(params: {
    alfa_distancia: number;
    beta_tempo: number;
    gamma_troca_modulo: number;
    delta_prioridade_produtiva: number;
    demanda_diaria_toneladas?: number;
    meta_toneladas_hora?: number;
  }) {
    // Desativar parâmetros anteriores
    await supabase
      .from('parametros_otimizacao')
      .update({ ativo: false })
      .eq('ativo', true);
    
    // Inserir novos parâmetros
    const { data, error } = await supabase
      .from('parametros_otimizacao')
      .insert({
        ...params,
        ativo: true
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Buscar fazendas com estoque disponível para otimização
  async getFazendasParaOtimizacao() {
    const { data, error } = await supabase
      .from('fazendas')
      .select(`
        id,
        nome,
        latitude,
        longitude,
        distancia_fabrica_km,
        estoque_toneladas,
        produtividade,
        estado:estados(sigla, nome)
      `)
      .eq('ativo', true)
      .gt('estoque_toneladas', 0)
      .order('estoque_toneladas', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar fazendas:', error);
      throw error;
    }
    return data || [];
  },

  // Buscar módulos de carregamento disponíveis
  async getModulosCarregamento() {
    const { data, error } = await supabase
      .from('modulos')
      .select(`
        *,
        fazenda_atual:fazendas!fazenda_atual_id(
          id,
          nome,
          estoque_toneladas,
          distancia_fabrica_km,
          latitude,
          longitude,
          estado:estados(sigla)
        )
      `)
      .eq('ativo', true)
      .eq('tipo', 'Carregamento')
      .in('status', ['Ativo', 'Pausado'])
      .order('codigo', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar módulos de carregamento:', error);
      throw error;
    }
    return data || [];
  },

  // Buscar todas as fazendas para cálculo de distância
  async getTodasFazendas() {
    const { data, error } = await supabase
      .from('fazendas')
      .select(`
        id,
        nome,
        latitude,
        longitude,
        distancia_fabrica_km,
        estoque_toneladas,
        produtividade,
        estado:estados(sigla)
      `)
      .eq('ativo', true);
    
    if (error) throw error;
    return data || [];
  }
};