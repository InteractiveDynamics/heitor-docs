import React from 'react';

/**
 * Roadmap da semana 13–20/jul/2026 · Semana 2 — base de Godot (versão enxuta).
 * Substitui o antigo roadmap "Bloco 5": o foco real da semana virou a fundação
 * de Godot (assistir o material, criar o repositório, conhecer GDScript + o uso
 * de outras linguagens). Portado do HTML "plano da semana — base de Godot" pra
 * estética do site, reutilizando as classes de src/css/roadmap.css (escopo
 * `.roadmap`). Escrito em 1ª pessoa — notas do Heitor pra si mesmo.
 */
export default function RoadmapBaseGodot() {
  return (
    <div className="roadmap">
      {/* hero */}
      <header className="rm-hero">
        <span className="eyebrow">Semana 2 · versão enxuta</span>
        <h1>
          Semana de <span className="accent">base de Godot</span>
        </h1>
        <p className="lede">
          Deixo o rover e o multicorpos de lado por enquanto — aquilo vem lá na
          frente. Esta semana é <b>base de Godot</b>, do jeito que o professor
          pediu: <b>assistir o material</b>, <b>criar o repositório</b> e{' '}
          <b>conhecer a linguagem do Godot</b> e como ela usa outras linguagens.
          Três coisas, sem pressa.
        </p>
      </header>

      {/* 01 · assistir o material */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">01</span>
          <h2>Assistir o material</h2>
        </div>
        <p className="sec-sub">
          Ver os vídeos que o professor mandou <b>e</b> pegar a base do Godot.
          Dica que muda tudo: <b>fazer junto no editor</b> enquanto assisto — não
          só assistir de braços cruzados.
        </p>
        <ul className="checklist">
          <li>
            Assistir na ordem, pausando pra reproduzir cada passo no Godot aberto
            do lado.
          </li>
          <li>
            Se travar num ponto, anotar a dúvida em vez de parar tudo — seguir e
            voltar depois.
          </li>
        </ul>
        <div className="res">
          <a
            href="https://youtu.be/CdPYlj5uZeI"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">Vídeo indicado pelo professor</span>
            <span className="rk">VÍDEO</span>
          </a>
          <a
            href="https://youtu.be/MrIAw980iYg"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">Vídeo indicado pelo professor</span>
            <span className="rk">VÍDEO</span>
          </a>
          <a
            href="https://www.youtube.com/playlist?list=PLiRELyH-yJivTRnpjr0nHeGWncLiMmD2D"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">Playlist indicada pelo professor</span>
            <span className="rk">PLAYLIST</span>
          </a>
          <a
            href="https://vehiclephysics.com"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              Vehicle Physics Pro
              <span className="rd">
                Referência de dinâmica veicular: motor, câmbio, suspensão,
                tração.
              </span>
            </span>
            <span className="rk">DOCS</span>
          </a>
        </div>
      </section>

      {/* 02 · criar o repositório */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">02</span>
          <h2>Criar o repositório</h2>
        </div>
        <p className="sec-sub">
          Colocar o projeto no <b>GitHub</b>. Além de organizar, é a base do
          futuro <b>site de documentação</b> (GitHub Pages) que eu planejo.
        </p>
        <ul className="checklist">
          <li>
            Criar o repo no GitHub (pode ser privado no começo) e escrever um{' '}
            <b>README</b> curto: o que é o projeto e qual é a minha frente.
          </li>
          <li>
            Na criação, escolher o template de <code>.gitignore</code> chamado{' '}
            <b>"Godot"</b> — ele já ignora a pasta <code>.godot/</code> e afins.
          </li>
          <li>
            Fazer o <b>primeiro commit</b> com o projeto do carrinho que eu já
            montei.
          </li>
        </ul>
      </section>

      {/* 03 · a linguagem do Godot */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">03</span>
          <h2>A linguagem do Godot (e as outras)</h2>
        </div>
        <p className="sec-sub">
          Entender o <b>GDScript</b> — a linguagem nativa — e como o Godot deixa
          usar <b>outras linguagens</b>. Esse item conecta direto com o meu tema
          (ver o box abaixo).
        </p>
        <ul className="checklist">
          <li>
            <b>GDScript:</b> parecida com Python, feita pra viver dentro do
            editor. É por onde começar.
          </li>
          <li>
            As duas que me interessam: <b>GDScript</b> e{' '}
            <b>C++ (via GDExtension)</b>.
          </li>
          <li>
            Fazer o "Learn GDScript From Zero" (interativo e gratuito) e dar uma
            lida na página "Other languages" da doc oficial.
          </li>
        </ul>
        <div className="res">
          <a
            href="https://www.gdquest.com/"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              GDQuest — "Learn GDScript From Zero"
              <span className="rd">Curso interativo e gratuito.</span>
            </span>
            <span className="rk">CURSO</span>
          </a>
          <a
            href="https://docs.godotengine.org/en/stable/tutorials/scripting/other_languages.html"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              Godot — "Other languages"
              <span className="rd">GDScript, C#, C++.</span>
            </span>
            <span className="rk">DOC</span>
          </a>
        </div>
      </section>

      {/* fechamento · por que o item 03 importa */}
      <section className="rm-sec">
        <div className="cards">
          <div className="card cyan">
            <h3>Por que o item 03 não é aleatório</h3>
            <div className="kind">a ponte com o meu Tema 1</div>
            <p>
              O <b>GDExtension</b> — o mecanismo que carrega código C++ nativo
              dentro do Godot — é <b>exatamente</b> como a <b>ExoPhysics</b> (que
              é C++) vai se plugar na ExoTerra. Ou seja: entender "como o Godot
              usa outras linguagens" é entender a{' '}
              <b>fundação técnica da integração do meu Tema 1</b>. Não preciso
              dominar agora — só reconhecer o conceito já me deixa à frente.
            </p>
          </div>
        </div>
        <p className="ex-intro" style={{marginBottom: 0}}>
          Sem rover, sem juntas, sem tabelas. Só três tarefas tranquilas pra
          fechar a semana.
        </p>
      </section>
    </div>
  );
}
