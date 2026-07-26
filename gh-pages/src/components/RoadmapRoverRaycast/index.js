import React from 'react';

/**
 * Roadmap da semana 20–27/jul/2026 · Rover v0 em raycast, do zero.
 * Refaço o protótipo por raycast tratando o contato com o solo (a "caixa teal"
 * do diagrama) como requisito de projeto: construo primeiro o contrato e o carro
 * em volta dele. Três entregáveis — repo, regra de arquitetura e doc ligando ao
 * Bloco 5. Portado do HTML "Rover v0 em raycast" pra estética do site,
 * reutilizando src/css/roadmap.css (escopo `.roadmap`). Escrito em 1ª pessoa —
 * notas do Heitor pra si mesmo.
 */
export default function RoadmapRoverRaycast() {
  return (
    <div className="roadmap">
      {/* hero */}
      <header className="rm-hero">
        <span className="eyebrow">Semana · 20 – 27 jul</span>
        <h1>
          Rover v0 em <span className="accent">raycast</span>, do zero
        </h1>
        <p className="lede">
          Vou refazer o protótipo por raycast, tratando a <b>caixa teal do
          diagrama</b> — o contato com o solo — como <b>requisito de projeto,
          não consequência</b>. Ou seja: construo o <b>contrato</b> primeiro e o
          carro em volta dele. Três entregáveis, na ordem.
        </p>
      </header>

      {/* 01 · os três entregáveis */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">▤</span>
          <h2>Os três entregáveis</h2>
        </div>
        <div className="deliv">
          <div className="drow">
            <span className="dn">01</span>
            <span className="dt">
              <b>Repo + rover v0 em raycast.</b> Um <code>RigidBody3D</code> com
              quatro <code>RayCast3D</code> nos cantos — sem{' '}
              <code>VehicleBody3D</code>, sem <code>VehicleWheel3D</code>. Cada
              roda calcula três forças e aplica com <code>apply_force</code> no
              ponto de contato. A meta não é um carro bonito andando: é{' '}
              <b>cada força nomeada e isolada</b>.
            </span>
          </div>
          <div className="drow">
            <span className="dn">02</span>
            <span className="dt">
              <b>Uma regra de arquitetura, desde o commit 1.</b> Nenhum raycast
              fora de <code>ground_contact.gd</code>. O resto do veículo só
              enxerga <b>uma função</b> — então trocar pela ExoPhysics depois não
              toca em mais nada.
            </span>
          </div>
          <div className="drow">
            <span className="dn">03</span>
            <span className="dt">
              <b>Uma página de doc ligando ao Bloco 5.</b> O modelo raycast não
              tem junta nenhuma — resolve por <b>força de penalidade</b>.
              Escrever esse mapeamento explicitamente é o que gera a pergunta pro
              professor.
            </span>
          </div>
        </div>
      </section>

      {/* 02 · a semana dia a dia */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◷</span>
          <h2>A semana, dia a dia</h2>
        </div>
        <p className="sec-sub">
          Ritmo calmo: fazer o carro <b>parar em pé</b>, depois <b>andar</b>,
          depois <b>virar</b> — uma força por vez.
        </p>
        <div className="spine">
          <div className="stop seam">
            <div className="code">SEG 20 · fundação</div>
            <h3>Repo, regra e esqueleto</h3>
            <p>
              Preparar o repo. Criar o <code>ground_contact.gd</code> e colar o
              contrato em C++ como comentário já no <b>commit 1</b> (seção
              abaixo). Montar o <code>RigidBody3D</code> + 4{' '}
              <code>RayCast3D</code> nos cantos. A regra "raycast só aqui" nasce
              hoje e vale a semana inteira.
            </p>
          </div>

          <div className="stop">
            <div className="code">TER 21 · força 1</div>
            <h3>Mola–amortecedor (ao longo da normal)</h3>
            <p>
              A suspensão. Com ela o carro <b>senta e para em pé</b> sobre os
              quatro raios. É a força mais densa — vale caprichar aqui.
            </p>
            <a
              className="doit"
              href="https://www.youtube.com/watch?v=9MqmFSn1Rlw"
              target="_blank"
              rel="noopener noreferrer">
              → Octodemy · Parte 1 (Suspensions)
            </a>
          </div>

          <div className="stop">
            <div className="code">QUA 22 · força 2</div>
            <h3>Longitudinal (tração / frenagem)</h3>
            <p>
              Agora o carro <b>anda</b> pra frente e pra trás. Força aplicada no
              ponto de contato, na direção de rolagem da roda.
            </p>
          </div>

          <div className="stop">
            <div className="code">QUI 23 · força 3</div>
            <h3>Atrito lateral (o grip)</h3>
            <p>
              O que impede a derrapagem. Com ela o carro <b>vira</b> sem
              escorregar de lado. Fecha as três forças.
            </p>
          </div>

          <div className="stop seam">
            <div className="code">SEX 24 · integração</div>
            <h3>Juntar e isolar</h3>
            <p>
              As três forças rodando juntas. Conferir o principal: cada uma{' '}
              <b>nomeada e isolada</b>, e <b>nenhum raycast vazou</b> de{' '}
              <code>ground_contact.gd</code> — o veículo só chama{' '}
              <code>query_wheel_contact()</code>.
            </p>
          </div>

          <div className="stop">
            <div className="code">SÁB 25 · entregável 3</div>
            <h3>Doc: raycast ↔ Bloco 5</h3>
            <p>
              Escrever a página mapeando o modelo de <b>força de penalidade</b>{' '}
              na tabela de corpos/juntas (prismática/revoluta). Tabela pronta na
              seção abaixo.
            </p>
          </div>

          <div className="stop">
            <div className="code">DOM 26 · polimento</div>
            <h3>Limpar e fechar</h3>
            <p>
              README, histórico de commits arrumado, contrato revisado no repo,
              doc relida. Dia de folga técnica / buffer.
            </p>
          </div>

          <div className="stop final">
            <div className="code">SEG 27 · ▲ entrega</div>
            <h3>Três entregáveis na mão</h3>
            <p>
              Repo rodando, contrato plantado e o mapeamento escrito — pronto pra
              próxima conversa.
            </p>
          </div>
        </div>
      </section>

      {/* 03 · o contrato */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◈</span>
          <h2>A regra que segura tudo</h2>
        </div>
        <div className="flip">
          <span className="lbl">◈ Entregável 02 · o contrato, desde o commit 1</span>
          <p>
            Todo o contato com o solo mora num único arquivo,{' '}
            <code>ground_contact.gd</code>. O resto do veículo só conhece uma
            função. Quando a <b>ExoPhysics</b> existir, troco a implementação por
            trás dessa função e <b>não toco em mais nada</b>. O contrato final é
            em C++ (a ExoPhysics), mas o <code>ground_contact.gd</code> em
            GDScript já devolve exatamente esse formato desde a v0.
          </p>
          <div className="code-block">
            <div className="fname">// rascunho do contrato — comentário no repo</div>
            <pre>
              <code>
                <span className="kw">struct</span>{' WheelState {\n'}
                {'    Vec3  position, linear_velocity;\n'}
                {'    Quat  orientation;\n'}
                {'    '}<span className="kw">float</span>{' angular_velocity;   '}
                <span className="cm">{'// rotação da roda'}</span>{'\n'}
                {'    '}<span className="kw">float</span>{' radius, width;\n'}
                {'    '}<span className="kw">float</span>{' normal_load_prev;   '}
                <span className="cm">{'// carga do passo anterior'}</span>{'\n'}
                {'};\n\n'}
                <span className="kw">struct</span>{' ContactResult {\n'}
                {'    '}<span className="kw">bool</span>{'  in_contact;\n'}
                {'    Vec3  point, normal;\n'}
                {'    '}<span className="kw">float</span>{' sinkage;            '}
                <span className="cm-hot">{'// afundamento — só com solo deformável'}</span>{'\n'}
                {'    Vec3  force, torque;\n'}
                {'};\n\n'}
                {'ContactResult query_wheel_contact('}<span className="kw">const</span>
                {' WheelState& w, '}<span className="kw">double</span>{' dt);'}
              </code>
            </pre>
          </div>
          <p>
            Detalhe no <code>sinkage</code>: na v0 ele vem <b>sempre zero</b>. É
            a prova de que o contrato já nasceu pensando no solo deformável — e é
            exatamente a peça que a <b>Luana precisa ver</b> pra alinhar o lado
            dela.
          </p>
        </div>
      </section>

      {/* 04 · amarrando no Bloco 5 */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">↹</span>
          <h2>Amarrando no Bloco 5</h2>
        </div>
        <p className="sec-sub">
          O mesmo canto do rover, resolvido de dois jeitos diferentes.
        </p>
        <div className="tbl cyan">
          <div className="cap">No Bloco 5 (multicorpos) → No modelo raycast (v0)</div>
          <div className="trow">
            <div className="a">Suspensão = junta prismática</div>
            <div className="b">força mola–amortecedor ao longo da normal</div>
          </div>
          <div className="trow">
            <div className="a">Giro da roda = junta revoluta</div>
            <div className="b">força longitudinal no ponto de contato</div>
          </div>
          <div className="trow seam">
            <div className="a">Restrição resolvida pelo solver</div>
            <div className="b">força de penalidade (o raio "empurra" de volta)</div>
          </div>
        </div>
        <p className="payoff">
          <b>O ponto da doc:</b> o raycast não tem junta nenhuma — ele chega no
          mesmo resultado por penalidade em vez de restrição. Escrever isso lado
          a lado é o que transforma o Bloco 5 numa <b>pergunta concreta</b> pro
          professor.
        </p>
      </section>
    </div>
  );
}
