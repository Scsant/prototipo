import { useEffect, useState } from 'react';
import { KPICard } from '../KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Truck, Package, TrendingUp, Clock, MapPin, AlertTriangle, Repeat, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardQueries, ordersQueries } from '../../lib/queries';
import { getStatusColorDark } from '../../lib/mock-data';
import { toast } from 'sonner@2.0.3';

export function Dashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [ordensRecentes, setOrdensRecentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        
        // Buscar dados reais do banco
        const [kpisData, alertasData, ordensData] = await Promise.all([
          dashboardQueries.getKPIsHoje(),
          dashboardQueries.getAlertasAtivos(3),
          ordersQueries.getOrdensHoje()
        ]);
        
        setKpis(kpisData);
        setAlertas(alertasData);
        setOrdensRecentes(ordensData.slice(0, 5));
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        toast.error('Erro ao conectar com o banco de dados');
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboard();
    
    // Auto-atualizar a cada 30 segundos
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Carregando dados operacionais...</div>
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Erro ao carregar dados</div>
      </div>
    );
  }

  const demandaAtendida = kpis.volume_transportado_m3 || 0;
  const demandaTotal = 35000; // Meta diária conhecida
  const gap = demandaTotal - demandaAtendida;
  const frotaAtiva = kpis.caminhoes_em_viagem || 0;
  const frotaTotal = kpis.total_caminhoes || 830;
  const trocasModulo = kpis.total_trocas_modulo || 0;
  const metaTrocas = 10;

  const consumoHora = [
    { hora: '06:00', meta: 1458, real: 1390 },
    { hora: '07:00', meta: 1458, real: 1520 },
    { hora: '08:00', meta: 1458, real: 1480 },
    { hora: '09:00', meta: 1458, real: 1445 },
    { hora: '10:00', meta: 1458, real: 1510 },
    { hora: '11:00', meta: 1458, real: 1380 },
    { hora: '12:00', meta: 1458, real: 1250 },
    { hora: '13:00', meta: 1458, real: 1420 },
    { hora: '14:00', meta: 1458, real: 1490 },
    { hora: '15:00', meta: 1458, real: 1465 },
  ];

  const statusViagens = [
    { status: 'Planejada', count: kpis.ordens_planejadas || 0 },
    { status: 'Em Andamento', count: kpis.ordens_em_andamento || 0 },
    { status: 'Concluída', count: kpis.ordens_concluidas || 0 },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl mb-2 text-white">Dashboard Operacional</h1>
        <p className="text-gray-300">Visão geral do planejamento e execução - {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      {/* Alertas do Banco */}
      {alertas.map((alerta, index) => (
        <Alert 
          key={alerta.id || index} 
          variant="default" 
          className={`${
            alerta.prioridade === 'alta' 
              ? 'bg-red-900/30 border-red-700/50 text-red-200' 
              : alerta.prioridade === 'media'
              ? 'bg-amber-900/30 border-amber-700/50 text-amber-200'
              : 'bg-blue-900/30 border-blue-700/50 text-blue-200'
          }`}
        >
          <AlertTriangle className="size-4" />
          <AlertDescription>
            <strong>{alerta.tipo}:</strong> {alerta.mensagem}
            {alerta.fazenda_nome && ` - ${alerta.fazenda_nome}`}
            {alerta.modulo_nome && ` - ${alerta.modulo_nome}`}
          </AlertDescription>
        </Alert>
      ))}

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Demanda Diária"
          value={`${demandaTotal.toLocaleString()}m³`}
          subtitle="Meta do dia"
          icon={<Target className="size-4 text-blue-600" />}
          status="normal"
        />
        <KPICard
          title="Atendido"
          value={`${demandaAtendida.toLocaleString()}m³`}
          subtitle={`${((demandaAtendida / demandaTotal) * 100).toFixed(1)}% da meta`}
          icon={<Package className="size-4 text-green-600" />}
          status={demandaAtendida >= demandaTotal * 0.9 ? 'success' : 'warning'}
          trend="up"
          trendValue={`${kpis.eficiencia_operacional?.toFixed(1)}%`}
        />
        <KPICard
          title="Gap"
          value={`${gap.toLocaleString()}m³`}
          subtitle="Restante para atingir meta"
          icon={<TrendingUp className="size-4 text-amber-600" />}
          status={gap > 200 ? 'warning' : 'normal'}
        />
        <KPICard
          title="Trocas de Módulo"
          value={trocasModulo}
          subtitle={`Meta: ≤ ${metaTrocas}`}
          icon={<Repeat className="size-4 text-amber-600" />}
          status={trocasModulo > metaTrocas ? 'warning' : 'success'}
        />
      </div>

      {/* Second Row KPIs - Dados Reais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Frota Ativa"
          value={`${frotaAtiva}/${frotaTotal}`}
          subtitle={`${kpis.caminhoes_disponiveis || 0} disponíveis`}
          icon={<Truck className="size-4 text-blue-600" />}
          status="normal"
        />
        <KPICard
          title="Ordens Hoje"
          value={kpis.ordens_hoje || 0}
          subtitle={`${kpis.ordens_em_andamento || 0} em andamento`}
          icon={<Package className="size-4 text-blue-600" />}
          status="normal"
        />
        <KPICard
          title="Módulos Ativos"
          value={`${(kpis.modulos_colheita_ativos || 0) + (kpis.modulos_carregamento_ativos || 0)}`}
          subtitle={`${kpis.modulos_colheita_ativos || 0} colheita + ${kpis.modulos_carregamento_ativos || 0} carregamento`}
          icon={<MapPin className="size-4 text-blue-600" />}
          status="normal"
        />
        <KPICard
          title="Total Fazendas"
          value={kpis.total_fazendas || 0}
          subtitle={`${kpis.fazendas_colheita || 0} em colheita`}
          icon={<Target className="size-4 text-blue-600" />}
          status="normal"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consumo vs Produção por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={consumoHora}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis label={{ value: 'Toneladas', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="meta" stroke="#3b82f6" name="Meta (t/h)" strokeWidth={2} />
                <Line type="monotone" dataKey="real" stroke="#10b981" name="Real (t/h)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status das Viagens</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusViagens}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders - Dados Reais */}
      <Card>
        <CardHeader>
          <CardTitle>Ordens Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ordensRecentes.length > 0 ? (
              ordensRecentes.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColorDark(order.status)}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <div>
                      <p className="text-white">Ordem #{order.numero_ordem}</p>
                      <p className="text-sm text-gray-400">
                        {order.volume_toneladas}t - {order.fazenda_nome || 'Fazenda N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {order.fazenda?.distancia_fabrica_km ? `${order.fazenda.distancia_fabrica_km}km` : 'N/A'}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Nenhuma ordem recente</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}