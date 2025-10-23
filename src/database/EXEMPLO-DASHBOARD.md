# 📊 Exemplo Prático: Migrar Dashboard

## 🎯 Objetivo

Conectar o Dashboard ao banco real do Supabase, exibindo KPIs verdadeiros da operação Bracell.

---

## 📋 Antes vs Depois

### ❌ ANTES (Mock Data)
```typescript
// components/pages/Dashboard.tsx
import { mockFarms } from '../../lib/mock-data';

export function Dashboard() {
  const totalFarms = mockFarms.length;
  const activeModules = 11; // Hardcoded
  
  return (
    <div className="grid grid-cols-4 gap-4">
      <KPICard title="Total Fazendas" value={totalFarms} />
      <KPICard title="Módulos Ativos" value={activeModules} />
    </div>
  );
}
```

**Problemas:**
- Dados estáticos
- Não reflete operação real
- Sem tempo real

---

### ✅ DEPOIS (Banco Real)
```typescript
// components/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { dashboardQueries } from '../../lib/queries';

export function Dashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        
        // Buscar dados reais do banco
        const [kpisData, alertasData] = await Promise.all([
          dashboardQueries.getKPIsHoje(),
          dashboardQueries.getAlertasAtivos(5)
        ]);
        
        setKpis(kpisData);
        setAlertas(alertasData);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        // Opcional: fallback para mock
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Carregando dados reais...</div>
      </div>
    );
  }

  if (!kpis) {
    return <div>Erro ao carregar dados</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPIs Grid */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard 
          title="Total Fazendas" 
          value={kpis.total_fazendas} 
          subtitle={`${kpis.fazendas_colheita} em colheita`}
        />
        <KPICard 
          title="Módulos Ativos" 
          value={kpis.modulos_colheita_ativos + kpis.modulos_carregamento_ativos}
          subtitle={`${kpis.modulos_colheita_ativos} colheita + ${kpis.modulos_carregamento_ativos} carregamento`}
        />
        <KPICard 
          title="Ordens Hoje" 
          value={kpis.ordens_hoje}
          subtitle={`${kpis.ordens_em_andamento} em andamento`}
        />
        <KPICard 
          title="Frota Disponível" 
          value={kpis.caminhoes_disponiveis}
          subtitle={`de ${kpis.total_caminhoes} caminhões`}
        />
      </div>

      {/* Operação */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard 
          title="Em Colheita" 
          value={kpis.fazendas_colheita}
          color="green"
        />
        <KPICard 
          title="CTO/TPC" 
          value={kpis.fazendas_cto}
          color="yellow"
        />
        <KPICard 
          title="Carregamento" 
          value={kpis.fazendas_carregamento}
          color="blue"
        />
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h3 className="mb-4">Alertas Ativos</h3>
          <div className="space-y-2">
            {alertas.map(alerta => (
              <div 
                key={alerta.id} 
                className={`p-3 rounded border-l-4 ${
                  alerta.prioridade === 'alta' 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : alerta.prioridade === 'media'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold">{alerta.tipo}</span>
                    <p className="text-sm mt-1">{alerta.mensagem}</p>
                    {alerta.fazenda_nome && (
                      <p className="text-xs text-gray-500 mt-1">
                        Fazenda: {alerta.fazenda_nome}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(alerta.data_alerta).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Vantagens:**
- ✅ Dados em tempo real
- ✅ 500+ fazendas reais
- ✅ KPIs calculados do banco
- ✅ Alertas verdadeiros
- ✅ Auto-atualiza

---

## 🔍 O que a Query Retorna

### `dashboardQueries.getKPIsHoje()`

Retorna objeto com:

```typescript
{
  // Volume e eficiência
  volume_transportado_m3: 28450.5,
  taxa_utilizacao_frota: 87.3,
  custo_por_m3: 12.45,
  eficiencia_operacional: 92.1,
  aderencia_planejamento: 95.8,
  total_viagens: 142,
  total_trocas_modulo: 3,
  
  // Ordens
  ordens_hoje: 156,
  ordens_em_andamento: 45,
  ordens_planejadas: 78,
  ordens_concluidas: 33,
  
  // Frota
  caminhoes_disponiveis: 328,
  caminhoes_em_viagem: 502,
  total_caminhoes: 830,
  motoristas_disponiveis: 312,
  
  // Módulos
  modulos_colheita_ativos: 5,
  modulos_carregamento_ativos: 5,
  
  // Fazendas
  total_fazendas: 542,
  fazendas_colheita: 28,
  fazendas_carregamento: 35,
  fazendas_cto: 87
}
```

### `dashboardQueries.getAlertasAtivos(5)`

Retorna array:

```typescript
[
  {
    id: "alert-123",
    tipo: "Módulo",
    prioridade: "alta",
    mensagem: "Módulo COL-M1 próximo do limite de trocas diárias",
    data_alerta: "2025-10-19T14:30:00Z",
    resolvido: false,
    fazenda_nome: "Fazenda Pantanal",
    modulo_nome: "COL-M1",
    modulo_tipo: "colheita"
  },
  {
    id: "alert-124",
    tipo: "Manutenção",
    prioridade: "media",
    mensagem: "Caminhão ABC-1234 atingindo km de manutenção",
    data_alerta: "2025-10-19T13:15:00Z",
    resolvido: false,
    caminhao_placa: "ABC-1234"
  }
]
```

---

## 📊 Variação: Dashboard com Gráfico

```typescript
import { useEffect, useState } from 'react';
import { dashboardQueries } from '../../lib/queries';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function Dashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [tendencia, setTendencia] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      const [kpisData, tendenciaData] = await Promise.all([
        dashboardQueries.getKPIsHoje(),
        dashboardQueries.getTendenciaSemanal()
      ]);
      
      setKpis(kpisData);
      setTendencia(tendenciaData);
    }
    
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* KPIs... */}
      
      {/* Gráfico de Tendência */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 className="mb-4">Volume Semanal</h3>
        <LineChart width={800} height={300} data={tendencia}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="data" 
            tickFormatter={(val) => new Date(val).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="volume_transportado_m3" 
            stroke="#8884d8" 
            name="Volume (m³)"
          />
          <Line 
            type="monotone" 
            dataKey="taxa_utilizacao_frota" 
            stroke="#82ca9d" 
            name="Utilização Frota (%)"
          />
        </LineChart>
      </div>
    </div>
  );
}
```

---

## 🔄 Auto-Atualização (Opcional)

```typescript
export function Dashboard() {
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    // Carregar dados inicialmente
    loadDashboard();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadDashboard, 30000);
    
    return () => clearInterval(interval);
  }, []);

  async function loadDashboard() {
    const data = await dashboardQueries.getKPIsHoje();
    setKpis(data);
  }

  // ... resto do código
}
```

---

## ✅ Checklist de Migração

- [ ] Importar `dashboardQueries` de `lib/queries`
- [ ] Criar states: `kpis`, `alertas`, `loading`
- [ ] Criar `useEffect` para carregar dados
- [ ] Substituir valores mock por `kpis.campo`
- [ ] Adicionar loading state
- [ ] Testar no navegador
- [ ] Verificar se dados reais aparecem
- [ ] Adicionar tratamento de erro (opcional)
- [ ] Adicionar auto-refresh (opcional)

---

## 🚨 Troubleshooting

### Erro: "Cannot read property 'total_fazendas' of null"
**Solução:** Adicionar verificação antes de renderizar
```typescript
if (!kpis) return <div>Carregando...</div>;
```

### Erro: "dashboardQueries is not defined"
**Solução:** Verificar import
```typescript
import { dashboardQueries } from '../../lib/queries';
```

### Dados não aparecem
**Solução:** Ver console do navegador para erros
```typescript
catch (error) {
  console.error('Erro completo:', error);
}
```

### Query demora muito
**Solução:** Executar views.sql para criar índices otimizados

---

## 📞 Próximo Passo

Após migrar o Dashboard:
1. Testar todas as funcionalidades
2. Verificar que dados reais aparecem
3. Migrar próxima página: **Mapa Interativo** (ver `/database/CONECTAR.md`)

**Dashboard conectado ao banco real! 🎉**
