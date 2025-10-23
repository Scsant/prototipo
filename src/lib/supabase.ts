import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://xscvgaayewwasvqewdmd.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzY3ZnYWF5ZXd3YXN2cWV3ZG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODIzNTAsImV4cCI6MjA3NjA1ODM1MH0.-R73ypFeNfR3LgKSDRl8_DIQPrnESEUkpHv79yKQFGE';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export types from database
export type { Database } from './database.types';

// Backward compatibility types (deprecated - use Database types instead)
export type Productivity = 'alta' | 'media' | 'baixa';
export type ModuleStatus = 'ativo' | 'pausa' | 'indisp' | 'manutencao';
export type OrderStatus = 'planejada' | 'em_andamento' | 'concluida' | 'cancelada';
export type RouteStatus = 'planejada' | 'em_execucao' | 'concluida';
export type OperationState = 'colheita' | 'carregamento' | 'cto_baldeio' | 'idle';

// Legacy interfaces for backward compatibility
export interface Farm {
  id: string;
  nome: string;
  produtividade: Productivity;
  distancia_km: number;
  janela_ini: string;
  janela_fim: string;
  estoque_t: number;
}

export interface Module {
  id: string;
  farm_id: string;
  nome: string;
  status: ModuleStatus;
  trocas_dia_max: number;
}

export interface Truck {
  id: string;
  placa: string;
  capacidade_t: number;
  restricoes_via: string;
  disponibilidade: boolean;
}

export interface Driver {
  id: string;
  nome: string;
  jornada_max_h: number;
  pausas: number;
}

export interface Route {
  id: string;
  origem: string;
  destino: string;
  distancia_km: number;
  tempo_min: number;
  tipo_via: string;
  bloqueios: boolean;
}

export interface Order {
  id: string;
  farm_id: string;
  module_id: string;
  volume_t: number;
  janela: string;
  status: OrderStatus;
  truck_id?: string;
  driver_id?: string;
}

export interface Demand {
  data: string;
  demanda_total_t: number;
  meta_hora_t: number;
}

export interface Plan {
  id: string;
  data: string;
  parametros: {
    alpha: number;
    beta: number;
    gamma: number;
    delta: number;
  };
  kpis: {
    demanda_atendida: number;
    trocas_modulo: number;
    km_total: number;
    tempo_medio_ciclo: number;
  };
  publicado: boolean;
}