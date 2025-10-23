# 🚀 Quick Start - Conectar ao Banco Real

## ✅ Seu Banco JÁ TEM TUDO

Você não precisa popular dados! O banco já contém:
- ✅ 500+ fazendas reais da operação
- ✅ Estados, módulos, motoristas, caminhões
- ✅ Ordens de carga e status operacionais
- ✅ Dados históricos e KPIs

---

## ⚡ 3 Passos para Conectar

### 1️⃣ **Criar Views (Opcional mas Recomendado)**
```bash
1. Abra Supabase Dashboard → SQL Editor
2. Cole o conteúdo de /database/views.sql
3. Execute (RUN)
```

Isso cria 8 views que facilitam as queries.

---

### 2️⃣ **Testar Queries**
Execute no SQL Editor para ver seus dados:

```sql
-- Ver total de fazendas por estado
SELECT 
  e.sigla,
  COUNT(f.id) as total
FROM estados e
LEFT JOIN fazendas f ON e.id = f.estado_id
WHERE f.ativo = true
GROUP BY e.sigla;

-- Ver módulos
SELECT tipo, status, COUNT(*) as total
FROM modulos
GROUP BY tipo, status;

-- Ver fazendas com status operacional
SELECT * FROM vw_fazendas_status LIMIT 10;
```

**Resultado esperado:**
```
SP  | 200+
MS  | 150+
GO  | 100+
PR  | 50+
MG  | 30+
```

---

### 3️⃣ **Migrar Primeira Página**
Comece pelo Dashboard:

```typescript
// components/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { dashboardQueries } from '../../lib/queries';

export function Dashboard() {
  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    dashboardQueries.getKPIsHoje()
      .then(setKpis)
      .catch(console.error);
  }, []);

  return (
    <div>
      <KPICard 
        title="Total Fazendas" 
        value={kpis?.total_fazendas || 0} 
      />
      <KPICard 
        title="Em Colheita" 
        value={kpis?.fazendas_colheita || 0} 
      />
      <KPICard 
        title="Carregamento" 
        value={kpis?.fazendas_carregamento || 0} 
      />
    </div>
  );
}
```

---

## 🎯 Queries Disponíveis

Todas em `/lib/queries.ts`:

```typescript
// Dashboard - KPIs e alertas
dashboardQueries.getKPIsHoje()
dashboardQueries.getAlertasAtivos(10)

// Mapa - 500+ fazendas com status
mapQueries.getFazendasComStatus()
mapQueries.getModulosComLocalizacao('colheita')

// Ordens - CRUD completo
ordersQueries.getOrdensHoje()
ordersQueries.criarOrdem(dados)
ordersQueries.atualizarStatusOrdem(id, 'em_andamento')

// Fazendas - Listagem e detalhes
farmsQueries.getFazendas()
farmsQueries.getFazendaById(id)

// Frota - Caminhões e motoristas
fleetQueries.getCaminhoes({ status: 'disponivel' })
fleetQueries.getMotoristas()

// Relatórios - Dados históricos
reportsQueries.getKPIsPeriodo('2025-10-01', '2025-10-31')
reportsQueries.getRelatorioTrocas('2025-10-01', '2025-10-31')
```

---

## 📊 Mapeamento Rápido

### Mock → Banco Real

```typescript
// ANTES (mock)
import { mockFarms } from '../../lib/mock-data';
const farms = mockFarms;

// DEPOIS (banco real)
import { mapQueries } from '../../lib/queries';
const farms = await mapQueries.getFazendasComStatus();

// Mapear para formato da UI (se necessário)
const mapped = farms.map(f => ({
  name: f.nome,
  state: f.estado_sigla,
  lat: f.latitude,
  lng: f.longitude,
  operation_state: f.operation_state || 'idle',
  tpc_dias: f.tpc_dias || 0
}));
```

---

## 🔥 Ordem de Migração Recomendada

1. **Dashboard** (mais simples) ⚡
2. **Mapa Interativo** (mais impacto) 🗺️
3. **Ordens de Carga** (CRUD importante) 📦
4. **Fazendas** (listagem) 🏭
5. **Frota** (gerenciamento) 🚛
6. **Planejamento** (parâmetros) 📊
7. **Relatórios** (análises) 📈
8. **Cenários** (simulações) 🎯

---

## ✅ Checklist

- [ ] Executar views.sql (opcional)
- [ ] Testar queries no SQL Editor
- [ ] Verificar que tem 500+ fazendas
- [ ] Migrar Dashboard
- [ ] Testar no navegador
- [ ] Migrar Mapa Interativo
- [ ] Testar interatividade
- [ ] Continuar outras páginas

---

## 🛠️ Helpers Úteis

```typescript
// Converter status do banco para UI
import { mapOperationState } from '../../lib/queries';

const state = mapOperationState('colheita', 'COL');
// Retorna: 'colheita'

// Converter produtividade
import { mapProdutividade } from '../../lib/queries';

const prod = mapProdutividade('Alta');
// Retorna: 'alta'

// Calcular TPC em dias
import { calcularTPCDias } from '../../lib/queries';

const dias = calcularTPCDias('2025-08-15');
// Retorna: 65
```

---

## 📞 Documentação Completa

- **CONECTAR.md** → Guia completo de integração
- **views.sql** → Criar views otimizadas
- **queries.ts** → Todas as queries prontas
- **database.types.ts** → Tipos TypeScript

**Conecte ao banco real em minutos! 🎉**
