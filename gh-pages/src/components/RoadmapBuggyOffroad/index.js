import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Roadmap da semana 9–16/nov/2026 · Um buggy de verdade.
 *
 * O item 1 da lista do professor (a colisão da roda com o chão) fechou em 3/nov
 * com o carro de rodas de verdade e mola. Esta semana é o item 2: trocar a caixa
 * por um modelo 3D de veículo off-road, com a mesma montagem física por baixo.
 *
 * Reutiliza src/css/roadmap.css (escopo `.roadmap`).
 */
export default function RoadmapBuggyOffroad() {
  const molaHref = useBaseUrl('/docs/multicorpo/roda-com-mola');
  const bogieHref = useBaseUrl('/docs/multicorpo/rocker-bogie');
  const anteriorHref = useBaseUrl('/docs/roadmaps/semana-2026-10-19');

  return (
    <div className="roadmap">
      {/* hero */}
      <header className="rm-hero">
        <div className="countdown">
          <span className="big">1</span>
          <span className="sep mono">·······</span>
          <span className="goal">MODELO OFF-ROAD ESCOLHIDO E ANDANDO NO JOLT</span>
        </div>
        <span className="eyebrow">Semana · 9 nov → 16 nov</span>
        <h1>
          Um buggy <span className="accent">de verdade</span>
        </h1>
        <p className="lede">
          A roda já colide como roda: no <a href={molaHref}>carro com mola</a>{' '}
          ela entra 1,6 cm no degrau e pula a 1,2 m/s, contra 20 cm e 12 m/s do
          raio. Isso fecha o item 1 da lista do professor. Esta semana é o item
          2: trocar a caixa por um <b>modelo 3D de veículo off-road</b>, de
          preferência um buggy, com a <b>mesma montagem física</b> por baixo.
        </p>

        <div className="callout amber" style={{marginTop: 22}}>
          <span className="lbl">◈ o registro honesto</span>
          O <a href={anteriorHref}>roadmap anterior</a>, estendido até 6/nov,
          entregou o carro com mola, a comparação, os vídeos e a correção do
          lumped. A <b>nota de escolha do modelo 3D não saiu</b>: decidi procurar
          os candidatos com calma em vez de escolher às pressas, e ela abre
          esta semana.
        </div>
      </header>

      {/* 01 · o critério */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">★</span>
          <h2>O que o modelo precisa ter</h2>
        </div>
        <p className="sec-sub">
          O modelo é a casca visual. Quem simula continua sendo o{' '}
          <code>car_rig.h</code>: chassi e quatro rodas como corpos, presos por
          junta com mola. Então o modelo serve se der para separar as peças e
          tirar as medidas dele.
        </p>

        <div className="deliv">
          <div className="drow">
            <span className="dn mono">licença</span>
            <span className="dt">
              Uso livre com atribuição (CC0 ou CC-BY), para eu poder mostrar em
              vídeo, no site e em post. Nada de licença "só uso pessoal".
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">rodas soltas</span>
            <span className="dt">
              As quatro rodas como <b>malhas separadas</b> do chassi. Cada uma
              vira o visual de um corpo-roda; roda fundida no chassi não serve.
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">escala real</span>
            <span className="dt">
              Proporções de um veículo de verdade, para eu tirar entre-eixos,
              bitola e raio da roda do próprio modelo, sem inventar número.
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">formato e peso</span>
            <span className="dt">
              glTF/GLB, que o Godot importa direto, ou FBX/OBJ conversível no
              Blender. Polígonos numa faixa que o Godot roda com sobra, porque
              a cena tem três veículos lado a lado.
            </span>
          </div>
        </div>
      </section>

      {/* 02 · a semana */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⇉</span>
          <h2>A semana</h2>
        </div>
        <p className="sec-sub">
          Primeiro escolher, depois vestir o carro, por último medir. A física
          não muda de lugar: o que muda são as medidas e a casca.
        </p>

        <div className="spine">
          <div className="stop seam">
            <div className="code">TER–QUA · 10–11 NOV</div>
            <h3>Procurar e escolher o modelo</h3>
            <ol className="steps">
              <li>
                Levantar candidatos de buggy (e de jipe, como reserva) em
                repositórios de modelos 3D com licença aberta.
              </li>
              <li>
                Para cada um, anotar licença, autor, formato, número de
                polígonos e se as rodas são peças separadas.
              </li>
              <li>
                Abrir os finalistas no Blender: conferir a escala, separar as
                rodas se precisar e exportar em glTF.
              </li>
              <li>
                Escrever a <b>nota de decisão</b>: qual modelo, por quê, e a
                atribuição que vai nos créditos.
              </li>
            </ol>
            <span className="doit">↳ modelo escolhido e nota escrita</span>
          </div>
          <div className="stop">
            <div className="code">QUI · 12 NOV</div>
            <h3>Vestir o carro com o buggy</h3>
            <ol className="steps">
              <li>
                Tirar do modelo o entre-eixos, a bitola, o raio e a largura da
                roda, e levar para o <code>CarParams</code>. Massa e mola de um
                buggy real, com fonte; se não achar, manter as atuais e dizer.
              </li>
              <li>
                Importar no Godot e pendurar as malhas nos nós{' '}
                <code>Chassis</code> e <code>Wheel0..3</code> do{' '}
                <code>JoltCar</code>. O colisor do chassi continua uma caixa,
                por enquanto.
              </li>
              <li>
                Passar o <code>revisor-fisico</code> na montagem com as medidas
                novas, antes de medir.
              </li>
            </ol>
            <span className="doit">↳ o buggy andando no Jolt</span>
          </div>
          <div className="stop final">
            <div className="code">SEX · 13 NOV</div>
            <h3>Medir, gravar e publicar</h3>
            <ol className="steps">
              <li>
                Rodar o degrau com as medidas do buggy (<code>--testers</code>{' '}
                e varredura, 4 e 8 sub-passos, μ = 1 e 0,7) e comparar com o
                carro-caixa.
              </li>
              <li>
                Gravar o buggy no degrau e numa pista com obstáculos.
              </li>
              <li>
                Publicar a entrada com os vídeos embutidos e passar o{' '}
                <code>conferente-de-numeros</code> antes.
              </li>
            </ol>
            <span className="doit">↳ entrada publicada com vídeo</span>
          </div>
        </div>

        <div className="callout" style={{marginTop: 22}}>
          <span className="lbl">◈ pendência pequena que entra junto</span>
          O revisor viu que, no degrau de 0,50 m, o "não sobe" do rocker e do
          bogie pode ser a <b>caixa do chassi batendo na face</b>, e não o
          mecanismo. Conferir no banco e, se for isso, pôr nota de correção na
          entrada do <a href={bogieHref}>bogie</a>.
        </div>
      </section>

      {/* 03 · perguntas */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">?</span>
          <h2>Perguntas para o professor</h2>
        </div>
        <div className="qbox">
          <h3>Para o próximo passo</h3>
          <ul>
            <li>
              O off-road tem que ser algum <b>específico</b>, como um Baja SAE
              de equipe com dados reais de massa e suspensão, ou um buggy com
              proporções plausíveis serve?
            </li>
            <li>
              O limite de subida depende do <b>atrito</b> (μ = 1 sobe 0,50 m,
              μ = 0,7 para em 0,30 m). Que valor eu uso? Isso já é ponte para o
              modelo de solo do Roberto e do Maurício: em que formato ele está,
              e com quem eu falo?
            </li>
            <li>
              O render no Blender é para os vídeos de divulgação, ou também
              precisa sair da simulação?
            </li>
          </ul>
        </div>
      </section>

      {/* 04 · trava de escopo */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">✕</span>
          <h2>Esta semana eu NÃO vou</h2>
        </div>
        <div className="rm-guard">
          <span className="lbl">✕ trava de escopo</span>
          <p className="sub">
            <b>Primeiro o veículo de verdade, depois o terreno.</b> A física
            fica como está; o que muda é o veículo.
          </p>
          <ul>
            <li>Colisor de chassi com a forma do buggy (fica caixa)</li>
            <li>Diferencial ou modelo de pneu</li>
            <li>O modelo de solo e o terreno</li>
            <li>Render no Blender, página do grupo e posts</li>
          </ul>
        </div>
      </section>

      {/* 05 · entregáveis */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">✔</span>
          <h2>O que sai desta sprint</h2>
        </div>
        <div className="deliver">
          <h3>Até sexta, 13 de novembro</h3>
          <ul>
            <li>
              <b>A nota de escolha</b> do modelo off-road, com licença e
              atribuição.
            </li>
            <li>
              <b>O buggy no Godot</b>, com a física do carro com mola e as
              medidas do modelo.
            </li>
            <li>
              <b>A comparação</b> buggy × carro-caixa no degrau, o vídeo e a
              entrada publicada.
            </li>
          </ul>
        </div>
        <p style={{marginTop: 18}}>
          A montagem física que vai por baixo está em{' '}
          <a href={molaHref}>A roda de verdade, com mola</a>.
        </p>
      </section>
    </div>
  );
}
