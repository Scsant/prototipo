# 🧠 Geração Inteligente de Cenários - Documentação

## 📋 Visão Geral

A página **"Geração Inteligente de Cenários"** é um sistema avançado que utiliza algoritmos de **Machine Learning** e **Pesquisa Operacional** para gerar cenários otimizados de acordo com diferentes objetivos estratégicos.

**Localização:** `/components/pages/SmartScenariosPage.tsx`  
**Navegação:** Menu principal → "IA Cenários" (ícone 🧠 Brain)

---

## 🎯 Estratégias Disponíveis

### 1️⃣ **Máximo Volume** 🔵
**Objetivo:** Maximizar a chegada de madeira na fábrica

**Algoritmo:**
- Prioriza fazendas de **alta produtividade**
- Identifica fazendas com **alto estoque sem módulo ativo**
- Realoca módulos para áreas estratégicas
- Otimiza rotas para fazendas produtivas

**Métricas Principais:**
- Volume diário estimado: **38.500t** (+10% vs. baseline)
- Trocas de módulos: **2 movimentações**
- Eficiência: **94%**

**Ações Típicas:**
- Mover módulos de fazendas de baixa produtividade para alta
- Criar rotas dedicadas para fazendas com alto estoque
- Aumentar frota em fazendas próximas e produtivas

---

### 2️⃣ **Estoque Alto** 🟡
**Objetivo:** Explorar fazendas críticas quando estoque está alto, reservando fazendas boas para momentos críticos

**Algoritmo:**
- Identifica fazendas de **baixa produtividade com estoque parado**
- Prioriza fazendas com **TPC próximo do limite**
- Reserva fazendas de alta produtividade para emergências
- Distribui 60% da frota para fazendas críticas

**Métricas Principais:**
- Volume diário estimado: **31.200t** (volume reduzido, foco em limpeza)
- Trocas de módulos: **3 movimentações**
- Redução de custo: **+5%** (menos desperdício)

**Ações Típicas:**
- Completar operação em fazendas de baixa produtividade
- Liberar estoque crítico antes do vencimento de TPC
- Reservar fazendas estratégicas para momento de estoque baixo

---

### 3️⃣ **Mínimo Custo** 🟢
**Objetivo:** Minimizar custos operacionais e maximizar lucros

**Algoritmo:**
- Prioriza fazendas **< 100km da fábrica**
- Cria **clusters regionais** para reduzir km rodados
- Minimiza **trocas de módulos** (apenas essenciais)
- Reduz operações em fazendas muito distantes

**Métricas Principais:**
- Volume diário estimado: **33.800t** (balanceado)
- Redução de custo: **+18%** 💰
- Tempo médio de ciclo: **98 minutos** (ciclos curtos)
- Trocas de módulos: **1 movimentação** (mínimo)

**Ações Típicas:**
- Concentrar em fazendas SP < 100km
- Adiar operações em fazendas > 150km
- Criar rotas otimizadas em clusters

**Exemplo de Economia:**
- Mover MOD-CAR-03 de Fazenda Córrego Fundo (92km) para Três Irmãos (52km)
- **Redução:** 40km por viagem = **R$ 18.500/semana**

---

### 4️⃣ **Urgência** 🔴
**Objetivo:** Resposta rápida para demanda crítica da fábrica

**Algoritmo:**
- Ativa **100% da frota** (830 caminhões)
- Prioriza fazendas **< 100km** em **capacidade máxima**
- Movimenta **4 módulos** simultaneamente
- Ciclos curtos mesmo com menor volume por viagem

**Métricas Principais:**
- Volume diário estimado: **42.000t** 🚀 (+20% vs. baseline)
- Trocas de módulos: **4 movimentações** (rápidas)
- Tempo médio de ciclo: **95 minutos** (ultra rápido)
- Eficiência: **96%**

**Ações Típicas:**
- Mobilizar frota total
- Duplicar módulos em fazendas críticas
- Criar turnos estendidos

**Cenário de Uso:**
- Parada inesperada na operação
- Demanda urgente da fábrica
- Recuperação de atrasos

---

### 5️⃣ **Balanceado** 🟣
**Objetivo:** Equilíbrio entre volume, custo e eficiência operacional

**Algoritmo:**
- Pondera **60% fazendas próximas** + **40% estratégicas distantes**
- Usa **programação dinâmica** para otimizar rotas
- Equilibra todos os fatores (α=0.30, β=0.25, γ=0.25, δ=0.20)

**Métricas Principais:**
- Volume diário estimado: **35.000t** (meta exata)
- Redução de custo: **+8%**
- Tempo médio de ciclo: **125 minutos**
- Eficiência: **92%**

**Ações Típicas:**
- Balancear operações entre regiões
- Otimizar sem extremos
- Operação sustentável

**Melhor para:** Operação diária padrão

---

### 6️⃣ **Sustentável** 🟢💚
**Objetivo:** Minimizar emissões de CO₂ e impacto ambiental

**Algoritmo:**
- Prioriza fazendas em **raio de 80km**
- Usa **roteirização verde** (menor pegada de carbono)
- Consolida cargas para **reduzir viagens vazias**
- Evita fazendas > 150km quando possível

**Métricas Principais:**
- Volume diário estimado: **33.500t**
- Redução de custo: **+12%**
- **Economia de CO₂: 45.800 kg/dia** 🌱
- Trocas de módulos: **1 movimentação**

**Ações Típicas:**
- Adiar fazendas muito distantes
- Consolidar operações regionais
- Otimizar rotas por menor emissão

**Impacto Ambiental:**
- Fazenda Progresso (210km) gera **18 ton CO₂/dia**
- Solução: Consolidar com outras fazendas da região

---

## 📊 Estrutura de Resultados

Cada cenário gerado apresenta:

### **1. Métricas Principais**
```typescript
{
  volume_diario_estimado: number;      // Toneladas/dia
  reducao_custo_percent: number;       // % vs. baseline
  trocas_modulos: number;              // Movimentações necessárias
  tempo_medio_ciclo: number;           // Minutos por viagem
  eficiencia_percent: number;          // % de utilização
  co2_economia_kg?: number;            // Economia de CO₂ (opcional)
}
```

### **2. Ações Recomendadas** (Priorizadas)
- **Tipo:** mover_modulo | realocar_frota | priorizar_fazenda | otimizar_rota
- **Impacto:** alto | medio | baixo
- **Prioridade:** 1, 2, 3, 4...

### **3. Fazendas Críticas**
Identifica fazendas que requerem atenção:
- **Problema:** Diagnóstico da situação
- **Solução:** Ação recomendada
- **Ganho Estimado:** Toneladas/dia

### **4. Realocações de Módulos**
Detalhamento completo das movimentações sugeridas:
- Módulo
- Origem → Destino
- Razão da movimentação
- Distância de transporte (km)
- Ganho de volume estimado (t)

### **5. Análise Completa**
- Situação atual de todas as fazendas
- Distribuição de módulos
- Capacidades e estoques

---

## 🔍 Exemplo Prático: Cenário "Máximo Volume"

### **Situação Detectada:**
```
❌ Fazenda Palmital (MS): 15.800t sem módulo ativo
❌ Fazenda Progresso (GO): 18.200t sem cobertura
✅ Fazenda Córrego Fundo: MOD-CAR-03 operando (baixa produtividade)
```

### **Decisão do Algoritmo:**
```
🔄 REALOCAR MOD-CAR-03
   DE: Fazenda Córrego Fundo (baixa produtividade, 3.200t)
   PARA: Fazenda Palmital (alta produtividade, 15.800t)
   
   RAZÃO: Produtividade alta + Estoque crítico
   DISTÂNCIA: 245 km
   GANHO: +4.200t/dia
```

### **Resultado:**
- ✅ Volume diário: **35.000t** → **38.500t** (+10%)
- ✅ Fazenda Palmital ativada (maior ganho)
- ✅ Apenas 2 trocas de módulos necessárias

---

## 💡 Como Usar na Prática

### **Passo 1: Identificar Objetivo**
Qual é a prioridade do momento?
- Estoque baixo? → **Máximo Volume**
- Estoque alto? → **Estoque Alto**
- Orçamento apertado? → **Mínimo Custo**
- Emergência? → **Urgência**
- Operação normal? → **Balanceado**
- Sustentabilidade? → **Sustentável**

### **Passo 2: Gerar Cenário**
1. Acesse "IA Cenários" no menu
2. Clique no card da estratégia desejada
3. Aguarde processamento (1-2 segundos)

### **Passo 3: Analisar Resultados**
Navegue pelas abas:
- **Ações Recomendadas:** O que fazer primeiro
- **Realocações:** Mudanças de módulos
- **Fazendas Críticas:** Pontos de atenção
- **Análise Completa:** Visão geral do sistema

### **Passo 4: Aplicar Cenário**
- Clique em "Aplicar Cenário"
- Sistema atualiza configuração operacional
- Equipes recebem novas instruções

---

## 🧮 Dados Mockados

A página usa **8 fazendas** e **5 módulos mockados** para demonstração:

### **Fazendas:**
1. **Santa Rita (SP)** - 45km, 12.500t, alta produtividade
2. **Boa Vista (SP)** - 78km, 8.300t, média produtividade
3. **Palmital (MS)** - 165km, 15.800t, alta produtividade, SEM MÓDULO
4. **Córrego Fundo (SP)** - 92km, 3.200t, baixa produtividade
5. **Progresso (GO)** - 210km, 18.200t, alta produtividade, SEM MÓDULO
6. **Serra Azul (MG)** - 185km, 4.500t, baixa produtividade, SEM MÓDULO
7. **Três Irmãos (SP)** - 52km, 9.100t, média produtividade
8. **Esperança (PR)** - 195km, 6.700t, baixa produtividade

### **Módulos:**
- MOD-CAR-01: 850t/dia (Santa Rita, SP)
- MOD-CAR-02: 820t/dia (Boa Vista, SP)
- MOD-CAR-03: 780t/dia (Córrego Fundo, SP)
- MOD-CAR-04: 850t/dia (Três Irmãos, SP)
- MOD-CAR-05: 800t/dia (Esperança, PR)

---

## 🚀 Algoritmos Implementados

### **1. Otimização de Volume (Simplex Modificado)**
```typescript
Maximizar: Σ (produtividade[i] × capacidade[j] × distancia_peso[i])
Sujeito a:
  - capacidade_modulo[j] ≥ demanda_fazenda[i]
  - distancia[i] ≤ raio_operacional
  - trocas_modulo ≤ limite_trocas
```

### **2. Minimização de Custo (Algoritmo Húngaro)**
```typescript
Minimizar: Σ (distancia[i] × custo_km + tempo_ciclo[i] × custo_hora)
Sujeito a:
  - volume_total ≥ demanda_fabrica
  - cada_fazenda ≤ 1_modulo
```

### **3. Heurística de Urgência (Greedy Modificado)**
```typescript
Prioridade[i] = (estoque[i] / distancia[i]) × produtividade[i]
Ordenar por prioridade DESC
Alocar módulos até saturação
```

### **4. Programação Dinâmica (Balanceado)**
```typescript
DP[i][j] = max(
  DP[i-1][j],  // Não usar fazenda i
  DP[i-1][j-capacidade[i]] + valor[i]  // Usar fazenda i
)
```

---

## 📈 Comparação de Estratégias

| Estratégia | Volume | Custo | Trocas | Ciclo | Uso |
|-----------|--------|-------|--------|-------|-----|
| **Máximo Volume** | 38.500t 🏆 | -8% ⚠️ | 2 ✅ | 145min | Estoque baixo |
| **Estoque Alto** | 31.200t | +5% ✅ | 3 ⚠️ | 168min | Limpar estoques críticos |
| **Mínimo Custo** | 33.800t | +18% 🏆 | 1 🏆 | 98min 🏆 | Otimizar orçamento |
| **Urgência** | 42.000t 🚀 | -15% ❌ | 4 ❌ | 95min | Emergência |
| **Balanceado** | 35.000t ✅ | +8% ✅ | 2 ✅ | 125min ✅ | Operação diária |
| **Sustentável** | 33.500t | +12% ✅ | 1 🏆 | 108min | Reduzir CO₂ |

**Legenda:**
- 🏆 Melhor métrica
- ✅ Bom desempenho
- ⚠️ Atenção
- ❌ Comprometido (trade-off aceitável)

---

## 🎓 Próximos Passos (Melhorias Futuras)

### **Fase 2: Integração com Banco de Dados**
- [ ] Conectar com Supabase real
- [ ] Buscar fazendas e módulos em tempo real
- [ ] Salvar cenários gerados
- [ ] Histórico de decisões

### **Fase 3: ML Avançado**
- [ ] Modelo de previsão de demanda (LSTM)
- [ ] Clustering de fazendas (K-Means)
- [ ] Otimização evolutiva (Algoritmos Genéticos)
- [ ] Reinforcement Learning para alocação dinâmica

### **Fase 4: Visualizações Avançadas**
- [ ] Gráficos de Gantt para cronograma
- [ ] Mapas de calor de produtividade
- [ ] Simulação de cenários em tempo real
- [ ] Dashboard de comparação lado a lado

---

## 📚 Referências Técnicas

**Código:**
- Página principal: `/components/pages/SmartScenariosPage.tsx`
- Algoritmos de otimização: `/lib/optimizer.ts`
- Navegação: `/components/Navigation.tsx`

**Conceitos:**
- Pesquisa Operacional: Simplex, Algoritmo Húngaro
- Machine Learning: Heurísticas, Greedy, Programação Dinâmica
- Otimização Multiobjetivo: Pareto, Trade-offs

---

**Criado por:** Sistema Bracell de Otimização de Transporte  
**Última atualização:** 20/10/2025  
**Status:** ✅ Implementado com dados mockados
