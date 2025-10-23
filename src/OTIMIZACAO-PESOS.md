# 🎯 Sistema de Otimização - Como Funcionam os Pesos

## 📊 Visão Geral do Algoritmo

O sistema usa **4 pesos principais** que são combinados para gerar um **score final** para cada cenário possível de alocação de módulos de carregamento nas fazendas.

---

## ⚖️ Os 4 Pesos de Otimização

### 🔵 **α (Alpha) - Peso da Distância**
**Intervalo:** 0.0 a 1.0  
**O que faz:** Prioriza fazendas **mais próximas da fábrica**

```typescript
// Cálculo do score de distância
scoreDistancia = 1 - normalizar(
  fazenda.distancia_fabrica_km,
  minDistancia,
  maxDistancia
)
```

**Exemplo prático:**
- Fazenda A: 50km da fábrica → `scoreDistancia = 0.9` ✅
- Fazenda B: 200km da fábrica → `scoreDistancia = 0.3` ⚠️

**Quando aumentar α:**
- Quer **minimizar custos de transporte**
- Quer **ciclos de viagem mais rápidos**
- Quer **reduzir emissões de CO₂**

---

### 🟢 **β (Beta) - Peso do Tempo**
**Intervalo:** 0.0 a 1.0  
**O que faz:** Prioriza módulos **mais próximos da fazenda destino**

```typescript
// Cálculo do score de tempo
// Distância entre a posição ATUAL do módulo e a fazenda destino
distModuloFazenda = calcularDistancia(
  modulo.latitude_atual,
  modulo.longitude_atual,
  fazenda.latitude,
  fazenda.longitude
)

scoreTempo = 1 - normalizar(distModuloFazenda, 0, 500)
```

**Exemplo prático:**
- Módulo MOD-CAR-01 está em Fazenda X
- Movê-lo para Fazenda Y (50km) → `scoreTempo = 0.9` ✅
- Movê-lo para Fazenda Z (300km) → `scoreTempo = 0.4` ⚠️

**Quando aumentar β:**
- Quer **minimizar tempo de movimentação de módulos**
- Tem **urgência** em começar a operar
- Quer **evitar longos deslocamentos de equipamento**

---

### 🟡 **γ (Gamma) - Penalidade por Troca de Módulo**
**Intervalo:** 0.0 a 1.0  
**O que faz:** **Penaliza** trocar módulos de fazendas que ainda têm muito estoque

```typescript
// Avaliação do impacto de trocar módulo
function avaliarImpactoTroca(estoqueRestante: number) {
  if (estoqueRestante > 10000) {
    return { impacto: 'ALTO', penalidade: 1.0 }      // Muito ruim trocar
  } else if (estoqueRestante > 5000) {
    return { impacto: 'MÉDIO', penalidade: 0.6 }     // Ruim trocar
  } else if (estoqueRestante > 2000) {
    return { impacto: 'BAIXO', penalidade: 0.3 }     // Ok trocar
  } else {
    return { impacto: 'MÍNIMO', penalidade: 0.1 }    // Ideal trocar
  }
}

scoreTroca = 1 - penalidade
```

**Exemplo prático:**
- Fazenda atual do módulo tem 15.000t restantes → `scoreTroca = 0.0` ❌ (NÃO TROCAR!)
- Fazenda atual do módulo tem 1.500t restantes → `scoreTroca = 0.9` ✅ (OK TROCAR!)

**Quando aumentar γ:**
- Quer **evitar trocas desnecessárias de módulos**
- Quer **completar operações em andamento**
- Quer **minimizar custos operacionais de movimentação**

---

### 🟣 **δ (Delta) - Prioridade de Fazendas Produtivas**
**Intervalo:** 0.0 a 1.0  
**O que faz:** Prioriza fazendas com **alta produtividade**

```typescript
// Score de produtividade
const produtividadeScores = {
  'alta':  1.0,  // Fazendas muito produtivas
  'média': 0.6,  // Fazendas normais
  'baixa': 0.3   // Fazendas pouco produtivas
}

scoreProdutividade = produtividadeScores[fazenda.produtividade]
```

**Exemplo prático:**
- Fazenda Alta Produtividade → `scoreProdutividade = 1.0` ✅
- Fazenda Média Produtividade → `scoreProdutividade = 0.6` 🟡
- Fazenda Baixa Produtividade → `scoreProdutividade = 0.3` ⚠️

**Quando aumentar δ:**
- Quer **maximizar volume de madeira coletado**
- Quer **priorizar áreas estratégicas**
- Quer **melhor retorno sobre investimento**

---

## 🧮 Fórmula Final do Score

```typescript
scoreFinal = 
  (α × scoreDistancia) +
  (β × scoreTempo) +
  (γ × scoreTroca) +
  (δ × scoreProdutividade)
```

### ⚠️ **IMPORTANTE:** A soma dos pesos deve ser 1.0

```typescript
α + β + γ + δ = 1.0
```

**Exemplo de configuração balanceada:**
```typescript
α = 0.30  // 30% - Distância à fábrica
β = 0.25  // 25% - Tempo de movimentação
γ = 0.25  // 25% - Penalidade troca
δ = 0.20  // 20% - Produtividade
// SOMA = 1.00 ✅
```

---

## 📋 Cenários Práticos de Uso

### 🎯 **Cenário 1: Minimizar Custos de Transporte**
**Objetivo:** Reduzir ao máximo km rodados

```typescript
α = 0.50  // PRIORIDADE MÁXIMA: fazendas próximas
β = 0.20  
γ = 0.20  
δ = 0.10  
```

**Resultado esperado:**
- ✅ Fazendas mais próximas da fábrica terão score alto
- ✅ Menor custo por tonelada transportada
- ⚠️ Pode ignorar fazendas produtivas longe

---

### ⚡ **Cenário 2: Maximizar Agilidade Operacional**
**Objetivo:** Começar a operar o mais rápido possível

```typescript
α = 0.15  
β = 0.50  // PRIORIDADE MÁXIMA: módulos próximos
γ = 0.25  
δ = 0.10  
```

**Resultado esperado:**
- ✅ Módulos se movem pouco (já estão perto)
- ✅ Início rápido da operação
- ⚠️ Pode escolher fazendas longe da fábrica

---

### 🔒 **Cenário 3: Evitar Trocas Desnecessárias**
**Objetivo:** Completar operações em andamento

```typescript
α = 0.20  
β = 0.15  
γ = 0.50  // PRIORIDADE MÁXIMA: não trocar módulos
δ = 0.15  
```

**Resultado esperado:**
- ✅ Módulos só trocam se fazenda atual tiver pouco estoque
- ✅ Continuidade operacional
- ⚠️ Pode perder oportunidades melhores

---

### 🏆 **Cenário 4: Maximizar Produtividade**
**Objetivo:** Priorizar fazendas de alto rendimento

```typescript
α = 0.20  
β = 0.15  
γ = 0.20  
δ = 0.45  // PRIORIDADE MÁXIMA: fazendas produtivas
```

**Resultado esperado:**
- ✅ Fazendas de alta produtividade sempre atendidas
- ✅ Máximo volume de madeira
- ⚠️ Pode aumentar custos de transporte

---

### ⚖️ **Cenário 5: Balanceado (PADRÃO RECOMENDADO)**
**Objetivo:** Equilíbrio entre todos os fatores

```typescript
α = 0.30  // Distância
β = 0.25  // Tempo
γ = 0.25  // Penalidade troca
δ = 0.20  // Produtividade
```

**Resultado esperado:**
- ✅ Decisões equilibradas
- ✅ Bom para uso diário
- ✅ Pondera todos os critérios

---

## 📊 Interpretação dos Scores Finais

Após calcular o `scoreFinal`, o sistema classifica automaticamente:

| Score Final | Classificação | Recomendação |
|------------|---------------|--------------|
| **> 0.75** | 🟢 **EXCELENTE** | Altamente recomendado |
| **0.60 - 0.75** | 🔵 **BOM** | Recomendado |
| **0.45 - 0.60** | 🟡 **RAZOÁVEL** | Avaliar com cautela |
| **< 0.45** | 🔴 **NÃO RECOMENDADO** | Evitar |

---

## 🛠️ Como Usar na Prática

### **1. Página de Cenários** (`/components/pages/ScenariosPage.tsx`)

Na interface, você pode:
1. **Criar novo cenário** com sliders para ajustar α, β, γ, δ
2. **Ver score calculado** de cada opção
3. **Comparar cenários** lado a lado
4. **Aplicar cenário vencedor** na operação real

### **2. Código de Otimização** (`/lib/optimizer.ts`)

```typescript
import { gerarCenarios, ParametrosOtimizacao } from './lib/optimizer';

// Definir pesos
const parametros: ParametrosOtimizacao = {
  alpha: 0.30,
  beta: 0.25,
  gamma: 0.25,
  delta: 0.20
};

// Gerar cenários
const cenarios = gerarCenarios(fazendas, modulos, parametros);

// Os cenários já vêm ordenados por score (melhores primeiro)
const melhorCenario = cenarios[0];
```

---

## 💡 Dicas de Uso

### ✅ **Faça:**
- Teste diferentes combinações de pesos
- Compare resultados de cenários diferentes
- Ajuste pesos conforme prioridades do dia/semana
- Use cenário balanceado como baseline

### ❌ **Evite:**
- Deixar todos os pesos muito baixos (< 0.15 cada)
- Colocar apenas 1 peso = 1.0 (ignora outros fatores)
- Esquecer de garantir que α + β + γ + δ = 1.0

---

## 🎓 Exemplo Completo de Decisão

**Situação:** Preciso escolher onde alocar MOD-CAR-03

**Opção A:**
- Fazenda: 80km da fábrica
- Módulo atual: 20km da fazenda destino
- Estoque atual do módulo: 3.000t (impacto BAIXO)
- Produtividade fazenda: ALTA

**Opção B:**
- Fazenda: 150km da fábrica
- Módulo atual: 5km da fazenda destino
- Estoque atual do módulo: 12.000t (impacto ALTO)
- Produtividade fazenda: MÉDIA

**Com pesos balanceados (0.30, 0.25, 0.25, 0.20):**

| Critério | Opção A | Opção B |
|----------|---------|---------|
| Score Distância (α=0.30) | 0.85 × 0.30 = **0.255** | 0.40 × 0.30 = **0.120** |
| Score Tempo (β=0.25) | 0.96 × 0.25 = **0.240** | 0.99 × 0.25 = **0.248** |
| Score Troca (γ=0.25) | 0.70 × 0.25 = **0.175** | 0.00 × 0.25 = **0.000** |
| Score Produtividade (δ=0.20) | 1.00 × 0.20 = **0.200** | 0.60 × 0.20 = **0.120** |
| **SCORE FINAL** | **0.870** 🏆 | **0.488** |

**✅ Vencedor: OPÇÃO A** (score 0.870 - EXCELENTE)

**Motivo:** Apesar da Opção B ter módulo muito próximo, o impacto ALTO de trocar (12.000t restantes) penalizou muito. Opção A tem fazenda mais perto da fábrica, produtividade alta e impacto baixo de troca.

---

## 📚 Referências no Código

- **Algoritmo completo:** `/lib/optimizer.ts`
- **Interface de cenários:** `/components/pages/ScenariosPage.tsx`
- **Consultas ao banco:** `/lib/queries.ts` (scenariosQueries)
- **Tipos TypeScript:** `/lib/database.types.ts`

---

**Criado por:** Sistema Bracell de Otimização de Transporte  
**Última atualização:** 20/10/2025
