// ============================================
// OTIMIZADOR DE TRANSPORTE - ALGORITMO
// Sistema de recomendação de cenários para transporte de madeira
// ============================================

// Tipos
export interface Fazenda {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  distancia_fabrica_km: number;
  estoque_toneladas: number;
  produtividade: string;
  estado: { sigla: string };
  modulos?: any[];
}

export interface Modulo {
  id: string;
  nome: string;
  tipo: string;
  status: string;
  capacidade_diaria_toneladas: number;
  fazenda_atual?: {
    id: string;
    nome: string;
    estoque_toneladas: number;
    distancia_fabrica_km: number;
    latitude: number;
    longitude: number;
    estado: { sigla: string };
  };
}

export interface Cenario {
  id: string;
  fazenda: Fazenda;
  modulo: Modulo;
  score: number;
  distancia_modulo_fazenda: number;
  impacto_troca: string;
  estoque_restante_origem: number;
  viagens_estimadas: number;
  tempo_ciclo_estimado: number;
  custo_estimado: number;
  recomendacao: string;
  detalhes: {
    score_distancia: number;
    score_tempo: number;
    score_troca: number;
    score_produtividade: number;
  };
}

// Parâmetros de otimização
export interface ParametrosOtimizacao {
  alpha: number; // Peso distância
  beta: number;  // Peso tempo
  gamma: number; // Penalidade troca
  delta: number; // Prioridade produtividade
}

/**
 * Calcula distância entre dois pontos (Haversine)
 */
function calcularDistancia(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Normaliza valores entre 0 e 1
 */
function normalizar(valor: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (valor - min) / (max - min);
}

/**
 * Avalia o impacto de trocar um módulo de fazenda
 */
function avaliarImpactoTroca(estoqueRestante: number): {
  impacto: string;
  penalidade: number;
} {
  if (estoqueRestante > 10000) {
    return { impacto: 'ALTO', penalidade: 1.0 };
  } else if (estoqueRestante > 5000) {
    return { impacto: 'MÉDIO', penalidade: 0.6 };
  } else if (estoqueRestante > 2000) {
    return { impacto: 'BAIXO', penalidade: 0.3 };
  } else {
    return { impacto: 'MÍNIMO', penalidade: 0.1 };
  }
}

/**
 * Gera cenários de otimização baseados nos parâmetros
 */
export function gerarCenarios(
  fazendas: Fazenda[],
  modulos: Modulo[],
  params: ParametrosOtimizacao
): Cenario[] {
  const cenarios: Cenario[] = [];
  
  // Filtrar apenas fazendas com estoque disponível
  const fazendasDisponiveis = fazendas.filter(f => 
    f.estoque_toneladas > 0
  );
  
  // Filtrar apenas módulos de carregamento
  const modulosCarregamento = modulos.filter(m => 
    m.tipo === 'Carregamento' && 
    m.fazenda_atual
  );
  
  console.log(`DEBUG: ${fazendasDisponiveis.length} fazendas disponíveis`);
  console.log(`DEBUG: ${modulosCarregamento.length} módulos de carregamento`);
  console.log('DEBUG: Módulos recebidos:', modulos.map(m => ({ codigo: m.nome, tipo: m.tipo })));
  
  if (modulosCarregamento.length === 0 || fazendasDisponiveis.length === 0) {
    console.warn('Nenhum cenário gerado: faltam fazendas ou módulos');
    return [];
  }
  
  // Calcular valores min/max para normalização
  const distancias = fazendasDisponiveis.map(f => f.distancia_fabrica_km);
  const minDistFabrica = Math.min(...distancias);
  const maxDistFabrica = Math.max(...distancias);
  
  // Para cada fazenda disponível, avaliar todos os módulos possíveis
  fazendasDisponiveis.forEach(fazenda => {
    modulosCarregamento.forEach(modulo => {
      if (!modulo.fazenda_atual) return;
      
      // Calcular distância entre módulo atual e fazenda destino
      const distModuloFazenda = calcularDistancia(
        modulo.fazenda_atual.latitude,
        modulo.fazenda_atual.longitude,
        fazenda.latitude,
        fazenda.longitude
      );
      
      // 1. Score de Distância (menor distância da fábrica = melhor)
      const scoreDistancia = 1 - normalizar(
        fazenda.distancia_fabrica_km,
        minDistFabrica,
        maxDistFabrica
      );
      
      // 2. Score de Tempo (baseado na distância do módulo)
      // Módulos mais próximos da fazenda destino são melhores
      const scoreTempo = 1 - normalizar(distModuloFazenda, 0, 500);
      
      // 3. Score de Troca (penaliza trocar módulos de fazendas com muito estoque)
      const estoqueRestante = modulo.fazenda_atual.estoque_toneladas || 0;
      const { impacto, penalidade } = avaliarImpactoTroca(estoqueRestante);
      const scoreTroca = 1 - penalidade;
      
      // 4. Score de Produtividade
      const produtividadeScores: { [key: string]: number } = {
        'alta': 1.0,
        'média': 0.6,
        'baixa': 0.3
      };
      const scoreProdutividade = produtividadeScores[fazenda.produtividade || 'média'] || 0.5;
      
      // Score final ponderado
      const scoreFinal = 
        (params.alpha * scoreDistancia) +
        (params.beta * scoreTempo) +
        (params.gamma * scoreTroca) +
        (params.delta * scoreProdutividade);
      
      // Estimativas
      const viagensEstimadas = Math.ceil(fazenda.estoque_toneladas / 42);
      const tempoCiclo = Math.round((fazenda.distancia_fabrica_km / 60) * 60 * 2); // ida e volta a 60km/h
      const custoEstimado = fazenda.distancia_fabrica_km * 2 * viagensEstimadas * 2.5; // R$ 2,50/km
      
      // Recomendação baseada no score
      let recomendacao = '';
      if (scoreFinal > 0.75) {
        recomendacao = 'EXCELENTE - Altamente recomendado';
      } else if (scoreFinal > 0.6) {
        recomendacao = 'BOM - Recomendado';
      } else if (scoreFinal > 0.45) {
        recomendacao = 'RAZOÁVEL - Avaliar com cautela';
      } else {
        recomendacao = 'NÃO RECOMENDADO - Evitar';
      }
      
      cenarios.push({
        id: `${fazenda.id}-${modulo.id}`,
        fazenda,
        modulo,
        score: scoreFinal,
        distancia_modulo_fazenda: Math.round(distModuloFazenda),
        impacto_troca: impacto,
        estoque_restante_origem: estoqueRestante,
        viagens_estimadas: viagensEstimadas,
        tempo_ciclo_estimado: tempoCiclo,
        custo_estimado: Math.round(custoEstimado),
        recomendacao,
        detalhes: {
          score_distancia: scoreDistancia,
          score_tempo: scoreTempo,
          score_troca: scoreTroca,
          score_produtividade: scoreProdutividade
        }
      });
    });
  });
  
  // Ordenar por score (melhores primeiro)
  return cenarios.sort((a, b) => b.score - a.score);
}

/**
 * Filtra cenários por critérios específicos
 */
export function filtrarCenarios(
  cenarios: Cenario[],
  filtros: {
    scoreMinimo?: number;
    impactoMaximo?: string[];
    estadoFazenda?: string;
  }
): Cenario[] {
  let resultado = [...cenarios];
  
  if (filtros.scoreMinimo) {
    resultado = resultado.filter(c => c.score >= filtros.scoreMinimo);
  }
  
  if (filtros.impactoMaximo && filtros.impactoMaximo.length > 0) {
    resultado = resultado.filter(c => 
      filtros.impactoMaximo!.includes(c.impacto_troca)
    );
  }
  
  if (filtros.estadoFazenda) {
    resultado = resultado.filter(c => 
      c.fazenda.estado.sigla === filtros.estadoFazenda
    );
  }
  
  return resultado;
}

/**
 * Agrupa cenários por fazenda (mostrando os melhores módulos para cada fazenda)
 */
export function agruparPorFazenda(cenarios: Cenario[]): Map<string, Cenario[]> {
  const grupos = new Map<string, Cenario[]>();
  
  cenarios.forEach(cenario => {
    const fazendaId = cenario.fazenda.id;
    if (!grupos.has(fazendaId)) {
      grupos.set(fazendaId, []);
    }
    grupos.get(fazendaId)!.push(cenario);
  });
  
  // Ordenar módulos dentro de cada fazenda por score
  grupos.forEach((cenariosGrupo, fazendaId) => {
    grupos.set(
      fazendaId, 
      cenariosGrupo.sort((a, b) => b.score - a.score)
    );
  });
  
  return grupos;
}

/**
 * Gera resumo dos cenários
 */
export function gerarResumo(cenarios: Cenario[]): {
  total_cenarios: number;
  cenarios_excelentes: number;
  cenarios_bons: number;
  cenarios_razoaveis: number;
  cenarios_nao_recomendados: number;
  score_medio: number;
  melhor_cenario: Cenario | null;
} {
  if (cenarios.length === 0) {
    return {
      total_cenarios: 0,
      cenarios_excelentes: 0,
      cenarios_bons: 0,
      cenarios_razoaveis: 0,
      cenarios_nao_recomendados: 0,
      score_medio: 0,
      melhor_cenario: null
    };
  }
  
  const scoresMedios = cenarios.reduce((sum, c) => sum + c.score, 0) / cenarios.length;
  
  return {
    total_cenarios: cenarios.length,
    cenarios_excelentes: cenarios.filter(c => c.score > 0.75).length,
    cenarios_bons: cenarios.filter(c => c.score > 0.6 && c.score <= 0.75).length,
    cenarios_razoaveis: cenarios.filter(c => c.score > 0.45 && c.score <= 0.6).length,
    cenarios_nao_recomendados: cenarios.filter(c => c.score <= 0.45).length,
    score_medio: scoresMedios,
    melhor_cenario: cenarios[0] || null
  };
}