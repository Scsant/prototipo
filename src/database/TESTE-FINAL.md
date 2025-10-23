# 🧪 Guia de Testes - Migração Final

## Páginas Migradas Nesta Sessão

### ✅ 1. Cenários & Comparação
### ✅ 2. Relatórios & KPIs  
### ✅ 3. Configurações

---

## 🎯 Teste 1: Página de Cenários

### O que testar:
1. **Carregamento inicial**
   - [ ] Loading spinner aparece enquanto carrega
   - [ ] Lista de cenários carrega do Supabase
   - [ ] Se não houver cenários, mostra mensagem amigável

2. **Listagem de cenários**
   - [ ] Cenários são ordenados por score (melhor primeiro)
   - [ ] Badge "MELHOR OPÇÃO" aparece no melhor cenário
   - [ ] Badge "APLICADO" aparece no cenário ativo
   - [ ] Award icon (troféu) aparece no melhor cenário
   - [ ] Parâmetros α, β, γ, δ são exibidos
   - [ ] Data de criação está formatada em português

3. **KPIs dos cenários**
   - [ ] Demanda atendida em toneladas
   - [ ] Percentual de atendimento calculado
   - [ ] Trocas de módulo com indicador (verde se ≤4)
   - [ ] KM total formatado com separador de milhares
   - [ ] Tempo médio de ciclo em minutos

4. **Ações**
   - [ ] Botão "Aplicar" funciona e marca cenário como aplicado
   - [ ] Botão duplicar (Copy) cria uma cópia
   - [ ] Botão deletar (Trash) remove o cenário
   - [ ] Confirmação antes de deletar
   - [ ] Toast de sucesso após cada ação

5. **Tabelas de comparação**
   - [ ] Tabela detalhada mostra todos cenários
   - [ ] Cálculo de custo estimado (R$)
   - [ ] Score calculado e exibido
   - [ ] Tabela de parâmetros mostra α, β, γ, δ
   - [ ] γ ≥ 0.35 aparece em verde

### Como testar:
```bash
1. Navegue para "Cenários & Comparação" no menu
2. Aguarde o carregamento
3. Clique em "Aplicar" em um cenário
4. Clique em "Copy" para duplicar
5. Clique em "Trash" para deletar (confirme)
6. Verifique as tabelas de comparação
```

---

## 📊 Teste 2: Página de Relatórios

### O que testar:
1. **Carregamento inicial**
   - [ ] Loading spinner durante carregamento
   - [ ] Dados carregados da última semana
   - [ ] Cards de resumo com KPIs calculados

2. **Cards de Resumo (4 cards)**
   - [ ] Média de Atendimento (%)
   - [ ] Média de Trocas/Dia (com meta ≤3)
   - [ ] KM Médio/Dia
   - [ ] Custo Médio/t (R$)

3. **Aba "Atendimento Demanda"**
   - [ ] Gráfico de barras (meta vs real)
   - [ ] Dados dos últimos 7 dias
   - [ ] Eixo Y em m³
   - [ ] Gráfico de linha (consumo por hora)
   - [ ] Tooltip ao passar mouse

4. **Aba "Trocas de Módulo"**
   - [ ] Gráfico de barras por dia
   - [ ] Card "Análise de Impacto":
     - Total de trocas na semana
     - Meta semanal (≤21)
     - Impacto em produtividade (% calculado)
   - [ ] Card "Recomendações":
     - Mensagem verde se dentro da meta
     - Sugestões em amarelo se acima da meta

5. **Aba "Uso de Frota"**
   - [ ] Gráfico de pizza (Em Uso, Disponível, Manutenção)
   - [ ] Cores corretas (verde, azul, amarelo)
   - [ ] Card "Métricas de Frota":
     - Taxa de utilização com barra de progresso
     - Caminhões ativos
     - Em viagem
     - Motoristas disponíveis

6. **Aba "Produtividade"**
   - [ ] Gráfico de barras horizontal por fazenda
   - [ ] Top 5 fazendas
   - [ ] Cards de resumo:
     - Total de fazendas ativas
     - Produção total (m³)
     - Viagens totais
     - Produção média
     - m³ por viagem

7. **Sem dados**
   - [ ] Mensagem amigável quando não há dados
   - [ ] Card vazio não quebra o layout

### Como testar:
```bash
1. Navegue para "Relatórios & KPIs"
2. Verifique os 4 cards de resumo
3. Teste cada aba (4 abas no total)
4. Passe o mouse nos gráficos (tooltip)
5. Verifique os cards de métricas
```

---

## ⚙️ Teste 3: Página de Configurações

### O que testar:
1. **Carregamento inicial**
   - [ ] Loading spinner ao buscar parâmetros
   - [ ] Parâmetros carregados do Supabase
   - [ ] Valores dos sliders corretos

2. **Aba "Otimização"**
   - [ ] **Sliders de Pesos**:
     - [ ] α - Peso Distância (0.00 a 1.00)
     - [ ] β - Peso Tempo (0.00 a 1.00)
     - [ ] γ - Penalidade Troca (0.00 a 1.00)
     - [ ] δ - Prioridade Fazenda (0.00 a 1.00)
     - [ ] Valores atualizados em tempo real
   
   - [ ] **Inputs de Demanda**:
     - [ ] Demanda Diária (toneladas)
     - [ ] Meta Toneladas/Hora
   
   - [ ] **Botão Salvar**:
     - [ ] Mostra "Salvando..." com spinner
     - [ ] Toast de sucesso após salvar
     - [ ] Dados persistidos no Supabase
   
   - [ ] **Card "Limites e Restrições"**:
     - [ ] 4 inputs numéricos (trocas, jornada, carregamento, descarga)
     - [ ] Botão "Salvar Limites" funciona
   
   - [ ] **Card "Custos Operacionais"**:
     - [ ] Custo por KM (R$)
     - [ ] Custo por Hora (R$)
     - [ ] Botão "Salvar Custos" funciona

3. **Aba "Supabase"**
   - [ ] Badge verde "Conectado ao Supabase"
   - [ ] URL do Supabase exibida
   - [ ] Anon Key mascarada (password)
   - [ ] **17 Tabelas** listadas com dot verde
   - [ ] **8 Views SQL** listadas com dot azul
   - [ ] Status da integração atualizado

4. **Aba "Notificações"**
   - [ ] 4 switches de preferências:
     - Plano Gerado
     - Limite Excedido
     - Rota Bloqueada
     - Manutenção de Frota
   - [ ] Switches funcionam (on/off)
   - [ ] Botão "Salvar Preferências" funciona

5. **Aba "Usuário"**
   - [ ] Avatar com ícone de usuário
   - [ ] Informações do usuário:
     - Nome
     - Email
     - Função (disabled)
     - Unidade (disabled)
   - [ ] Botão "Salvar Informações"

### Como testar:
```bash
1. Navegue para "Configurações"
2. Teste os sliders (arraste e veja valor mudar)
3. Altere os valores de demanda
4. Clique em "Salvar Parâmetros Padrão"
5. Vá para aba "Supabase"
6. Conte as tabelas (17) e views (8)
7. Teste os switches em "Notificações"
8. Edite nome em "Usuário"
```

---

## 🔍 Validações Importantes

### Integração com Supabase
- [ ] Queries não retornam erro 404
- [ ] Loading states funcionam
- [ ] Dados são salvos corretamente
- [ ] Dados são carregados na próxima visita

### Toast Notifications
- [ ] Toast aparece após salvar
- [ ] Toast aparece após aplicar cenário
- [ ] Toast aparece após deletar
- [ ] Toast aparece em caso de erro
- [ ] Toast desaparece automaticamente

### Tratamento de Erros
- [ ] Erro não quebra a página
- [ ] Mensagem de erro amigável
- [ ] Console.error mostra detalhes técnicos
- [ ] Estado vazio não causa crash

### Performance
- [ ] Página carrega em < 2 segundos
- [ ] Gráficos renderizam suavemente
- [ ] Filtros respondem rapidamente
- [ ] Sem memory leaks (console limpo)

---

## 📋 Checklist de Regressão

### Páginas Anteriores (não quebrou?)
- [ ] Dashboard continua funcionando
- [ ] Planejamento continua funcionando
- [ ] Mapa continua funcionando
- [ ] Mapa Interativo continua funcionando
- [ ] Ordens continua funcionando
- [ ] Fazendas continua funcionando
- [ ] Frota continua funcionando

### Navegação
- [ ] Menu lateral funciona
- [ ] Todas as páginas acessíveis
- [ ] Landing page → Dashboard funciona

---

## 🐛 Bugs Conhecidos (se houver)

_Nenhum bug conhecido no momento da entrega._

---

## ✅ Critérios de Aceitação

Para considerar a migração bem-sucedida, TODOS os itens devem estar ✅:

1. [ ] Todas as 3 páginas carregam sem erro
2. [ ] Dados são carregados do Supabase (não mock)
3. [ ] Loading states funcionam
4. [ ] Salvamento persiste dados
5. [ ] Toast notifications aparecem
6. [ ] Gráficos renderizam corretamente
7. [ ] Filtros e ações funcionam
8. [ ] Não há crashes ou erros no console
9. [ ] Layout responsivo funciona
10. [ ] Performance aceitável (< 3s load)

---

## 🚀 Como Executar os Testes

### Teste Manual Completo (20 minutos)
```bash
# 1. Cenários (5 min)
- Abrir página
- Testar 3 ações (aplicar, duplicar, deletar)
- Verificar tabelas

# 2. Relatórios (10 min)
- Abrir página
- Testar 4 abas
- Verificar todos os gráficos
- Passar mouse nos tooltips

# 3. Configurações (5 min)
- Abrir página
- Testar 4 abas
- Salvar parâmetros
- Verificar persistência
```

### Teste Rápido (5 minutos)
```bash
1. Cenários: Abrir e aplicar um cenário
2. Relatórios: Verificar os 4 cards de resumo
3. Configurações: Mover um slider e salvar
4. ✅ Se tudo funcionar = SUCESSO
```

---

## 📊 Resultados Esperados

Ao final dos testes, você deve ver:

### ✅ Cenários
- Lista de cenários ordenada
- Ações funcionando
- Toasts de sucesso

### ✅ Relatórios
- 4 cards com KPIs
- 4 abas com gráficos
- Dados da última semana

### ✅ Configurações
- Parâmetros carregados
- Salvamento funcionando
- Status Supabase verde

---

## 🎉 Status Final

Após completar todos os testes:

- **Cenários**: ⬜ Passou / ⬜ Falhou
- **Relatórios**: ⬜ Passou / ⬜ Falhou
- **Configurações**: ⬜ Passou / ⬜ Falhou

**Resultado Geral**: ⬜ APROVADO / ⬜ PRECISA AJUSTES

---

**Data do Teste**: _______________  
**Testador**: _______________  
**Ambiente**: Produção / Desenvolvimento  
