// ============================================
// TIPOS TYPESCRIPT DO BANCO SUPABASE
// Gerado baseado no schema do banco de dados
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      estados: {
        Row: {
          id: string
          sigla: string
          nome: string
          ativo: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          sigla: string
          nome: string
          ativo?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          sigla?: string
          nome?: string
          ativo?: boolean | null
          created_at?: string | null
        }
      }
      fazendas: {
        Row: {
          id: string
          nome: string
          estado_id: string | null
          latitude: number
          longitude: number
          produtividade: string | null
          distancia_fabrica_km: number
          estoque_toneladas: number | null
          tipo_via: string | null
          janela_operacao_inicio: string | null
          janela_operacao_fim: string | null
          ativo: boolean | null
          created_at: string | null
          tem_operacao_ativa: boolean | null
          data_ultima_operacao: string | null
          codigo: string | null
          area_hectares: number | null
          capacidade_estimada_toneladas: number | null
          updated_at: string | null
          observacoes: string | null
        }
        Insert: {
          id?: string
          nome: string
          estado_id?: string | null
          latitude: number
          longitude: number
          produtividade?: string | null
          distancia_fabrica_km: number
          estoque_toneladas?: number | null
          tipo_via?: string | null
          janela_operacao_inicio?: string | null
          janela_operacao_fim?: string | null
          ativo?: boolean | null
          created_at?: string | null
          tem_operacao_ativa?: boolean | null
          data_ultima_operacao?: string | null
          codigo?: string | null
          area_hectares?: number | null
          capacidade_estimada_toneladas?: number | null
          updated_at?: string | null
          observacoes?: string | null
        }
        Update: {
          id?: string
          nome?: string
          estado_id?: string | null
          latitude?: number
          longitude?: number
          produtividade?: string | null
          distancia_fabrica_km?: number
          estoque_toneladas?: number | null
          tipo_via?: string | null
          janela_operacao_inicio?: string | null
          janela_operacao_fim?: string | null
          ativo?: boolean | null
          created_at?: string | null
          tem_operacao_ativa?: boolean | null
          data_ultima_operacao?: string | null
          codigo?: string | null
          area_hectares?: number | null
          capacidade_estimada_toneladas?: number | null
          updated_at?: string | null
          observacoes?: string | null
        }
      }
      modulos: {
        Row: {
          id: string
          nome: string
          tipo: string | null
          mobilidade: string | null
          estado_id: string | null
          fazenda_atual_id: string | null
          limite_trocas_dia: number | null
          trocas_hoje: number | null
          status: string | null
          ultima_manutencao: string | null
          ativo: boolean | null
          created_at: string | null
          codigo: string | null
          latitude_atual: number | null
          longitude_atual: number | null
          data_ultima_troca: string | null
          proxima_manutencao: string | null
          horas_operacao: number | null
          capacidade_diaria_toneladas: number | null
          observacoes: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nome: string
          tipo?: string | null
          mobilidade?: string | null
          estado_id?: string | null
          fazenda_atual_id?: string | null
          limite_trocas_dia?: number | null
          trocas_hoje?: number | null
          status?: string | null
          ultima_manutencao?: string | null
          ativo?: boolean | null
          created_at?: string | null
          codigo?: string | null
          latitude_atual?: number | null
          longitude_atual?: number | null
          data_ultima_troca?: string | null
          proxima_manutencao?: string | null
          horas_operacao?: number | null
          capacidade_diaria_toneladas?: number | null
          observacoes?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          nome?: string
          tipo?: string | null
          mobilidade?: string | null
          estado_id?: string | null
          fazenda_atual_id?: string | null
          limite_trocas_dia?: number | null
          trocas_hoje?: number | null
          status?: string | null
          ultima_manutencao?: string | null
          ativo?: boolean | null
          created_at?: string | null
          codigo?: string | null
          latitude_atual?: number | null
          longitude_atual?: number | null
          data_ultima_troca?: string | null
          proxima_manutencao?: string | null
          horas_operacao?: number | null
          capacidade_diaria_toneladas?: number | null
          observacoes?: string | null
          updated_at?: string | null
        }
      }
      motoristas: {
        Row: {
          id: string
          nome: string
          cnh: string
          validade_cnh: string
          telefone: string | null
          status: string | null
          total_viagens_mes: number | null
          ativo: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          nome: string
          cnh: string
          validade_cnh: string
          telefone?: string | null
          status?: string | null
          total_viagens_mes?: number | null
          ativo?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          nome?: string
          cnh?: string
          validade_cnh?: string
          telefone?: string | null
          status?: string | null
          total_viagens_mes?: number | null
          ativo?: boolean | null
          created_at?: string | null
        }
      }
      caminhoes: {
        Row: {
          id: string
          placa: string
          tipo: string | null
          capacidade_toneladas: number
          status: string | null
          latitude: number | null
          longitude: number | null
          quilometragem: number | null
          proxima_manutencao_km: number | null
          motorista_atual_id: string | null
          ativo: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          placa: string
          tipo?: string | null
          capacidade_toneladas: number
          status?: string | null
          latitude?: number | null
          longitude?: number | null
          quilometragem?: number | null
          proxima_manutencao_km?: number | null
          motorista_atual_id?: string | null
          ativo?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          placa?: string
          tipo?: string | null
          capacidade_toneladas?: number
          status?: string | null
          latitude?: number | null
          longitude?: number | null
          quilometragem?: number | null
          proxima_manutencao_km?: number | null
          motorista_atual_id?: string | null
          ativo?: boolean | null
          created_at?: string | null
        }
      }
      ordens_carga: {
        Row: {
          id: string
          numero_ordem: string
          fazenda_id: string | null
          caminhao_id: string | null
          motorista_id: string | null
          modulo_id: string | null
          volume_toneladas: number
          distancia_km: number | null
          tempo_estimado_minutos: number | null
          data_agendamento: string
          data_inicio: string | null
          data_conclusao: string | null
          status: string | null
          custo_estimado: number | null
          custo_real: number | null
          observacoes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          numero_ordem: string
          fazenda_id?: string | null
          caminhao_id?: string | null
          motorista_id?: string | null
          modulo_id?: string | null
          volume_toneladas: number
          distancia_km?: number | null
          tempo_estimado_minutos?: number | null
          data_agendamento: string
          data_inicio?: string | null
          data_conclusao?: string | null
          status?: string | null
          custo_estimado?: number | null
          custo_real?: number | null
          observacoes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          numero_ordem?: string
          fazenda_id?: string | null
          caminhao_id?: string | null
          motorista_id?: string | null
          modulo_id?: string | null
          volume_toneladas?: number
          distancia_km?: number | null
          tempo_estimado_minutos?: number | null
          data_agendamento?: string
          data_inicio?: string | null
          data_conclusao?: string | null
          status?: string | null
          custo_estimado?: number | null
          custo_real?: number | null
          observacoes?: string | null
          created_at?: string | null
        }
      }
      status_operacional_fazenda: {
        Row: {
          id: string
          fazenda_id: string | null
          status: string | null
          flag_ativa: string | null
          data_inicio: string
          data_fim: string | null
          tpc_dias: number | null
          toneladas_colhidas: number | null
          meta_toneladas: number | null
          observacoes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          fazenda_id?: string | null
          status?: string | null
          flag_ativa?: string | null
          data_inicio: string
          data_fim?: string | null
          tpc_dias?: number | null
          toneladas_colhidas?: number | null
          meta_toneladas?: number | null
          observacoes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          fazenda_id?: string | null
          status?: string | null
          flag_ativa?: string | null
          data_inicio?: string
          data_fim?: string | null
          tpc_dias?: number | null
          toneladas_colhidas?: number | null
          meta_toneladas?: number | null
          observacoes?: string | null
          created_at?: string | null
        }
      }
      kpis_diarios: {
        Row: {
          id: string
          data: string
          volume_transportado_m3: number | null
          taxa_utilizacao_frota: number | null
          custo_por_m3: number | null
          eficiencia_operacional: number | null
          aderencia_planejamento: number | null
          total_viagens: number | null
          total_trocas_modulo: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          data: string
          volume_transportado_m3?: number | null
          taxa_utilizacao_frota?: number | null
          custo_por_m3?: number | null
          eficiencia_operacional?: number | null
          aderencia_planejamento?: number | null
          total_viagens?: number | null
          total_trocas_modulo?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          data?: string
          volume_transportado_m3?: number | null
          taxa_utilizacao_frota?: number | null
          custo_por_m3?: number | null
          eficiencia_operacional?: number | null
          aderencia_planejamento?: number | null
          total_viagens?: number | null
          total_trocas_modulo?: number | null
          created_at?: string | null
        }
      }
      alertas: {
        Row: {
          id: string
          tipo: string | null
          prioridade: string | null
          fazenda_id: string | null
          modulo_id: string | null
          caminhao_id: string | null
          mensagem: string
          data_alerta: string | null
          resolvido: boolean | null
          data_resolucao: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          tipo?: string | null
          prioridade?: string | null
          fazenda_id?: string | null
          modulo_id?: string | null
          caminhao_id?: string | null
          mensagem: string
          data_alerta?: string | null
          resolvido?: boolean | null
          data_resolucao?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          tipo?: string | null
          prioridade?: string | null
          fazenda_id?: string | null
          modulo_id?: string | null
          caminhao_id?: string | null
          mensagem?: string
          data_alerta?: string | null
          resolvido?: boolean | null
          data_resolucao?: string | null
          created_at?: string | null
        }
      }
      cenarios_simulacao: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          configuracao: Json
          resultados: Json | null
          aplicado: boolean | null
          data_criacao: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          configuracao: Json
          resultados?: Json | null
          aplicado?: boolean | null
          data_criacao?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          configuracao?: Json
          resultados?: Json | null
          aplicado?: boolean | null
          data_criacao?: string | null
          created_at?: string | null
        }
      }
      parametros_otimizacao: {
        Row: {
          id: string
          alfa_distancia: number
          beta_tempo: number
          gamma_troca_modulo: number
          delta_prioridade_produtiva: number
          demanda_diaria_toneladas: number | null
          meta_toneladas_hora: number | null
          ativo: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          alfa_distancia: number
          beta_tempo: number
          gamma_troca_modulo: number
          delta_prioridade_produtiva: number
          demanda_diaria_toneladas?: number | null
          meta_toneladas_hora?: number | null
          ativo?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          alfa_distancia?: number
          beta_tempo?: number
          gamma_troca_modulo?: number
          delta_prioridade_produtiva?: number
          demanda_diaria_toneladas?: number | null
          meta_toneladas_hora?: number | null
          ativo?: boolean | null
          created_at?: string | null
        }
      }
    }
    Views: {
      vw_fazendas_status: {
        Row: {
          id: string
          nome: string
          codigo: string | null
          estado_id: string | null
          estado_sigla: string
          estado_nome: string
          latitude: number
          longitude: number
          produtividade: string | null
          distancia_fabrica_km: number
          estoque_toneladas: number | null
          tipo_via: string | null
          janela_operacao_inicio: string | null
          janela_operacao_fim: string | null
          area_hectares: number | null
          ativo: boolean | null
          operation_state: string | null
          flag_ativa: string | null
          tpc_dias: number | null
          toneladas_colhidas: number | null
          meta_toneladas: number | null
          operacao_data_inicio: string | null
          colheita_id: string | null
          modulo_corte_id: string | null
          colhido_t: number | null
          colheita_meta_t: number | null
          colheita_progresso_pct: number | null
          modulo_atual_id: string | null
          modulo_atual_nome: string | null
          modulo_tipo: string | null
        }
      }
      vw_modulos_detalhados: {
        Row: {
          id: string
          nome: string
          codigo: string | null
          tipo: string | null
          mobilidade: string | null
          status: string | null
          latitude_atual: number | null
          longitude_atual: number | null
          limite_trocas_dia: number | null
          trocas_hoje: number | null
          capacidade_diaria_toneladas: number | null
          ativo: boolean | null
          fazenda_atual_id: string | null
          fazenda_atual_nome: string | null
          estado_id: string | null
          estado_sigla: string | null
          estado_nome: string | null
          viagens_ativas: number | null
        }
      }
      vw_ordens_completas: {
        Row: {
          id: string
          numero_ordem: string
          status: string | null
          volume_toneladas: number
          distancia_km: number | null
          tempo_estimado_minutos: number | null
          data_agendamento: string
          data_inicio: string | null
          data_conclusao: string | null
          custo_estimado: number | null
          custo_real: number | null
          observacoes: string | null
          fazenda_id: string | null
          fazenda_nome: string
          produtividade: string | null
          fazenda_codigo: string | null
          fazenda_estado: string
          caminhao_id: string | null
          caminhao_placa: string
          caminhao_tipo: string | null
          caminhao_capacidade: number
          motorista_id: string | null
          motorista_nome: string
          motorista_telefone: string | null
          modulo_id: string | null
          modulo_nome: string
          modulo_tipo: string | null
          created_at: string | null
        }
      }
      vw_kpis_hoje: {
        Row: {
          volume_transportado_m3: number
          taxa_utilizacao_frota: number
          custo_por_m3: number
          eficiencia_operacional: number
          aderencia_planejamento: number
          total_viagens: number
          total_trocas_modulo: number
          ordens_hoje: number
          ordens_em_andamento: number
          ordens_planejadas: number
          ordens_concluidas: number
          caminhoes_disponiveis: number
          caminhoes_em_viagem: number
          total_caminhoes: number
          motoristas_disponiveis: number
          modulos_colheita_ativos: number
          modulos_carregamento_ativos: number
          total_fazendas: number
          fazendas_colheita: number
          fazendas_carregamento: number
          fazendas_cto: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}