import React from 'react';

/**
 * Roadmap da quinzena 27/jul – 10/ago/2026 · Rumo ao multicorpo.
 * Sprint carregada: montei o plano pra semana de 27/jul mas não desenvolvi,
 * então estendi o mesmo arco conceitual pelas duas semanas até hoje (10/ago) e
 * dobrei dentro os novos pontos da reunião de hoje — comparar/replicar um sample
 * do Jolt no Godot, ler a doc do GDExtension e espelhar o GDChrono do professor
 * pro Jolt. Norte da quinzena: entender, não construir.
 * Portado do HTML "Rumo ao multicorpo" pra estética do site, reutilizando
 * src/css/roadmap.css (escopo `.roadmap`). Escrito em 1ª pessoa — notas do
 * Heitor pra si mesmo.
 */
export default function RoadmapMulticorpo() {
  return (
    <div className="roadmap">
      {/* hero */}
      <header className="rm-hero">
        <span className="eyebrow">Quinzena · 27 jul – 10 ago</span>
        <h1>
          Rumo ao <span className="accent">multicorpo</span>: constraints, Jolt e
          os limites do Godot
        </h1>
        <p className="lede">
          Montei este roadmap pra semana de <b>27 de julho</b>, mas não cheguei a
          desenvolver — então estico o mesmo arco pelas <b>duas semanas até hoje
          (10 ago)</b> e dobro dentro os pontos novos da reunião de hoje. O norte
          não mudou: <b>entender</b>, não construir. O professor foi explícito —
          devagar.
        </p>
      </header>

      {/* 01 · traduzindo a reunião */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">✎</span>
          <h2>Traduzindo a direção</h2>
        </div>
        <div className="flip">
          <span className="lbl">◈ O que ficou combinado</span>
          <p>
            A pergunta arquitetural que ficou aberta: <b>raycast (força de
            penalidade)</b> vs. <b>multicorpo (juntas e constraints)</b>. A
            direção agora é clara — <b>explorar o caminho multicorpo</b>,
            entendendo como o motor de física do Godot liga corpos rígidos e
            restringe o movimento entre eles.
          </p>
          <p>
            O ponto central: o Godot usa o <b>Jolt Physics</b> por baixo. Então a
            quinzena é sobre três camadas — <b>o conceito</b> (o que é multicorpo
            e constraint), <b>a ferramenta</b> (como o Jolt resolve constraints) e{' '}
            <b>a ponte</b> (o que o Godot me deixa usar do Jolt, e o que fica de
            fora).
          </p>
        </div>
      </section>

      {/* 02 · achado */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◉</span>
          <h2>Achado que já responde uma das perguntas</h2>
        </div>
        <div className="cards">
          <div className="card cyan">
            <div className="kind">Godot ↔ Jolt · paridade</div>
            <p>
              O <b>Godot 4.6 tornou o Jolt o motor de física 3D padrão</b>. Mas a
              documentação oficial marca o módulo Jolt embutido como{' '}
              <b>experimental e sem paridade total</b> com a antiga extensão{' '}
              <code>godot-jolt</code>.
            </p>
            <p>
              Na prática, isso <b>é</b> a "limitação do Godot em relação às
              constraints do Jolt": pela API <code>Joint3D</code> eu acesso os
              tipos padrão de junta, mas <b>não</b> os recursos ricos do Jolt
              (limites suaves, juntas quebráveis, iterações de solver por junta,
              nós tipo <code>JoltHingeJoint3D</code>) — e a{' '}
              <code>VehicleConstraint</code> própria do Jolt não é exposta.
            </p>
          </div>
        </div>
      </section>

      {/* 03 · a sprint semana a semana */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◷</span>
          <h2>A sprint, semana a semana</h2>
        </div>
        <p className="sec-sub">
          O arco de 27/jul esticado nas duas semanas: primeiro o <b>conceito</b>,
          depois a <b>prática mínima</b>, depois o <b>Jolt por dentro</b> — e
          fecha na reunião de hoje, que abre a próxima frente.
        </p>
        <div className="spine">
          <div className="stop seam">
            <div className="code">SEM 1 · 27 jul · conceito</div>
            <h3>O que é "multicorpo" (multibody)</h3>
            <p>
              Definir em uma frase: <b>vários corpos rígidos + juntas que
              restringem o movimento relativo entre eles</b>. Anotar a diferença
              essencial pro raycast — lá <em>eu</em> calculo e aplico forças; aqui{' '}
              <em>eu declaro relações</em> e o solver calcula as forças. Escrever,
              com minhas palavras, por que o <code>VehicleBody3D</code> e o
              raycast já eram "meio multicorpo escondido".
            </p>
          </div>

          <div className="stop">
            <div className="code">SEM 1 · constraints = GDL</div>
            <h3>Constraint = tirar graus de liberdade</h3>
            <p>
              Fixar o conceito de <b>grau de liberdade (GDL)</b>: um corpo rígido
              livre no 3D tem <b>6 GDL</b> (3 translação + 3 rotação). Toda junta é
              "quantos GDL eu removo": a dobradiça deixa só 1 rotação; a prismática
              deixa só 1 translação. Mapear os tipos de junta do Godot (tabela
              abaixo).
            </p>
          </div>

          <div className="stop seam">
            <div className="code">SEM 1 · prática mínima</div>
            <h3>Dois corpos + uma junta no Godot</h3>
            <p>
              Numa cena <b>isolada</b> (não tocar no rover): dois{' '}
              <code>RigidBody3D</code> + um <code>HingeJoint3D</code> ligando eles.
              Confirmar em <em>Project Settings → Physics → 3D</em> que o motor é{' '}
              <b>Jolt</b>. Rodar e só <b>observar</b> o corpo obedecer a restrição
              sem eu aplicar nenhuma força. Uma junta, dois corpos — só isso.
            </p>
          </div>

          <div className="stop">
            <div className="code">SEM 2 · 03 ago · Jolt por dentro</div>
            <h3>Como o Jolt resolve + o que o Godot esconde</h3>
            <p>
              Ler (sem implementar) como o Jolt organiza constraints: um{' '}
              <b>solver de impulsos</b> que, a cada passo, corrige velocidades pra
              manter a restrição — o oposto do "empurrão por penalidade". Explorar
              o repositório (<code>Physics/Constraints</code>,{' '}
              <code>Physics/Vehicle</code>, <code>Samples</code>) e listar o que o
              Godot <b>não</b> expõe do Jolt.
            </p>
          </div>

          <div className="stop">
            <div className="code">SEM 2 · consolidar</div>
            <h3>Mapear pro rover (no papel) + documentar</h3>
            <p>
              <b>Só no papel:</b> qual junta modela cada parte do rover (roda =
              hinge, curso da suspensão = slider, chassi = corpo-mãe). Escrever a
              entrada <code>docs/multicorpo/visao-geral</code> com o que aprendi e
              montar o briefing da quinzena.
            </p>
          </div>

          <div className="stop final">
            <div className="code">SEM 2 · 10 ago · ▲ reunião</div>
            <h3>Nova direção: sample do Jolt → Godot</h3>
            <p>
              A reunião de hoje aterrissou o conceito em tarefas concretas —
              comparar e replicar um sample do Jolt no Godot, ler a doc do
              GDExtension e espelhar o GDChrono do professor pro Jolt. Detalhado na
              próxima seção.
            </p>
          </div>
        </div>
      </section>

      {/* 04 · novos pontos da reunião de hoje */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">＋</span>
          <h2>Novos pontos · reunião de 10 ago</h2>
        </div>
        <div className="firstmove">
          <div className="kick">o que saiu de hoje · próxima frente</div>
          <h3>Do conceito ao sample rodando</h3>
          <ol className="steps">
            <li>
              <b>Comparativo Jolt × Godot.</b> Pegar um dos <code>Samples</code> do
              Jolt, rodar, e mapear feature a feature <b>o que o Jolt tem e o Godot
              não expõe</b>. Vira o comparativo formal que fundamenta a decisão
              arquitetural.
            </li>
            <li>
              <b>Replicar um sample no Godot.</b> Escolher um sample do Jolt e
              tentar reconstruir o mesmo cenário no Godot com os nós{' '}
              <code>Joint3D</code> — medir até onde o Godot chega e onde bate no
              limite do achado acima.
            </li>
            <li>
              <b>Ler a doc do GDExtension.</b> Entender como estender o Godot em
              C++ — é a <b>ponte</b> pra, um dia, expor o que o Jolt tem e o Godot
              esconde (ler a doc, não construir uma extensão de produção).
            </li>
            <li>
              <b>Espelhar o GDChrono do professor pro Jolt.</b> O professor fez uma
              GDExtension ligando o Godot ao <b>Project Chrono</b>; estudar como
              ele fez e fazer o mesmo raciocínio pro <b>Jolt</b>. Casa direto com o
              ponto 2 — é a mesma proposta de pegar um sample e replicar, só que
              pela via da extensão.
            </li>
          </ol>
        </div>
        <div className="callout">
          <span className="lbl">◈ a costura</span>
          <b>GDChrono → Jolt</b> e "replicar um sample" são o mesmo movimento visto
          de dois ângulos: um vai pela API de nós do Godot, o outro pela ponte
          C++. Os dois medem a mesma coisa — o vão entre o que o Jolt entrega e o
          que o Godot deixa alcançar.
        </div>
      </section>

      {/* 05 · trava de escopo */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⚠</span>
          <h2>Esta quinzena eu NÃO vou</h2>
        </div>
        <div className="rm-guard">
          <span className="lbl">✕ trava de escopo</span>
          <p className="sub">
            Porque "explorar" vira "reconstruir tudo" com uma facilidade
            assustadora.
          </p>
          <ul>
            <li>Construir o rover de 4/6 rodas em multicorpo</li>
            <li>Trocar ou aposentar o protótipo raycast</li>
            <li>
              Integrar a ExoPhysics ou mexer no <code>sinkage</code>
            </li>
            <li>
              Escrever uma <b>GDExtension de produção</b> (ler a doc, sim)
            </li>
            <li>
              Implementar a <code>VehicleConstraint</code> do Jolt
            </li>
            <li>Modelar suspensão + direção juntas</li>
          </ul>
        </div>
      </section>

      {/* 06 · cola conceitual */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⇄</span>
          <h2>Cola conceitual · penalidade vs. constraint</h2>
        </div>
        <div className="cards">
          <div className="card amber">
            <h3>Raycast</h3>
            <div className="kind">força de penalidade · o que já tenho</div>
            <p>
              <b>Eu empurro.</b> A cada frame eu <b>calculo</b> as forças
              (mola-amortecedor, tração, lateral) e <b>aplico</b> no corpo. O corpo
              é livre; o comportamento certo emerge das forças que eu escolho.
            </p>
            <p>
              <b>A favor:</b> controle total, física explícita, troca fácil pra
              ExoPhysics. <b>Contra:</b> instabilidade do integrador, eu
              reimplemento tudo.
            </p>
          </div>
          <div className="card cyan">
            <h3>Multicorpo</h3>
            <div className="kind">junta + constraint · o caminho a explorar</div>
            <p>
              <b>Eu restrinjo.</b> Eu <b>declaro</b> uma relação geométrica ("estes
              dois corpos giram juntos neste eixo") e o <b>solver do Jolt</b>{' '}
              calcula os impulsos que mantêm a relação. Não empurro — amarro.
            </p>
            <p>
              <b>A favor:</b> junções rígidas estáveis, suspensão/direção "de
              graça". <b>Contra:</b> menos controle da física interna, preso ao que
              o Godot expõe.
            </p>
          </div>
        </div>
        <div className="callout">
          <span className="lbl">◈ a ponte</span>
          Não é "um ou outro". O modelo de veículo do próprio Jolt usa
          raycast/shapecast nas rodas <em>combinado</em> com o solver de
          constraints. Meu protótipo raycast não foi trabalho jogado fora — ele é
          metade do que um veículo multicorpo maduro faz.
        </div>
      </section>

      {/* 07 · tabela de GDL */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">▤</span>
          <h2>Referência · juntas do Godot e graus de liberdade</h2>
        </div>
        <div className="tbl cyan">
          <div className="cap">junta (Godot) → análogo · GDL que sobra · uso no rover</div>
          <div className="trow">
            <div className="a">PinJoint3D</div>
            <div className="b">
              rótula / ponto · <b>3 rotação</b> · ponto de articulação livre
            </div>
          </div>
          <div className="trow">
            <div className="a">HingeJoint3D</div>
            <div className="b">
              dobradiça / revoluta · <b>1 rotação</b> · eixo da roda girando; braço
              de suspensão
            </div>
          </div>
          <div className="trow">
            <div className="a">SliderJoint3D</div>
            <div className="b">
              prismática · <b>1 translação</b> · curso vertical da suspensão
            </div>
          </div>
          <div className="trow">
            <div className="a">ConeTwistJoint3D</div>
            <div className="b">
              esférica limitada · <b>cone + twist</b> · juntas com limite angular
            </div>
          </div>
          <div className="trow seam">
            <div className="a">Generic6DOFJoint3D</div>
            <div className="b">
              configurável · <b>eu escolho</b> · trava/libera cada eixo + motores
            </div>
          </div>
        </div>
      </section>

      {/* 08 · guia de exploração dos repos */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">↗</span>
          <h2>Guia de exploração · repositórios</h2>
        </div>
        <div className="deliv">
          <div className="drow">
            <span className="dn mono">Constraints/</span>
            <span className="dt">
              <b>Só ler os headers.</b> <code>HingeConstraint</code>,{' '}
              <code>SliderConstraint</code>, <code>SixDOFConstraint</code> — reparar
              nos parâmetros de cada uma (eixo, limites, motor). É o "de verdade"
              por trás dos nós do Godot.
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">Vehicle/</span>
            <span className="dt">
              <b>Olhar, não implementar.</b> A <code>WheeledVehicleConstraint</code>.
              O objetivo é só perceber que o Jolt já tem um modelo de veículo pronto
              — e que ele usa raycast nas rodas por baixo. A ponte entre meus dois
              mundos.
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">Samples/</span>
            <span className="dt">
              <b>Intuição visual + o sample a replicar.</b> Os exemplos rodáveis
              (ConstraintTests, Vehicle) — é daqui que sai o sample pra comparar e
              reconstruir no Godot (pontos 1 e 2 da reunião).
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">GDChrono</span>
            <span className="dt">
              <b>O molde do professor.</b> A GDExtension que ele fez ligando o Godot
              ao Project Chrono. Estudar a estrutura e espelhar o mesmo raciocínio
              pro Jolt (ponto 4).
            </span>
          </div>
        </div>
        <div className="res">
          <a
            href="https://github.com/jrouwe/JoltPhysics"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              Jolt Physics — repo do jrouwe
              <span className="rd">Samples, Constraints, Vehicle e o doc de arquitetura</span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://docs.godotengine.org/en/stable/tutorials/scripting/gdextension/index.html"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              GDExtension — documentação oficial
              <span className="rd">como estender o Godot em C++ (a ponte do ponto 3)</span>
            </span>
            <span className="rk">↗ godot docs</span>
          </a>
        </div>
      </section>

      {/* 09 · handoff */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">↹</span>
          <h2>Para o dossiê e a próxima reunião</h2>
        </div>
        <div className="deliver">
          <h3>O que sai desta quinzena</h3>
          <ul>
            <li>
              <b>Entrada no Docusaurus</b> — ✔ publicada em{' '}
              <a href="/docs/multicorpo/constraints-e-jolt">
                Constraints, juntas e o Jolt
              </a>
              : o quadro penalidade × constraint, a tabela de GDL, o experimento
              com <code>HingeJoint3D</code> e a nota Godot↔Jolt.
            </li>
            <li>
              <b>Cena de teste versionada</b> — ✔ feita: os dois corpos + hinge em{' '}
              <code>Teste_junta/</code>, com os prints do pêndulo no dossiê.
            </li>
            <li>
              <b>Comparativo Jolt × Godot</b> — a partir de um sample: o que o Jolt
              entrega e o Godot não expõe, feature a feature.
            </li>
            <li>
              <b>Sample replicado no Godot</b> — a tentativa de reconstruir o
              cenário do Jolt, mais o paralelo GDChrono → Jolt via GDExtension.
            </li>
            <li>
              <b>Posição escrita sobre a decisão arquitetural</b> — com o dado novo:
              o Godot não expõe a <code>VehicleConstraint</code> do Jolt, e o
              próprio Jolt mistura raycast + constraint.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
