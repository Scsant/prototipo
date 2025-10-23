import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  Zap, 
  Brain,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Truck,
  BarChart3,
  Target,
  Sparkles
} from 'lucide-react';

// ============================================
// TIPOS E INTERFACES
// ============================================

type StrategyType = 'volume' | 'estoque-alto' | 'custo' | 'balanceado' | 'urgencia' | 'sustentabilidade';

interface ScenarioResult {
  strategy: StrategyType;
  nome: string;
  descricao: string;
  metricas: {
    volume_diario_estimado: number;
    reducao_custo_percent: number;
    trocas_modulos: number;
    tempo_medio_ciclo: number;
    eficiencia_percent: number;
    co2_economia_kg?: number;
  };
  acoes: {
    tipo: 'mover_modulo' | 'realocar_frota' | 'priorizar_fazenda' | 'otimizar_rota';
    descricao: string;
    impacto: 'alto' | 'medio' | 'baixo';
    prioridade: number;
  }[];
  fazendas_criticas: {
    nome: string;
    problema: string;
    solucao: string;
    ganho_estimado: number;
  }[];
  realocacoes: {
    modulo: string;
    de: string;
    para: string;
    razao: string;
    distancia_km: number;
    ganho_volume_t: number;
  }[];
}

// ============================================
// DADOS MOCKADOS
// ============================================

const FAZENDAS_MOCK = [
  { id: 'F01', nome: 'Fazenda Santa Rita', estado: 'SP', distancia: 45, estoque: 12500, produtividade: 'alta', modulo_atual: 'MOD-CAR-01' },
  { id: 'F02', nome: 'Fazenda Boa Vista', estado: 'SP', distancia: 78, estoque: 8300, produtividade: 'media', modulo_atual: 'MOD-CAR-02' },
  { id: 'F03', nome: 'Fazenda Palmital', estado: 'MS', distancia: 165, estoque: 15800, produtividade: 'alta', modulo_atual: null },
  { id: 'F04', nome: 'Fazenda Córrego Fundo', estado: 'SP', distancia: 92, estoque: 3200, produtividade: 'baixa', modulo_atual: 'MOD-CAR-03' },
  { id: 'F05', nome: 'Fazenda Progresso', estado: 'GO', distancia: 210, estoque: 18200, produtividade: 'alta', modulo_atual: null },
  { id: 'F06', nome: 'Fazenda Serra Azul', estado: 'MG', distancia: 185, estoque: 4500, produtividade: 'baixa', modulo_atual: null },
  { id: 'F07', nome: 'Fazenda Três Irmãos', estado: 'SP', distancia: 52, estoque: 9100, produtividade: 'media', modulo_atual: 'MOD-CAR-04' },
  { id: 'F08', nome: 'Fazenda Esperança', estado: 'PR', distancia: 195, estoque: 6700, produtividade: 'baixa', modulo_atual: 'MOD-CAR-05' },
];

const MODULOS_MOCK = [
  { id: 'MOD-CAR-01', tipo: 'carregamento', capacidade: 850, fazenda_atual: 'Fazenda Santa Rita', estado: 'SP' },
  { id: 'MOD-CAR-02', tipo: 'carregamento', capacidade: 820, fazenda_atual: 'Fazenda Boa Vista', estado: 'SP' },
  { id: 'MOD-CAR-03', tipo: 'carregamento', capacidade: 780, fazenda_atual: 'Fazenda Córrego Fundo', estado: 'SP' },
  { id: 'MOD-CAR-04', tipo: 'carregamento', capacidade: 850, fazenda_atual: 'Fazenda Três Irmãos', estado: 'SP' },
  { id: 'MOD-CAR-05', tipo: 'carregamento', capacidade: 800, fazenda_atual: 'Fazenda Esperança', estado: 'PR' },
];

// ============================================
// ALGORITMOS DE OTIMIZAÇÃO
// ============================================

function gerarCenarioVolume(): ScenarioResult {
  return {
    strategy: 'volume',
    nome: 'Maximização de Volume',
    descricao: 'Cenário focado em maximizar a chegada de madeira na fábrica priorizando fazendas de alta produtividade',
    metricas: {
      volume_diario_estimado: 38500,
      reducao_custo_percent: -8,
      trocas_modulos: 2,
      tempo_medio_ciclo: 145,
      eficiencia_percent: 94,
    },
    acoes: [
      {
        tipo: 'mover_modulo',
        descricao: 'Realocar MOD-CAR-03 de Fazenda Córrego Fundo (baixa produtividade) para Fazenda Palmital (alta produtividade)',
        impacto: 'alto',
        prioridade: 1,
      },
      {
        tipo: 'mover_modulo',
        descricao: 'Realocar MOD-CAR-05 de Fazenda Esperança (baixa produtividade) para Fazenda Progresso (alta produtividade)',
        impacto: 'alto',
        prioridade: 2,
      },
      {
        tipo: 'priorizar_fazenda',
        descricao: 'Aumentar frota em Fazenda Santa Rita (45km) para aproveitar alta produtividade e proximidade',
        impacto: 'medio',
        prioridade: 3,
      },
      {
        tipo: 'otimizar_rota',
        descricao: 'Criar rota dedicada para Fazenda Palmital (165km, 15.800t disponíveis)',
        impacto: 'alto',
        prioridade: 4,
      },
    ],
    fazendas_criticas: [
      {
        nome: 'Fazenda Palmital (MS)',
        problema: 'Alto estoque (15.800t) sem módulo de carregamento ativo',
        solucao: 'Alocar MOD-CAR-03 para exploração imediata',
        ganho_estimado: 4200,
      },
      {
        nome: 'Fazenda Progresso (GO)',
        problema: 'Maior estoque do sistema (18.200t) sem cobertura',
        solucao: 'Alocar MOD-CAR-05 para captura de volume',
        ganho_estimado: 5100,
      },
    ],
    realocacoes: [
      {
        modulo: 'MOD-CAR-03',
        de: 'Fazenda Córrego Fundo (SP)',
        para: 'Fazenda Palmital (MS)',
        razao: 'Produtividade alta + Estoque crítico (15.800t)',
        distancia_km: 245,
        ganho_volume_t: 4200,
      },
      {
        modulo: 'MOD-CAR-05',
        de: 'Fazenda Esperança (PR)',
        para: 'Fazenda Progresso (GO)',
        razao: 'Maior estoque do sistema (18.200t) + Alta produtividade',
        distancia_km: 312,
        ganho_volume_t: 5100,
      },
    ],
  };
}

function gerarCenarioEstoqueAlto(): ScenarioResult {
  return {
    strategy: 'estoque-alto',
    nome: 'Gestão de Estoque Alto',
    descricao: 'Cenário para explorar fazendas críticas/baixa produção quando estoque está alto, reservando fazendas boas para momentos críticos',
    metricas: {
      volume_diario_estimado: 31200,
      reducao_custo_percent: 5,
      trocas_modulos: 3,
      tempo_medio_ciclo: 168,
      eficiencia_percent: 87,
    },
    acoes: [
      {
        tipo: 'priorizar_fazenda',
        descricao: 'Priorizar Fazenda Córrego Fundo (baixa produtividade) para liberar estoque crítico',
        impacto: 'alto',
        prioridade: 1,
      },
      {
        tipo: 'priorizar_fazenda',
        descricao: 'Explorar Fazenda Serra Azul (baixa produtividade, 4.500t) antes que expire TPC',
        impacto: 'medio',
        prioridade: 2,
      },
      {
        tipo: 'mover_modulo',
        descricao: 'Mover MOD-CAR-01 temporariamente para fazenda crítica Serra Azul',
        impacto: 'medio',
        prioridade: 3,
      },
      {
        tipo: 'realocar_frota',
        descricao: 'Reservar 60% da frota para fazendas críticas/baixa produção',
        impacto: 'alto',
        prioridade: 4,
      },
    ],
    fazendas_criticas: [
      {
        nome: 'Fazenda Córrego Fundo (SP)',
        problema: 'Baixa produtividade mas 3.200t parados',
        solucao: 'Manter MOD-CAR-03 até esgotar estoque',
        ganho_estimado: 1200,
      },
      {
        nome: 'Fazenda Serra Azul (MG)',
        problema: 'Baixa produtividade + Sem módulo + TPC próximo do limite',
        solucao: 'Alocar temporariamente MOD-CAR-01',
        ganho_estimado: 980,
      },
      {
        nome: 'Fazenda Esperança (PR)',
        problema: 'Baixa produtividade + Distância alta (195km)',
        solucao: 'Finalizar operação com MOD-CAR-05',
        ganho_estimado: 850,
      },
    ],
    realocacoes: [
      {
        modulo: 'MOD-CAR-01',
        de: 'Fazenda Santa Rita (SP)',
        para: 'Fazenda Serra Azul (MG)',
        razao: 'Reservar Santa Rita (alta produtividade) para momento de estoque baixo',
        distancia_km: 178,
        ganho_volume_t: 980,
      },
    ],
  };
}

function gerarCenarioCusto(): ScenarioResult {
  return {
    strategy: 'custo',
    nome: 'Minimização de Custos',
    descricao: 'Cenário otimizado para reduzir custos operacionais priorizando fazendas próximas e minimizando movimentações',
    metricas: {
      volume_diario_estimado: 33800,
      reducao_custo_percent: 18,
      trocas_modulos: 1,
      tempo_medio_ciclo: 98,
      eficiencia_percent: 91,
    },
    acoes: [
      {
        tipo: 'priorizar_fazenda',
        descricao: 'Concentrar operações em fazendas <100km: Santa Rita (45km), Três Irmãos (52km), Boa Vista (78km)',
        impacto: 'alto',
        prioridade: 1,
      },
      {
        tipo: 'otimizar_rota',
        descricao: 'Criar cluster SP com 3 fazendas próximas para reduzir km rodados',
        impacto: 'alto',
        prioridade: 2,
      },
      {
        tipo: 'realocar_frota',
        descricao: 'Reduzir viagens para fazendas >150km (Palmital, Progresso, Serra Azul, Esperança)',
        impacto: 'medio',
        prioridade: 3,
      },
      {
        tipo: 'mover_modulo',
        descricao: 'Minimizar trocas de módulos - apenas 1 movimentação essencial',
        impacto: 'baixo',
        prioridade: 4,
      },
    ],
    fazendas_criticas: [
      {
        nome: 'Fazenda Esperança (PR)',
        problema: 'Distância alta (195km) + Baixa produtividade = Custo elevado por tonelada',
        solucao: 'Reduzir operação e finalizar estoque rapidamente',
        ganho_estimado: 3500,
      },
      {
        nome: 'Fazenda Progresso (GO)',
        problema: 'Distância muito alta (210km) aumenta custo mesmo com alta produtividade',
        solucao: 'Adiar operação para momento estratégico',
        ganho_estimado: 4200,
      },
    ],
    realocacoes: [
      {
        modulo: 'MOD-CAR-03',
        de: 'Fazenda Córrego Fundo (92km)',
        para: 'Fazenda Três Irmãos (52km)',
        razao: 'Redução de 40km por viagem = Economia de R$ 18.500/semana',
        distancia_km: 48,
        ganho_volume_t: -200, // Redução de volume mas ganho em custo
      },
    ],
  };
}

function gerarCenarioBalanceado(): ScenarioResult {
  return {
    strategy: 'balanceado',
    nome: 'Estratégia Balanceada',
    descricao: 'Equilíbrio entre volume, custo e eficiência operacional para operação sustentável',
    metricas: {
      volume_diario_estimado: 35000,
      reducao_custo_percent: 8,
      trocas_modulos: 2,
      tempo_medio_ciclo: 125,
      eficiencia_percent: 92,
    },
    acoes: [
      {
        tipo: 'mover_modulo',
        descricao: 'Realocar MOD-CAR-03 para fazenda de média distância com bom estoque',
        impacto: 'medio',
        prioridade: 1,
      },
      {
        tipo: 'priorizar_fazenda',
        descricao: 'Balancear 60% fazendas próximas + 40% fazendas estratégicas distantes',
        impacto: 'medio',
        prioridade: 2,
      },
      {
        tipo: 'otimizar_rota',
        descricao: 'Otimizar rotas com algoritmo de programação dinâmica',
        impacto: 'medio',
        prioridade: 3,
      },
    ],
    fazendas_criticas: [],
    realocacoes: [
      {
        modulo: 'MOD-CAR-03',
        de: 'Fazenda Córrego Fundo (SP)',
        para: 'Fazenda Boa Vista (SP)',
        razao: 'Equilíbrio entre distância (78km) e produtividade média',
        distancia_km: 35,
        ganho_volume_t: 2100,
      },
    ],
  };
}

function gerarCenarioUrgencia(): ScenarioResult {
  return {
    strategy: 'urgencia',
    nome: 'Resposta a Urgência',
    descricao: 'Cenário de contingência para atender demanda urgente da fábrica com máxima velocidade',
    metricas: {
      volume_diario_estimado: 42000,
      reducao_custo_percent: -15,
      trocas_modulos: 4,
      tempo_medio_ciclo: 95,
      eficiencia_percent: 96,
    },
    acoes: [
      {
        tipo: 'priorizar_fazenda',
        descricao: 'URGENTE: Ativar todas as fazendas próximas (<100km) em capacidade máxima',
        impacto: 'alto',
        prioridade: 1,
      },
      {
        tipo: 'realocar_frota',
        descricao: 'Mobilizar 100% da frota disponível (830 caminhões)',
        impacto: 'alto',
        prioridade: 2,
      },
      {
        tipo: 'mover_modulo',
        descricao: 'Movimentar 4 módulos para fazendas de acesso rápido',
        impacto: 'alto',
        prioridade: 3,
      },
      {
        tipo: 'otimizar_rota',
        descricao: 'Priorizar ciclos mais curtos mesmo com menor volume por viagem',
        impacto: 'medio',
        prioridade: 4,
      },
    ],
    fazendas_criticas: [
      {
        nome: 'Fazenda Santa Rita (SP)',
        problema: 'Subutilizada - Pode entregar +3.000t/dia',
        solucao: 'Aumentar frota de 45 para 80 caminhões',
        ganho_estimado: 3200,
      },
      {
        nome: 'Fazenda Três Irmãos (SP)',
        problema: 'Capacidade ociosa - 52km permite ciclos rápidos',
        solucao: 'Dobrar operação com segundo módulo',
        ganho_estimado: 2800,
      },
    ],
    realocacoes: [
      {
        modulo: 'MOD-CAR-03',
        de: 'Fazenda Córrego Fundo (SP)',
        para: 'Fazenda Santa Rita (SP)',
        razao: 'Segundo módulo para duplicar capacidade em fazenda crítica',
        distancia_km: 52,
        ganho_volume_t: 3200,
      },
    ],
  };
}

function gerarCenarioSustentabilidade(): ScenarioResult {
  return {
    strategy: 'sustentabilidade',
    nome: 'Otimização Sustentável',
    descricao: 'Minimizar emissões de CO₂ e impacto ambiental priorizando eficiência energética',
    metricas: {
      volume_diario_estimado: 33500,
      reducao_custo_percent: 12,
      trocas_modulos: 1,
      tempo_medio_ciclo: 108,
      eficiencia_percent: 89,
      co2_economia_kg: 45800,
    },
    acoes: [
      {
        tipo: 'priorizar_fazenda',
        descricao: 'Priorizar fazendas em raio de 80km para minimizar emissões',
        impacto: 'alto',
        prioridade: 1,
      },
      {
        tipo: 'otimizar_rota',
        descricao: 'Roteirização verde com algoritmo de menor pegada de carbono',
        impacto: 'medio',
        prioridade: 2,
      },
      {
        tipo: 'realocar_frota',
        descricao: 'Consolidar cargas para reduzir viagens vazias',
        impacto: 'medio',
        prioridade: 3,
      },
    ],
    fazendas_criticas: [
      {
        nome: 'Fazenda Progresso (GO)',
        problema: 'Distância de 210km gera 18 ton CO₂/dia',
        solucao: 'Adiar operação e consolidar com outras fazendas da região',
        ganho_estimado: 1200,
      },
    ],
    realocacoes: [],
  };
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function SmartScenariosPage() {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType | null>(null);
  const [cenarioAtual, setCenarioAtual] = useState<ScenarioResult | null>(null);
  const [loading, setLoading] = useState(false);

  const gerarCenario = (strategy: StrategyType) => {
    setLoading(true);
    setSelectedStrategy(strategy);

    // Simular processamento de algoritmo
    setTimeout(() => {
      let resultado: ScenarioResult;
      
      switch (strategy) {
        case 'volume':
          resultado = gerarCenarioVolume();
          break;
        case 'estoque-alto':
          resultado = gerarCenarioEstoqueAlto();
          break;
        case 'custo':
          resultado = gerarCenarioCusto();
          break;
        case 'balanceado':
          resultado = gerarCenarioBalanceado();
          break;
        case 'urgencia':
          resultado = gerarCenarioUrgencia();
          break;
        case 'sustentabilidade':
          resultado = gerarCenarioSustentabilidade();
          break;
        default:
          resultado = gerarCenarioBalanceado();
      }

      setCenarioAtual(resultado);
      setLoading(false);
    }, 1500);
  };

  const estrategias = [
    {
      id: 'volume' as StrategyType,
      nome: 'Máximo Volume',
      descricao: 'Maximizar chegada de madeira na fábrica',
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-blue-500 to-blue-700',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      id: 'estoque-alto' as StrategyType,
      nome: 'Estoque Alto',
      descricao: 'Explorar fazendas críticas e reservar as melhores',
      icon: Package,
      color: 'bg-gradient-to-br from-amber-500 to-amber-700',
      textColor: 'text-amber-600',
      bgLight: 'bg-amber-50',
    },
    {
      id: 'custo' as StrategyType,
      nome: 'Mínimo Custo',
      descricao: 'Minimizar custos operacionais e maximizar lucros',
      icon: DollarSign,
      color: 'bg-gradient-to-br from-green-500 to-green-700',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50',
    },
    {
      id: 'urgencia' as StrategyType,
      nome: 'Urgência',
      descricao: 'Resposta rápida para demanda crítica',
      icon: Zap,
      color: 'bg-gradient-to-br from-red-500 to-red-700',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50',
    },
    {
      id: 'balanceado' as StrategyType,
      nome: 'Balanceado',
      descricao: 'Equilíbrio entre volume, custo e eficiência',
      icon: Target,
      color: 'bg-gradient-to-br from-purple-500 to-purple-700',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50',
    },
    {
      id: 'sustentabilidade' as StrategyType,
      nome: 'Sustentável',
      descricao: 'Minimizar emissões de CO₂ e impacto ambiental',
      icon: Sparkles,
      color: 'bg-gradient-to-br from-teal-500 to-teal-700',
      textColor: 'text-teal-600',
      bgLight: 'bg-teal-50',
    },
  ];

  return (
    <div className="p-6 max-w-[1800px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-white flex items-center gap-3">
            <Brain className="size-8 text-blue-400" />
            Geração Inteligente de Cenários
          </h1>
          <p className="text-gray-300">
            Algoritmos de Machine Learning e Pesquisa Operacional para otimização estratégica
          </p>
        </div>
      </div>

      {/* Strategy Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {estrategias.map((estrategia) => {
          const Icon = estrategia.icon;
          const isSelected = selectedStrategy === estrategia.id;
          
          return (
            <Card
              key={estrategia.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
              onClick={() => gerarCenario(estrategia.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${estrategia.color}`}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-1 text-white">{estrategia.nome}</h3>
                    <p className="text-sm text-gray-400">{estrategia.descricao}</p>
                    {isSelected && (
                      <Badge className="mt-2 bg-blue-500/20 text-blue-400 border-blue-500/50">
                        Ativo
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Brain className="size-16 text-blue-500 animate-pulse" />
                <Sparkles className="size-6 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
              </div>
              <div className="text-center">
                <h3 className="text-xl mb-2 text-white">Processando Algoritmos...</h3>
                <p className="text-gray-400">Analisando 8 fazendas, 5 módulos e 830 caminhões</p>
              </div>
              <Progress value={65} className="w-64" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!loading && cenarioAtual && (
        <div className="space-y-6">
          {/* Header do Cenário */}
          <Card className="border-2 border-blue-500/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <CheckCircle className="size-6 text-green-500" />
                    {cenarioAtual.nome}
                  </CardTitle>
                  <p className="text-gray-400 mt-2">{cenarioAtual.descricao}</p>
                </div>
                <Button size="lg" className="gap-2">
                  Aplicar Cenário
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Métricas Principais */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="size-4 text-blue-400" />
                  <p className="text-sm text-gray-400">Volume Diário</p>
                </div>
                <p className="text-2xl text-white">{cenarioAtual.metricas.volume_diario_estimado.toLocaleString()}t</p>
                <p className="text-xs text-gray-500 mt-1">Meta: 35.000t/dia</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="size-4 text-green-400" />
                  <p className="text-sm text-gray-400">Redução de Custo</p>
                </div>
                <p className={`text-2xl ${cenarioAtual.metricas.reducao_custo_percent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {cenarioAtual.metricas.reducao_custo_percent > 0 ? '+' : ''}{cenarioAtual.metricas.reducao_custo_percent}%
                </p>
                <p className="text-xs text-gray-500 mt-1">vs. Baseline</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="size-4 text-amber-400" />
                  <p className="text-sm text-gray-400">Trocas de Módulos</p>
                </div>
                <p className="text-2xl text-white">{cenarioAtual.metricas.trocas_modulos}</p>
                <p className="text-xs text-gray-500 mt-1">Movimentações necessárias</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="size-4 text-purple-400" />
                  <p className="text-sm text-gray-400">Tempo Médio Ciclo</p>
                </div>
                <p className="text-2xl text-white">{cenarioAtual.metricas.tempo_medio_ciclo}min</p>
                <p className="text-xs text-gray-500 mt-1">Por viagem</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="size-4 text-teal-400" />
                  <p className="text-sm text-gray-400">Eficiência</p>
                </div>
                <p className="text-2xl text-white">{cenarioAtual.metricas.eficiencia_percent}%</p>
                {cenarioAtual.metricas.co2_economia_kg && (
                  <p className="text-xs text-teal-500 mt-1">-{(cenarioAtual.metricas.co2_economia_kg / 1000).toFixed(1)}t CO₂</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tabs com Detalhes */}
          <Tabs defaultValue="acoes" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="acoes">Ações Recomendadas</TabsTrigger>
              <TabsTrigger value="realocacoes">Realocações</TabsTrigger>
              <TabsTrigger value="criticas">Fazendas Críticas</TabsTrigger>
              <TabsTrigger value="analise">Análise Completa</TabsTrigger>
            </TabsList>

            {/* Ações Recomendadas */}
            <TabsContent value="acoes">
              <Card>
                <CardHeader>
                  <CardTitle>Plano de Ação Prioritário</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cenarioAtual.acoes.map((acao, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          acao.impacto === 'alto'
                            ? 'border-red-500 bg-red-500/10'
                            : acao.impacto === 'medio'
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-green-500 bg-green-500/10'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                Prioridade {acao.prioridade}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={
                                  acao.impacto === 'alto'
                                    ? 'text-red-400 border-red-500/50'
                                    : acao.impacto === 'medio'
                                    ? 'text-amber-400 border-amber-500/50'
                                    : 'text-green-400 border-green-500/50'
                                }
                              >
                                Impacto {acao.impacto.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-white">{acao.descricao}</p>
                          </div>
                          <CheckCircle className="size-5 text-gray-500 ml-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Realocações */}
            <TabsContent value="realocacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Movimentações de Módulos Sugeridas</CardTitle>
                </CardHeader>
                <CardContent>
                  {cenarioAtual.realocacoes.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <XCircle className="size-12 mx-auto mb-3 text-gray-600" />
                      <p>Nenhuma realocação necessária neste cenário</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Módulo</TableHead>
                          <TableHead>Origem</TableHead>
                          <TableHead>Destino</TableHead>
                          <TableHead>Razão</TableHead>
                          <TableHead>Distância</TableHead>
                          <TableHead>Ganho Estimado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cenarioAtual.realocacoes.map((real, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Badge variant="outline" className="text-blue-400 border-blue-500/50">
                                {real.modulo}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-300">{real.de}</TableCell>
                            <TableCell className="text-gray-300">
                              <div className="flex items-center gap-2">
                                <ArrowRight className="size-4 text-green-500" />
                                {real.para}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-400 max-w-xs">{real.razao}</TableCell>
                            <TableCell className="text-gray-300">{real.distancia_km} km</TableCell>
                            <TableCell>
                              <span className={real.ganho_volume_t > 0 ? 'text-green-500' : 'text-amber-500'}>
                                {real.ganho_volume_t > 0 ? '+' : ''}{real.ganho_volume_t.toLocaleString()}t
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fazendas Críticas */}
            <TabsContent value="criticas">
              <Card>
                <CardHeader>
                  <CardTitle>Fazendas que Requerem Atenção</CardTitle>
                </CardHeader>
                <CardContent>
                  {cenarioAtual.fazendas_criticas.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <CheckCircle className="size-12 mx-auto mb-3 text-green-600" />
                      <p>Nenhuma fazenda crítica identificada</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cenarioAtual.fazendas_criticas.map((fazenda, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30"
                        >
                          <div className="flex items-start gap-4">
                            <AlertTriangle className="size-6 text-orange-500 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <h4 className="text-lg text-white mb-2">{fazenda.nome}</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-400 w-20">Problema:</span>
                                  <span className="text-orange-300 flex-1">{fazenda.problema}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-400 w-20">Solução:</span>
                                  <span className="text-green-300 flex-1">{fazenda.solucao}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-gray-400 w-20">Ganho:</span>
                                  <span className="text-blue-300 flex-1">
                                    +{fazenda.ganho_estimado.toLocaleString()}t/dia
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Análise Completa */}
            <TabsContent value="analise">
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Situação Atual das Fazendas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fazenda</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Distância (km)</TableHead>
                          <TableHead>Estoque (t)</TableHead>
                          <TableHead>Produtividade</TableHead>
                          <TableHead>Módulo Atual</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {FAZENDAS_MOCK.map((faz) => (
                          <TableRow key={faz.id}>
                            <TableCell className="text-white">{faz.nome}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{faz.estado}</Badge>
                            </TableCell>
                            <TableCell className="text-gray-300">{faz.distancia} km</TableCell>
                            <TableCell className="text-gray-300">{faz.estoque.toLocaleString()}t</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  faz.produtividade === 'alta'
                                    ? 'bg-green-500/20 text-green-400 border-green-500/50'
                                    : faz.produtividade === 'media'
                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                                    : 'bg-red-500/20 text-red-400 border-red-500/50'
                                }
                              >
                                {faz.produtividade.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {faz.modulo_atual ? (
                                <Badge variant="outline" className="text-blue-400 border-blue-500/50">
                                  {faz.modulo_atual}
                                </Badge>
                              ) : (
                                <span className="text-gray-600">Sem módulo</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição de Módulos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {MODULOS_MOCK.map((mod) => (
                        <div key={mod.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-blue-400 border-blue-500/50">
                              {mod.id}
                            </Badge>
                            <Badge>{mod.estado}</Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Localização:</span>
                              <span className="text-white">{mod.fazenda_atual}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Capacidade:</span>
                              <span className="text-white">{mod.capacidade}t/dia</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Instrução Inicial */}
      {!cenarioAtual && !loading && (
        <Card className="border-2 border-dashed border-gray-700">
          <CardContent className="py-12 text-center">
            <Brain className="size-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-white">Selecione uma Estratégia</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Clique em uma das estratégias acima para gerar um cenário otimizado usando algoritmos de
              Machine Learning e Pesquisa Operacional
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
