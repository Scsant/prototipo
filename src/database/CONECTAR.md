# 🔌 Conectar ao Banco Real - Sistema Bracell

## ✅ Seu Banco JÁ TEM TUDO!

Você não precisa popular dados. O banco já contém:
- ✅ 500+ fazendas reais
- ✅ Estados (SP, MS, GO, PR, MG)
- ✅ Módulos de colheita e carregamento
- ✅ Motoristas e caminhões
- ✅ Ordens de carga
- ✅ Status operacionais

---

## 🎯 Objetivo

Substituir `mock-data.ts` por queries reais do Supabase **SEM PERDER NENHUMA FUNCIONALIDADE**.

---

## 📋 Checklist de Integração

### Fase 1: Preparação (Opcional)
- [ ] Executar `views.sql` no Supabase para criar views otimizadas
- [ ] Testar queries básicas no SQL Editor

### Fase 2: Conectar Página por Página
- [ ] Dashboard → KPIs e alertas
- [ ] Mapa Interativo → Fazendas com status
- [ ] Ordens de Carga → Lista e CRUD
- [ ] Planejamento → Parâmetros e simulação
- [ ] Fazendas → Listagem e detalhes
- [ ] Frota → Caminhões e motoristas
- [ ] Relatórios → Dados históricos
- [ ] Cenários → Simulações

---

## 🚀 Exemplo Prático: Dashboard

### ANTES (mock-data.ts):
```typescript
// components/pages/Dashboard.tsx
import { mockFarms } from '../../lib/mock-data';

export function Dashboard() {
  const farms = mockFarms;
  const totalFarms = farms.length;
  
  return (
    <div>
      <KPICard title="Total Fazendas" value={totalFarms} />
    </div>
  );
}
```

### DEPOIS (queries do banco):
```typescript
// components/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { dashboardQueries } from '../../lib/queries';

export function Dashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await dashboardQueries.getKPIsHoje();
        setKpis(data);
      } catch (error) {
        console.error('Erro ao carregar KPIs:', error);
        // Fallback para mock em caso de erro
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <KPICard 
        title="Total Fazendas" 
        value={kpis?.total_fazendas || 0} 
      />
    </div>
  );
}
```

---

## 🗺️ Exemplo Prático: Mapa Interativo

### ANTES (mock-data.ts):
```typescript
// components/pages/InteractiveMapPage.tsx
import { mockFarms } from '../../lib/mock-data';

const farms = mockFarms.map(f => ({
  ...f,
  operation_state: 'colheita' // Mock estático
}));
```

### DEPOIS (queries do banco):
```typescript
// components/pages/InteractiveMapPage.tsx
import { useEffect, useState } from 'react';
import { mapQueries, mapOperationState } from '../../lib/queries';

export function InteractiveMapPage() {
  const [farms, setFarms] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    async function loadMapData() {
      try {
        const [farmsData, modulesData] = await Promise.all([
          mapQueries.getFazendasComStatus(),
          mapQueries.getModulosComLocalizacao()
        ]);
        
        // Mapear para o formato esperado pela UI
        const mappedFarms = farmsData.map(f => ({
          id: f.id,
          name: f.nome,
          state: f.estado_sigla,
          lat: f.latitude,
          lng: f.longitude,
          produtividade: f.produtividade,
          distancia_km: f.distancia_fabrica_km,
          estoque_t: f.estoque_toneladas,
          // Status operacional do banco
          operation_state: mapOperationState(f.operation_state, f.flag_ativa),
          tpc_dias: f.tpc_dias,
          colheita_progresso: f.colheita_progresso_pct
        }));
        
        setFarms(mappedFarms);
        setModules(modulesData);
      } catch (error) {
        console.error('Erro ao carregar mapa:', error);
      }
    }
    
    loadMapData();
  }, []);

  return (
    <Map farms={farms} modules={modules} />
  );
}
```

---

## 📊 Mapeamento de Campos

### Fazendas
| Mock Data | Banco Real | Transformação |
|-----------|------------|---------------|
| `name` | `nome` | Direto |
| `state` | `estado_sigla` | Via JOIN com estados |
| `produtividade` | `produtividade` | Direto |
| `distancia_km` | `distancia_fabrica_km` | Renomear |
| `estoque_t` | `estoque_toneladas` | Renomear |
| `operation_state` | `status_operacional_fazenda.status` | Via VIEW |
| `tpc_dias` | `status_operacional_fazenda.tpc_dias` | Via VIEW |

### Módulos
| Mock Data | Banco Real | Transformação |
|-----------|------------|---------------|
| `id` | `id` | Direto |
| `nome` | `nome` | Direto |
| `tipo` | `tipo` | 'colheita' ou 'carregamento' |
| `status` | `status` | 'ativo', 'manutencao', etc |
| `lat` | `latitude_atual` | Renomear |
| `lng` | `longitude_atual` | Renomear |

### Ordens de Carga
| Mock Data | Banco Real | Transformação |
|-----------|------------|---------------|
| `id` | `numero_ordem` | Prefixo automático |
| `volume_t` | `volume_toneladas` | Renomear |
| `status` | `status` | 'planejada', 'em_andamento', 'concluida' |

---

## 🛠️ Queries Prontas

Todas as queries já estão em `/lib/queries.ts`:

```typescript
// Dashboard
dashboardQueries.getKPIsHoje()
dashboardQueries.getAlertasAtivos()
dashboardQueries.getVolumePorEstado()

// Mapa
mapQueries.getFazendasComStatus()
mapQueries.getModulosComLocalizacao()
mapQueries.getFazendaById(id)

// Ordens
ordersQueries.getOrdensHoje()
ordersQueries.criarOrdem(dados)
ordersQueries.atualizarStatusOrdem(id, status)

// Fazendas
farmsQueries.getFazendas()
farmsQueries.getFazendaById(id)
farmsQueries.getModulosDaFazenda(id)

// Frota
fleetQueries.getCaminhoes()
fleetQueries.getMotoristas()

// Cenários
scenariosQueries.getCenarios()
scenariosQueries.salvarCenario(dados)

// Relatórios
reportsQueries.getKPIsPeriodo(inicio, fim)
reportsQueries.getRelatorioTrocas(inicio, fim)
```

---

## ⚡ Quick Win: Testar Conexão

Execute esta query no SQL Editor do Supabase para verificar os dados:

```sql
-- Ver total de fazendas por estado
SELECT 
  e.sigla,
  COUNT(f.id) as total_fazendas
FROM estados e
LEFT JOIN fazendas f ON e.id = f.estado_id
WHERE f.ativo = true
GROUP BY e.sigla
ORDER BY total_fazendas DESC;

-- Ver módulos ativos
SELECT 
  tipo,
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'ativo' THEN 1 END) as ativos
FROM modulos
GROUP BY tipo;

-- Ver ordens de hoje
SELECT 
  status,
  COUNT(*) as total,
  SUM(volume_toneladas) as volume_total
FROM ordens_carga
WHERE DATE(data_agendamento) = CURRENT_DATE
GROUP BY status;
```

---

## 🎯 Estratégia Gradual

### Semana 1: Leitura de Dados
- ✅ Dashboard (KPIs e alertas)
- ✅ Mapa Interativo (fazendas e módulos)
- ✅ Listagens (ordens, fazendas, frota)

### Semana 2: CRUD Básico
- ✅ Criar ordens de carga
- ✅ Atualizar status de ordens
- ✅ Salvar parâmetros de otimização

### Semana 3: Funcionalidades Avançadas
- ✅ Cenários de simulação
- ✅ Relatórios históricos
- ✅ Alertas automáticos

---

## 🔥 Migração Página por Página

### 1. Dashboard
**Arquivo:** `/components/pages/Dashboard.tsx`

**Substituir:**
```typescript
// ANTES
import { mockFarms } from '../../lib/mock-data';

// DEPOIS
import { dashboardQueries } from '../../lib/queries';
const kpis = await dashboardQueries.getKPIsHoje();
```

**Benefícios:**
- KPIs em tempo real
- Alertas do banco
- Estatísticas calculadas

---

### 2. Mapa Interativo
**Arquivo:** `/components/pages/InteractiveMapPage.tsx`

**Substituir:**
```typescript
// ANTES
const farms = mockFarms;

// DEPOIS
const farms = await mapQueries.getFazendasComStatus();
const modules = await mapQueries.getModulosComLocalizacao();
```

**Benefícios:**
- Status operacional real (colheita/carregamento/TPC)
- 500+ fazendas reais
- Módulos com localização atual

---

### 3. Ordens de Carga
**Arquivo:** `/components/pages/OrdersPage.tsx`

**Substituir:**
```typescript
// ANTES
const orders = mockOrders;

// DEPOIS
const orders = await ordersQueries.getOrdensHoje();
```

**Criar novas ordens:**
```typescript
await ordersQueries.criarOrdem({
  numero_ordem: 'ORD-2025-' + Date.now(),
  fazenda_id: selectedFarm.id,
  modulo_id: selectedModule.id,
  volume_toneladas: 42.0,
  distancia_km: 58,
  tempo_estimado_minutos: 87,
  data_agendamento: new Date().toISOString()
});
```

---

### 4. Planejamento
**Arquivo:** `/components/pages/PlanningPage.tsx`

**Substituir:**
```typescript
// ANTES
const params = { alpha: 0.3, beta: 0.25, gamma: 0.25, delta: 0.2 };

// DEPOIS
const params = await planningQueries.getParametrosAtivos();

// Salvar novos parâmetros
await planningQueries.salvarParametros({
  nome_configuracao: 'Config ' + new Date().toLocaleDateString(),
  alpha, beta, gamma, delta,
  demanda_diaria_toneladas: 35000,
  meta_hora_toneladas: 1458
});
```

---

### 5. Fazendas
**Arquivo:** `/components/pages/FarmsPage.tsx`

**Substituir:**
```typescript
// ANTES
const farms = mockFarms;

// DEPOIS
const farms = await farmsQueries.getFazendas();

// Ver detalhes de uma fazenda
const farm = await farmsQueries.getFazendaById(id);
const modules = await farmsQueries.getModulosDaFazenda(id);
```

---

### 6. Frota
**Arquivo:** `/components/pages/FleetPage.tsx`

**Substituir:**
```typescript
// ANTES
const trucks = mockTrucks;
const drivers = mockDrivers;

// DEPOIS
const trucks = await fleetQueries.getCaminhoes({ status: 'disponivel' });
const drivers = await fleetQueries.getMotoristas({ status: 'disponivel' });
```

---

### 7. Relatórios
**Arquivo:** `/components/pages/ReportsPage.tsx`

**Substituir:**
```typescript
// ANTES
const data = mockReportData;

// DEPOIS
const kpis = await reportsQueries.getKPIsPeriodo('2025-10-01', '2025-10-31');
const trocas = await reportsQueries.getRelatorioTrocas('2025-10-01', '2025-10-31');
const produtividade = await reportsQueries.getRelatorioProdutividadeFazendas('2025-10-01', '2025-10-31');
```

---

### 8. Cenários
**Arquivo:** `/components/pages/ScenariosPage.tsx`

**Substituir:**
```typescript
// ANTES
const scenarios = mockScenarios;

// DEPOIS
const scenarios = await scenariosQueries.getCenarios();

// Salvar novo cenário
await scenariosQueries.salvarCenario({
  nome: 'Cenário Otimista Q4',
  descricao: 'Alta demanda + clima favorável',
  configuracao: { /* params */ },
  resultados: { /* simulation results */ }
});
```

---

## ✅ Vantagens da Integração

1. **Dados Reais em Tempo Real**
   - 500+ fazendas com status atual
   - TPC calculado dinamicamente
   - Progresso de colheita real

2. **CRUD Completo**
   - Criar/editar/deletar ordens
   - Salvar configurações
   - Histórico persistente

3. **Type-Safety**
   - Tipos gerados do banco
   - Autocomplete no VSCode
   - Menos bugs

4. **Performance**
   - VIEWs otimizadas
   - Queries indexadas
   - Cache do Supabase

5. **Colaboração**
   - Múltiplos usuários
   - Dados sincronizados
   - Sem conflitos

---

## 📞 Próximo Passo

1. **Testar queries no SQL Editor** (ver queries acima)
2. **Executar views.sql** (opcional mas recomendado)
3. **Migrar uma página por vez** (começar pelo Dashboard)
4. **Manter fallback para mock** durante transição

```typescript
try {
  const data = await dashboardQueries.getKPIsHoje();
  return data;
} catch (error) {
  console.warn('Usando dados mock:', error);
  return mockKPIs; // Fallback temporário
}
```

**Pronto para conectar aos dados reais! 🚀**
