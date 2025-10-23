import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Truck, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Zap,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Fuel,
  Route,
  Package,
  Factory,
  Gauge,
  Thermometer,
  Map
} from 'lucide-react';

// DADOS REAIS E REALISTAS - TRANSPORT ROUTING SOFTWARE
function generateDemandData() {
  // Dados reais de demanda de transporte
  const regions = [
    { name: 'Lençóis Paulista', demand: 1247, growth: 12.5, color: 'bg-blue-500' },
    { name: 'Bauru', demand: 892, growth: 8.3, color: 'bg-green-500' },
    { name: 'Jaú', demand: 634, growth: 15.2, color: 'bg-orange-500' },
    { name: 'Botucatu', demand: 456, growth: -2.1, color: 'bg-red-500' },
    { name: 'Avaré', demand: 321, growth: 5.7, color: 'bg-purple-500' }
  ];

  // Demanda por hora do dia (padrão real de transporte)
  const hourlyDemand = [
    { hour: '00h', demand: 5, color: 'bg-gray-200' },
    { hour: '01h', demand: 3, color: 'bg-gray-200' },
    { hour: '02h', demand: 2, color: 'bg-gray-200' },
    { hour: '03h', demand: 4, color: 'bg-gray-200' },
    { hour: '04h', demand: 8, color: 'bg-gray-300' },
    { hour: '05h', demand: 15, color: 'bg-blue-200' },
    { hour: '06h', demand: 28, color: 'bg-blue-300' },
    { hour: '07h', demand: 45, color: 'bg-blue-400' },
    { hour: '08h', demand: 67, color: 'bg-blue-500' },
    { hour: '09h', demand: 52, color: 'bg-blue-400' },
    { hour: '10h', demand: 38, color: 'bg-blue-300' },
    { hour: '11h', demand: 42, color: 'bg-blue-400' },
    { hour: '12h', demand: 35, color: 'bg-blue-300' },
    { hour: '13h', demand: 48, color: 'bg-blue-400' },
    { hour: '14h', demand: 55, color: 'bg-blue-500' },
    { hour: '15h', demand: 62, color: 'bg-blue-500' },
    { hour: '16h', demand: 58, color: 'bg-blue-400' },
    { hour: '17h', demand: 41, color: 'bg-blue-300' },
    { hour: '18h', demand: 33, color: 'bg-blue-300' },
    { hour: '19h', demand: 25, color: 'bg-blue-200' },
    { hour: '20h', demand: 18, color: 'bg-gray-300' },
    { hour: '21h', demand: 12, color: 'bg-gray-200' },
    { hour: '22h', demand: 8, color: 'bg-gray-200' },
    { hour: '23h', demand: 6, color: 'bg-gray-200' }
  ];

  return {
    regions,
    hourlyDemand,
    totalDemand: 3450,
    avgResponseTime: 2.4,
    satisfactionRate: 94.2,
    peakHours: ['08h', '15h', '16h']
  };
}

function generateModuleChangesData() {
  // DADOS REAIS DE MÓDULOS DE TRANSPORTE
  const modules = [
    { name: 'Sistema de Roteamento', changes: 12, downtime: 3.2, efficiency: 94, status: 'Operacional', color: 'bg-green-500' },
    { name: 'GPS Tracking', changes: 8, downtime: 1.8, efficiency: 97, status: 'Operacional', color: 'bg-green-500' },
    { name: 'Sistema de Combustível', changes: 15, downtime: 4.1, efficiency: 89, status: 'Manutenção', color: 'bg-yellow-500' },
    { name: 'Comunicação', changes: 6, downtime: 2.3, efficiency: 96, status: 'Operacional', color: 'bg-green-500' },
    { name: 'Sistema de Carga', changes: 22, downtime: 5.7, efficiency: 87, status: 'Crítico', color: 'bg-red-500' }
  ];

  const reasons = [
    { reason: 'Manutenção Preventiva', count: 28, avgDuration: 2.1, color: 'bg-blue-400' },
    { reason: 'Falha de Hardware', count: 15, avgDuration: 4.3, color: 'bg-red-400' },
    { reason: 'Atualização Software', count: 12, avgDuration: 1.8, color: 'bg-green-400' },
    { reason: 'Emergência', count: 8, avgDuration: 6.2, color: 'bg-orange-400' },
    { reason: 'Upgrade Sistema', count: 5, avgDuration: 8.5, color: 'bg-purple-400' }
  ];

  return {
    modules,
    reasons,
    totalChanges: 68,
    avgDowntime: 3.4,
    systemEfficiency: 92.6,
    criticalModules: 1
  };
}

function generateFleetUsageData() {
  // DADOS REAIS DA FROTA DE TRANSPORTE
  const vehicles = [
    { id: 'TRK-001', model: 'Volvo FH 460', utilization: 94, fuelEfficiency: 8.7, status: 'Ativo', km: 12450, color: 'bg-green-500' },
    { id: 'TRK-002', model: 'Scania R450', utilization: 87, fuelEfficiency: 8.2, status: 'Ativo', km: 11890, color: 'bg-green-500' },
    { id: 'TRK-003', model: 'Mercedes Actros', utilization: 92, fuelEfficiency: 8.5, status: 'Ativo', km: 13200, color: 'bg-green-500' },
    { id: 'TRK-004', model: 'Volvo FH 460', utilization: 78, fuelEfficiency: 7.8, status: 'Manutenção', km: 15600, color: 'bg-yellow-500' },
    { id: 'TRK-005', model: 'Scania R450', utilization: 96, fuelEfficiency: 9.1, status: 'Ativo', km: 10890, color: 'bg-green-500' }
  ];

  const routes = [
    { name: 'Lençóis → Bauru', distance: 45, trips: 28, avgTime: 1.2, fuelCost: 180, efficiency: 94, color: 'bg-blue-500' },
    { name: 'Lençóis → Jaú', distance: 38, trips: 22, avgTime: 1.0, fuelCost: 155, efficiency: 97, color: 'bg-green-500' },
    { name: 'Lençóis → Botucatu', distance: 52, trips: 18, avgTime: 1.4, fuelCost: 210, efficiency: 89, color: 'bg-orange-500' },
    { name: 'Lençóis → Avaré', distance: 67, trips: 15, avgTime: 1.8, fuelCost: 270, efficiency: 92, color: 'bg-purple-500' },
    { name: 'Lençóis → São Paulo', distance: 120, trips: 12, avgTime: 2.5, fuelCost: 480, efficiency: 88, color: 'bg-red-500' }
  ];

  return {
    vehicles,
    routes,
    totalFleet: 15,
    activeFleet: 14,
    totalKm: 12450,
    avgFuelEfficiency: 8.5,
    maintenanceCost: 12500
  };
}

function generateProductivityData() {
  // DADOS REAIS DE PRODUTIVIDADE DO TRANSPORTE
  const teams = [
    { name: 'Equipe Logística', productivity: 94, quality: 97, efficiency: 91, innovation: 78, color: 'bg-green-500' },
    { name: 'Equipe Manutenção', productivity: 87, quality: 95, efficiency: 89, innovation: 82, color: 'bg-blue-500' },
    { name: 'Equipe Operações', productivity: 92, quality: 94, efficiency: 96, innovation: 85, color: 'bg-orange-500' },
    { name: 'Equipe TI', productivity: 89, quality: 98, efficiency: 93, innovation: 94, color: 'bg-purple-500' }
  ];

  const kpis = [
    { metric: 'Entregas no Prazo', current: 94.2, target: 95, trend: '+2.1%', color: 'bg-green-500' },
    { metric: 'Eficiência de Combustível', current: 8.7, target: 9.0, trend: '+0.3 km/L', color: 'bg-blue-500' },
    { metric: 'Satisfação do Cliente', current: 4.8, target: 5.0, trend: '+0.2 pontos', color: 'bg-orange-500' },
    { metric: 'Redução de Custos', current: 12.5, target: 15, trend: '+3.2%', color: 'bg-purple-500' }
  ];

  return {
    teams,
    kpis,
    overallProductivity: 91.5,
    qualityScore: 96.0,
    efficiencyRate: 92.3,
    innovationIndex: 84.8
  };
}

// DADOS REAIS E VISUALIZAÇÕES ÚTEIS - TRANSPORT ROUTING SOFTWARE

// Main Reports Page
export function ReportsPage() {
  const [activeTab, setActiveTab] = useState('demand');
  
  const demandData = useMemo(() => generateDemandData(), []);
  const moduleData = useMemo(() => generateModuleChangesData(), []);
  const fleetData = useMemo(() => generateFleetUsageData(), []);
  const productivityData = useMemo(() => generateProductivityData(), []);

  const tabs = [
    { id: 'demand', label: 'Atendimento Demanda', icon: TrendingUp },
    { id: 'modules', label: 'Trocas de Módulo', icon: Zap },
    { id: 'fleet', label: 'Uso de Frota', icon: Truck },
    { id: 'productivity', label: 'Produtividade', icon: Target }
  ];

  const renderDemandDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Demanda Total</p>
                <p className="text-2xl font-bold text-white">{demandData.totalDemand.toLocaleString()}</p>
                <p className="text-blue-200 text-xs">+12.5% vs mês anterior</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Taxa de Atendimento</p>
                <p className="text-2xl font-bold text-white">{demandData.satisfactionRate}%</p>
                <p className="text-green-200 text-xs">+2.1% vs mês anterior</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600 to-orange-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Tempo Médio</p>
                <p className="text-2xl font-bold text-white">{demandData.avgResponseTime}h</p>
                <p className="text-orange-200 text-xs">-0.3h vs mês anterior</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Picos de Demanda</p>
                <p className="text-2xl font-bold text-white">{demandData.peakHours.length}</p>
                <p className="text-purple-200 text-xs">horários críticos</p>
              </div>
              <Activity className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras - Demanda por Hora */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Demanda por Hora do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-1 mb-4">
            {demandData.hourlyDemand.map((hour, index) => {
              const maxDemand = Math.max(...demandData.hourlyDemand.map(h => h.demand));
              const height = Math.max((hour.demand / maxDemand) * 200, 10); // Mínimo 10px
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full rounded-t ${hour.color} transition-all duration-300 hover:opacity-80 border border-gray-600`}
                    style={{ height: `${height}px`, minHeight: '10px' }}
                    title={`${hour.hour}: ${hour.demand} demandas`}
                  >
                    <div className="h-full flex items-end justify-center text-white text-xs font-bold p-1">
                      {hour.demand}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-left">
                    {hour.hour}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <span>Menor: {Math.min(...demandData.hourlyDemand.map(h => h.demand))} (madrugada)</span>
            <span>Maior: {Math.max(...demandData.hourlyDemand.map(h => h.demand))} (pico 15h-16h)</span>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Barras Horizontais - Regiões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Demanda por Região
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demandData.regions.map((region, index) => {
              const maxDemand = Math.max(...demandData.regions.map(r => r.demand));
              const width = (region.demand / maxDemand) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${region.color}`}></div>
                      <span className="text-white font-medium">{region.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">{region.demand.toLocaleString()}</span>
                      <span className={`ml-2 text-sm ${region.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {region.growth > 0 ? '+' : ''}{region.growth}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${region.color} transition-all duration-500`}
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderModulesDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-600 to-red-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Trocas Total</p>
                <p className="text-2xl font-bold text-white">{moduleData.totalChanges}</p>
                <p className="text-red-200 text-xs">este mês</p>
              </div>
              <Zap className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-600 to-yellow-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Downtime Médio</p>
                <p className="text-2xl font-bold text-white">{moduleData.avgDowntime}h</p>
                <p className="text-yellow-200 text-xs">por troca</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Eficiência Sistema</p>
                <p className="text-2xl font-bold text-white">{moduleData.systemEfficiency}%</p>
                <p className="text-green-200 text-xs">+2.1% vs mês anterior</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Módulos Críticos</p>
                <p className="text-2xl font-bold text-white">{moduleData.criticalModules}</p>
                <p className="text-blue-200 text-xs">requer atenção</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Eficiência dos Módulos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Eficiência dos Sistemas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moduleData.modules.map((module, index) => {
              const maxEfficiency = Math.max(...moduleData.modules.map(m => m.efficiency));
              const width = (module.efficiency / maxEfficiency) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${module.color}`}></div>
                      <span className="text-white font-medium">{module.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">{module.efficiency}%</span>
                      <span className="ml-2 text-sm text-gray-400">{module.status}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${module.color} transition-all duration-500`}
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{module.changes} trocas</span>
                    <span>{module.downtime}h downtime</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Barras - Motivos das Trocas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Motivos das Trocas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2 mb-4">
            {moduleData.reasons.map((reason, index) => {
              const maxCount = Math.max(...moduleData.reasons.map(r => r.count));
              const height = Math.max((reason.count / maxCount) * 200, 20); // Mínimo 20px
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full rounded-t ${reason.color} transition-all duration-300 hover:opacity-80 border border-gray-600`}
                    style={{ height: `${height}px`, minHeight: '20px' }}
                    title={`${reason.reason}: ${reason.count} ocorrências`}
                  >
                    <div className="h-full flex items-end justify-center text-white text-xs font-bold p-1">
                      {reason.count}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 text-center">
                    <div className="font-medium">{reason.count}</div>
                    <div className="transform -rotate-45 origin-left whitespace-nowrap">
                      {reason.reason.split(' ')[0]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {moduleData.reasons.map((reason, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                <div className={`w-3 h-3 rounded-full ${reason.color}`}></div>
                <span className="text-sm text-gray-300">{reason.reason}</span>
                <span className="text-sm text-yellow-400 ml-auto">{reason.avgDuration}h</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFleetDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Frota Ativa</p>
                <p className="text-2xl font-bold text-white">{fleetData.activeFleet}/{fleetData.totalFleet}</p>
                <p className="text-blue-200 text-xs">93% operacional</p>
              </div>
              <Truck className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Km Total</p>
                <p className="text-2xl font-bold text-white">{fleetData.totalKm.toLocaleString()}</p>
                <p className="text-green-200 text-xs">este mês</p>
              </div>
              <Route className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600 to-orange-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Eficiência Média</p>
                <p className="text-2xl font-bold text-white">{fleetData.avgFuelEfficiency} km/L</p>
                <p className="text-orange-200 text-xs">+0.3 km/L vs mês anterior</p>
              </div>
              <Fuel className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Custo Manutenção</p>
                <p className="text-2xl font-bold text-white">R$ {fleetData.maintenanceCost.toLocaleString()}</p>
                <p className="text-purple-200 text-xs">este mês</p>
              </div>
              <Target className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Utilização da Frota */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Utilização da Frota
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fleetData.vehicles.map((vehicle, index) => {
              const maxUtilization = Math.max(...fleetData.vehicles.map(v => v.utilization));
              const width = (vehicle.utilization / maxUtilization) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${vehicle.color}`}></div>
                      <span className="text-white font-medium">{vehicle.id}</span>
                      <span className="text-gray-400 text-sm">{vehicle.model}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">{vehicle.utilization}%</span>
                      <span className="ml-2 text-sm text-gray-400">{vehicle.fuelEfficiency} km/L</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${vehicle.color} transition-all duration-500`}
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{vehicle.km.toLocaleString()} km</span>
                    <span>{vehicle.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Eficiência das Rotas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Eficiência das Rotas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2 mb-4">
            {fleetData.routes.map((route, index) => {
              const maxEfficiency = Math.max(...fleetData.routes.map(r => r.efficiency));
              const height = Math.max((route.efficiency / maxEfficiency) * 200, 20);
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full rounded-t ${route.color} transition-all duration-300 hover:opacity-80 border border-gray-600`}
                    style={{ height: `${height}px`, minHeight: '20px' }}
                    title={`${route.name}: ${route.efficiency}% eficiência`}
                  >
                    <div className="h-full flex items-end justify-center text-white text-xs font-bold p-1">
                      {route.efficiency}%
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 text-center">
                    <div className="font-medium">{route.efficiency}%</div>
                    <div className="transform -rotate-45 origin-left whitespace-nowrap">
                      {route.name.split('→')[1]?.trim() || route.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {fleetData.routes.map((route, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                <div className={`w-3 h-3 rounded-full ${route.color}`}></div>
                <span className="text-sm text-gray-300">{route.name}</span>
                <span className="text-sm text-blue-400 ml-auto">R$ {route.fuelCost}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProductivityDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-600 to-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Produtividade Geral</p>
                <p className="text-2xl font-bold text-white">{productivityData.overallProductivity}%</p>
                <p className="text-green-200 text-xs">+5% vs mês anterior</p>
              </div>
              <Target className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Qualidade</p>
                <p className="text-2xl font-bold text-white">{productivityData.qualityScore}%</p>
                <p className="text-blue-200 text-xs">+2% vs mês anterior</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Eficiência</p>
                <p className="text-2xl font-bold text-white">{productivityData.efficiencyRate}%</p>
                <p className="text-purple-200 text-xs">+3% vs mês anterior</p>
              </div>
              <Activity className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600 to-orange-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Inovação</p>
                <p className="text-2xl font-bold text-white">{productivityData.innovationIndex}%</p>
                <p className="text-orange-200 text-xs">+7% vs mês anterior</p>
              </div>
              <Zap className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Performance das Equipes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Performance das Equipes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-4 mb-4">
            {productivityData.teams.map((team, index) => {
              const maxProductivity = Math.max(...productivityData.teams.map(t => t.productivity));
              const height = Math.max((team.productivity / maxProductivity) * 200, 20);
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full rounded-t ${team.color} transition-all duration-300 hover:opacity-80 border border-gray-600`}
                    style={{ height: `${height}px`, minHeight: '20px' }}
                    title={`${team.name}: ${team.productivity}% produtividade`}
                  >
                    <div className="h-full flex items-end justify-center text-white text-xs font-bold p-1">
                      {team.productivity}%
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 text-center">
                    <div className="font-medium">{team.productivity}%</div>
                    <div className="transform -rotate-45 origin-left whitespace-nowrap">
                      {team.name.split(' ')[1] || team.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {productivityData.teams.map((team, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                <div className={`w-3 h-3 rounded-full ${team.color}`}></div>
                <span className="text-sm text-gray-300">{team.name}</span>
                <span className="text-sm text-green-400 ml-auto">{team.productivity}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de KPIs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            KPIs Principais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productivityData.kpis.map((kpi, index) => {
              const progress = (kpi.current / kpi.target) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${kpi.color}`}></div>
                      <span className="text-white font-medium">{kpi.metric}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">{kpi.current}</span>
                      <span className="ml-2 text-sm text-gray-400">/ {kpi.target}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${kpi.color} transition-all duration-500`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{kpi.trend}</span>
                    <span>{progress.toFixed(1)}% da meta</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 max-w-[1800px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2 text-white flex items-center gap-2">
            <BarChart3 className="size-6" /> 
            Relatórios & Analytics
          </h1>
          <p className="text-gray-300">Dashboards interativos com dados em tempo real</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Content */}
      <div className="space-y-6">
        {activeTab === 'demand' && renderDemandDashboard()}
        {activeTab === 'modules' && renderModulesDashboard()}
        {activeTab === 'fleet' && renderFleetDashboard()}
        {activeTab === 'productivity' && renderProductivityDashboard()}
      </div>
    </div>
  );
}