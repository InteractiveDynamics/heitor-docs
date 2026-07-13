import React from 'react';

/**
 * Roadmap da semana 13–20/jul/2026 · Semana 2 — foco total no Bloco 5.
 * Portado do HTML "dando andamento no Bloco 5" para a estética do site: mesma
 * paleta (slate/ciano/âmbar) e tipografia. Escopado sob `.roadmap`, reaproveita
 * os componentes de src/css/roadmap.css e as peças novas (flip, firstmove,
 * tbl, deliver) adicionadas lá.
 */
export default function RoadmapBloco5() {
  return (
    <div className="roadmap">
      {/* hero */}
      <header className="rm-hero">
        <span className="eyebrow">Semana 2 · Foco total no Bloco 5</span>
        <h1>
          Dando andamento no <span className="accent">Bloco 5</span>
        </h1>
        <p className="lede">
          Sem tarefas novas do professor esta semana — então dá pra atacar de
          frente o bloco que ficou nebuloso. Este roadmap responde a pergunta
          certa: <b>por onde eu começo, na prática?</b>
        </p>
      </header>

      {/* virada de chave */}
      <section className="rm-sec">
        <div className="flip">
          <span className="lbl">A virada de chave</span>
          <p>
            O Bloco 5 trava porque você está esperando <b>"codar"</b> ele. Mas
            ele é <b>90% lápis e papel</b> (ou diagrama): o primeiro movimento é{' '}
            <b>desenhar e tabelar</b> o veículo como corpos e juntas. O código
            vem depois.
          </p>
          <p>
            E você <b>já começou sem perceber</b>: no Godot, cada roda foi um
            node com config própria. Essa independência — cada roda sendo "sua
            própria coisa" — é a semente do pensamento multicorpos. O Bloco 5 é
            levar isso a sério.
          </p>
        </div>
      </section>

      {/* 01 · primeiro movimento */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">▶</span>
          <h2>Seu primeiro movimento</h2>
        </div>
        <p className="sec-sub">30 minutos, hoje. Reaproveita o que você já tem.</p>
        <div className="firstmove">
          <div className="kick">Inventário da sua própria cena</div>
          <h3>Abra o projeto do carrinho e faça esta lista</h3>
          <ol className="steps">
            <li>
              Liste <b>cada node</b> da cena: chassi + roda dianteira-esq,
              dianteira-dir, traseira-esq, traseira-dir.
            </li>
            <li>
              Pra cada um, escreva:{' '}
              <b>é um corpo de verdade ou um raio (raycast)?</b> No
              VehicleBody3D, a roda é ajudante — não tem massa nem gira como
              corpo.
            </li>
            <li>
              Anote <b>quais parâmetros você setou por roda</b> (suspensão,
              tração, esterço). Essa é a lista do que, no modelo multicorpos,
              vira propriedade de um corpo ou de uma junta.
            </li>
          </ol>
        </div>
      </section>

      {/* 02 · Bloco 5 em 5 movimentos */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">5</span>
          <h2>O Bloco 5 em 5 movimentos</h2>
        </div>
        <p className="sec-sub">
          Do que você já tem até um modelo completo, sem pular etapa.
        </p>
        <div className="spine">
          <div className="stop">
            <div className="code">5.1 · você já pode fazer</div>
            <h3>Inventário do que você tem</h3>
            <p>
              O primeiro movimento acima. Sai com uma tabela: cada node → corpo
              ou raio → configs. Isso mostra <b>o que é "fingido"</b> hoje.
            </p>
          </div>

          <div className="stop">
            <div className="code">5.2 · alfabetização</div>
            <h3>Ler qualquer coisa como corpos + juntas</h3>
            <p>
              Treine o olhar com objetos simples antes do rover: <b>porta</b> = 1
              corpo + junta revoluta; <b>gaveta</b> = junta prismática;{' '}
              <b>roda no eixo</b> = revoluta. A meta é bater o olho num mecanismo
              e enxergar os corpos (o que tem massa) e as juntas (como se ligam,
              quantos graus de liberdade).
            </p>
            <span className="doit">
              → desenhe 3 ou 4 mecanismos do dia a dia como corpos+juntas
            </span>
          </div>

          <div className="stop">
            <div className="code">5.3 · o núcleo</div>
            <h3>Modelar UM canto do rover</h3>
            <p>
              Não modele o rover inteiro ainda. Pegue <b>uma roda + a suspensão
              dela</b> e liste corpos, juntas e forças. É um padrão pequeno e
              repetível. O resultado pronto está logo abaixo.
            </p>
            <span className="doit">
              → preencha a tabela de um canto (modelo pronto na próxima seção)
            </span>
          </div>

          <div className="stop">
            <div className="code">5.4 · escalar</div>
            <h3>Montar o rover inteiro</h3>
            <p>
              Replique o canto (4×, ou 6× se for rocker-bogie) e prenda tudo no
              chassi. Agora conte:{' '}
              <b>quantos corpos, quantas juntas, quantos graus de liberdade</b>.
              Esse diagrama + tabela é o coração do seu entregável.
            </p>
          </div>

          <div className="stop">
            <div className="code">5.5 · aterrissar</div>
            <h3>Mapear no Chrono</h3>
            <p>
              Abra a doc/exemplos do <b>Chrono::Vehicle</b> e encaixe a sua
              tabela nos subsistemas dele: chassi, suspensão, direção,
              driveline/powertrain, roda, pneu. Onde bate, onde ele acrescenta
              nuance. Isso te dá base pra responder ao professor a pendência{' '}
              <b>"do zero vs. sobre lib"</b>.
            </p>
          </div>

          <div className="stop final">
            <div className="code">▲ fim da semana</div>
            <h3>Você tem um modelo, não só intuição</h3>
            <p>
              Sai da semana conseguindo descrever o rover como um sistema
              multicorpos — de papel e amarrado numa referência real.
            </p>
          </div>
        </div>
      </section>

      {/* 03 · como fica o resultado */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">✎</span>
          <h2>Como fica o resultado</h2>
        </div>
        <p className="ex-intro">
          Pra você não começar do zero, aqui está <b>um canto</b> já modelado
          (versão simplificada tipo strut). É exatamente esse formato de tabela
          que você replica no 5.3 e 5.4.
        </p>

        <div className="tbl">
          <div className="cap">Corpos — o que tem massa</div>
          <div className="trow">
            <span className="a">Chassi</span>
            <span className="b">a base de referência a que o canto se prende</span>
          </div>
          <div className="trow">
            <span className="a">Suporte da roda</span>
            <span className="b">
              segura a roda e desliza na suspensão (o "carrier")
            </span>
          </div>
          <div className="trow">
            <span className="a">Roda</span>
            <span className="b">gira e toca o solo</span>
          </div>
        </div>

        <div className="tbl">
          <div className="cap">Juntas — como se ligam</div>
          <div className="trow">
            <span className="a">Suspensão</span>
            <span className="b">
              chassi ↔ suporte · <b>prismática</b> · permite subir e descer
            </span>
          </div>
          <div className="trow">
            <span className="a">Eixo</span>
            <span className="b">
              suporte ↔ roda · <b>revoluta</b> · permite girar
            </span>
          </div>
        </div>

        <div className="tbl cyan">
          <div className="cap">Forças — o que entra em cada ponto</div>
          <div className="trow">
            <span className="a">Mola–amortecedor</span>
            <span className="b">na junta prismática (a suspensão)</span>
          </div>
          <div className="trow">
            <span className="a">Torque do motor</span>
            <span className="b">
              na junta revoluta (é o seu <code>engine_force</code>, agora no
              lugar certo)
            </span>
          </div>
          <div className="trow seam">
            <span className="a">Contato / atrito</span>
            <span className="b">
              na base da roda —{' '}
              <b>
                esta é a fronteira que vira o contrato de API com a ExoPhysics
              </b>
            </span>
          </div>
        </div>

        <p className="ex-intro" style={{marginBottom: 0}}>
          Graus de liberdade do canto em relação ao chassi: <b>2</b> (1
          prismática + 1 revoluta). Um rover de 4 rodas = chassi livre + 4
          cantos.
        </p>
      </section>

      {/* 04 · entregável */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◎</span>
          <h2>O entregável da semana</h2>
        </div>
        <div className="deliver">
          <h3>Um único artefato, em duas partes</h3>
          <ul>
            <li>
              Um <b>diagrama + tabela</b> do rover inteiro como corpos + juntas +
              forças (o resultado do 5.4).
            </li>
            <li>
              Uma <b>nota curta</b> mapeando esse modelo nos subsistemas do
              Chrono::Vehicle (o 5.5).
            </li>
          </ul>
          <p className="payoff">
            Com isso na mão você chega pronto pra <b>duas conversas</b> que já
            estão no seu radar: discutir o <b>contrato de API</b> (o contato
            roda–solo é a fronteira, marcada em azul acima) e opinar no{' '}
            <b>"construir do zero vs. apoiar numa lib"</b>.
          </p>
        </div>
      </section>
    </div>
  );
}
