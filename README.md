
  # Transport Routing Software

  This is a code bundle for Transport Routing Software. The original project is available at https://www.figma.com/design/sAfUZexslWR3LrUn9dGZMG/Transport-Routing-Software.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Environment setup

This app can connect to Supabase when environment variables are provided. Create a file named `.env.local` in the project root (you can copy from `.env.example`) and fill:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then restart the dev server if it is running.
  