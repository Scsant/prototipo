// Mock data for development and demo purposes
import type { Farm, Module, Truck, Driver, Route, Order, Demand, Plan } from './supabase';

// Operation states for farms
export type OperationState = 'idle' | 'cto_baldeio' | 'colheita' | 'carregamento';

// Extended Farm type with geographic data and operational state
export interface FarmWithGeo extends Farm {
  estado: string;
  latitude: number;
  longitude: number;
  poligono: [number, number][]; // Array of [lat, lng] coordinates for polygon
  problemas?: string[]; // queimadas, deficit_hidrico, formigas, etc.
  taxa_carregamento_caminhoes_hora: number; // Real loading rate considering operational stops
  operation_state: OperationState;
  tpc_dias?: number; // Tempo Pós-Corte (days since baldeio CTO)
  colheita_progresso?: { colhido_t: number; meta_t: number; modulo_id: string }; // Harvest progress
  carregamento_progresso?: { carregado_t: number; meta_t: number; modulo_id: string }; // Loading progress
}

// Extended Module type with geographic data
export interface ModuleWithGeo extends Module {
  tipo: 'fixo' | 'movel';
  tipo_operacao: 'colheita' | 'carregamento'; // NEW: operation type
  estado: string;
  latitude: number;
  longitude: number;
  maquinas_gruas?: number; // Only for carregamento modules
}

export const mockFarms: FarmWithGeo[] = [
  // SÃO PAULO - 8 fazendas (módulos fixos)
  {
    id: '1',
    nome: 'Fazenda São José - SP',
    estado: 'SP',
    produtividade: 'alta',
    distancia_km: 45,
    janela_ini: '06:00',
    janela_fim: '18:00',
    estoque_t: 4200,
    latitude: -23.5505,
    longitude: -46.6333,
    taxa_carregamento_caminhoes_hora: 9,
    problemas: [],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '1' },
  },
  {
    id: '2',
    nome: 'Fazenda Boa Vista - SP',
    estado: 'SP',
    produtividade: 'alta',
    distancia_km: 32,
    janela_ini: '06:00',
    janela_fim: '18:00',
    estoque_t: 3800,
    latitude: -23.4505,
    longitude: -46.5333,
    taxa_carregamento_caminhoes_hora: 9,
    problemas: [],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '2' },
  },
  {
    id: '3',
    nome: 'Fazenda Santa Clara - SP',
    estado: 'SP',
    produtividade: 'média',
    distancia_km: 58,
    janela_ini: '06:30',
    janela_fim: '18:30',
    estoque_t: 3200,
    latitude: -23.3505,
    longitude: -46.7333,
    taxa_carregamento_caminhoes_hora: 6,
    problemas: ['deficit_hidrico'],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '3' },
  },
  {
    id: '4',
    nome: 'Fazenda Horizonte - SP',
    estado: 'SP',
    produtividade: 'média',
    distancia_km: 67,
    janela_ini: '06:00',
    janela_fim: '17:00',
    estoque_t: 2900,
    latitude: -23.6505,
    longitude: -46.4333,
    taxa_carregamento_caminhoes_hora: 6,
    problemas: ['formigas'],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '4' },
  },
  {
    id: '5',
    nome: 'Fazenda Três Irmãos - SP',
    estado: 'SP',
    produtividade: 'alta',
    distancia_km: 52,
    janela_ini: '06:00',
    janela_fim: '18:00',
    estoque_t: 4100,
    latitude: -23.2505,
    longitude: -46.8333,
    taxa_carregamento_caminhoes_hora: 9,
    problemas: [],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '5' },
  },
  {
    id: '6',
    nome: 'Fazenda Progresso - SP',
    estado: 'SP',
    produtividade: 'média',
    distancia_km: 78,
    janela_ini: '06:00',
    janela_fim: '17:30',
    estoque_t: 3100,
    latitude: -23.7505,
    longitude: -46.3333,
    taxa_carregamento_caminhoes_hora: 6,
    problemas: [],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '6' },
  },
  {
    id: '7',
    nome: 'Fazenda Nova Era - SP',
    estado: 'SP',
    produtividade: 'alta',
    distancia_km: 41,
    janela_ini: '06:00',
    janela_fim: '18:00',
    estoque_t: 3900,
    latitude: -23.4005,
    longitude: -46.9333,
    taxa_carregamento_caminhoes_hora: 9,
    problemas: [],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '7' },
  },
  {
    id: '8',
    nome: 'Fazenda Paraíso - SP',
    estado: 'SP',
    produtividade: 'baixa',
    distancia_km: 95,
    janela_ini: '07:00',
    janela_fim: '16:00',
    estoque_t: 1800,
    latitude: -23.8505,
    longitude: -46.2333,
    taxa_carregamento_caminhoes_hora: 3,
    problemas: ['queimadas', 'trajeto_complexo'],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '8' },
  },
  
  // MATO GROSSO DO SUL - 3 fazendas
  {
    id: '9',
    nome: 'Fazenda Pantanal - MS',
    estado: 'MS',
    produtividade: 'média',
    distancia_km: 285,
    janela_ini: '06:00',
    janela_fim: '18:00',
    estoque_t: 2800,
    latitude: -20.4428,
    longitude: -54.6462,
    taxa_carregamento_caminhoes_hora: 6,
    problemas: ['trajeto_longo'],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '9' },
  },
  {
    id: '10',
    nome: 'Fazenda Cerrado - MS',
    estado: 'MS',
    produtividade: 'alta',
    distancia_km: 320,
    janela_ini: '06:00',
    janela_fim: '18:00',
    estoque_t: 3500,
    latitude: -20.5428,
    longitude: -54.7462,
    taxa_carregamento_caminhoes_hora: 9,
    problemas: [],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '10' },
  },
  
  // GOIÁS - 2 fazendas
  {
    id: '11',
    nome: 'Fazenda Planalto - GO',
    estado: 'GO',
    produtividade: 'média',
    distancia_km: 195,
    janela_ini: '06:00',
    janela_fim: '17:30',
    estoque_t: 2600,
    latitude: -16.6869,
    longitude: -49.2648,
    taxa_carregamento_caminhoes_hora: 6,
    problemas: ['deficit_hidrico'],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '11' },
  },
  {
    id: '12',
    nome: 'Fazenda Vale Verde - GO',
    estado: 'GO',
    produtividade: 'baixa',
    distancia_km: 220,
    janela_ini: '06:30',
    janela_fim: '17:00',
    estoque_t: 1900,
    latitude: -16.5869,
    longitude: -49.3648,
    taxa_carregamento_caminhoes_hora: 3,
    problemas: ['formigas', 'trajeto_complexo'],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '12' },
  },
  
  // PARANÁ - 2 fazendas
  {
    id: '13',
    nome: 'Fazenda Araucária - PR',
    estado: 'PR',
    produtividade: 'alta',
    distancia_km: 165,
    janela_ini: '06:00',
    janela_fim: '18:00',
    estoque_t: 3700,
    latitude: -25.5915,
    longitude: -49.4912,
    taxa_carregamento_caminhoes_hora: 9,
    problemas: [],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '13' },
  },
  {
    id: '14',
    nome: 'Fazenda Pinheiro - PR',
    estado: 'PR',
    produtividade: 'média',
    distancia_km: 180,
    janela_ini: '06:00',
    janela_fim: '17:30',
    estoque_t: 2700,
    latitude: -25.4915,
    longitude: -49.5912,
    taxa_carregamento_caminhoes_hora: 6,
    problemas: [],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '14' },
  },
  
  // MINAS GERAIS - 2 fazendas
  {
    id: '15',
    nome: 'Fazenda Ipê - MG',
    estado: 'MG',
    produtividade: 'média',
    distancia_km: 210,
    janela_ini: '06:00',
    janela_fim: '18:00',
    estoque_t: 2950,
    latitude: -19.9167,
    longitude: -43.9345,
    taxa_carregamento_caminhoes_hora: 6,
    problemas: ['queimadas'],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '15' },
  },
  {
    id: '16',
    nome: 'Fazenda Sucupira - MG',
    estado: 'MG',
    produtividade: 'baixa',
    distancia_km: 245,
    janela_ini: '06:30',
    janela_fim: '17:00',
    estoque_t: 1750,
    latitude: -19.8167,
    longitude: -44.0345,
    taxa_carregamento_caminhoes_hora: 3,
    problemas: ['deficit_hidrico', 'formigas'],
    operation_state: 'colheita',
    tpc_dias: 5,
    colheita_progresso: { colhido_t: 2000, meta_t: 4000, modulo_id: '16' },
  },
];

export const mockModules: ModuleWithGeo[] = [
  // 8 Módulos FIXOS em SP
  { id: '1', farm_id: '1', nome: 'Módulo SP-A1', status: 'ativo', trocas_dia_max: 2, tipo: 'fixo', estado: 'SP', latitude: -23.5505, longitude: -46.6333, maquinas_gruas: 3 },
  { id: '2', farm_id: '2', nome: 'Módulo SP-A2', status: 'ativo', trocas_dia_max: 2, tipo: 'fixo', estado: 'SP', latitude: -23.4505, longitude: -46.5333, maquinas_gruas: 3 },
  { id: '3', farm_id: '3', nome: 'Módulo SP-B1', status: 'ativo', trocas_dia_max: 2, tipo: 'fixo', estado: 'SP', latitude: -23.3505, longitude: -46.7333, maquinas_gruas: 3 },
  { id: '4', farm_id: '4', nome: 'Módulo SP-B2', status: 'ativo', trocas_dia_max: 2, tipo: 'fixo', estado: 'SP', latitude: -23.6505, longitude: -46.4333, maquinas_gruas: 3 },
  { id: '5', farm_id: '5', nome: 'Módulo SP-C1', status: 'ativo', trocas_dia_max: 2, tipo: 'fixo', estado: 'SP', latitude: -23.2505, longitude: -46.8333, maquinas_gruas: 3 },
  { id: '6', farm_id: '6', nome: 'Módulo SP-C2', status: 'ativo', trocas_dia_max: 2, tipo: 'fixo', estado: 'SP', latitude: -23.7505, longitude: -46.3333, maquinas_gruas: 3 },
  { id: '7', farm_id: '7', nome: 'Módulo SP-D1', status: 'ativo', trocas_dia_max: 2, tipo: 'fixo', estado: 'SP', latitude: -23.4005, longitude: -46.9333, maquinas_gruas: 3 },
  { id: '8', farm_id: '8', nome: 'Módulo SP-D2', status: 'pausa', trocas_dia_max: 1, tipo: 'fixo', estado: 'SP', latitude: -23.8505, longitude: -46.2333, maquinas_gruas: 3 },
  
  // 3 Módulos MÓVEIS (revezam entre MS, GO, PR, MG)
  { id: '9', farm_id: '10', nome: 'Módulo MÓVEL-1', status: 'ativo', trocas_dia_max: 3, tipo: 'movel', estado: 'MS', latitude: -20.5428, longitude: -54.7462, maquinas_gruas: 3 },
  { id: '10', farm_id: '13', nome: 'Módulo MÓVEL-2', status: 'ativo', trocas_dia_max: 3, tipo: 'movel', estado: 'PR', latitude: -25.5915, longitude: -49.4912, maquinas_gruas: 3 },
  { id: '11', farm_id: '11', nome: 'Módulo MÓVEL-3', status: 'ativo', trocas_dia_max: 3, tipo: 'movel', estado: 'GO', latitude: -16.6869, longitude: -49.2648, maquinas_gruas: 3 },
];

// Sample trucks (representing 830 total)
export const mockTrucks: Truck[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  placa: `ABC-${String(1000 + i).slice(-4)}`,
  capacidade_t: i % 3 === 0 ? 35 : 40,
  restricoes_via: i % 4 === 0 ? 'Terra' : 'Pavimentada',
  disponibilidade: i % 10 !== 0, // 90% disponível
}));

export const mockDrivers: Driver[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  nome: `Motorista ${i + 1}`,
  jornada_max_h: i % 3 === 0 ? 10 : 8,
  pausas: i % 3 === 0 ? 3 : 2,
}));

export const mockRoutes: Route[] = mockFarms.map((farm) => ({
  id: farm.id,
  origem: farm.nome,
  destino: 'Fábrica Bracell',
  distancia_km: farm.distancia_km,
  tempo_min: Math.round(farm.distancia_km * 1.5), // Aproximadamente 1.5 min por km
  tipo_via: farm.problemas?.includes('trajeto_complexo') ? 'Terra' : 'Pavimentada',
  bloqueios: farm.problemas?.includes('queimadas') || false,
}));

export const mockOrders: Order[] = [
  { id: '1', farm_id: '1', module_id: '1', volume_t: 40, janela: '06:00-08:00', status: 'em_rota', truck_id: '1', driver_id: '1' },
  { id: '2', farm_id: '1', module_id: '1', volume_t: 40, janela: '08:00-10:00', status: 'planejada', truck_id: '2', driver_id: '2' },
  { id: '3', farm_id: '2', module_id: '2', volume_t: 40, janela: '07:00-09:00', status: 'carregando', truck_id: '4', driver_id: '4' },
  { id: '4', farm_id: '2', module_id: '2', volume_t: 40, janela: '09:00-11:00', status: 'planejada', truck_id: '6', driver_id: '6' },
  { id: '5', farm_id: '3', module_id: '3', volume_t: 35, janela: '08:00-10:00', status: 'planejada', truck_id: '3', driver_id: '3' },
  { id: '6', farm_id: '3', module_id: '3', volume_t: 35, janela: '10:00-12:00', status: 'planejada' },
  { id: '7', farm_id: '4', module_id: '4', volume_t: 40, janela: '09:00-11:00', status: 'planejada' },
  { id: '8', farm_id: '1', module_id: '1', volume_t: 40, janela: '10:00-12:00', status: 'concluída', truck_id: '1', driver_id: '1' },
];

export const mockDemand: Demand = {
  data: '2025-10-18',
  demanda_total_t: 35000, // 35 mil m³ (considerando densidade ~1 t/m³)
  meta_hora_t: 1458, // 35000 / 24 horas
};

export const mockPlans: Plan[] = [
  {
    id: '1',
    data: '2025-10-18',
    parametros: { alpha: 0.3, beta: 0.2, gamma: 0.4, delta: 0.1 },
    kpis: { demanda_atendida: 34300, trocas_modulo: 8, km_total: 45200, tempo_medio_ciclo: 145 },
    publicado: true,
  },
  {
    id: '2',
    data: '2025-10-18',
    parametros: { alpha: 0.2, beta: 0.3, gamma: 0.3, delta: 0.2 },
    kpis: { demanda_atendida: 35000, trocas_modulo: 12, km_total: 43800, tempo_medio_ciclo: 138 },
    publicado: false,
  },
  {
    id: '3',
    data: '2025-10-18',
    parametros: { alpha: 0.25, beta: 0.25, gamma: 0.35, delta: 0.15 },
    kpis: { demanda_atendida: 34650, trocas_modulo: 10, km_total: 44500, tempo_medio_ciclo: 142 },
    publicado: false,
  },
];

export const getProductivityColor = (produtividade: 'alta' | 'média' | 'baixa') => {
  switch (produtividade) {
    case 'alta':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'média':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'baixa':
      return 'text-red-600 bg-red-50 border-red-200';
  }
};

export const getProductivityColorDark = (produtividade: 'alta' | 'média' | 'baixa') => {
  switch (produtividade) {
    case 'alta':
      return 'text-green-400 bg-green-900/30 border-green-700/50';
    case 'média':
      return 'text-amber-400 bg-amber-900/30 border-amber-700/50';
    case 'baixa':
      return 'text-red-400 bg-red-900/30 border-red-700/50';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'ativo':
    case 'concluída':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'em_rota':
    case 'carregando':
    case 'descarregando':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'planejada':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    case 'pausa':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'indisp':
    case 'atrasada':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getStatusColorDark = (status: string) => {
  switch (status) {
    case 'ativo':
    case 'concluída':
      return 'text-green-400 bg-green-900/30 border-green-700/50';
    case 'em_rota':
    case 'carregando':
    case 'descarregando':
      return 'text-blue-400 bg-blue-900/30 border-blue-700/50';
    case 'planejada':
      return 'text-gray-400 bg-gray-800/30 border-gray-700/50';
    case 'pausa':
      return 'text-amber-400 bg-amber-900/30 border-amber-700/50';
    case 'indisp':
    case 'atrasada':
      return 'text-red-400 bg-red-900/30 border-red-700/50';
    default:
      return 'text-gray-400 bg-gray-800/30 border-gray-700/50';
  }
};