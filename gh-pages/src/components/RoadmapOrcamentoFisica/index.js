import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Roadmap da semana 14–21/set/2026 · O rover cabe no Jolt?
 *
 * Nasce de duas ideias do Heitor depois de ler o GDChrono: medir quanto cálculo
 * de física cabe num quadro (o passo de 0,5 ms do professor contra os 16,7 ms
 * herdados do Godot), e testar se dá para montar dinâmica multicorpo de verdade
 * com o Jolt — corpos e juntas, em vez do modelo lumped da VehicleConstraint.
 *
 * A reunião de 8/set foi adiada, então as perguntas que iam orientar a semana
 * seguem abertas. A semana foi remontada para PRODUZIR a evidência que
 * responderia a principal delas, em vez de esperar por ela.
 *
 * Entregável-âncora: a resposta fundamentada para "o rover articulado cabe no
 * Jolt, em tempo real?" — as três faixas alimentam essa única pergunta.
 * Reutiliza src/css/roadmap.css (escopo `.roadmap`).
 */
export default function RoadmapOrcamentoFisica() {
  const ponteHref = useBaseUrl('/docs/multicorpo/ponte-gdextension');
  const gdchronoHref = useBaseUrl('/docs/multicorpo/gdchrono-comparado');
  const porDentroHref = useBaseUrl('/docs/multicorpo/vehicleconstraint-por-dentro');
  const quinzenaHref = useBaseUrl('/docs/multicorpo/constraints-e-jolt');
  const rodaSoloHref = useBaseUrl('/docs/roda-solo/visao-geral');

  return (
    <div className="roadmap">
      {/* hero */}
      <header className="rm-hero">
        <div className="countdown">
          <span className="big">16,7 ms</span>
          <span className="sep mono">·······</span>
          <span className="goal">O ORÇAMENTO DE UM QUADRO</span>
        </div>
        <span className="eyebrow">Semana · 14 → 21 set</span>
        <h1>
          O rover cabe <span className="accent">no Jolt</span>?
        </h1>
        <p className="lede">
          A entrada anterior fechou a ponte C++ e provou que o Jolt roda dentro do
          Godot. Mas o que roda hoje é um <b>veículo de um corpo só</b> — a{' '}
          <code>VehicleConstraint</code> é um modelo <em>lumped</em>, sem
          articulação nenhuma. Rover não é isso.
        </p>
        <p className="lede">
          Esta semana ataca a pergunta que decide o rumo do projeto:{' '}
          <b>dá para montar dinâmica multicorpo de verdade com o Jolt — corpos e
          juntas — e ainda caber no orçamento de um quadro?</b> Três frentes
          alimentam essa resposta: quanto cálculo cabe, se a articulação funciona,
          e o que o terreno custa.
        </p>

        <div className="callout amber" style={{marginTop: 22}}>
          <span className="lbl">◈ mudança de contexto</span>
          <b>A reunião de 8/set foi adiada</b> — imprevisto do professor. As
          perguntas que iam orientar a semana continuam abertas, e a principal
          delas é justamente <em>"o rover é trabalho de Jolt ou de Chrono?"</em>.
          Em vez de esperar, a semana foi remontada para <b>produzir a evidência
          que responde isso</b>. Chegar na reunião com a medição feita é melhor do
          que chegar com a pergunta.
        </div>
      </header>

      {/* 01 · entregável-âncora */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">★</span>
          <h2>O entregável-âncora</h2>
        </div>
        <div className="firstmove">
          <div className="kick">as três faixas existem pra sustentar isto</div>
          <h3>Uma resposta fundamentada: o rover articulado cabe no Jolt?</h3>
          <p>
            Não uma opinião — um documento com <b>números medidos</b> dizendo: o
            mecanismo articulado funciona no Jolt (sim ou não, com evidência), ele
            custa <em>tanto</em> por quadro, o terreno deformável custa{' '}
            <em>mais tanto</em>, e sobra ou não sobra orçamento para tempo real.
          </p>
          <p>
            É a base para a decisão mais cara do projeto:{' '}
            <b>seguir no Jolt, migrar pro Chrono, ou manter os dois</b> — um para
            tempo real, outro para fidelidade.
          </p>
        </div>
      </section>

      {/* 02 · as três faixas */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⇉</span>
          <h2>Três faixas, uma pergunta</h2>
        </div>
        <div className="cards">
          <div className="card amber">
            <div className="kind">faixa A · seg e ter</div>
            <h3>Quanto cabe num quadro</h3>
            <p>
              Instrumentar o <code>vehicle_probe</code>, varrer os parâmetros de
              custo do Jolt e levantar a <b>curva custo × fidelidade</b>. Define o
              orçamento contra o qual tudo mais é medido.
            </p>
          </div>
          <div className="card cyan">
            <div className="kind">faixa B · qua e qui · ★ prioridade</div>
            <h3>Multicorpo de verdade</h3>
            <p>
              Montar uma <b>perna articulada</b> com corpos e juntas — o que a{' '}
              <code>VehicleConstraint</code> não faz. Testar se ela sobe um degrau
              melhor que o corpo único, e quanto custa.
            </p>
          </div>
          <div className="card amber">
            <div className="kind">faixa C · sex · cortável</div>
            <h3>O terreno</h3>
            <p>
              Chão de altura variável e deformação do sulco. É a faixa a sacrificar
              se a semana apertar — as outras duas respondem mais.
            </p>
          </div>
        </div>

        <div className="callout">
          <span className="lbl">⚠ leitura honesta do escopo</span>
          <b>Três faixas em cinco dias é apertado.</b> A ordem acima é a de
          prioridade, não só a do calendário: se algo cair, cai a{' '}
          <b>faixa C</b>. A faixa B é a que responde a pergunta do título — e é a
          única que produz capacidade nova, não só medição.
        </div>
      </section>

      {/* 03 · faixa A */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◷</span>
          <h2>Faixa A · o orçamento do quadro</h2>
        </div>
        <p className="sec-sub">
          Quatro parâmetros controlam quanto o Jolt calcula por passo. Nenhum foi
          tocado até agora — todos estão no padrão.
        </p>

        <div className="tbl cyan">
          <div className="cap">os botões de custo · o que cada um compra</div>
          <div className="trow">
            <div className="a">sub-passos</div>
            <div className="b">
              Chamar <code>Update</code> várias vezes por quadro com{' '}
              <code>dt/N</code> · <b>o botão principal</b> · é o que aproxima do
              passo de 0,5 ms do professor
            </div>
          </div>
          <div className="trow">
            <div className="a">mNumVelocitySteps</div>
            <div className="b">
              Iterações do solver de velocidade · padrão <b>10</b> · quanto o
              solver insiste até as restrições fecharem
            </div>
          </div>
          <div className="trow">
            <div className="a">mNumPositionSteps</div>
            <div className="b">
              Iterações de correção de posição · padrão <b>2</b> · corrige
              penetração acumulada
            </div>
          </div>
          <div className="trow seam">
            <div className="a">colisão da roda</div>
            <div className="b">
              <code>SetNumStepsBetweenCollisionTestActive</code> · de quantos em
              quantos passos o <b>raycast</b> da roda é refeito — hoje todo passo
            </div>
          </div>
        </div>

        <div className="spine">
          <div className="stop seam">
            <div className="code">SEG · 14 SET</div>
            <h3>Instrumentar o medidor</h3>
            <ol className="steps">
              <li>
                Cronometrar cada <code>PhysicsSystem::Update</code> e reportar
                mínimo, mediana e <b>máximo</b> — o pico é o que estoura o quadro,
                não a média.
              </li>
              <li>
                Definir uma <b>manobra padrão</b> reproduzível: acelerar em reta,
                subir um degrau, curva fechada. Sem ela, nada é comparável.
              </li>
              <li>
                Fixar as <b>métricas de fidelidade</b>: erro no impulso de
                suspensão contra m·g·Δt, penetração máxima da roda, tremor do corpo
                parado.
              </li>
            </ol>
            <span className="doit">↳ vehicle_probe cronometrado e repetível</span>
          </div>

          <div className="stop">
            <div className="code">TER · 15 SET</div>
            <h3>A varredura e a curva</h3>
            <ol className="steps">
              <li>
                Variar <b>um parâmetro por vez</b>: sub-passos 1, 2, 4, 8, 16, 32 —
                até encostar no 0,5 ms do professor (33 sub-passos).
              </li>
              <li>
                Repetir para as iterações do solver e a frequência do raycast.
              </li>
              <li>
                Montar a curva e <b>marcar o joelho</b>: o ponto em que dobrar o
                custo para de melhorar o resultado. E marcar onde os 16,7 ms
                estouram.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> a partir daqui, "quanto isso custa" tem resposta em
              número para qualquer coisa que eu adicionar depois.
            </p>
            <span className="doit">↳ curva custo × fidelidade</span>
          </div>
        </div>
      </section>

      {/* 04 · faixa B — multicorpo */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⚙</span>
          <h2>Faixa B · multicorpo de verdade no Jolt</h2>
        </div>
        <p className="sec-sub">
          A frente inteira se chama "dinâmica multicorpo" e, até agora, o que roda
          tem <b>um corpo</b>. Esta faixa fecha esse vão — e é a que produz
          capacidade nova.
        </p>

        <div className="callout">
          <span className="lbl">◈ por que a VehicleConstraint não basta</span>
          O rocker-bogie existe para que, ao subir uma pedra,{' '}
          <b>uma roda suba enquanto as outras seguem apoiadas</b>, e o chassi quase
          não incline. Esse comportamento <b>emerge da articulação</b> — não sai de
          um bloco só com molas calculadas, por melhor que sejam os parâmetros.
          Detalhado em <a href={porDentroHref}>Um corpo só, quatro bengalas</a>.
        </div>

        <div className="tbl cyan">
          <div className="cap">os três caminhos · o que cada um custa</div>
          <div className="trow">
            <div className="a">1 · VehicleConstraint</div>
            <div className="b">
              O que existe hoje. <b>Modelo de pneu bom</b> (curvas de slip, μ·N),{' '}
              <b>articulação zero</b>. Ótimo para carro, imprestável para rover
            </div>
          </div>
          <div className="trow">
            <div className="a">2 · corpos + juntas</div>
            <div className="b">
              Cada braço um corpo, cada pivô um <code>HingeConstraint</code>, cada
              roda um cilindro com <b>motor no eixo</b>. Articulação total; o pneu
              vira <b>atrito comum de corpo rígido</b>. É o caminho do{' '}
              <code>VehicleSixDOFTest</code> e do Viper
            </div>
          </div>
          <div className="trow seam">
            <div className="a">3 · híbrido · hipótese</div>
            <div className="b">
              A <code>VehicleConstraint</code> se prende a <b>um</b> corpo — e nada
              diz que esse corpo é o chassi. Uma constraint de <b>uma roda só</b>{' '}
              em cada braço articulado daria articulação <b>e</b> modelo de pneu.{' '}
              <b>Não testado</b>
            </div>
          </div>
        </div>

        <div className="spine">
          <div className="stop seam">
            <div className="code">QUA · 16 SET · o caminho 2</div>
            <h3>Uma perna articulada</h3>
            <ol className="steps">
              <li>
                Um braço (corpo dinâmico) preso ao chassi por{' '}
                <code>HingeConstraint</code> — o pivô do bogie.
              </li>
              <li>
                Uma roda de verdade: <code>CylinderShape</code>, corpo dinâmico,
                presa ao braço por outro <code>HingeConstraint</code>{' '}
                <b>com motor</b> — <code>SetMotorState(Velocity)</code> e{' '}
                <code>SetTargetAngularVelocity</code>. A roda é acionada pelo{' '}
                <b>eixo</b>, como na vida real, não por força no corpo.
              </li>
              <li>
                Gabarito: <code>Samples/Tests/Vehicle/VehicleSixDOFTest.cpp</code>,
                escrito pelo próprio autor do Jolt — "mostra como um carro poderia
                ser feito com um <code>SixDOFConstraint</code>".
              </li>
            </ol>
            <p>
              <b>O teste que decide:</b> a mesma manobra de degrau, nas duas
              montagens. Medir <b>inclinação do chassi</b> e se sobe. Se a
              articulada inclinar menos, o mecanismo está fazendo o que deveria.
            </p>
            <span className="doit">
              ↳ perna articulada subindo degrau + comparação com o corpo único
            </span>
          </div>

          <div className="stop">
            <div className="code">QUI · 17 SET · o caminho 3</div>
            <h3>Testar a hipótese do híbrido</h3>
            <ol className="steps">
              <li>
                Montar o braço articulado do dia anterior e prender nele uma{' '}
                <code>VehicleConstraint</code> de <b>uma roda só</b>.
              </li>
              <li>
                Ver o que quebra. Suspeitas anotadas antes de testar: o{' '}
                <code>WheeledVehicleController</code> faz motor e diferencial{' '}
                <em>entre</em> rodas, o que não faz sentido dividido em várias
                constraints; e o <code>mMaxPitchRollAngle</code> assume um veículo
                só. Talvez precise de um controller mais simples, ou nenhum.
              </li>
              <li>
                Comparar as três montagens na mesma manobra:{' '}
                <b>o pneu se comporta diferente?</b> Aparece curva de slip no
                híbrido que não aparece no caminho 2?
              </li>
            </ol>
            <p>
              <b>Porquê:</b> se funcionar, é o melhor dos dois mundos e muda a
              resposta da semana. Se não funcionar, saber <b>por quê</b> vale quase
              tanto — e é barato descobrir.
            </p>
            <span className="doit">
              ↳ veredito do híbrido, com o motivo anotado
            </span>
          </div>
        </div>

        <div className="callout amber" style={{marginTop: 22}}>
          <b>O que se perde no caminho 2, e não dá pra esconder:</b> quando a roda
          vira um corpo que colide, o contato passa a ser <b>atrito comum</b> — um
          coeficiente, Coulomb. Some o modelo de pneu: sem curvas de{' '}
          <em>slip</em>, sem tratar longitudinal e lateral separadamente, sem o{' '}
          <em>clamp</em> μ·N por roda. Troca-se <b>fidelidade de contato</b> por{' '}
          <b>fidelidade de mecanismo</b>. Essa é a frase que a semana precisa
          transformar em número.
        </div>
      </section>

      {/* 05 · faixa C — terreno */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⌁</span>
          <h2>Faixa C · o terreno</h2>
        </div>

        <div className="callout">
          <span className="lbl">⚠ a distinção que organiza a faixa</span>
          <b>Deformar a geometria não é modelar o solo.</b> O Jolt tem{' '}
          <code>HeightFieldShape::SetHeights()</code>, que permite <b>abrir o
          sulco</b> onde a roda passou, em tempo de execução. O que ele{' '}
          <b>não</b> tem é terramecânica: nenhum Bekker, nenhum Janosi, nenhuma
          força de resistência ao afundamento ou de cisalhamento. Essa parte
          existe no Chrono e teria que ser escrita à mão no Jolt.
        </div>

        <div className="spine">
          <div className="stop final">
            <div className="code">SEX · 18 SET</div>
            <h3>Relevo, sulco e o custo dos dois</h3>
            <ol className="steps">
              <li>
                Trocar o chão de caixa por um <code>HeightFieldShape</code> e
                confirmar que a suspensão responde ao relevo — a telemetria por
                roda deve deixar de ser simétrica.
              </li>
              <li>
                Deformar onde a roda tocou, com <code>SetHeights</code> numa janela
                pequena ao redor do contato — a ideia de <b>domínio ativo</b>{' '}
                copiada do <a href={gdchronoHref}>GDChrono</a>.
              </li>
              <li>
                <b>Medir o custo</b> por quadro e somar ao orçamento da faixa A.
              </li>
              <li>
                Listar o que o <code>SCMTerrain</code> calcula e o Jolt não, e
                estimar o que seria escrever isso à mão — <b>e se vale</b>, dado
                que o Chrono entrega pronto.
              </li>
            </ol>
            <span className="doit">
              ↳ sulco aparecendo, custo medido, nota de decisão para a frente{' '}
              <a href={rodaSoloHref}>roda–solo</a>
            </span>
          </div>
        </div>
      </section>

      {/* 06 · fechamento */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">↹</span>
          <h2>O que sai desta semana</h2>
        </div>
        <div className="deliver">
          <h3>Para a reunião remarcada</h3>
          <ul>
            <li>
              <b>A curva custo × fidelidade</b> — quanto cálculo cabe em 16,7 ms e
              onde está o joelho.
            </li>
            <li>
              <b>A perna articulada rodando</b> — corpos e juntas de verdade, com a
              comparação de inclinação do chassi contra o modelo de um corpo só{' '}
              <em>(o entregável que muda o rumo)</em>.
            </li>
            <li>
              <b>O veredito do híbrido</b> — funciona, ou não funciona e por quê.
            </li>
            <li>
              <b>A nota de decisão</b>: o rover articulado cabe no Jolt em tempo
              real, ou terreno deformável empurra para o Chrono?
            </li>
          </ul>
        </div>
      </section>

      {/* 07 · trava de escopo */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⚠</span>
          <h2>Esta semana eu NÃO vou</h2>
        </div>
        <div className="rm-guard">
          <span className="lbl">✕ trava de escopo</span>
          <p className="sub">
            <b>Uma perna, não um rover.</b> A pergunta é se o mecanismo funciona e
            quanto custa — não montar o veículo completo.
          </p>
          <ul>
            <li>
              Montar o rocker-bogie de <b>seis rodas</b> — uma perna responde a
              pergunta
            </li>
            <li>
              Refatorar a cena para nascer da física (decidido, mas é o passo
              seguinte)
            </li>
            <li>Migrar o build para CMake</li>
            <li>Escrever terramecânica do zero</li>
            <li>Otimizar o que ainda não foi medido</li>
          </ul>
        </div>
        <div className="callout">
          <span className="lbl">◈ modo da semana</span>
          <b>Experimental.</b> Toda afirmação tem que vir com{' '}
          <em>o número ao lado</em>. Se não deu pra medir, não entra na conclusão.
        </div>
      </section>

      {/* 08 · perguntas */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">?</span>
          <h2>Perguntas para o professor</h2>
        </div>
        <p className="sec-sub">
          Continuam abertas — a reunião de 8/set foi adiada. Duas delas a semana
          responde sozinha, e isso está marcado.
        </p>

        <div className="qbox">
          <h3>Sobre o rumo · as que só ele responde</h3>
          <ul>
            <li>
              O alvo é <b>uma</b> ponte ou <b>duas</b>? Faz sentido o projeto ter
              Jolt e Chrono lado a lado — um para tempo real, outro para fidelidade
              — ou é para convergir numa só?
            </li>
            <li>
              Posso usar o <b>Viper</b> como referência de rover articulado, ou o
              alvo é um rover da ExoTerra com geometria própria?
            </li>
            <li>
              O que conta como <b>validação</b> para o PIBIC: comparar contra o
              Chrono na mesma manobra, ou contra dado experimental?
            </li>
            <li>
              O rover precisa rodar em <b>tempo real</b>, ou pode rodar mais devagar
              que o relógio? Isso muda toda a leitura da curva da faixa A.
            </li>
          </ul>
        </div>

        <div className="qbox">
          <h3>Sobre o código dele</h3>
          <ul>
            <li>
              O <b>passo de 0,5 ms</b> do GDChrono foi escolhido por convergência do
              SCM, por estabilidade das juntas do Viper, ou empiricamente?
            </li>
            <li>
              Em <code>ChWorld.cpp</code>, o <code>SCMTerrain terrain(&amp;sys)</code>{' '}
              é variável local dentro do <code>Init()</code> — o terreno continua
              vivo depois que a função retorna?
            </li>
          </ul>
        </div>

        <div className="qbox">
          <h3>As que eu mesmo respondo esta semana</h3>
          <ul>
            <li>
              <b>Dá para montar multicorpo articulado no Jolt?</b> → faixa B, com
              medição.
            </li>
            <li>
              <b>Solo deformável é viável no Jolt em tempo real?</b> → faixa C, com
              o custo por quadro medido.
            </li>
          </ul>
        </div>
      </section>

      {/* 09 · de onde parto */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◉</span>
          <h2>De onde eu parto</h2>
        </div>
        <div className="flip">
          <span className="lbl">◈ o que a sprint anterior entregou</span>
          <p>
            A ponte C++ está de pé e verificada — ver{' '}
            <a href={ponteHref}>Dois mundos, uma cena</a>. Tenho um{' '}
            <code>vehicle_probe</code> que roda o veículo sem Godot e imprime
            telemetria, o que torna a faixa A quase só instrumentar o que já
            existe.
          </p>
          <p>
            E tenho as duas leituras que sustentam a faixa B: a{' '}
            <a href={porDentroHref}>mecânica interna da VehicleConstraint</a>, que
            explica por que ela não articula, e a{' '}
            <a href={quinzenaHref}>tabela de graus de liberdade das juntas</a>, que
            é exatamente o material para montar a perna.
          </p>
        </div>
      </section>

      {/* 10 · referências */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">↗</span>
          <h2>O que abrir</h2>
        </div>
        <div className="res">
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Samples/Tests/Vehicle/VehicleSixDOFTest.cpp"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              VehicleSixDOFTest.cpp — o gabarito da faixa B
              <span className="rd">
                veículo feito de corpos e juntas, com motor no eixo da roda
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Constraints/HingeConstraint.h"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              HingeConstraint.h
              <span className="rd">
                SetMotorState e SetTargetAngularVelocity — como se aciona um eixo
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/PhysicsSettings.h"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              PhysicsSettings.h
              <span className="rd">
                mNumVelocitySteps e mNumPositionSteps — os botões do solver
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Collision/Shape/HeightFieldShape.h"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              HeightFieldShape.h
              <span className="rd">
                SetHeights — deformar o terreno em tempo de execução
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/InteractiveDynamics/GdChrono"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              GdChrono — o molde
              <span className="rd">
                ChWorld.cpp: o passo de 0,5 ms, o SCMTerrain e os domínios ativos
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
        </div>
      </section>
    </div>
  );
}
