# pibic-docs

Documentação do meu projeto de Iniciação Científica (PIBIC), construída com
[Docusaurus](https://docusaurus.io/) e publicada no GitHub Pages.

🔗 **Site:** https://heitorm50.github.io/pibic-docs/

## Como editar

O conteúdo fica em Markdown:

- `docs/` — páginas da documentação (visão geral, metodologia, resultados...).
- `blog/` — posts do diário de bordo (nome do arquivo: `AAAA-MM-DD-titulo.md`).

Edite os arquivos, faça `git push` na branch `main` e o
[GitHub Actions](.github/workflows/deploy.yml) reconstrói e publica o site
automaticamente.

## Rodar localmente

```bash
npm install     # instala as dependências (só na primeira vez)
npm start       # servidor de desenvolvimento em http://localhost:3000
npm run build   # gera o site estático em build/
```
