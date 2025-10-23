import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { CheckCircle, Trash2, Copy, TrendingDown, TrendingUp, Award, Loader2 } from 'lucide-react';
import { scenariosQueries } from '../../lib/queries';
import { toast } from 'sonner@2.0.3';

interface Cenario {
  id: string;
  nome: string;
  descricao?: string;
  configuracao: {
    parametros: {
      alfa_distancia: number;
      beta_tempo: number;
      gamma_troca_modulo: number;
      delta_prioridade_produtiva: number;
    };
  };
  resultados?: {
    demanda_atendida: number;
    trocas_modulo: number;
    km_total: number;
    tempo_medio_ciclo: number;
  };
  aplicado: boolean;
  data_criacao: string;
}

export function ScenariosPage() {
  const [cenarios, setCenarios] = useState<Cenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCenarios();
  }, []);

  const carregarCenarios = async () => {
    try {
      setLoading(true);
      const data = await scenariosQueries.getCenarios();
      setCenarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar cenários:', error);
      toast.error('Erro ao carregar cenários');
    } finally {
      setLoading(false);
    }
  };

  const aplicarCenario = async (id: string) => {
    try {
      await scenariosQueries.aplicarCenario(id);
      toast.success('Cenário aplicado com sucesso!');
      carregarCenarios();
    } catch (error) {
      console.error('Erro ao aplicar cenário:', error);
      toast.error('Erro ao aplicar cenário');
    }
  };

  const deletarCenario = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este cenário?')) return;
    
    try {
      await scenariosQueries.deletarCenario(id);
      toast.success('Cenário deletado com sucesso!');
      carregarCenarios();
    } catch (error) {
      console.error('Erro ao deletar cenário:', error);
      toast.error('Erro ao deletar cenário');
    }
  };

  const duplicarCenario = async (cenario: Cenario) => {
    try {
      await scenariosQueries.salvarCenario({
        nome: `${cenario.nome} (Cópia)`,
        descricao: cenario.descricao,
        configuracao: cenario.configuracao,
        resultados: cenario.resultados
      });
      toast.success('Cenário duplicado com sucesso!');
      carregarCenarios();
    } catch (error) {
      console.error('Erro ao duplicar cenário:', error);
      toast.error('Erro ao duplicar cenário');
    }
  };

  const calcularScore = (cenario: Cenario) => {
    if (!cenario.resultados) return 0;
    const { demanda_atendida, trocas_modulo, km_total } = cenario.resultados;
    return demanda_atendida - (trocas_modulo * 50) - (km_total * 0.1);
  };

  const sortedCenarios = [...cenarios].sort((a, b) => {
    return calcularScore(b) - calcularScore(a);
  });

  const bestCenario = sortedCenarios[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (cenarios.length === 0) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2 text-white">Cenários & Comparação</h1>
            <p className="text-gray-300">Compare diferentes cenários de otimização e escolha o melhor</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nenhum cenário cadastrado ainda.</p>
            <p className="text-sm text-gray-400 mt-2">Crie novos cenários na página de Planejamento.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-white">Cenários & Comparação</h1>
          <p className="text-gray-300">Compare diferentes cenários de otimização e escolha o melhor</p>
        </div>
      </div>

      {/* Scenarios List */}
      <div className="grid gap-4">
        {sortedCenarios.map((cenario, index) => {
          const params = cenario.configuracao?.parametros;
          const kpis = cenario.resultados;
          
          return (
            <Card key={cenario.id} className={cenario.aplicado ? 'border-green-500 border-2' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {index === 0 && kpis && (
                      <Award className="size-6 text-amber-500" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{cenario.nome}</CardTitle>
                        {cenario.aplicado && (
                          <Badge className="text-green-600 bg-green-50 border-green-200">
                            APLICADO
                          </Badge>
                        )}
                        {index === 0 && !cenario.aplicado && kpis && (
                          <Badge className="text-amber-600 bg-amber-50 border-amber-200">
                            MELHOR OPÇÃO
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Criado em {new Date(cenario.data_criacao).toLocaleDateString('pt-BR')}
                        {params && ` - α:${params.alfa_distancia.toFixed(1)} β:${params.beta_tempo.toFixed(1)} γ:${params.gamma_troca_modulo.toFixed(1)} δ:${params.delta_prioridade_produtiva.toFixed(1)}`}
                      </p>
                      {cenario.descricao && (
                        <p className="text-sm text-gray-500 mt-1">{cenario.descricao}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!cenario.aplicado && (
                      <Button onClick={() => aplicarCenario(cenario.id)} className="gap-2">
                        <CheckCircle className="size-4" />
                        Aplicar
                      </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={() => duplicarCenario(cenario)}>
                      <Copy className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => deletarCenario(cenario.id)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {kpis ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Demanda Atendida</p>
                      <p className="text-2xl">{kpis.demanda_atendida}t</p>
                      <p className="text-sm text-green-600">{((kpis.demanda_atendida / 35000) * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Trocas de Módulo</p>
                      <p className="text-2xl">{kpis.trocas_modulo}</p>
                      <div className="flex items-center gap-1 text-sm">
                        {kpis.trocas_modulo <= 4 ? (
                          <>
                            <TrendingDown className="size-3 text-green-600" />
                            <span className="text-green-600">Ótimo</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="size-3 text-amber-600" />
                            <span className="text-amber-600">Acima da meta</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">KM Total</p>
                      <p className="text-2xl">{kpis.km_total.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Estimado</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tempo Médio Ciclo</p>
                      <p className="text-2xl">{kpis.tempo_medio_ciclo}min</p>
                      <p className="text-sm text-gray-600">Por viagem</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>Aguardando execução de simulação</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Table */}
      {sortedCenarios.filter(c => c.resultados).length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Comparação Detalhada</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cenário</TableHead>
                    <TableHead>Demanda Atendida (t)</TableHead>
                    <TableHead>% Atendimento</TableHead>
                    <TableHead>Trocas Módulo</TableHead>
                    <TableHead>KM Total</TableHead>
                    <TableHead>Tempo Médio (min)</TableHead>
                    <TableHead>Custo Estimado (R$)</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCenarios
                    .filter(cenario => cenario.resultados)
                    .map((cenario, index) => {
                      const kpis = cenario.resultados!;
                      const score = calcularScore(cenario);
                      const custo = (kpis.km_total * 2.5) + (kpis.tempo_medio_ciclo * 28 * 0.8);
                      
                      return (
                        <TableRow key={cenario.id} className={cenario.aplicado ? 'bg-green-50' : ''}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {index === 0 && <Award className="size-4 text-amber-500" />}
                              {cenario.nome}
                              {cenario.aplicado && (
                                <Badge className="text-green-600 bg-green-50 border-green-200" variant="outline">
                                  ATIVO
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{kpis.demanda_atendida}</TableCell>
                          <TableCell>{((kpis.demanda_atendida / 35000) * 100).toFixed(1)}%</TableCell>
                          <TableCell>
                            <span className={kpis.trocas_modulo <= 4 ? 'text-green-600' : 'text-amber-600'}>
                              {kpis.trocas_modulo}
                            </span>
                          </TableCell>
                          <TableCell>{kpis.km_total.toLocaleString()}</TableCell>
                          <TableCell>{kpis.tempo_medio_ciclo}</TableCell>
                          <TableCell>R$ {custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            <span className={index === 0 ? '' : 'text-gray-600'}>
                              {score.toFixed(0)}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Parameters Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Parâmetros</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cenário</TableHead>
                    <TableHead>α (Distância)</TableHead>
                    <TableHead>β (Tempo)</TableHead>
                    <TableHead>γ (Troca Módulo)</TableHead>
                    <TableHead>δ (Prioridade Fazenda)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCenarios.map((cenario) => {
                    const params = cenario.configuracao?.parametros;
                    if (!params) return null;
                    
                    return (
                      <TableRow key={cenario.id}>
                        <TableCell>{cenario.nome}</TableCell>
                        <TableCell>{params.alfa_distancia.toFixed(2)}</TableCell>
                        <TableCell>{params.beta_tempo.toFixed(2)}</TableCell>
                        <TableCell className={params.gamma_troca_modulo >= 0.35 ? 'text-green-600' : ''}>
                          {params.gamma_troca_modulo.toFixed(2)}
                        </TableCell>
                        <TableCell>{params.delta_prioridade_produtiva.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
