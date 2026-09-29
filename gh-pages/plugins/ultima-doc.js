// Descobre, na hora do build, qual página de docs/ foi publicada por último,
// e deixa isso disponível para a home e para a rota /ultima.
//
// "Publicada" = o commit que ADICIONOU o arquivo, seguindo renomeações
// (--follow). A data de última edição não serve: corrigir uma entrada antiga
// não pode transformá-la na "última". Arquivo ainda sem commit conta como o
// mais novo, para o `npm start` já mostrar a doc que está sendo escrita.
//
// Roadmaps ficam de fora: eles têm entrada própria ("Sprints semanais"), e a
// última publicação é a última documentação técnica.
//
// Depende do histórico completo do git no build — o deploy.yml já faz o
// checkout com fetch-depth: 0. Com clone raso, todo arquivo pareceria
// adicionado no mesmo commit.

import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const IGNORAR = new Set(['roadmaps']);

function listarDocs(dir) {
  const out = [];
  for (const entrada of fs.readdirSync(dir, {withFileTypes: true})) {
    if (entrada.name.startsWith('_')) {
      continue;
    }
    const p = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (!IGNORAR.has(entrada.name)) {
        out.push(...listarDocs(p));
      }
    } else if (/\.mdx?$/.test(entrada.name)) {
      out.push(p);
    }
  }
  return out;
}

function frontmatter(texto) {
  const m = texto.match(/^---\n([\s\S]*?)\n---/);
  const campos = {};
  if (!m) {
    return campos;
  }
  for (const linha of m[1].split('\n')) {
    const kv = linha.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      campos[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
    }
  }
  return campos;
}

/** Segundos desde a época do commit que adicionou o arquivo; agora, se não tem commit. */
function dataDePublicacao(arquivo, cwd) {
  try {
    const saida = execFileSync(
      'git',
      ['log', '--follow', '--diff-filter=A', '--format=%ct', '--', arquivo],
      {cwd, encoding: 'utf8'},
    ).trim();
    const linhas = saida.split('\n').filter(Boolean);
    // Com --follow, o commit de criação é o mais antigo da lista.
    return linhas.length ? Number(linhas[linhas.length - 1]) : Date.now() / 1000;
  } catch {
    return Date.now() / 1000;
  }
}

export default function ultimaDoc(context) {
  const docsDir = path.join(context.siteDir, 'docs');

  return {
    name: 'ultima-doc',

    async loadContent() {
      const candidatos = listarDocs(docsDir).map((arquivo) => {
        const fm = frontmatter(fs.readFileSync(arquivo, 'utf8'));
        const rel = path.relative(docsDir, arquivo).replace(/\.mdx?$/, '');
        const permalink = fm.slug
          ? `/docs${fm.slug.startsWith('/') ? fm.slug : `/${fm.slug}`}`
          : `/docs/${rel.split(path.sep).join('/')}`;
        return {
          permalink,
          titulo: fm.sidebar_label || fm.title || rel,
          publicadoEm: dataDePublicacao(arquivo, context.siteDir),
          // Desempate para docs adicionadas no mesmo commit: a de posição
          // maior na sidebar é a que veio depois dentro da frente.
          posicao: Number(fm.sidebar_position) || 0,
        };
      });

      candidatos.sort(
        (a, b) => b.publicadoEm - a.publicadoEm || b.posicao - a.posicao,
      );
      return candidatos[0];
    },

    async contentLoaded({content, actions}) {
      actions.setGlobalData(content);
    },

    getPathsToWatch() {
      return [path.join(docsDir, '**/*.{md,mdx}')];
    },
  };
}
