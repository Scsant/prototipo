# 🔌 Guia de Integração - Banco Supabase

## 📊 Visão Geral

Este documento explica como conectar o sistema Bracell ao banco de dados Supabase mantendo todas as funcionalidades atuais.

---

## 🗂️ Arquivos Criados

### 1. **`/database/views.sql`**
Contém 8 VIEWs SQL que facilitam queries complexas:

- `vw_fazendas_status` - Fazendas com status operacional completo
- `vw_modulos_detalhados` - Módulos com localização e fazenda atual
- `vw_ordens_completas` - Ordens com todos os relacionamentos
- `vw_kpis_hoje` - KPIs do dia atual (dashboard)
- `vw_alertas_ativos` - Alertas não resolvidos
- `vw_estatisticas_por_estado` - Agregações por estado
- `vw_historico_trocas_recente` - Trocas da última semana
- `vw_fazendas_prontas_carregar` - Fazendas com TPC >= 60 dias

**Como usar:**
```bash
# Execute no SQL Editor do Supabase após popular os dados
# Isso criará as views para facilitar as queries
```

### 2. **`/lib/database.types.ts`**
Tipos TypeScript gerados do schema do banco:

- Tipos para todas as tabelas
- Tipos para todas as views
- Type-safety completa com Supabase

### 3. **`/lib/queries.ts`**
Queries organizadas por funcionalidade:

- `dashboardQueries` - KPIs, alertas, tendências
- `mapQueries` - Fazendas, módulos, estatísticas
- `planningQueries` - Parâmetros de otimização
- `ordersQueries` - CRUD de ordens de carga
- `farmsQueries` - Gestão de fazendas e módulos
- `fleetQueries` - Caminhões e motoristas
- `scenariosQueries` - Simulação de cenários
- `reportsQueries` - Relatórios e análises

### 4. **`/lib/supabase.ts`** (atualizado)
Cliente Supabase configurado com type-safety

---

## 🔄 Estratégia de Migração

### Fase 1: Preparação (CONCLUÍDA ✅)
- [x] Criar VIEWs SQL
- [x] Definir tipos TypeScript
- [x] Criar queries organizadas
- [x] Configurar cliente Supabase

### Fase 2: Popular Banco de Dados (PRÓXIMO PASSO)
```sql
-- 1. Execute seed-data.sql no Supabase SQL Editor
-- 2. Execute views.sql no Supabase SQL Editor
-- 3. Verifique os dados com:
SELECT * FROM vw_fazendas_status LIMIT 10;
SELECT * FROM vw_kpis_hoje;
```

### Fase 3: Migração Gradual por Página

#### **Dashboard** (Prioridade Alta)
```typescript
// Antes (mock-data.ts)
import { mockFarms } from '../lib/mock-data';

// Depois (queries.ts)
import { dashboardQueries } from '../lib/queries';

const kpis = await dashboardQueries.getKPIsHoje();
const alertas = await dashboardQueries.getAlertasAtivos();
```

**Benefícios:**
- KPIs em tempo real
- Alertas do banco
- Dados agregados automáticos

---

#### **Mapa Interativo** (Prioridade Alta)
```typescript
// Antes
const fazendas = mockFarms;

// Depois
import { mapQueries } from '../lib/queries';

const fazendas = await mapQueries.getFazendasComStatus();
const modulos = await mapQueries.getModulosComLocalizacao();
```

**Benefícios:**
- Status operacional real (colheita/carregamento/TPC)
- TPC calculado dinamicamente
- Progresso de colheita real

---

#### **Planejamento** (Prioridade Média)
```typescript
// Buscar parâmetros salvos
const params = await planningQueries.getParametrosAtivos();

// Salvar novos parâmetros
await planningQueries.salvarParametros({
  nome_configuracao: 'Config Outubro',
  alpha: 0.3,
  beta: 0.25,
  gamma: 0.25,
  delta: 0.2,
  demanda_diaria_toneladas: 35000,
  meta_hora_toneladas: 1458
});

// Buscar fazendas prontas
const prontas = await planningQueries.getFazendasProntasCarregar();
```

**Benefícios:**
- Histórico de configurações
- Sugestões baseadas em TPC real
- Persistência de parâmetros

---

#### **Ordens de Carga** (Prioridade Alta)
```typescript
// Listar ordens
const ordens = await ordersQueries.getOrdensHoje();

// Filtrar por status
const emAndamento = await ordersQueries.getOrdens({ 
  status: 'em_andamento' 
});

// Criar nova ordem
await ordersQueries.criarOrdem({
  numero_ordem: 'ORD-2025-001',
  fazenda_id: 'f1',
  modulo_id: 'mod_car_1',
  volume_toneladas: 42.0,
  distancia_km: 58,
  tempo_estimado_minutos: 87,
  data_agendamento: new Date().toISOString()
});

// Atualizar status
await ordersQueries.atualizarStatusOrdem('ord001', 'em_andamento');
```

**Benefícios:**
- CRUD completo
- Relacionamentos automáticos
- Tracking de custos real vs estimado

---

#### **Fazendas & Módulos** (Prioridade Média)
```typescript
const fazendas = await farmsQueries.getFazendas();
const fazenda = await farmsQueries.getFazendaById('f1');
const modulos = await farmsQueries.getModulosDaFazenda('f1');
const historico = await farmsQueries.getHistoricoTrocas();
```

**Benefícios:**
- Relacionamento estado ↔ fazenda
- Histórico de trocas real
- Dados completos de janelas operacionais

---

#### **Frota** (Prioridade Baixa)
```typescript
const caminhoes = await fleetQueries.getCaminhoes({ status: 'disponivel' });
const motoristas = await fleetQueries.getMotoristas({ status: 'disponivel' });
const stats = await fleetQueries.getEstatisticasFrota();
```

**Benefícios:**
- Status em tempo real
- Relacionamento caminhão ↔ motorista
- Quilometragem e manutenção

---

#### **Cenários** (Prioridade Baixa)
```typescript
const cenarios = await scenariosQueries.getCenarios();

await scenariosQueries.salvarCenario({
  nome: 'Cenário Verão 2025',
  descricao: 'Simulação com alta demanda',
  configuracao: { /* ... */ },
  resultados: { /* ... */ }
});

await scenariosQueries.aplicarCenario(cenarioId);
```

**Benefícios:**
- Persistência de simulações
- Comparação histórica
- JSONB para configurações flexíveis

---

#### **Relatórios** (Prioridade Média)
```typescript
const kpis = await reportsQueries.getKPIsPeriodo('2025-10-01', '2025-10-31');
const trocas = await reportsQueries.getRelatorioTrocas('2025-10-01', '2025-10-31');
const produtividade = await reportsQueries.getRelatorioProdutividadeFazendas('2025-10-01', '2025-10-31');
```

**Benefícios:**
- Relatórios com datas flexíveis
- Agregações calculadas
- Dados históricos reais

---

## 🎯 Mapeamento de Campos

### Fazendas
| Mock Data | Banco Real | Transformação |
|-----------|------------|---------------|
| `produtividade` | `produtividade` | Direto |
| `distancia_km` | `distancia_fabrica_km` | Renomear |
| `estoque_t` | `estoque_toneladas` | Renomear |
| `janela_ini` | `janela_operacao_inicio` | Renomear |
| `janela_fim` | `janela_operacao_fim` | Renomear |

### Status Operacional
| Mock Data | Banco Real | Fonte |
|-----------|------------|-------|
| `operation_state` | `status` | `status_operacional_fazenda.status` |
| `tpc_dias` | `tpc_dias` | `status_operacional_fazenda.tpc_dias` |
| `colheita_progresso` | Calculado | JOIN com `colheita_corte` |

### Ordens de Carga
| Mock Data | Banco Real | Transformação |
|-----------|------------|---------------|
| `id` | `numero_ordem` | Prefixo "ORD-" |
| `status` | `status` | Direto |
| `volume_t` | `volume_toneladas` | Renomear |

---

## 🛠️ Helpers Úteis

### Converter Produtividade
```typescript
import { mapProdutividade } from '../lib/queries';

const produtividade = mapProdutividade(fazenda.produtividade);
// 'Alta' | 'alta' → 'alta'
```

### Converter Operation State
```typescript
import { mapOperationState } from '../lib/queries';

const state = mapOperationState(
  status_operacional.status,
  status_operacional.flag_ativa
);
// 'colheita', 'COL' → 'colheita'
```

### Calcular TPC
```typescript
import { calcularTPCDias } from '../lib/queries';

const tpcDias = calcularTPCDias(colheita.data_inicio);
// '2025-08-15' → 65 dias
```

---

## 📝 Exemplo Completo: Dashboard

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
        
        // Buscar dados do banco
        const [kpisData, alertasData] = await Promise.all([
          dashboardQueries.getKPIsHoje(),
          dashboardQueries.getAlertasAtivos(5)
        ]);
        
        setKpis(kpisData);
        setAlertas(alertasData);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboard();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard 
          title="Volume Transportado"
          value={`${kpis?.volume_transportado_m3 || 0} m³`}
        />
        <KPICard 
          title="Taxa Utilização"
          value={`${kpis?.taxa_utilizacao_frota || 0}%`}
        />
        <KPICard 
          title="Ordens Hoje"
          value={kpis?.ordens_hoje || 0}
        />
        <KPICard 
          title="Em Andamento"
          value={kpis?.ordens_em_andamento || 0}
        />
      </div>
      
      {/* Alertas */}
      <div className="mt-6">
        <h2>Alertas Ativos</h2>
        {alertas.map(alerta => (
          <div key={alerta.id} className={`alert alert-${alerta.prioridade}`}>
            {alerta.mensagem}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ Checklist de Migração

### Banco de Dados
- [ ] Executar `seed-data.sql` no Supabase
- [ ] Executar `views.sql` no Supabase
- [ ] Verificar dados inseridos
- [ ] Testar queries no SQL Editor

### Código
- [ ] Migrar Dashboard
- [ ] Migrar Mapa Interativo
- [ ] Migrar Ordens de Carga
- [ ] Migrar Planejamento
- [ ] Migrar Relatórios
- [ ] Migrar Fazendas & Módulos
- [ ] Migrar Frota
- [ ] Migrar Cenários

### Testes
- [ ] Testar navegação entre páginas
- [ ] Verificar filtros
- [ ] Testar criação de ordens
- [ ] Validar cálculo de TPC
- [ ] Conferir KPIs
- [ ] Testar modo responsivo

---

## 🚀 Próximos Passos

1. **Execute os scripts SQL:**
   ```bash
   # 1. Vá para Supabase Dashboard → SQL Editor
   # 2. Cole o conteúdo de seed-data.sql
   # 3. Execute (Run)
   # 4. Cole o conteúdo de views.sql
   # 5. Execute (Run)
   ```

2. **Teste as queries:**
   ```sql
   -- Teste básico
   SELECT * FROM vw_fazendas_status LIMIT 5;
   SELECT * FROM vw_kpis_hoje;
   SELECT * FROM vw_ordens_completas WHERE status = 'em_andamento';
   ```

3. **Migre página por página:**
   - Comece pelo Dashboard (mais simples)
   - Continue com Mapa Interativo (mais impactante)
   - Termine com páginas secundárias

4. **Mantenha os mocks como fallback:**
   ```typescript
   try {
     const data = await dashboardQueries.getKPIsHoje();
     return data;
   } catch (error) {
     console.warn('Usando dados mock:', error);
     return mockKPIs;
   }
   ```

---

## 📞 Suporte

- **Documentação Supabase:** https://supabase.com/docs
- **SQL Views:** Ver `/database/views.sql`
- **Tipos TypeScript:** Ver `/lib/database.types.ts`
- **Queries:** Ver `/lib/queries.ts`

**Sistema pronto para integração completa! 🎉**
