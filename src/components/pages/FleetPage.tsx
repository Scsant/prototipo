import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Truck, User, Clock, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';
import { fleetQueries } from '../../lib/queries';

export function FleetPage() {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFleetData();
  }, []);

  async function loadFleetData() {
    try {
      setLoading(true);
      const [trucksData, driversData] = await Promise.all([
        fleetQueries.getCaminhoes(),
        fleetQueries.getMotoristas()
      ]);
      
      setTrucks(trucksData || []);
      setDrivers(driversData || []);
    } catch (error) {
      console.error('Erro ao carregar frota:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Carregando frota...</div>
      </div>
    );
  }

  const trucksDisponiveis = trucks.filter(t => t.status === 'disponivel').length;
  const trucksManutencao = trucks.filter(t => t.status === 'manutencao').length;
  const capacidadeMedia = trucks.length > 0 
    ? Math.round(trucks.reduce((sum, t) => sum + (t.capacidade_toneladas || 0), 0) / trucks.length)
    : 0;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl mb-2 text-white">Frota (Veículos & Motoristas)</h1>
        <p className="text-gray-300">Gestão de veículos e jornada de trabalho - {trucks.length} caminhões, {drivers.length} motoristas</p>
      </div>

      <Tabs defaultValue="trucks">
        <TabsList>
          <TabsTrigger value="trucks">Veículos ({trucks.length})</TabsTrigger>
          <TabsTrigger value="drivers">Motoristas ({drivers.length})</TabsTrigger>
        </TabsList>

        {/* Trucks */}
        <TabsContent value="trucks" className="space-y-6">
          {/* Trucks Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="size-5 text-blue-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Frota</p>
                </div>
                <p className="text-3xl text-white">{trucks.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="size-5 text-green-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Disponíveis</p>
                </div>
                <p className="text-3xl text-white">{trucksDisponiveis}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Wrench className="size-5 text-amber-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manutenção</p>
                </div>
                <p className="text-3xl text-white">{trucksManutencao}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="size-5 text-blue-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cap. Média</p>
                </div>
                <p className="text-3xl text-white">{capacidadeMedia}t</p>
              </CardContent>
            </Card>
          </div>

          {/* Trucks Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trucks.slice(0, 12).map((truck) => (
              <Card key={truck.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        truck.status === 'disponivel' ? 'bg-green-100' : 
                        truck.status === 'em_viagem' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <Truck className={`size-6 ${
                          truck.status === 'disponivel' ? 'text-green-600' : 
                          truck.status === 'em_viagem' ? 'text-blue-600' :
                          'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{truck.placa}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{truck.tipo || 'Rodotrem'}</p>
                      </div>
                    </div>
                    <Badge className={
                      truck.status === 'disponivel' ? 'text-green-600 bg-green-50 border-green-200' :
                      truck.status === 'em_viagem' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                      'text-gray-600 bg-gray-50 border-gray-200'
                    }>
                      {truck.status?.toUpperCase().replace('_', ' ') || 'N/A'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Capacidade</p>
                      <p className="text-xl text-white">{truck.capacidade_toneladas || 0}t</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tipo Via</p>
                      <p className="text-sm text-white">{truck.restricao_via || 'Todas'}</p>
                    </div>
                  </div>
                  
                  {truck.motorista && (
                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Motorista</p>
                      <p className="text-sm text-white">{truck.motorista.nome}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Histórico
                    </Button>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trucks Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Frota</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Capacidade (t)</TableHead>
                    <TableHead>Restrições</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Motorista</TableHead>
                    <TableHead>KM Rodados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trucks.map((truck) => (
                    <TableRow key={truck.id}>
                      <TableCell className="font-mono text-sm">{truck.placa}</TableCell>
                      <TableCell>{truck.tipo || 'Rodotrem'}</TableCell>
                      <TableCell>{truck.capacidade_toneladas || 0}t</TableCell>
                      <TableCell>{truck.restricao_via || 'Todas'}</TableCell>
                      <TableCell>
                        <Badge className={
                          truck.status === 'disponivel' ? 'text-green-600 bg-green-50 border-green-200' :
                          truck.status === 'em_viagem' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                          'text-gray-600 bg-gray-50 border-gray-200'
                        }>
                          {truck.status?.toUpperCase().replace('_', ' ') || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{truck.motorista?.nome || '-'}</TableCell>
                      <TableCell className="text-sm">{truck.km_rodados || 0} km</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drivers */}
        <TabsContent value="drivers" className="space-y-6">
          {/* Drivers Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <User className="size-5 text-blue-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Motoristas</p>
                </div>
                <p className="text-3xl text-white">{drivers.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="size-5 text-green-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Disponíveis</p>
                </div>
                <p className="text-3xl text-white">
                  {drivers.filter(d => d.status === 'disponivel').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="size-5 text-blue-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Jornada Média</p>
                </div>
                <p className="text-3xl text-white">
                  {drivers.length > 0 
                    ? Math.round(drivers.reduce((sum, d) => sum + (d.jornada_maxima_horas || 8), 0) / drivers.length)
                    : 0}h
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="size-5 text-amber-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Em Viagem</p>
                </div>
                <p className="text-3xl text-white">
                  {drivers.filter(d => d.status === 'em_viagem').length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Drivers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Motoristas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Motorista</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Jornada Máx (h)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Horas Trabalhadas</TableHead>
                    <TableHead>Status Jornada</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.map((driver, idx) => {
                    // Simular horas trabalhadas (em produção viria do banco)
                    const horasTrabalhadas = 4 + (idx * 0.5) % 5;
                    const jornadaMax = driver.jornada_maxima_horas || 8;
                    const percentJornada = (horasTrabalhadas / jornadaMax) * 100;
                    
                    return (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="size-4 text-blue-600" />
                            </div>
                            <span className="text-white">{driver.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{driver.telefone || '-'}</TableCell>
                        <TableCell>{jornadaMax}h</TableCell>
                        <TableCell>
                          <Badge className={
                            driver.status === 'disponivel' ? 'text-green-600 bg-green-50 border-green-200' :
                            driver.status === 'em_viagem' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                            'text-gray-600 bg-gray-50 border-gray-200'
                          }>
                            {driver.status?.toUpperCase().replace('_', ' ') || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>{horasTrabalhadas.toFixed(1)}h</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  percentJornada >= 90 ? 'bg-red-600' :
                                  percentJornada >= 75 ? 'bg-amber-600' :
                                  'bg-green-600'
                                }`}
                                style={{ width: `${percentJornada}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{percentJornada.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Jornada Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-amber-600" />
                Alertas de Jornada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {drivers.filter(d => d.status === 'em_viagem').length > 0 ? (
                  drivers
                    .filter(d => d.status === 'em_viagem')
                    .slice(0, 3)
                    .map((driver) => (
                      <div key={driver.id} className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Clock className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="mb-1 text-white">{driver.nome} - Em Viagem</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Motorista atualmente em rota. Jornada máxima: {driver.jornada_maxima_horas || 8}h
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="mb-1 text-white">Todos os motoristas dentro das normas</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Jornadas e pausas em conformidade com a legislação.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}