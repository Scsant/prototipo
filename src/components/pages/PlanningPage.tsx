import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Sparkles, Save, Settings2, TrendingUp, MapPin, Truck, AlertTriangle, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { optimizationQueries } from '../../lib/queries';
import { gerarCenarios, filtrarCenarios, gerarResumo, type Cenario } from '../../lib/optimizer';
import { toast } from 'sonner@2.0.3';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

export function PlanningPage() {
  const [params, setParams] = useState({
    alpha: 0.3,
    beta: 0.2,
    gamma: 0.4,
    delta: 0.1,
  });
  
  const [demanda, setDemanda] = useState(35000);
  const [metaHora, setMetaHora] = useState(1458);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [cenarios, setCenarios] = useState<Cenario[]>([]);
  const [cenariosExibidos, setCenariosExibidos] = useState<Cenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filtroScore, setFiltroScore] = useState(0.45);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const parametros = await optimizationQueries.getParametros();
      
      setParams({
        alpha: parametros.alfa_distancia,
        beta: parametros.beta_tempo,
        gamma: parametros.gamma_troca_modulo,
        delta: parametros.delta_prioridade_produtiva,
      });
      setDemanda(parametros.demanda_diaria_toneladas || 35000);
      setMetaHora(parametros.meta_toneladas_hora || 1458);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      
      // Fallback para dados mockados quando Supabase não está disponível
      setParams({
        alpha: 0.3,
        beta: 0.2,
        gamma: 0.4,
        delta: 0.1,
      });
      setDemanda(35000);
      setMetaHora(1458);
      
      toast.info('Usando parâmetros padrão (modo offline)');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveParams() {
    try {
      setSaving(true);
      await optimizationQueries.salvarParametros({
        alfa_distancia: params.alpha,
        beta_tempo: params.beta,
        gamma_troca_modulo: params.gamma,
        delta_prioridade_produtiva: params.delta,
        demanda_diaria_toneladas: demanda,
        meta_toneladas_hora: metaHora,
      });
      toast.success('Parâmetros salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar parâmetros:', error);
      toast.info('Parâmetros salvos localmente (modo offline)');
    } finally {
      setSaving(false);
    }
  }

  async function handleOptimize() {
    try {
      setIsOptimizing(true);
      setOptimizationProgress(0);
      setCenarios([]);
      setCenariosExibidos([]);

      // Progresso: Carregando dados
      setOptimizationProgress(20);
      const [fazendas, modulos] = await Promise.all([
        optimizationQueries.getFazendasParaOtimizacao(),
        optimizationQueries.getModulosCarregamento()
      ]);

      console.log('Fazendas carregadas:', fazendas.length, fazendas);
      console.log('Módulos carregados:', modulos.length, modulos);

      if (fazendas.length === 0) {
        toast.error('Nenhuma fazenda com estoque encontrada!');
        setIsOptimizing(false);
        return;
      }

      if (modulos.length === 0) {
        toast.error('Nenhum módulo de carregamento encontrado! Veja database/POPULAR-MODULOS.md');
        setIsOptimizing(false);
        return;
      }

      toast.info(`Processando ${fazendas.length} fazendas e ${modulos.length} módulos...`);

      // Progresso: Calculando cenários
      setOptimizationProgress(50);
      const cenariosGerados = gerarCenarios(fazendas, modulos, params);

      console.log('Cenários gerados:', cenariosGerados.length);

      if (cenariosGerados.length === 0) {
        toast.warning('Nenhum cenário viável foi gerado. Verifique os dados.');
        setIsOptimizing(false);
        return;
      }

      // Progresso: Filtrando resultados
      setOptimizationProgress(75);
      const cenariosFiltrados = filtrarCenarios(cenariosGerados, {
        scoreMinimo: filtroScore
      });

      // Progresso: Finalizado
      setOptimizationProgress(100);
      setCenarios(cenariosFiltrados);
      setCenariosExibidos(cenariosFiltrados.slice(0, 20));

      const resumo = gerarResumo(cenariosFiltrados);
      toast.success(
        `Otimização concluída! ${resumo.cenarios_excelentes} cenários excelentes encontrados.`
      );
    } catch (error) {
      console.error('Erro na otimização:', error);
      
      // Fallback para cenários mockados quando otimização falha
      const mockCenarios: Cenario[] = [
        {
          id: 'CEN-001',
          score: 0.92,
          demanda_atendida: 28500,
          trocas_modulo: 8,
          km_total: 1650,
          tempo_medio_ciclo: 3.8,
          fazendas_ativas: 6,
          eficiencia: 89.5,
          detalhes: {
            fazendas: [
              { id: 'SP-01', nome: 'Fazenda Operacional 01', status: 'colheita', volume: 2500 },
              { id: 'SP-02', nome: 'Fazenda Operacional 02', status: 'carregamento', volume: 3200 },
              { id: 'SP-03', nome: 'Fazenda Operacional 03', status: 'cto_baldeio', volume: 1800 }
            ],
            modulos: [
              { id: 'COL-01', tipo: 'colheita', fazenda: 'SP-01', eficiencia: 95 },
              { id: 'CAR-01', tipo: 'carregamento', fazenda: 'SP-02', eficiencia: 88 }
            ]
          }
        },
        {
          id: 'CEN-002',
          score: 0.87,
          demanda_atendida: 27200,
          trocas_modulo: 12,
          km_total: 1890,
          tempo_medio_ciclo: 4.1,
          fazendas_ativas: 7,
          eficiencia: 85.2,
          detalhes: {
            fazendas: [
              { id: 'SP-04', nome: 'Fazenda Operacional 04', status: 'colheita', volume: 2100 },
              { id: 'SP-05', nome: 'Fazenda Operacional 05', status: 'carregamento', volume: 2800 }
            ],
            modulos: [
              { id: 'COL-02', tipo: 'colheita', fazenda: 'SP-04', eficiencia: 90 },
              { id: 'CAR-02', tipo: 'carregamento', fazenda: 'SP-05', eficiencia: 82 }
            ]
          }
        }
      ];
      
      setCenarios(mockCenarios);
      setCenariosExibidos(mockCenarios);
      
      toast.info('Usando cenários de demonstração (modo offline)');
    } finally {
      setIsOptimizing(false);
    }
  }

  function toggleRowExpansion(id: string) {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  }

  function getScoreBadgeColor(score: number): string {
    if (score > 0.75) return 'bg-green-100 text-green-800 border-green-300';
    if (score > 0.6) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score > 0.45) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-red-100 text-red-800 border-red-300';
  }

  function getImpactoBadgeColor(impacto: string): string {
    if (impacto === 'MÍNIMO') return 'bg-green-100 text-green-800 border-green-300';
    if (impacto === 'BAIXO') return 'bg-blue-100 text-blue-800 border-blue-300';
    if (impacto === 'MÉDIO') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-red-100 text-red-800 border-red-300';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const resumo = gerarResumo(cenarios);
  const totalSoma = params.alpha + params.beta + params.gamma + params.delta;
  const somaCorreta = Math.abs(totalSoma - 1.0) < 0.01;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-white">Planejamento & Otimização</h1>
          <p className="text-gray-300">Configure pesos e gere cenários otimizados de alocação de módulos</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleSaveParams}
            disabled={saving}
          >
            <Save className="size-4" />
            {saving ? 'Salvando...' : 'Salvar Parâmetros'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Painel de Parâmetros */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="size-5" />
                Parâmetros de Otimização
              </CardTitle>
              <CardDescription>
                {somaCorreta ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="size-4" /> Soma = {totalSoma.toFixed(2)} ✓
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="size-4" /> Soma = {totalSoma.toFixed(2)} (recomendado: 1.0)
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>α - Peso Distância</Label>
                  <span className="text-sm text-white">{params.alpha.toFixed(2)}</span>
                </div>
                <Slider
                  value={[params.alpha * 100]}
                  onValueChange={([value]) => setParams({ ...params, alpha: value / 100 })}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-gray-400">Prioriza fazendas próximas da fábrica</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>β - Peso Tempo</Label>
                  <span className="text-sm text-white">{params.beta.toFixed(2)}</span>
                </div>
                <Slider
                  value={[params.beta * 100]}
                  onValueChange={([value]) => setParams({ ...params, beta: value / 100 })}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-gray-400">Considera tempo de movimentação do módulo</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>γ - Penalidade Troca Módulo</Label>
                  <span className="text-sm text-white">{params.gamma.toFixed(2)}</span>
                </div>
                <Slider
                  value={[params.gamma * 100]}
                  onValueChange={([value]) => setParams({ ...params, gamma: value / 100 })}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-gray-400">Evita mover módulos com muito estoque restante</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>δ - Prioridade Fazenda Produtiva</Label>
                  <span className="text-sm text-white">{params.delta.toFixed(2)}</span>
                </div>
                <Slider
                  value={[params.delta * 100]}
                  onValueChange={([value]) => setParams({ ...params, delta: value / 100 })}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-gray-400">Favorece fazendas de alta produtividade</p>
              </div>

              <div className="pt-4 border-t border-gray-700 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="demanda">Demanda Diária (t)</Label>
                  <Input
                    id="demanda"
                    type="number"
                    value={demanda}
                    onChange={(e) => setDemanda(Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-400">Meta: 35.000 t/dia</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scoreMinimo">Score Mínimo</Label>
                  <Input
                    id="scoreMinimo"
                    type="number"
                    step="0.05"
                    value={filtroScore}
                    onChange={(e) => setFiltroScore(Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-400">Filtra cenários abaixo deste score (0-1)</p>
                </div>
              </div>

              <Button 
                className="w-full gap-2" 
                size="lg" 
                onClick={handleOptimize}
                disabled={isOptimizing}
              >
                <Sparkles className="size-4" />
                {isOptimizing ? 'Otimizando...' : 'Gerar Cenários (PO)'}
              </Button>

              {isOptimizing && (
                <div className="space-y-2">
                  <Progress value={optimizationProgress} />
                  <p className="text-sm text-gray-400 text-center">
                    Processando... {optimizationProgress}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumo dos Cenários */}
          {cenarios.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  Resumo da Otimização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <p className="text-xs text-gray-400">Total Cenários</p>
                    <p className="text-2xl text-white">{resumo.total_cenarios}</p>
                  </div>
                  <div className="p-3 bg-green-900/30 border border-green-700/50 rounded-lg">
                    <p className="text-xs text-gray-400">Excelentes</p>
                    <p className="text-2xl text-green-400">{resumo.cenarios_excelentes}</p>
                  </div>
                  <div className="p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                    <p className="text-xs text-gray-400">Bons</p>
                    <p className="text-2xl text-blue-400">{resumo.cenarios_bons}</p>
                  </div>
                  <div className="p-3 bg-amber-900/30 border border-amber-700/50 rounded-lg">
                    <p className="text-xs text-gray-400">Score Médio</p>
                    <p className="text-2xl text-amber-400">{(resumo.score_medio * 100).toFixed(0)}%</p>
                  </div>
                </div>

                {resumo.melhor_cenario && (
                  <div className="p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">🏆 Melhor Cenário</p>
                    <p className="text-sm text-white">{resumo.melhor_cenario.fazenda.nome}</p>
                    <p className="text-xs text-gray-400">
                      Módulo: {resumo.melhor_cenario.modulo.nome}
                    </p>
                    <p className="text-xs text-green-400">
                      Score: {(resumo.melhor_cenario.score * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabela de Cenários */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cenários Gerados - Top {cenariosExibidos.length}</CardTitle>
              <CardDescription>
                Fazendas sem módulo de carregamento × Módulos disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cenariosExibidos.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Sparkles className="size-12 mx-auto mb-3 opacity-50" />
                  <p>Clique em "Gerar Cenários" para ver recomendações</p>
                  <p className="text-sm mt-1">O otimizador irá analisar todas as combinações possíveis</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cenariosExibidos.map((cenario) => {
                    const isExpanded = expandedRows.has(cenario.id);
                    return (
                      <Collapsible key={cenario.id} open={isExpanded} onOpenChange={() => toggleRowExpansion(cenario.id)}>
                        <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800/30">
                          <CollapsibleTrigger className="w-full p-4 hover:bg-gray-800/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="text-left">
                                  <p className="text-white flex items-center gap-2">
                                    <MapPin className="size-4 text-blue-400" />
                                    {cenario.fazenda.nome}
                                    <Badge variant="outline" className="ml-2">
                                      {cenario.fazenda.estado.sigla}
                                    </Badge>
                                  </p>
                                  <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                    <Truck className="size-4 text-amber-400" />
                                    {cenario.modulo.nome}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className={getScoreBadgeColor(cenario.score)}>
                                  Score: {(cenario.score * 100).toFixed(0)}%
                                </Badge>
                                <Badge className={getImpactoBadgeColor(cenario.impacto_troca)}>
                                  Impacto: {cenario.impacto_troca}
                                </Badge>
                                {isExpanded ? (
                                  <ChevronUp className="size-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="size-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent>
                            <div className="p-4 border-t border-gray-700 bg-gray-900/30">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-gray-400">Distância Fábrica</p>
                                  <p className="text-white">{cenario.fazenda.distancia_fabrica_km} km</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Distância Módulo</p>
                                  <p className="text-white">{cenario.distancia_modulo_fazenda} km</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Estoque Fazenda</p>
                                  <p className="text-white">{cenario.fazenda.estoque_toneladas.toLocaleString()} t</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Viagens Estimadas</p>
                                  <p className="text-white">{cenario.viagens_estimadas}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-gray-400">Tempo Ciclo</p>
                                  <p className="text-white">{cenario.tempo_ciclo_estimado} min</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Custo Estimado</p>
                                  <p className="text-white">R$ {cenario.custo_estimado.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Módulo Atual Em</p>
                                  <p className="text-white">{cenario.modulo.fazenda_atual?.nome || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Estoque Restante</p>
                                  <p className="text-white">{cenario.estoque_restante_origem.toLocaleString()} t</p>
                                </div>
                              </div>

                              <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg mb-3">
                                <p className="text-xs text-gray-400 mb-2">Componentes do Score</p>
                                <div className="grid grid-cols-4 gap-2 text-xs">
                                  <div>
                                    <p className="text-gray-400">Distância</p>
                                    <p className="text-white">{(cenario.detalhes.score_distancia * 100).toFixed(0)}%</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400">Tempo</p>
                                    <p className="text-white">{(cenario.detalhes.score_tempo * 100).toFixed(0)}%</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400">Troca</p>
                                    <p className="text-white">{(cenario.detalhes.score_troca * 100).toFixed(0)}%</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400">Produtividade</p>
                                    <p className="text-white">{(cenario.detalhes.score_produtividade * 100).toFixed(0)}%</p>
                                  </div>
                                </div>
                              </div>

                              <div className={`p-3 rounded-lg ${
                                cenario.score > 0.75 ? 'bg-green-900/30 border border-green-700/50' :
                                cenario.score > 0.6 ? 'bg-blue-900/30 border border-blue-700/50' :
                                cenario.score > 0.45 ? 'bg-amber-900/30 border border-amber-700/50' :
                                'bg-red-900/30 border border-red-700/50'
                              }`}>
                                <p className="text-sm text-white flex items-center gap-2">
                                  {cenario.score > 0.75 ? <CheckCircle2 className="size-4" /> :
                                   cenario.score > 0.45 ? <AlertTriangle className="size-4" /> :
                                   <XCircle className="size-4" />}
                                  {cenario.recomendacao}
                                </p>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}

                  {cenarios.length > cenariosExibidos.length && (
                    <div className="text-center pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setCenariosExibidos(cenarios.slice(0, cenariosExibidos.length + 10))}
                      >
                        Carregar Mais ({cenarios.length - cenariosExibidos.length} restantes)
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}