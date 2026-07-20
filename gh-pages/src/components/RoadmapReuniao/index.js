import React from 'react';

/**
 * Roadmap da semana 06–13/jul/2026 · preparação até a reunião.
 * Conteúdo portado do HTML "plano de voo" para JSX, usando os componentes
 * definidos em src/css/roadmap.css (escopados sob `.roadmap`).
 */
export default function RoadmapReuniao() {
  return (
    <div className="roadmap">
      {/* hero / countdown */}
      <header className="rm-hero">
        <div className="countdown">
          <span className="big">T–7 DIAS</span>
          <span className="sep mono">·······</span>
          <span className="goal">DESTINO: REUNIÃO</span>
        </div>
        <h1>
          Plano de voo até a <span className="accent">próxima reunião</span>
        </h1>
        <p className="lede">
          O professor pediu quatro coisas na fala do kick-off:{' '}
          <b>artigos/exemplos de carros</b>,{' '}
          <b>como isso vira modelagem de sistemas complexos</b>,{' '}
          <b>estudar Godot</b> e <b>fazer um carrinho simples</b> pra pegar noção
          de torque, suspensão e powertrain. Abaixo, isso traduzido num roteiro
          pra você chegar com bagagem.
        </p>
      </header>

      {/* 01 · briefing */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">01</span>
          <h2>O briefing, decodificado</h2>
        </div>
        <p className="sec-sub">A fala solta do professor separada em quatro frentes.</p>
        <div className="chips">
          <div className="chip">
            <span className="tag">Frente A</span>
            <p>
              Levantar artigos e exemplos de <b>dinâmica veicular</b> — como um
              carro é modelado.
            </p>
          </div>
          <div className="chip">
            <span className="tag">Frente B</span>
            <p>
              Entender como isso vira <b>modelagem de sistema complexo</b>{' '}
              (multicorpos).
            </p>
          </div>
          <div className="chip">
            <span className="tag">Frente C</span>
            <p>
              Aprender o <b>Godot</b> o suficiente pra prototipar.
            </p>
          </div>
          <div className="chip">
            <span className="tag">Frente D</span>
            <p>
              Fazer um <b>carrinho</b> e sentir na mão torque, suspensão e
              powertrain.
            </p>
          </div>
        </div>
      </section>

      {/* 02 · conceitos */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">02</span>
          <h2>Os três conceitos pra dominar</h2>
        </div>
        <p className="sec-sub">
          Nível intuição — o suficiente pra conversar com o professor e
          reconhecer no código.
        </p>
        <div className="cards">
          <div className="card amber">
            <h3>Powertrain &amp; Torque</h3>
            <div className="kind">Frente A · como a energia vira movimento</div>
            <p>
              Powertrain é a cadeia que transforma energia em rotação da roda:{' '}
              <b>motor → transmissão/redução → diferencial → roda</b>. O torque
              (τ) é a "força de giro" que o motor produz; a relação de
              engrenagens multiplica esse torque, e a roda o converte em força de
              tração que empurra o veículo — limitada pelo atrito com o solo.
            </p>
            <span className="formula">F_tração = τ_roda / raio_da_roda</span>
            <p>
              Num <b>rover</b> normalmente são motores elétricos (às vezes um por
              roda), sem a complexidade de câmbio de um carro a combustão — o que
              simplifica bastante seu caso.
            </p>
            <div className="tie">
              No Godot, a propriedade <code>engine_force</code> do VehicleBody3D é
              exatamente isso: uma força aplicada nas rodas de tração. Mexer nela
              = sentir o torque.
            </div>
          </div>

          <div className="card amber">
            <h3>Suspensão</h3>
            <div className="kind">Frente A · manter a roda no chão</div>
            <p>
              É um sistema <b>mola–amortecedor</b>. A mola (rigidez{' '}
              <span className="mono">k</span>) resiste à compressão; o
              amortecedor (<span className="mono">c</span>) dissipa a oscilação.
              Objetivo: manter as rodas em contato com o terreno e absorver
              irregularidades. Parâmetros que importam: comprimento de repouso,
              rigidez, amortecimento (compressão/retorno) e curso.
            </p>
            <p>
              Vale conhecer a suspensão icônica de rover: a{' '}
              <b>rocker-bogie</b> (rovers de Marte) — passiva, mantém todas as
              rodas no chão sobre obstáculos usando articulações que pivotam, sem
              molas.
            </p>
            <div className="tie">
              No Godot, o VehicleWheel3D expõe <code>suspension_stiffness</code>,{' '}
              <code>suspension_travel</code>, <code>damping_compression</code> e{' '}
              <code>damping_relaxation</code>. Variar e observar já constrói a
              intuição.
            </div>
          </div>

          <div className="card amber">
            <h3>Modelagem multicorpos</h3>
            <div className="kind">Frente B · o coração do seu Tema 1</div>
            <p>
              Aqui mora o seu tema. Um veículo é um conjunto de{' '}
              <b>corpos rígidos</b> (chassi, rodas, braços de suspensão) ligados
              por <b>juntas</b> — revoluta pra roda girar, articulada/prismática
              pra suspensão. O estado do sistema é posição, orientação e
              velocidade de cada corpo; as juntas impõem restrições; motores,
              molas, gravidade e contato aplicam forças; e um{' '}
              <b>integrador temporal</b> avança tudo passo a passo.
            </p>
            <div className="tie">
              O "transformar em sistema complexo" que o professor citou é
              justamente sair do <b>carrinho arcade</b> (um corpo só + rodas por
              raycast) pra um <b>modelo multicorpos de verdade</b>. Você{' '}
              <b>implementa</b> dinâmica multicorpos já conhecida — a física
              avançada do solo é da equipe, não sua.
            </div>
          </div>
        </div>
      </section>

      {/* 03 · Godot */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">03</span>
          <h2>Trilha Godot</h2>
        </div>
        <p className="sec-sub">
          O objetivo é intuição, não virar especialista. Umas horas resolvem.
        </p>
        <div className="cards">
          <div className="card cyan">
            <h3>Do zero ao carrinho</h3>
            <div className="kind">Frente C + D</div>
            <p>
              <b>1.</b> Instale o <b>Godot 4.7</b> (estável mais recente, de
              jul/2026). Desde o 4.6 o motor de física 3D padrão é o{' '}
              <b>Jolt</b>, mais estável — só bom saber.
            </p>
            <p>
              <b>2.</b> Faça 1–2h de tutorial básico: interface, nós (nodes) e{' '}
              <code>GDScript</code>.
            </p>
            <p>
              <b>3.</b> Monte um carro com <code>VehicleBody3D</code> + um{' '}
              <code>VehicleWheel3D</code> por roda, controlado por{' '}
              <code>engine_force</code>, <code>brake</code> e{' '}
              <code>steering</code>.
            </p>
            <p>
              <b>4.</b> Use modelos glTF prontos do <b>Kenney Car Kit</b> — glTF
              é o mesmo formato que você já vai usar pro rover.
            </p>
            <div className="tie">
              Aviso honesto: a própria doc do Godot diz que o VehicleBody3D{' '}
              <b>não é fisicamente realista</b> e tem limitações conhecidas — pra
              física séria você escreveria a sua sobre RigidBody3D. Mas pro
              objetivo desta semana (sentir torque, suspensão e powertrain), ele é
              perfeito.
            </div>
            <div className="callout">
              <span className="lbl">⚠ Nota de escopo</span>
              No seu plano, o Godot é domínio da <b>Luana</b> e você só integra
              via API. Estudar Godot e fazer o carrinho{' '}
              <b>não contradiz isso</b> — é um sandbox de aprendizado pra ganhar
              intuição de dinâmica veicular, não você assumindo a parte gráfica da
              ExoTerra. Ainda assim, vale <b>confirmar essa fronteira</b> com o
              professor na reunião.
            </div>
          </div>
        </div>
      </section>

      {/* 04 · sequência */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">04</span>
          <h2>Sequência sugerida da semana</h2>
        </div>
        <p className="sec-sub">Ordem, não datas rígidas — encaixe nos seus horários.</p>
        <div className="spine">
          <div className="stop">
            <div className="code">BLOCO 1 · ~meio dia</div>
            <h3>Instalar Godot + tutorial básico</h3>
            <p>Interface, nós e GDScript. Só pra não travar depois.</p>
          </div>
          <div className="stop">
            <div className="code">BLOCO 2</div>
            <h3>Fundamentos: Powertrain &amp; Torque</h3>
            <p>Notas próprias + uma leitura. Entender a cadeia motor→roda.</p>
          </div>
          <div className="stop">
            <div className="code">BLOCO 3</div>
            <h3>Fundamentos: Suspensão</h3>
            <p>Mola–amortecedor e a rocker-bogie dos rovers.</p>
          </div>
          <div className="stop">
            <div className="code">BLOCO 4 · mão na massa</div>
            <h3>Montar o carrinho no Godot</h3>
            <p>
              Mexer em <span className="mono">engine_force</span> e nos
              parâmetros de suspensão e sentir o efeito de cada um.
            </p>
          </div>
          <div className="stop">
            <div className="code">BLOCO 5 · amarrar</div>
            <h3>Da teoria pro Tema 1</h3>
            <p>
              Escrever como o carro vira um modelo multicorpos (corpos + juntas).
              Dar uma olhada no módulo de veículos do Chrono.
            </p>
          </div>
          <div className="stop">
            <div className="code">BLOCO 6 · fechar</div>
            <h3>Preparar a entrega da reunião</h3>
            <p>Demo do carrinho + resumo de 1 página + lista de perguntas.</p>
          </div>
          <div className="stop final">
            <div className="code">▲ CHEGADA</div>
            <h3>Reunião</h3>
            <p>
              Você chega com carrinho rodando e vocabulário na ponta da língua.
            </p>
          </div>
        </div>
      </section>

      {/* 05 · materiais */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">05</span>
          <h2>Materiais</h2>
        </div>

        <div className="res-group-label">Godot &amp; carrinho</div>
        <div className="res">
          <a
            href="https://docs.godotengine.org/en/stable/classes/class_vehiclebody3d.html"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              Doc oficial — VehicleBody3D
              <span className="rd">
                Referência dos parâmetros: engine_force, brake, steering,
                suspensão.
              </span>
            </span>
            <span className="rk">DOCS</span>
          </a>
          <a
            href="https://kidscancode.org/godot_recipes/4.x/3d/3d_sphere_car/index.html"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              KidsCanCode — carro arcade em Godot 4
              <span className="rd">
                Receita passo a passo, ótima pra sentir aceleração e curva
                rápido.
              </span>
            </span>
            <span className="rk">TUTORIAL</span>
          </a>
          <a
            href="https://github.com/DAShoe1/Godot-Easy-Vehicle-Physics"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              Godot-Easy-Vehicle-Physics (DAShoe1)
              <span className="rd">
                Repo com suspensão calculada e tooltips — bom pra estudar
                parâmetros reais.
              </span>
            </span>
            <span className="rk">REPO</span>
          </a>
          <a
            href="https://kenney.nl/assets/car-kit"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              Kenney — Car Kit (modelos glTF)
              <span className="rd">
                Modelos prontos e gratuitos no formato que você já vai usar.
              </span>
            </span>
            <span className="rk">ASSETS</span>
          </a>
        </div>

        <div className="res-group-label">Dinâmica veicular (lado teórico)</div>
        <div className="res">
          <div
            className="rt"
            style={{padding: '2px 0', color: 'var(--ink-mid)'}}>
            Gillespie — <i>Fundamentals of Vehicle Dynamics</i> (SAE): clássico
            introdutório de powertrain, tração e suspensão.
            <span className="rd">
              Serban, Taves &amp; Zhou (ref. 11 do projeto) — dinâmica veicular
              em terreno deformável em tempo real. Schepelmann (ref. 10) —
              panorama de contato pneu–solo. Ambos já estão na sua bibliografia.
            </span>
          </div>
        </div>
      </section>

      {/* 06 · bagagem */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">06</span>
          <h2>Pra chegar com bagagem</h2>
        </div>
        <ul className="checklist">
          <li>
            Um <b>carrinho rodando no Godot</b> (mesmo arcade) pra demonstrar na
            tela.
          </li>
          <li>
            Um <b>resumo de 1 página</b> conectando: conceitos de carro → modelo
            multicorpos do rover → seu ponto de integração via API (Mês 7 do seu
            plano).
          </li>
          <li>
            Vocabulário de torque, suspensão e powertrain{' '}
            <b>que você consiga usar</b> numa conversa.
          </li>
        </ul>

        <div className="qbox">
          <h3>Perguntas pra levar pro professor</h3>
          <ul>
            <li>
              A dinâmica veicular vai ser escrita <b>do zero</b> ou apoiada em
              lib (ex.: Chrono)? Isso muda o peso "programação vs. matemática".
            </li>
            <li>
              Estudar Godot e fazer o carrinho é só pra <b>intuição</b>, ou eu
              assumo parte da ExoTerra? Vale alinhar a{' '}
              <b>fronteira com a Luana</b>.
            </li>
            <li>
              Qual o <b>nível de fidelidade</b> esperado nessa fase inicial —
              arcade só pra provar conceito, ou já mirando algo mais realista?
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
