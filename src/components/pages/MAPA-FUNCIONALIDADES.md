# 🗺️ Mapa Operacional Avançado - Bracell

## 🎯 Visão Geral

O **Mapa Operacional** é uma visualização em tempo real que mostra todas as **fazendas** e **módulos de trabalho** da Bracell, permitindo gerenciar operações de forma geográfica e estratégica.

---

## ✨ Funcionalidades Principais

### 1. 📍 **Visualização de Fazendas**

**Marcadores coloridos** por produtividade:
- 🟢 **Verde**: Alta produtividade (vias pavimentadas, fácil acesso)
- 🟠 **Laranja**: Média produtividade
- 🔴 **Vermelho**: Baixa produtividade (vias ruins, acesso difícil)

**Informações ao clicar:**
- Nome da fazenda
- Estado (SP, MS, MG, PR, GO)
- Estoque disponível (toneladas)
- Distância até a fábrica (km)
- Nível de produtividade

---

### 2. 🚩 **Módulos de Trabalho com Flags**

**Bandeiras coloridas** para identificar tipo de módulo:

| Tipo | Cor | Descrição |
|------|-----|-----------|
| **Carregamento** | 🔵 Azul | Módulos que carregam madeira nos caminhões |
| **Colheita** | 🟢 Verde | Módulos de corte de eucalipto |
| **Baldeio** | 🟠 Laranja | Módulos de transporte interno na fazenda |

**Informações ao clicar:**
- Código do módulo (ex: MC-001)
- Nome completo
- Tipo e mobilidade (Fixo/Móvel)
- Capacidade diária (toneladas/dia)
- Fazenda atual
- Status (Ativo/Pausado/Manutenção)

**Exemplo visual:**
```
    🚩 ← Flag colorida
    |
    ● ← Base do módulo
  MC-001 ← Código
```

---

### 3. ⭕ **Buffers de Influência**

**Círculos ao redor das fazendas** mostrando raio de atuação de 50km.

**Utilidade:**
- Identificar fazendas próximas entre si
- Planejar movimentação de módulos móveis
- Avaliar cobertura geográfica

**Visual:**
- Círculo pontilhado
- Cor corresponde à produtividade da fazenda
- Transparente (não atrapalha visualização)

---

### 4. 🎛️ **Controle de Camadas (Layers)**

Painel lateral para **ativar/desativar** elementos do mapa:

#### Camadas Disponíveis:

**✅ Fazendas**
- Mostra/oculta marcadores de fazendas
- Sub-legenda: Alta/Média/Baixa produtividade

**✅ Buffers (Raio 50km)**
- Mostra/oculta círculos de influência
- Útil para análise de cobertura

**✅ Módulos de Trabalho**
- Mostra/oculta flags de módulos
- Sub-legenda: Carregamento/Colheita/Baldeio

**🔲 Rotas Ativas** *(planejado)*
- Linhas mostrando caminhões em viagem
- Origem → Destino em tempo real

**🔲 Heatmap** *(planejado)*
- Mapa de calor de demanda/estoque
- Identifica regiões críticas

---

### 5. 🖥️ **Modo Tela Cheia (Fullscreen)**

**Botão "Tela Cheia"** no canto superior direito.

**Ao ativar:**
- Mapa ocupa toda a tela
- Sidebar lateral é ocultada
- Controle de camadas permanece disponível
- Ideal para apresentações e análises detalhadas

**Atalho:** Botão "Minimizar" para voltar ao normal

---

### 6. ℹ️ **Popup de Informações**

**Clique em qualquer elemento** para ver detalhes:

**Para Fazendas:**
```
📍 Fazenda
━━━━━━━━━━━━━━━━━━
Nome: Fazenda Santa Rita
Estado: SP
Estoque: 8.450 ton
Distância Fábrica: 120 km
[ALTA PRODUTIVIDADE]
```

**Para Módulos:**
```
⚙️ Módulo
━━━━━━━━━━━━━━━━━━
Código: MC-003
Nome: MC-003 Carregamento SP Oeste
Tipo: Carregamento
Mobilidade: Fixo
Capacidade: 800 t/dia
━━━━━━━━━━━━━━━━━━
Localização Atual:
Fazenda Boa Vista - SP
[ATIVO]
```

---

### 7. 📊 **Estatísticas em Tempo Real**

**No painel de camadas:**
- Total de fazendas ativas
- Total de módulos operacionais
- Estoque total disponível (toneladas)

**No header do mapa:**
- `200 fazendas • 11 módulos ativos`

---

### 8. 📋 **Sidebar com Listas**

**Quando não está em tela cheia**, mostra sidebar lateral com:

**Seção Módulos:**
- Lista todos os módulos
- Badge colorida por tipo
- Mostra fazenda atual de cada módulo
- Clique para destacar no mapa

**Seção Fazendas:**
- Lista primeiras 20 fazendas
- Badge com estado (SP, MS, etc.)
- Mostra estoque e distância
- Clique para destacar no mapa

---

## 🎨 **Legenda Visual**

### Fazendas (Círculos)
```
🟢 Alta Produtividade    → Vias pavimentadas, fácil acesso
🟠 Média Produtividade   → Acesso razoável
🔴 Baixa Produtividade   → Vias ruins, difícil acesso
```

### Módulos (Flags)
```
🔵 Carregamento          → Carrega caminhões
🟢 Colheita (Corte)      → Corta eucalipto
🟠 Baldeio               → Move toras internamente
```

### Outros Elementos
```
🏭 Fábrica               → Lençóis Paulista (destino final)
⭕ Buffer                → Raio de influência (50km)
```

---

## 🚀 **Como Usar**

### Análise Rápida
1. **Abra o mapa** (menu lateral → Mapa & Rotas)
2. **Ative tela cheia** para melhor visualização
3. **Use camadas** para focar no que importa
4. **Clique nos elementos** para ver detalhes

### Planejamento de Movimentação de Módulos
1. **Ative layers**: Fazendas + Buffers + Módulos
2. **Identifique** fazendas com alto estoque
3. **Veja** quais módulos estão próximos (dentro do buffer)
4. **Planeje** movimentações para otimizar

### Apresentações
1. **Modo tela cheia** + projetor
2. **Ative/desative camadas** conforme o foco da discussão
3. **Clique nos elementos** para mostrar detalhes ao vivo

---

## 📈 **Casos de Uso Reais**

### 1. **Identificar Gargalos**
**Problema:** Fazenda com 15.000 ton de estoque mas nenhum módulo próximo

**Solução:**
- Abrir mapa
- Ativar buffers
- Ver quais módulos móveis podem ser movidos

---

### 2. **Otimizar Rotas de Coleta**
**Problema:** Caminhões viajando 200km quando há fazendas mais próximas

**Solução:**
- Ver no mapa as fazendas mais próximas da fábrica
- Identificar se há módulos disponíveis nelas
- Redirecionar módulos se necessário

---

### 3. **Acompanhamento em Tempo Real**
**Problema:** Gerente precisa saber status de todos os módulos

**Solução:**
- Abrir mapa em tela cheia
- Ver todos os 11 módulos e suas localizações
- Clicar para ver status (Ativo/Pausado/Manutenção)

---

## 🔮 **Próximas Funcionalidades (Roadmap)**

### 🚧 Em Desenvolvimento

**1. Rotas Ativas em Tempo Real**
- Linhas animadas mostrando caminhões em viagem
- Tempo estimado de chegada
- Alertas de atrasos

**2. Heatmap de Demanda**
- Mapa de calor mostrando regiões de alta demanda
- Cores: vermelho (crítico) → verde (ok)

**3. Filtros Avançados**
- Filtrar fazendas por estoque mínimo
- Filtrar módulos por tipo/status
- Buscar por nome/código

**4. Modo Satélite**
- Imagens de satélite reais
- Integração com Google Maps/Mapbox

**5. Medição de Distância**
- Ferramenta para medir distâncias entre pontos
- Útil para planejamento logístico

**6. Exportar Visualização**
- Salvar mapa como imagem PNG
- Exportar dados visíveis como CSV/Excel

---

## 🎓 **Dicas de UX**

### Performance
- **Limite de fazendas visíveis:** Primeiras 40 no mapa (evita lentidão)
- **Sidebar:** Mostra primeiras 20 (scroll para mais)
- **Lazy loading:** Carrega dados apenas quando necessário

### Interatividade
- **Hover nos elementos:** Visual feedback (opacidade)
- **Clique:** Abre popup com informações
- **Botão X:** Fecha popup rapidamente

### Responsividade
- **Desktop:** Mapa 3/4 + Sidebar 1/4
- **Tela cheia:** 100% do viewport
- **Mobile:** *(a ser desenvolvido)* Mapa ocupa tela toda

---

## 🔧 **Configurações Técnicas**

### Dados Carregados
- **Fazendas:** Query `getFazendasParaOtimizacao()` → com estoque > 0
- **Módulos:** Query `getModulosCarregamento()` → tipo = 'Carregamento'

### Atualização
- **Tempo real:** Reload manual (botão refresh planejado)
- **Auto-refresh:** *(planejado)* A cada 30 segundos

### Performance
- **SVG:** Renderização vetorial (escalável sem perda de qualidade)
- **Lazy render:** Apenas elementos visíveis no viewport

---

## 📞 **Suporte**

**Problemas comuns:**

**"Mapa não carrega"**
→ Verifique conexão com Supabase
→ Console do navegador (F12) para erros

**"Não vejo todos os módulos"**
→ Verifique se a camada "Módulos" está ativa
→ Pode haver módulos sem `fazenda_atual_id`

**"Buffers não aparecem"**
→ Ative a camada "Buffers" no painel de controle

---

**Sistema pronto para operação! 🚀**

Para dúvidas ou sugestões: documentação técnica em `/components/pages/AdvancedMapPage.tsx`
