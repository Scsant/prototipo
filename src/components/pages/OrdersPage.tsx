import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RefreshCw, Search, Filter, Download } from 'lucide-react';
import { ordersQueries, fleetQueries } from '../../lib/queries';
import { getStatusColor } from '../../lib/mock-data';

export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do banco
  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const [ordersData, trucksData] = await Promise.all([
        ordersQueries.getOrdensHoje(),
        fleetQueries.getCaminhoes()
      ]);
      
      setOrders(ordersData || []);
      setTrucks(trucksData || []);
    } catch (error) {
      console.error('Erro ao carregar ordens:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = 
      order.fazenda_nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.numero_ordem?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Carregando ordens...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-white">Ordens de Carga & Execução</h1>
          <p className="text-gray-300">Gestão e monitoramento de viagens - {orders.length} ordens hoje</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={loadOrders}>
            <RefreshCw className="size-4" />
            Atualizar
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Buscar por fazenda ou ordem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="size-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="planejada">Planejada</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Ordens ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fazenda</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Volume (t)</TableHead>
                  <TableHead>Distância (km)</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      #{order.numero_ordem}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.fazenda_nome || 'N/A'}</TableCell>
                    <TableCell>{order.modulo_nome || '-'}</TableCell>
                    <TableCell>{order.volume_toneladas?.toFixed(1) || '0.0'}</TableCell>
                    <TableCell>{order.fazenda?.distancia_fabrica_km || '-'}</TableCell>
                    <TableCell className="text-sm">
                      {order.caminhao_placa || <span className="text-gray-400">-</span>}
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.motorista_nome || <span className="text-gray-400">-</span>}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>Nenhuma ordem encontrada</p>
              <p className="text-sm mt-2">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros' 
                  : 'Nenhuma ordem agendada para hoje'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline / Gantt Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo (Gantt Simplificado)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trucks.slice(0, 8).map((truck) => {
              const truckOrders = orders.filter(o => o.caminhao_placa === truck.placa);
              return (
                <div key={truck.id} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-32 font-mono">{truck.placa}</span>
                    <div className="flex-1 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg relative overflow-hidden">
                      {truckOrders.map((order, idx) => {
                        const startHour = parseInt(order.janela.split('-')[0].split(':')[0]);
                        const left = ((startHour - 6) / 12) * 100;
                        const width = 15;
                        
                        return (
                          <div
                            key={order.id}
                            className={`absolute h-full flex items-center justify-center text-xs text-white ${
                              order.status === 'concluída' ? 'bg-green-600' :
                              order.status === 'em_rota' ? 'bg-blue-600' :
                              order.status === 'carregando' ? 'bg-blue-500' :
                              'bg-gray-400'
                            }`}
                            style={{ left: `${left}%`, width: `${width}%` }}
                          >
                            #{order.id}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Time Scale */}
            <div className="flex items-center gap-3 pt-2 border-t">
              <span className="text-sm w-32"></span>
              <div className="flex-1 flex justify-between text-xs text-gray-600">
                <span>06:00</span>
                <span>09:00</span>
                <span>12:00</span>
                <span>15:00</span>
                <span>18:00</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Ordens</p>
            <p className="text-3xl text-white">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Em Andamento</p>
            <p className="text-3xl text-white">
              {orders.filter(o => o.status === 'em_andamento').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Concluídas</p>
            <p className="text-3xl text-green-600">
              {orders.filter(o => o.status === 'concluida').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Planejadas</p>
            <p className="text-3xl text-white">
              {orders.filter(o => o.status === 'planejada').length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}