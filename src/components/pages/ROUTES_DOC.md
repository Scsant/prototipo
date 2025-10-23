# 🗺️ Página de Rotas - Documentação

## 📋 Visão Geral

A página **Rotas** é um sistema interativo de visualização de rotas entre a fábrica Bracell (Lençóis Paulista - SP) e as fazendas operacionais. Mostra o fluxo 24/7 de transporte de madeira com animação em tempo real de caminhões.

**Localização:** `/components/pages/RoutesPage.tsx`  
**Navegação:** Menu principal → "Rotas" (ícone 🗺️ Map)

---

## 🎯 Funcionalidades Principais

### ✅ **1. Visualização Interativa de Rotas**
- Mapa OpenStreetMap/Leaflet
- Animação de caminhões percorrendo as rotas
- Marcadores personalizados para fábrica e fazendas
- Polilinha mostrando rota ida e volta

### ✅ **2. Lista de Fazendas**
- **50 fazendas** geradas automaticamente ao redor da fábrica
- Distâncias realistas: **15km a 120km**
- Busca por nome ou estado
- Seleção interativa com highlight

### ✅ **3. Modo de Visualização**
- **Iframe (padrão)** - Mapa em arquivo HTML separado (`/public/routes-map.html`)

### ✅ **4. Modo Expandido**
- Tela cheia para análise detalhada
- Controles de navegação
- Animação contínua

### ✅ **5. Métricas em Tempo Real**
- Distância da rota (ida)
- Tempo estimado de viagem
- Origem e destino

---

## 🚀 Como Usar

### **Passo 1: Acessar a Página**
1. No menu principal, clique em **"Rotas"**
2. A página carrega com a primeira fazenda selecionada

### **Passo 2: Selecionar Fazenda**
- Use a **barra de busca** para filtrar (ex: "SP", "Fazenda 05")
- Clique em qualquer fazenda da lista
- O mapa abre em overlay (iframe) automaticamente

### **Passo 3: Visualizar Rota**
- Veja a **animação do caminhão** percorrendo a rota
- **Fábrica** (marcador azul) ← → **Fazenda** (marcador verde)
- **Linha azul** mostra o trajeto

### **Passo 4: Expandir / Fechar**
- **"Abrir mapa"** no header ou clicar na fazenda abre o overlay
- **"Voltar para lista"** e **"Fechar"** no overlay saem do modo expandido

---

## 📊 Dados Mockados

### **Fábrica:**
```ts
Localização: Lençóis Paulista - SP
Coordenadas: [-22.5989, -48.8003]
Capacidade: 35.000 m³/dia
```

### **Fazendas (50 geradas automaticamente):**
```ts
{
  id: 'SP-1' até 'SP-50',
  nome: 'Fazenda Operacional 01 - SP',
  estado: 'SP',
  latitude: calculado,
  longitude: calculado,
  distancia_km: 15-120km
}
```

**Algoritmo de Geração:**
- Distribuição **sunflower pattern** (Ângulo 137.508°)
- Raio variável: 15km a 120km
- Distância calculada por Haversine

---

## 🎨 Componentes Visuais

- Marcador Fábrica (azul), Fazendas (verde) e Caminhão (azul claro, animado)
- Polilinha azul #2563eb, espessura 4px, opacidade 90%

---

## 🧮 Algoritmo de Animação

- 200 pontos por trecho (ida/volta), total 400
- 40ms por frame (~25 FPS) → ~16s por ciclo
- Interpolação linear de latitude/longitude

---

## 📐 Haversine

Função `haversineKm(a, b)` retorna distância em km entre dois pontos [lat, lng].

---

## ⏱️ Estimativa de Tempo

`routeTimeMin = round(routeKm * 1.5)` (40 km/h médio com paradas)

---

## 🗂️ Arquitetura de Arquivos

- React: `/components/pages/RoutesPage.tsx`
- Iframe: `/public/routes-map.html`
- Router: `App.tsx` (case 'map')

---

## 📱 Responsividade

- Desktop: Grid `lg:grid-cols-[1fr_380px]` (Mapa + Sidebar)
- Mobile: Sidebar acima, Mapa abaixo (ordens invertidas com `order-*`)

---

## 🚀 Melhorias Futuras

- Integração com Supabase
- Filtros por estado e raio
- Múltiplos caminhões e heatmap
- Rotas alternativas e ETA real

---

**Última atualização:** 20/10/2025

