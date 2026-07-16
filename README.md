# Power Apps + React Starter

Este workspace foi preparado em `2026-07-14` para começar com Power Apps Component Framework (PCF) usando React.

## O que já está pronto

- `src/ReactStarter`: componente PCF React gerado com `pac pcf init -fw react`
- `solution`: solution Dataverse com referência para o componente
- `.tools/pac`: Power Platform CLI extraído localmente
- `.vscode/extensions.json`: recomendações de extensões para este projeto

## Stack validada localmente

- Node.js `v22.14.0`
- npm `11.18.0`
- .NET SDK `10.0.302`
- .NET SDK `8.0.414`
- VS Code `1.127.0`

## Comandos principais

Autenticar no ambiente Power Platform:

```powershell
.\scripts\pac.ps1 auth create
```

Rodar o test harness do componente:

```powershell
cd .\src\ReactStarter
npm start
```

Gerar o bundle do componente:

```powershell
cd .\src\ReactStarter
npm run build
```

Gerar a solution para import no Power Apps:

```powershell
dotnet build .\solution\solution.cdsproj
```

O zip gerado fica em:

```text
solution\bin\Debug\solution.zip
```

Fazer push direto para um ambiente de desenvolvimento:

```powershell
cd .\src\ReactStarter
..\..\scripts\pac.ps1 pcf push --publisher-prefix pal
```

## Fluxo recomendado

1. Faça login com `.\scripts\pac.ps1 auth create`.
2. Desenvolva e teste com `npm start`.
3. Gere a solution com `dotnet build .\solution\solution.cdsproj`.
4. Importe `solution\bin\Debug\solution.zip` no Power Apps / Dataverse.
5. Adicione o componente no app dentro do Power Apps Studio.

## Observação importante

Este setup usa PCF + React, que hoje é o caminho oficial e estável para componentes com React em Power Apps. O grupo `pac code` existe, mas continua como `Preview` na documentação oficial; se você quiser, no próximo passo eu também posso montar um exemplo usando esse fluxo novo.
