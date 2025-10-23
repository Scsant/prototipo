
  # Transport Routing Software

  This is a code bundle for Transport Routing Software. The original project is available at https://www.figma.com/design/sAfUZexslWR3LrUn9dGZMG/Transport-Routing-Software.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Environment setup

### Para desenvolvimento (dados mockados)
O projeto funciona perfeitamente sem configuração adicional usando dados mockados.

### Para conectar ao Supabase (opcional)
1. Crie um arquivo `.env` na raiz do projeto
2. Copie o conteúdo do arquivo `env.example`
3. Preencha com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. Reinicie o servidor de desenvolvimento: `npm run dev`

**Nota:** O projeto está configurado para funcionar com dados mockados por padrão, então você pode começar a usar imediatamente sem configuração adicional.
  