# 🚀 Popular Módulos de Carregamento - Bracell

## ⚠️ PROBLEMA IDENTIFICADO
O otimizador precisa de **módulos de carregamento** cadastrados no banco para funcionar.

## 📊 DISTRIBUIÇÃO REAL DOS MÓDULOS

Baseado na operação real da Bracell:
- **8 módulos FIXOS** em São Paulo (principal região produtora)
- **3 módulos MÓVEIS** distribuídos em MS, MG e PR
- **Total: 11 módulos de carregamento**

| Estado | Fixos | Móveis | Total |
|--------|-------|--------|-------|
| SP | 8 | 0 | 8 |
| MS | 0 | 1 | 1 |
| MG | 0 | 1 | 1 |
| PR | 0 | 1 | 1 |
| **Total** | **8** | **3** | **11** |

---

## ✅ SOLUÇÃO RÁPIDA

### Passo 1: Abra o Supabase Dashboard
1. Acesse seu projeto Supabase
2. Vá em **SQL Editor** (ícone de código no menu lateral)

### Passo 2: Cole e Execute o Script Completo

**Opção A - Script Completo (Recomendado)**

Copie todo o conteúdo do arquivo `/database/seed-modulos.sql` e execute no SQL Editor.

**Opção B - Comando Rápido**

Se preferir, execute apenas este comando consolidado:

```sql
-- ============================================
-- POPULAR 11 MÓDULOS DE CARREGAMENTO
-- 8 Fixos em SP + 3 Móveis (MS, MG, PR)
-- ============================================

-- SP 1
INSERT INTO modulos (nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id, capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje, status, ativo, latitude_atual, longitude_atual, horas_operacao)
SELECT 'MC-001 Carregamento SP Leste', 'MC-001', 'carregamento', 'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP'), (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 0 LIMIT 1),
  850, 1, 0, 'operacional', true, -22.5, -48.5, 2400;

-- SP 2
INSERT INTO modulos (nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id, capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje, status, ativo, latitude_atual, longitude_atual, horas_operacao)
SELECT 'MC-002 Carregamento SP Central', 'MC-002', 'carregamento', 'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP'), (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 1 LIMIT 1),
  820, 1, 0, 'operacional', true, -22.3, -48.7, 2200;

-- SP 3
INSERT INTO modulos (nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id, capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje, status, ativo, latitude_atual, longitude_atual, horas_operacao)
SELECT 'MC-003 Carregamento SP Oeste', 'MC-003', 'carregamento', 'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP'), (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 2 LIMIT 1),
  800, 1, 0, 'operacional', true, -22.7, -48.3, 2100;

-- SP 4
INSERT INTO modulos (nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id, capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje, status, ativo, latitude_atual, longitude_atual, horas_operacao)
SELECT 'MC-004 Carregamento SP Norte', 'MC-004', 'carregamento', 'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP'), (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 3 LIMIT 1),
  870, 1, 0, 'operacional', true, -22.1, -48.6, 2500;

-- SP 5
INSERT INTO modulos (nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id, capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje, status, ativo, latitude_atual, longitude_atual, horas_operacao)
SELECT 'MC-005 Carregamento SP Sul', 'MC-005', 'carregamento', 'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP'), (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 4 LIMIT 1),
  830, 1, 0, 'operacional', true, -22.8, -48.4, 2300;

-- SP 6
INSERT INTO modulos (nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id, capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje, status, ativo, latitude_atual, longitude_atual, horas_operacao)
SELECT 'MC-006 Carregamento SP Nordeste', 'MC-006', 'carregamento', 'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP'), (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 5 LIMIT 1),
  810, 1, 0, 'operacional', true, -22.2, -48.8, 2000;

-- SP 7
INSERT INTO modulos (nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id, capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje, status, ativo, latitude_atual, longitude_atual, horas_operacao)
SELECT 'MC-007 Carregamento SP Sudeste', 'MC-007', 'carregamento', 'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP'), (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 6 LIMIT 1),
  840, 1, 0, 'operacional', true, -22.6, -48.2, 2150;

-- SP 8
INSERT INTO modulos (nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id, capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje, status, ativo, latitude_atual, longitude_atual, horas_operacao)
SELECT 'MC-008 Carregamento SP Noroeste', 'MC-008', 'carregamento', 'fixo',
  (SELECT id FROM estados WHERE sigla = 'SP'), (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 7 LIMIT 1),
  860, 1, 0, 'operacional', true, -22.4, -48.9, 2350;

-- MS (MÓVEL)
INSERT INTO modulos (nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id, capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje, status, ativo, latitude_atual, longitude_atual, horas_operacao)
SELECT 'MC-009 Carregamento MS (Móvel)', 'MC-009', 'carregamento', 'movel',
  (SELECT id FROM estados WHERE sigla = 'MS'), (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'MS') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1),
  780, 3, 0, 'operacional', true, -20.5, -54.6, 1800;

-- MG (MÓVEL)
INSERT INTO modulos (nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id, capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje, status, ativo, latitude_atual, longitude_atual, horas_operacao)
SELECT 'MC-010 Carregamento MG (Móvel)', 'MC-010', 'carregamento', 'movel',
  (SELECT id FROM estados WHERE sigla = 'MG'), (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'MG') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1),
  790, 3, 0, 'operacional', true, -19.5, -46.5, 1650;

-- PR (MÓVEL)
INSERT INTO modulos (nome, codigo, tipo, mobilidade, estado_id, fazenda_atual_id, capacidade_diaria_toneladas, limite_trocas_dia, trocas_hoje, status, ativo, latitude_atual, longitude_atual, horas_operacao)
SELECT 'MC-011 Carregamento PR (Móvel)', 'MC-011', 'carregamento', 'movel',
  (SELECT id FROM estados WHERE sigla = 'PR'), (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'PR') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1),
  770, 3, 0, 'operacional', true, -24.3, -50.8, 1500;
```

### Passo 3: Verificar se Funcionou

Execute esta query de verificação:

```sql
SELECT 
  m.codigo,
  m.nome,
  m.mobilidade,
  e.sigla as estado,
  f.nome as fazenda_atual,
  f.estoque_toneladas,
  m.capacidade_diaria_toneladas
FROM modulos m
LEFT JOIN estados e ON m.estado_id = e.id
LEFT JOIN fazendas f ON m.fazenda_atual_id = f.id
WHERE m.tipo = 'carregamento' AND m.ativo = true
ORDER BY m.codigo;
```

**Você deve ver 11 módulos listados!**

### Passo 4: Ver Estatísticas

```sql
SELECT 
  e.sigla as estado,
  m.mobilidade,
  COUNT(*) as total_modulos,
  SUM(m.capacidade_diaria_toneladas) as capacidade_total_dia
FROM modulos m
LEFT JOIN estados e ON m.estado_id = e.id
WHERE m.tipo = 'carregamento' AND m.ativo = true
GROUP BY e.sigla, m.mobilidade
ORDER BY total_modulos DESC;
```

**Resultado esperado:**
| Estado | Mobilidade | Total | Capacidade/Dia |
|--------|------------|-------|----------------|
| SP | fixo | 8 | ~6.680 t |
| MS | movel | 1 | 780 t |
| MG | movel | 1 | 790 t |
| PR | movel | 1 | 770 t |

---

## 🎯 TESTAR O OTIMIZADOR

1. **Volte para a aplicação**
2. **Pressione F5** para recarregar
3. **Vá em Planejamento & Otimização**
4. **Clique em "Gerar Cenários (PO)"**
5. **BOOM!** 🎉 Você verá centenas de cenários sendo gerados!

---

## 🔍 O QUE O OTIMIZADOR VAI FAZER

Com **11 módulos** e **200+ fazendas**, o sistema vai:

1. **Calcular** todas as combinações possíveis
   - Exemplo: 200 fazendas × 11 módulos = **2.200 cenários**

2. **Rankear** por score considerando:
   - ✅ Distância da fazenda até a fábrica (α)
   - ✅ Distância do módulo até a fazenda (β)
   - ✅ Estoque restante na fazenda atual do módulo (γ)
   - ✅ Produtividade da fazenda destino (δ)

3. **Mostrar os melhores cenários** com:
   - Score final (0-100%)
   - Impacto da troca (MÍNIMO/BAIXO/MÉDIO/ALTO)
   - Recomendação (EXCELENTE/BOM/RAZOÁVEL/NÃO RECOMENDADO)
   - Estimativas de viagens, tempo e custo

---

## 📈 EXEMPLO DE USO REAL

**Cenário 1: Priorizando Distância**
- α = 0.5 (alto) → Sistema mostra fazendas próximas da fábrica
- Mesmo que o módulo esteja longe

**Cenário 2: Evitando Trocas**
- γ = 0.7 (alto) → Sistema evita mover módulos com muito estoque
- Só recomenda se o impacto for MÍNIMO

**Cenário 3: Alta Produtividade**
- δ = 0.4 (alto) → Sistema prioriza fazendas produtivas
- Favorece vias pavimentadas e fácil acesso

---

## 🚨 TROUBLESHOOTING

### ❌ "duplicate key violation"
**Causa:** Os módulos já foram inseridos antes  
**Solução:** Ignore o erro ou delete os módulos existentes:
```sql
DELETE FROM modulos WHERE tipo = 'carregamento';
```
Depois execute o script novamente.

### ❌ "Ainda mostra 0 módulos"
**Causa:** O script não executou completamente  
**Solução:** Execute a query de verificação acima para ver quantos módulos existem.

### ❌ "Nenhuma fazenda encontrada"
**Causa:** Não há fazendas com estoque > 0 no estado  
**Solução:** Verifique os dados:
```sql
SELECT estado_id, COUNT(*) 
FROM fazendas 
WHERE ativo = true AND estoque_toneladas > 0 
GROUP BY estado_id;
```

---

## 🎓 ENTENDENDO A DISTRIBUIÇÃO

**Por que 8 em SP e 3 móveis?**

- **SP:** Principal região produtora, concentra a maior parte das fazendas e volume
- **Fixos:** Equipamentos pesados de alta capacidade (800-870 t/dia)
- **Móveis:** Flexibilidade para atender MS, MG e PR conforme demanda
- **GO:** Menos fazendas, atendido por módulos próximos quando necessário

**Capacidade Total:**
- **SP:** 8 módulos × ~830 t/dia = **~6.640 t/dia**
- **Móveis:** 3 módulos × ~780 t/dia = **~2.340 t/dia**
- **TOTAL:** **~8.980 t/dia** de capacidade de carregamento

---

## ✅ CHECKLIST FINAL

- [ ] Script executado no Supabase SQL Editor
- [ ] 11 módulos listados na query de verificação
- [ ] Distribuição: 8 SP + 1 MS + 1 MG + 1 PR
- [ ] Aplicação recarregada (F5)
- [ ] Teste de otimização executado
- [ ] Cenários sendo exibidos corretamente

---

**Sistema pronto para produção! 🚀**
