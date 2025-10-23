import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { MapPin, Clock, TrendingUp, Repeat, Package } from 'lucide-react';
import { farmsQueries } from '../../lib/queries';
import { getProductivityColor, getStatusColor } from '../../lib/mock-data';

export function FarmsPage() {
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [farms, setFarms] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar fazendas do banco
  useEffect(() => {
    loadFarms();
  }, []);

  // Carregar módulos quando uma fazenda é selecionada
  useEffect(() => {
    if (selectedFarmId) {
      loadFarmModules(selectedFarmId);
    }
  }, [selectedFarmId]);

  async function loadFarms() {
    try {
      setLoading(true);
      const data = await farmsQueries.getFazendas();
      setFarms(data || []);
      if (data && data.length > 0) {
        setSelectedFarmId(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar fazendas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadFarmModules(farmId: string) {
    try {
      const data = await farmsQueries.getModulosDaFazenda(farmId);
      setModules(data || []);
    } catch (error) {
      console.error('Erro ao carregar módulos:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Carregando fazendas...</div>
      </div>
    );
  }

  const selectedFarm = farms.find(f => f.id === selectedFarmId);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl mb-2 text-white">Fazendas & Módulos</h1>
        <p className="text-gray-300">Gestão de frentes de colheita e módulos - {farms.length} fazendas</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Farms List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Fazendas Ativas ({farms.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {farms.map((farm) => (
                  <button
                    key={farm.id}
                    onClick={() => setSelectedFarmId(farm.id)}
                    className={`w-full p-4 border rounded-lg text-left transition-all ${
                      selectedFarmId === farm.id
                        ? 'border-blue-500 bg-blue-900/30'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-white">{farm.nome}</span>
                      <Badge className={getProductivityColor(farm.produtividade)}>
                        {farm.produtividade?.toUpperCase() || 'MEDIA'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        <span>{farm.distancia_fabrica_km || 0}km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="size-3" />
                        <span>{farm.estoque_toneladas || 0}t</span>
                      </div>
                      <div className="text-xs">
                        {farm.estado?.sigla || 'SP'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Farm Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Resumo Geral</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Fazendas</p>
                <p className="text-2xl text-white">{farms.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Estoque Total</p>
                <p className="text-2xl text-white">
                  {farms.reduce((sum, f) => sum + (f.estoque_toneladas || 0), 0).toLocaleString()}t
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alta Produtividade</p>
                <p className="text-2xl text-green-600">
                  {farms.filter(f => f.produtividade === 'alta').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Módulos Ativos</p>
                <p className="text-2xl text-white">
                  {modules.filter(m => m.status === 'ativo').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farm Detail */}
        <div className="lg:col-span-2">
          {selectedFarm && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedFarm.nome}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Detalhes da fazenda e módulos de colheita</p>
                    </div>
                    <Badge className={getProductivityColor(selectedFarm.produtividade)}>
                      {selectedFarm.produtividade.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="size-4" />
                        <span className="text-sm">Distância</span>
                      </div>
                      <p className="text-2xl text-white">{selectedFarm.distancia_fabrica_km || 0} km</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Package className="size-4" />
                        <span className="text-sm">Estoque</span>
                      </div>
                      <p className="text-2xl text-white">{selectedFarm.estoque_toneladas || 0} t</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="size-4" />
                        <span className="text-sm">Estado</span>
                      </div>
                      <p className="text-2xl text-white">{selectedFarm.estado?.sigla || selectedFarm.estado || 'SP'}</p>
                    </div>
                  </div>

                  <Tabs defaultValue="modules">
                    <TabsList>
                      <TabsTrigger value="modules">Módulos</TabsTrigger>
                      <TabsTrigger value="history">Histórico</TabsTrigger>
                      <TabsTrigger value="restrictions">Restrições</TabsTrigger>
                    </TabsList>

                    <TabsContent value="modules" className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Módulo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Trocas Máx/Dia</TableHead>
                            <TableHead>Trocas Hoje</TableHead>
                            <TableHead>Viagens Ativas</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {modules.length > 0 ? (
                            modules.map((module) => (
                              <TableRow key={module.id}>
                                <TableCell>{module.nome}</TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(module.status)}>
                                    {module.status?.toUpperCase() || 'N/A'}
                                  </Badge>
                                </TableCell>
                                <TableCell>{module.limite_trocas_dia || module.trocas_dia_max || '-'}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <span>{module.trocas_hoje || 0}</span>
                                    {(module.trocas_hoje || 0) >= (module.limite_trocas_dia || module.trocas_dia_max || 999) && (
                                      <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
                                        LIMITE
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{module.viagens_ativas || 0}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm">
                                      Editar
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      Pausar
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                                Nenhum módulo encontrado para esta fazenda
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TabsContent>

                    <TabsContent value="history" className="mt-4">
                      <div className="space-y-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4>Histórico de Trocas - Última Semana</h4>
                            </div>
                            <div className="space-y-3">
                              {[
                                { data: '17/10/2025', trocas: 3, meta: 3, status: 'success' },
                                { data: '16/10/2025', trocas: 4, meta: 3, status: 'warning' },
                                { data: '15/10/2025', trocas: 2, meta: 3, status: 'success' },
                                { data: '14/10/2025', trocas: 3, meta: 3, status: 'success' },
                                { data: '13/10/2025', trocas: 5, meta: 3, status: 'critical' },
                              ].map((day, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                                  <span>{day.data}</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600">
                                      {day.trocas} trocas (meta: {day.meta})
                                    </span>
                                    <Repeat className={`size-4 ${
                                      day.status === 'success' ? 'text-green-600' :
                                      day.status === 'warning' ? 'text-amber-600' :
                                      'text-red-600'
                                    }`} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6">
                            <h4 className="mb-4">Produtividade Mensal</h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Média (t/dia)</p>
                                <p className="text-2xl">285</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Máxima</p>
                                <p className="text-2xl">340</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Mínima</p>
                                <p className="text-2xl">220</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="restrictions" className="mt-4">
                      <div className="space-y-4">
                        <Card>
                          <CardContent className="pt-6">
                            <h4 className="mb-4">Restrições Operacionais</h4>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <Clock className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-white">Janela de Operação</p>
                                  <p className="text-sm text-gray-400">
                                    {selectedFarm.janela_inicio || '06:00'} às {selectedFarm.janela_fim || '18:00'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <TrendingUp className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-white">Produtividade</p>
                                  <p className="text-sm text-gray-400">
                                    {selectedFarm.produtividade === 'alta' ? 'Alta - Via Pavimentada' : 
                                     selectedFarm.produtividade === 'media' ? 'Média - Via Mista' :
                                     'Baixa - Via de Terra'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 border rounded-lg">
                                <Repeat className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p>Limite de Trocas</p>
                                  <p className="text-sm text-gray-600">
                                    Máximo 3 trocas de módulo por dia
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}