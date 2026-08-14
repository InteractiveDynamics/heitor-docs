import React from 'react';

/**
 * Roadmap da semana 10–17/ago/2026 · Do conceito ao sample rodando.
 * Aterrissa os quatro pontos que saíram da reunião de 10/08 em duas faixas:
 * (A) rodar um sample do Jolt e medir o gap contra o Godot, (B) entender a
 * ponte C++ (GDExtension) espelhando o GDChrono do professor. Entregável-âncora
 * da semana: o comparativo formal Jolt × Godot.
 * Portado do HTML "Do conceito ao sample rodando" pra estética do site,
 * reutilizando src/css/roadmap.css (escopo `.roadmap`). Escrito em 1ª pessoa —
 * notas do Heitor pra si mesmo.
 */
export default function RoadmapJoltSample() {
  return (
    <div className="roadmap">
      {/* hero */}
      <header className="rm-hero">
        <span className="eyebrow">Semana · 10 → 17 ago</span>
        <h1>
          Do conceito ao <span className="accent">sample rodando</span>
        </h1>
        <p className="lede">
          A quinzena anterior fechou o arco conceitual do multicorpo; a reunião de{' '}
          <b>10 de agosto</b> aterrissou isso em quatro tarefas concretas. Esta
          semana é sobre <b>fundamentar a decisão arquitetural</b> com evidência —
          rodar o Jolt de verdade, medir o que o Godot não alcança, e olhar a
          ponte C++ que um dia fecha esse vão. Continua valendo: explorar, não
          construir.
        </p>
      </header>

      {/* 01 · entregável-âncora */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">★</span>
          <h2>O entregável-âncora da semana</h2>
        </div>
        <div className="firstmove">
          <div className="kick">tudo nesta semana existe pra sustentar isto</div>
          <h3>Comparativo formal Jolt × Godot</h3>
          <p>
            O documento <b>feature a feature</b> que fundamenta a decisão
            arquitetural — raycast × juntas × ponte C++. Não é uma opinião sobre
            qual caminho seguir: é a tabela que mostra, item por item, o que o
            Jolt entrega e o que o módulo embutido do Godot 4.6 deixa passar. Todo
            o resto da semana alimenta essa tabela.
          </p>
        </div>
      </section>

      {/* 02 · as duas faixas */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⇉</span>
          <h2>Duas faixas em paralelo</h2>
        </div>
        <p className="sec-sub">
          Os quatro pontos da reunião se agrupam em dois movimentos: primeiro medir
          o limite do Godot na prática, depois olhar o caminho que existe pra
          passar por cima dele.
        </p>
        <div className="cards">
          <div className="card amber">
            <div className="kind">pontos 1 &amp; 2 · seg a qua</div>
            <h3>Faixa A · Provar até onde o Godot vai</h3>
            <p>
              Rodar o Jolt de verdade, mapear o gap feature a feature e testar o
              limite do Godot na prática — replicando no editor o mesmo cenário
              que o sample roda em C++.
            </p>
          </div>
          <div className="card cyan">
            <div className="kind">pontos 3 &amp; 4 · qui e sex</div>
            <h3>Faixa B · A ponte C++ pra além do Godot</h3>
            <p>
              Entender o <b>GDExtension</b> no conceito e espelhar o caminho que o
              professor já trilhou com o Chrono — o molde de como se expõe pro
              Godot algo que o motor não expõe.
            </p>
          </div>
        </div>
      </section>

      {/* 03 · dia a dia */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◷</span>
          <h2>A semana, dia a dia</h2>
        </div>
        <p className="sec-sub">
          Segunda a quarta na faixa A, quinta e sexta na faixa B, e a segunda
          seguinte fecha na reunião.
        </p>

        <div className="spine">
          <div className="stop seam">
            <div className="code">SEG · 10 AGO · ponto 1, parte 1</div>
            <h3>Rodar um sample do Jolt</h3>
            <ol className="steps">
              <li>
                Clonar <code>github.com/jrouwe/JoltPhysics</code>.
              </li>
              <li>
                <b>Atalho sem build:</b> abrir a página de demos web
                (JoltPhysics.js) e passar o olho nos samples — em especial os de{' '}
                <b>Constraints</b> e <b>Vehicle</b> (veículo de esteira com{' '}
                <em>hinge</em>, moto).
              </li>
              <li>
                <b>Nativo:</b> compilar o app <code>Samples</code> (precisa de
                CMake 3.23+; no Windows é o caminho mais direto — usa DirectX; se
                der erro de GPU, ativar "Graphics Tools" nas features opcionais).
                Alternativa mínima: só a pasta <code>HelloWorld</code>.
              </li>
              <li>
                Controles: começa pausado (<b>P</b> despausa),{' '}
                <b>ESC → Select Test</b> / Run All Tests.
              </li>
              <li>
                <b>Escolher O sample-âncora da semana</b> — de preferência um de
                Constraints/Vehicle, que casa direto com o <em>hinge</em> do meu{' '}
                <code>teste_junta</code>.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> sem ver o Jolt rodando, o comparativo vira achismo.
              Fixar o sample <b>agora</b> trava o alvo do resto da semana.
            </p>
            <span className="doit">
              ↳ Jolt clonado + rodando + 1 sample escolhido
            </span>
          </div>

          <div className="stop">
            <div className="code">TER · 11 AGO · ponto 1, parte 2</div>
            <h3>Comparativo feature a feature</h3>
            <ol className="steps">
              <li>
                Pro sample escolhido, listar as features que ele usa: tipo de
                constraint, motor, limites, callbacks, integrador.
              </li>
              <li>
                Pra cada uma, responder: <b>o Jolt expõe?</b> · <b>o módulo Jolt
                embutido do Godot 4.6 expõe?</b> (ex.: <code>VehicleConstraint</code>{' '}
                — o Jolt tem, o Godot não expõe).
              </li>
              <li>
                Montar a tabela:{' '}
                <b>Feature | Jolt | Godot (módulo Jolt) | Observação</b>.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> é literalmente o comparativo formal que saiu da
              reunião — o entregável-âncora tomando forma.
            </p>
            <span className="doit">↳ Rascunho da tabela comparativa</span>
          </div>

          <div className="stop">
            <div className="code">QUA · 12 AGO · ponto 2</div>
            <h3>Replicar o sample no Godot</h3>
            <ol className="steps">
              <li>
                Cena isolada nova (na linha do meu <code>teste_junta.tscn</code>):
                reconstruir o mesmo cenário do sample com nós <code>Joint3D</code>{' '}
                (<code>HingeJoint3D</code> / <code>Generic6DOFJoint3D</code>).
              </li>
              <li>
                Medir: o que reproduz 1:1, o que só dá pra aproximar e{' '}
                <b>onde bate no limite</b> do achado de terça.
              </li>
              <li>Cada limite encontrado volta anotado pra tabela do comparativo.</li>
            </ol>
            <p>
              <b>Porquê:</b> fecha o par <b>achado teórico → prova prática</b>, e
              conecta direto com o <em>hinge</em> que eu já testei na quinzena
              passada.
            </p>
            <span className="doit">
              ↳ Cena Godot replicando o sample + limites anotados
            </span>
          </div>

          <div className="stop">
            <div className="code">QUI · 13 AGO · ponto 3 · estou aqui</div>
            <h3>Ler a doc do GDExtension</h3>
            <ol className="steps">
              <li>
                Ler a doc oficial do <b>godot-cpp</b> (docs.godotengine.org → C++ /
                "GDExtension C++ example") — foco no <b>conceito</b>, não em
                construir uma extensão de produção.
              </li>
              <li>
                Entender as peças: <b>ABI estável</b>, o arquivo{' '}
                <code>.gdextension</code>, <code>compatibility_minimum</code>,{' '}
                <code>godot-cpp</code> + <code>godot-cpp-template</code>.
              </li>
              <li>
                Anotar o essencial: o que é preciso pra{' '}
                <b>expor pro Godot algo que o motor não expõe</b> — é o caminho
                pra, um dia, alcançar a <code>VehicleConstraint</code> do Jolt.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> é a ponte que, no futuro, resolve o gap que o
              comparativo vai apontar. <b>Ler, não implementar.</b>
            </p>
            <span className="doit">↳ Notas de conceito do GDExtension</span>
          </div>

          <div className="stop">
            <div className="code">SEX · 14 AGO · ponto 4</div>
            <h3>Espelhar o GDChrono → Jolt</h3>
            <ol className="steps">
              <li>
                Estudar a GDExtension do professor (<b>GDChrono</b>): como ele liga
                o Godot ao Project Chrono — estrutura, o que expôs, como bindou as
                classes.
              </li>
              <li>
                Traçar o raciocínio equivalente pro Jolt: se fosse um "GDJolt",{' '}
                <b>que classe/constraint</b> eu precisaria expor pra fechar o gap
                do comparativo? (ex.: <code>VehicleConstraint</code>).
              </li>
              <li>
                Não construir — só mapear o paralelo. Mesmo espírito do ponto 2
                ("pegar um sample e replicar"), agora pela via da extensão.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> casa o ponto 2 (replicar) com o ponto 3
              (GDExtension), e mostra o caminho concreto usando um exemplo que{' '}
              <b>já existe dentro do meu grupo</b>.
            </p>
            <span className="doit">
              ↳ Esboço "GDChrono → GDJolt": o que eu espelharia
            </span>
          </div>

          <div className="stop">
            <div className="code">FDS · 15–16 AGO · leve, opcional</div>
            <h3>Consolidar as notas</h3>
            <ol className="steps">
              <li>
                Passar a tabela comparativa e as notas a limpo → rascunho de uma
                entrada nova no dossiê do Docusaurus.
              </li>
              <li>
                Escrever com minhas palavras, a partir do que levantei na semana.
              </li>
            </ol>
            <span className="doit">↳ Rascunho da entrada do dossiê</span>
          </div>

          <div className="stop final">
            <div className="code">SEG · 17 AGO · ▲ reunião</div>
            <h3>Fechamento: o que eu levo</h3>
            <p>
              Os três entregáveis da semana chegam juntos — o comparativo é o que
              importa, os outros dois são a evidência que o sustenta.
            </p>
          </div>
        </div>
      </section>

      {/* 04 · entregáveis */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">↹</span>
          <h2>O que sai desta semana</h2>
        </div>
        <div className="deliver">
          <h3>Pra reunião de 17 de agosto</h3>
          <ul>
            <li>
              <b>Comparativo formal Jolt × Godot</b> — a decisão arquitetural
              fundamentada feature a feature{' '}
              <em>(o entregável-âncora)</em>.
            </li>
            <li>
              <b>Cena Godot replicando o sample</b> — com os limites do módulo Jolt
              anotados onde eu bati na parede.
            </li>
            <li>
              <b>Notas de GDExtension</b> + o esboço do espelhamento GDChrono →
              Jolt.
            </li>
          </ul>
        </div>
      </section>

      {/* 05 · trava de escopo */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⚠</span>
          <h2>Esta semana eu NÃO vou</h2>
        </div>
        <div className="rm-guard">
          <span className="lbl">✕ trava de escopo</span>
          <p className="sub">
            Só os <b>4 pontos da reunião</b>. A semana é sobre fundamentar a
            decisão, não construir.
          </p>
          <ul>
            <li>Montar o rover completo em multicorpo</li>
            <li>Mexer em powertrain ou suspensão</li>
            <li>
              Escrever uma <b>GDExtension de produção</b> (ler a doc, sim)
            </li>
            <li>
              Implementar a <code>VehicleConstraint</code> do Jolt
            </li>
            <li>Trocar ou aposentar o protótipo raycast</li>
          </ul>
        </div>
        <div className="callout">
          <span className="lbl">◈ modo da semana</span>
          <b>Exploratório.</b> Rodar sample, mapear features, ler doc, espelhar
          raciocínio. Os pontos 3 e 4 são <b>leitura e mapeamento</b> — nada de
          extensão de produção.
        </div>
      </section>

      {/* 06 · o que já está no chão */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◉</span>
          <h2>De onde eu parto</h2>
        </div>
        <div className="flip">
          <span className="lbl">◈ o que a quinzena anterior já entregou</span>
          <p>
            O arco conceitual está fechado e publicado em{' '}
            <a href="/docs/multicorpo/constraints-e-jolt">
              Constraints, juntas e o Jolt por dentro
            </a>
            : penalidade × constraint, a tabela de GDL das juntas do Godot, o
            experimento <code>TesteJunta</code> com <code>HingeJoint3D</code> e o
            levantamento das lacunas do módulo Jolt embutido.
          </p>
          <p>
            Ou seja: <b>eu já sei qual é o gap no papel</b>. Esta semana é sobre
            provar esse gap rodando o Jolt de verdade — e transformar o
            levantamento numa tabela que sustenta a decisão.
          </p>
        </div>
      </section>

      {/* 07 · referências */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">↗</span>
          <h2>O que abrir</h2>
        </div>
        <div className="res">
          <a href="https://github.com/jrouwe/JoltPhysics" target="_blank" rel="noopener noreferrer">
            <span className="rt">
              Jolt Physics — repo do jrouwe
              <span className="rd">
                Samples, Constraints, Vehicle e o doc de arquitetura
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Docs/Samples.md"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              Docs/Samples.md — catálogo de demonstrações
              <span className="rd">
                de onde sai o sample-âncora (Constraints e Vehicles)
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a href="https://jrouwe.github.io/JoltPhysics.js/" target="_blank" rel="noopener noreferrer">
            <span className="rt">
              JoltPhysics.js — demos no navegador
              <span className="rd">o atalho sem build pra ver os samples rodando</span>
            </span>
            <span className="rk">↗ web demo</span>
          </a>
          <a
            href="https://docs.godotengine.org/en/stable/tutorials/scripting/gdextension/index.html"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              GDExtension — documentação oficial
              <span className="rd">godot-cpp, .gdextension e a ABI estável (ponto 3)</span>
            </span>
            <span className="rk">↗ godot docs</span>
          </a>
        </div>
      </section>
    </div>
  );
}
