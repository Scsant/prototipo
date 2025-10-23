# 🔍 Verificar Módulos de Carregamento

## ✅ CORREÇÃO APLICADA

Ajustei as queries para usar os **valores corretos** do schema:

### ❌ Antes (errado):
```typescript
.eq('tipo', 'carregamento')  // minúsculo - NÃO FUNCIONA!
```

### ✅ Agora (correto):
```typescript
.eq('tipo', 'Carregamento')  // Primeira letra maiúscula
.in('status', ['Ativo', 'Pausado'])  // Filtra apenas módulos operacionais
```

---

## 🔍 PASSO 1: Verificar Módulos Existentes

Execute esta query no **Supabase SQL Editor**:

```sql
-- Ver todos os módulos de carregamento
SELECT 
  codigo,
  nome,
  tipo,
  mobilidade,
  status,
  capacidade_diaria_toneladas,
  limite_trocas_dia,
  trocas_hoje,
  ativo,
  fazenda_atual_id
FROM modulos
WHERE tipo = 'Carregamento'
  AND ativo = true
ORDER BY codigo;
```

### 📊 O que esperar:

**Se retornar 0 linhas:**
- ✅ Não há módulos cadastrados ainda
- 👉 Prossiga para o **PASSO 2** e insira módulos

**Se retornar módulos:**
- ✅ Ótimo! Os módulos já existem
- 👉 Vá direto para o **PASSO 3** e teste o otimizador

---

## 📝 PASSO 2: Inserir Módulos (SE NECESSÁRIO)

Se não houver módulos, execute este script:

```sql
-- ============================================
-- INSERIR MÓDULOS DE CARREGAMENTO REAIS
-- Seguindo o schema correto com primeira letra maiúscula
-- ============================================

-- Módulo 1: SP
INSERT INTO modulos (
  codigo, nome, tipo, mobilidade, 
  estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, 
  limite_trocas_dia, trocas_hoje,
  status, ativo,
  latitude_atual, longitude_atual, 
  horas_operacao
)
SELECT 
  'MC-001',
  'MC-001 Carregamento SP Leste',
  'Carregamento',
  'Fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1),
  850,
  1,
  0,
  'Ativo',
  true,
  -22.5,
  -48.5,
  2400
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- Módulo 2: SP
INSERT INTO modulos (
  codigo, nome, tipo, mobilidade, 
  estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, 
  limite_trocas_dia, trocas_hoje,
  status, ativo,
  latitude_atual, longitude_atual, 
  horas_operacao
)
SELECT 
  'MC-002',
  'MC-002 Carregamento SP Central',
  'Carregamento',
  'Fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 1 LIMIT 1),
  820,
  1,
  0,
  'Ativo',
  true,
  -22.3,
  -48.7,
  2200
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- Módulo 3: SP
INSERT INTO modulos (
  codigo, nome, tipo, mobilidade, 
  estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, 
  limite_trocas_dia, trocas_hoje,
  status, ativo,
  latitude_atual, longitude_atual, 
  horas_operacao
)
SELECT 
  'MC-003',
  'MC-003 Carregamento SP Oeste',
  'Carregamento',
  'Fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 2 LIMIT 1),
  800,
  1,
  0,
  'Ativo',
  true,
  -22.7,
  -48.3,
  2100
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- Módulo 4: SP
INSERT INTO modulos (
  codigo, nome, tipo, mobilidade, 
  estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, 
  limite_trocas_dia, trocas_hoje,
  status, ativo,
  latitude_atual, longitude_atual, 
  horas_operacao
)
SELECT 
  'MC-004',
  'MC-004 Carregamento SP Norte',
  'Carregamento',
  'Fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 3 LIMIT 1),
  870,
  1,
  0,
  'Ativo',
  true,
  -22.1,
  -48.6,
  2500
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- Módulo 5: SP
INSERT INTO modulos (
  codigo, nome, tipo, mobilidade, 
  estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, 
  limite_trocas_dia, trocas_hoje,
  status, ativo,
  latitude_atual, longitude_atual, 
  horas_operacao
)
SELECT 
  'MC-005',
  'MC-005 Carregamento SP Sul',
  'Carregamento',
  'Fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 4 LIMIT 1),
  830,
  1,
  0,
  'Ativo',
  true,
  -22.8,
  -48.4,
  2300
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- Módulo 6: SP
INSERT INTO modulos (
  codigo, nome, tipo, mobilidade, 
  estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, 
  limite_trocas_dia, trocas_hoje,
  status, ativo,
  latitude_atual, longitude_atual, 
  horas_operacao
)
SELECT 
  'MC-006',
  'MC-006 Carregamento SP Nordeste',
  'Carregamento',
  'Fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 5 LIMIT 1),
  810,
  1,
  0,
  'Ativo',
  true,
  -22.2,
  -48.8,
  2000
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- Módulo 7: SP
INSERT INTO modulos (
  codigo, nome, tipo, mobilidade, 
  estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, 
  limite_trocas_dia, trocas_hoje,
  status, ativo,
  latitude_atual, longitude_atual, 
  horas_operacao
)
SELECT 
  'MC-007',
  'MC-007 Carregamento SP Sudeste',
  'Carregamento',
  'Fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 6 LIMIT 1),
  840,
  1,
  0,
  'Ativo',
  true,
  -22.6,
  -48.2,
  2150
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- Módulo 8: SP
INSERT INTO modulos (
  codigo, nome, tipo, mobilidade, 
  estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, 
  limite_trocas_dia, trocas_hoje,
  status, ativo,
  latitude_atual, longitude_atual, 
  horas_operacao
)
SELECT 
  'MC-008',
  'MC-008 Carregamento SP Noroeste',
  'Carregamento',
  'Fixo',
  (SELECT id FROM estados WHERE sigla = 'SP' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP') AND ativo = true ORDER BY estoque_toneladas DESC OFFSET 7 LIMIT 1),
  860,
  1,
  0,
  'Ativo',
  true,
  -22.4,
  -48.9,
  2350
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'SP')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'SP'));

-- Módulo 9: MS (MÓVEL)
INSERT INTO modulos (
  codigo, nome, tipo, mobilidade, 
  estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, 
  limite_trocas_dia, trocas_hoje,
  status, ativo,
  latitude_atual, longitude_atual, 
  horas_operacao
)
SELECT 
  'MC-009',
  'MC-009 Carregamento MS (Móvel)',
  'Carregamento',
  'Móvel',
  (SELECT id FROM estados WHERE sigla = 'MS' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'MS') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1),
  780,
  3,
  0,
  'Ativo',
  true,
  -20.5,
  -54.6,
  1800
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'MS')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'MS'));

-- Módulo 10: MG (MÓVEL)
INSERT INTO modulos (
  codigo, nome, tipo, mobilidade, 
  estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, 
  limite_trocas_dia, trocas_hoje,
  status, ativo,
  latitude_atual, longitude_atual, 
  horas_operacao
)
SELECT 
  'MC-010',
  'MC-010 Carregamento MG (Móvel)',
  'Carregamento',
  'Móvel',
  (SELECT id FROM estados WHERE sigla = 'MG' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'MG') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1),
  790,
  3,
  0,
  'Ativo',
  true,
  -19.5,
  -46.5,
  1650
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'MG')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'MG'));

-- Módulo 11: PR (MÓVEL)
INSERT INTO modulos (
  codigo, nome, tipo, mobilidade, 
  estado_id, fazenda_atual_id,
  capacidade_diaria_toneladas, 
  limite_trocas_dia, trocas_hoje,
  status, ativo,
  latitude_atual, longitude_atual, 
  horas_operacao
)
SELECT 
  'MC-011',
  'MC-011 Carregamento PR (Móvel)',
  'Carregamento',
  'Móvel',
  (SELECT id FROM estados WHERE sigla = 'PR' LIMIT 1),
  (SELECT id FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'PR') AND ativo = true ORDER BY estoque_toneladas DESC LIMIT 1),
  770,
  3,
  0,
  'Ativo',
  true,
  -24.3,
  -50.8,
  1500
WHERE EXISTS (SELECT 1 FROM estados WHERE sigla = 'PR')
  AND EXISTS (SELECT 1 FROM fazendas WHERE estado_id = (SELECT id FROM estados WHERE sigla = 'PR'));
```

---

## ✅ PASSO 3: Confirmar Inserção

Execute novamente a query de verificação:

```sql
SELECT 
  codigo,
  nome,
  tipo,
  mobilidade,
  status,
  ativo
FROM modulos
WHERE tipo = 'Carregamento'
  AND ativo = true
ORDER BY codigo;
```

**Resultado esperado:** 11 módulos (MC-001 a MC-011)

---

## 🚀 PASSO 4: Testar o Otimizador

1. **Recarregue a aplicação** (F5)
2. **Vá em Planejamento & Otimização**
3. **Abra o Console** (F12)
4. **Clique em "Gerar Cenários (PO)"**

### 📋 Console Debug - O que você deve ver:

```
Fazendas carregadas: 180 [...]
Módulos carregados: 11 [...]
Processando 180 fazendas e 11 módulos...
Cenários gerados: 1980
```

Se os módulos ainda aparecerem como **0**, verifique:

```sql
-- Debug: Ver exatamente o que está no banco
SELECT tipo, COUNT(*) 
FROM modulos 
WHERE ativo = true 
GROUP BY tipo;
```

---

## 🎯 CHECKLIST FINAL

- [ ] Executei a query de verificação
- [ ] Vi quantos módulos de Carregamento existem
- [ ] Se 0, executei o script de inserção
- [ ] Confirmei que 11 módulos foram inseridos
- [ ] Recarreguei a aplicação (F5)
- [ ] Abri o Console (F12)
- [ ] Cliquei em "Gerar Cenários"
- [ ] Vi "Módulos carregados: 11" no console ✅

---

## 🔑 DIFERENÇAS IMPORTANTES

| Item | ❌ Errado (não funciona) | ✅ Correto |
|------|-------------------------|-----------|
| Tipo | `'carregamento'` | `'Carregamento'` |
| Mobilidade | `'fixo'`, `'movel'` | `'Fixo'`, `'Móvel'` |
| Status | `'ativo'`, `'pausado'` | `'Ativo'`, `'Pausado'` |

**PostgreSQL é case-sensitive com constraints CHECK!**

---

## 💡 PRÓXIMOS PASSOS

Depois que os módulos estiverem funcionando:

1. ✅ Ajustar dados das fazendas (estoque, distâncias)
2. ✅ Calibrar os pesos de otimização (α, β, γ, δ)
3. ✅ Testar cenários reais
4. ✅ Validar recomendações com a operação

---

**Sistema pronto para testes! 🚀**
