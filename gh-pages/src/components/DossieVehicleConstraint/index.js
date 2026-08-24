import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Doc técnica · Dinâmica multicorpo · Sessão de leitura de código de 24/ago/2026.
 * Terceira entrada da frente. As duas anteriores pararam em "o que a
 * VehicleConstraint é" e "por que o Godot não a expõe"; esta responde a pergunta
 * que sobrou: como ela funciona por dentro, e onde exatamente o raycast entra.
 *
 * Fonte: leitura direta do código-fonte do Jolt clonado localmente
 * (jrouwe/JoltPhysics, commit 2e28006e), pasta Jolt/Physics/Vehicle/. Todas as
 * citações de arquivo:linha conferem com esse commit.
 *
 * Renderiza sob `.dossie .tecnica .mcorpo` — mesma família visual das outras
 * entradas da frente, sem CSS próprio (não precisou de peça nova).
 */
export default function DossieVehicleConstraint() {
  const quinzenaHref = useBaseUrl('/docs/multicorpo/constraints-e-jolt');
  const comparativoHref = useBaseUrl('/docs/multicorpo/jolt-vs-godot');
  const raycastHref = useBaseUrl('/docs/roda-solo/visao-geral');

  return (
    <div className="dossie tecnica mcorpo">
      {/* faixa de telemetria */}
      <div className="telemetry-strip">
        <span>
          <span className="dot" />
          sessão · 24 ago
        </span>
        <span>
          fonte · <b>código-fonte do Jolt</b>
        </span>
        <span>
          commit · <b>2e28006e</b>
        </span>
        <span>
          pasta · <b>Jolt/Physics/Vehicle/</b>
        </span>
        <span>
          escopo · <b>como funciona por dentro</b>
        </span>
      </div>

      {/* hero */}
      <header className="hero-block">
        <div className="eyebrow">Leitura de código · a mecânica interna</div>
        <h1>
          Um corpo só, <span className="accent">quatro bengalas</span>.
        </h1>
        <p className="lede">
          As duas entradas anteriores desta frente estabeleceram <em>que</em> a{' '}
          <code>VehicleConstraint</code> existe e <em>por que</em> o Godot não a
          entrega. Ficou faltando o principal: <strong>como ela funciona</strong>.
          Abri o código-fonte do Jolt e li a implementação inteira — e a resposta
          reorganiza o que eu achava sobre a relação entre raycast e constraint.
          A peça central é que <strong>o veículo do Jolt tem um único corpo
          rígido</strong>, e que o raycast não é um detalhe do contato: ele é o
          que <strong>descobre com quem a constraint está amarrada</strong>.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>Em resumo:</b> a <code>VehicleConstraint</code> não liga o chassi às
          rodas — <b>ela liga o chassi ao chão</b>. Como o chão muda a cada
          instante, alguém precisa encontrá-lo: é o raycast, disparado do ponto de
          fixação da suspensão. A distância que ele mede, menos o raio da roda,{' '}
          <b>vira o comprimento atual da mola</b>. Daí em diante tudo é constraint
          resolvida no solver — inclusive um limite de atrito que é,
          literalmente, o mesmo <em>clamp</em> μ·N que eu escrevi à mão no
          protótipo.
        </div>

        <dl className="hero-meta">
          <div>
            <dt>Corpos rígidos</dt>
            <dd>Um — as rodas são dados, não corpos</dd>
          </div>
          <div>
            <dt>Papel do raycast</dt>
            <dd>Achar o segundo corpo da constraint</dd>
          </div>
          <div>
            <dt>Ritmo</dt>
            <dd>Percepção 1× · resolução N× por passo</dd>
          </div>
          <div>
            <dt>Reencontro</dt>
            <dd>μ · N, o mesmo clamp do meu bug</dd>
          </div>
        </dl>
      </header>

      {/* 00 · a pergunta que sobrou */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">00</span>
          <h2>A pergunta que as outras duas entradas deixaram aberta</h2>
        </div>
        <p className="sec-intro">
          Em <a href={quinzenaHref}>Constraints, juntas e o Jolt por dentro</a> eu
          estabeleci o paradigma: no raycast <b>eu empurro</b>, no multicorpo{' '}
          <b>eu amarro</b>. Em{' '}
          <a href={comparativoHref}>O tanque do Jolt e o teto do Godot</a> eu
          mapeei as peças do veículo do Jolt pelos headers e provei que o{' '}
          <code>VehicleBody3D</code> do Godot não é uma exposição delas. As duas
          entradas descrevem <b>o que existe</b>. Nenhuma responde{' '}
          <b>como a peça opera</b> — e sem isso a frase “o veículo do Jolt usa
          raycast e constraints juntos” fica sendo slogan, não entendimento.
        </p>

        <div className="callout">
          <b>Nota de método.</b> Nada aqui vem de documentação ou tutorial. Clonei
          o <code>jrouwe/JoltPhysics</code> e li os arquivos da pasta{' '}
          <code>Jolt/Physics/Vehicle/</code> — headers <b>e</b> implementação.
          Todas as citações de <code>arquivo:linha</code> desta página conferem
          com o commit <code>2e28006e</code>.
        </div>
      </section>

      {/* 01 · um corpo só */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">01</span>
          <h2>A revelação: existe um corpo rígido só</h2>
        </div>
        <p className="sec-intro">
          A expectativa natural, depois de duas semanas estudando multicorpo, é
          que um veículo do Jolt seja um esqueleto: chassi, quatro rodas, tudo
          ligado por juntas. <b>Não é.</b> Os membros da classe não deixam margem
          pra dúvida:
        </p>

        <div className="code-block">
          <div className="fname">Jolt/Physics/Vehicle/VehicleConstraint.h:218</div>
          <pre>
            <code>
              {`Body *   mBody;      // Body of the vehicle       ← singular
Wheels   mWheels;    // Wheel states of the vehicle`}
            </code>
          </pre>
        </div>

        <p className="sec-intro" style={{marginTop: 22}}>
          E <code>Wheel</code> não deriva de <code>Body</code>. É uma estrutura de
          dados com alguns floats:
        </p>

        <div className="code-block">
          <div className="fname">Jolt/Physics/Vehicle/Wheel.h:136–138</div>
          <pre>
            <code>
              {`float  mSteerAngle      = 0.0f;   // ângulo de esterço
float  mAngularVelocity = 0.0f;   // velocidade de giro (rad/s)
float  mAngle           = 0.0f;   // rotação atual, [0, 2 pi]`}
            </code>
          </pre>
        </div>

        <div className="stat" style={{marginTop: 24}}>
          A roda tem velocidade de giro guardada num <code>float</code>. Ela não
          gira na física — gira num número, que o jogo depois usa pra girar a
          malha na tela.
        </div>

        <div className="duo" style={{marginTop: 26}}>
          <div className="facet">
            <div className="tag">o que eu esperava</div>
            <h4>Um esqueleto</h4>
            <p>
              Cinco corpos rígidos (chassi + 4 rodas), ligados por juntas — a
              imagem que eu construí na quinzena conceitual, com{' '}
              <code>HingeJoint3D</code> no eixo e <code>SliderJoint3D</code> na
              suspensão.
            </p>
          </div>
          <div className="facet amber">
            <div className="tag">o que é</div>
            <h4>Um caixote com bengalas</h4>
            <p>
              <b>Um</b> corpo rígido, e N sondas apontando pra baixo. Cada sonda
              tateia o chão e, onde encosta, vira um pistão que empurra o caixote.
              Nenhuma roda é simulada como corpo.
            </p>
          </div>
        </div>

        <div className="callout amber">
          <b>Por que isso importa pro rover.</b> Se o objetivo for um rover
          articulado de verdade — rocker-bogie, braços que pivotam, rodas com
          inércia própria —, a <code>VehicleConstraint</code> do Jolt{' '}
          <b>não é a resposta pronta</b> que eu imaginava. Ela é um modelo{' '}
          <em>lumped</em> muito bem feito, da mesma família do meu protótipo
          raycast, e não um multicorpo articulado. Isso muda a expectativa sobre
          o que “expor a VehicleConstraint no Godot” resolveria.
        </div>
      </section>

      {/* 02 · constraint contra o chão */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">02</span>
          <h2>Então a constraint é entre o veículo e o chão</h2>
        </div>
        <p className="sec-intro">
          Uma constraint liga <b>dois</b> corpos. Se o veículo é um corpo só, quem
          é o segundo? A resposta está no argumento que o Jolt passa ao montar a
          equação da suspensão:
        </p>

        <div className="code-block">
          <div className="fname">Jolt/Physics/Vehicle/VehicleConstraint.cpp:508</div>
          <pre>
            <code>
              {`w->mSuspensionPart.CalculateConstraintPropertiesWithStiffnessAndDamping(
    inDeltaTime,
    *mBody,            // corpo 1 · o veículo
    r1_plus_u,
    *w->mContactBody,  // corpo 2 · O CORPO QUE A RODA ESTÁ TOCANDO
    r2, ...);`}
            </code>
          </pre>
        </div>

        <div className="stat" style={{marginTop: 24}}>
          O segundo corpo da constraint é o <b>chão</b> — e o chão de agora pode
          não ser o chão do próximo quadro.
        </div>

        <p className="sec-intro" style={{marginTop: 24}}>
          É aqui que a peça encaixa. Uma dobradiça sabe, desde que foi criada,
          quais dois corpos ela liga; a ligação é fixa. Um veículo{' '}
          <b>não sabe</b> — o corpo do outro lado muda a cada instante: uma pedra,
          uma rampa, uma plataforma em movimento, outro veículo. Alguém precisa{' '}
          <b>descobrir</b>, a cada passo, quem é o corpo 2 e em que ponto exato ele
          está.
        </p>

        <div className="callout coral">
          <b>A frase que reorganiza tudo.</b> O raycast não é “o jeito barato de
          detectar o chão”. Ele é <b>o que encontra o segundo corpo da
          constraint</b>. Sem ele, a constraint não tem contra o que empurrar — e
          por isso os dois paradigmas não competem: um é pré-requisito do outro.
        </div>
      </section>

      {/* 03 · o raycast linha por linha */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">03</span>
          <h2>O raycast, linha por linha</h2>
        </div>
        <p className="sec-intro">
          O teste de contato é uma classe abstrata,{' '}
          <code>VehicleCollisionTester</code>, com implementações trocáveis. A mais
          simples é a de raio puro —{' '}
          <code>VehicleCollisionTesterRay::Collide</code>, em{' '}
          <code>VehicleCollisionTester.cpp:19</code>.
        </p>

        <div className="steps">
          <div className="step">
            <h4>De onde o raio sai</h4>
            <p>
              Origem = o ponto onde a suspensão é parafusada no chassi (
              <code>mPosition</code>, espaço local), convertido pro mundo.
              Direção = a direção da suspensão (padrão{' '}
              <code>{'{0, -1, 0}'}</code>), <b>girada junto com o corpo</b> — se o
              veículo inclina, os raios inclinam junto.
              <span className="learn">
                <code>VehicleConstraint.cpp:201–202</code>
              </span>
            </p>
          </div>
          <div className="step">
            <h4>Que tamanho ele tem</h4>
            <p>
              <code>ray_length = mSuspensionMaxLength + mRadius</code>. O raio vai
              até onde o chão <b>encostaria na roda</b> com a suspensão totalmente
              estendida — nem um centímetro além.
              <span className="learn">
                <code>VehicleCollisionTester.cpp:32</code>
              </span>
            </p>
          </div>
          <div className="step">
            <h4>O que ele recusa como chão</h4>
            <p>
              O próprio veículo (<code>IgnoreSingleBodyFilter</code>, pra não bater
              no chassi), <b>sensores</b> (<code>:56</code>) e{' '}
              <b>superfícies mais íngremes que 80°</b> —{' '}
              <code>normal.Dot(up) &gt; cos(maxSlopeAngle)</code> (<code>:62</code>
              ). Sem esse último filtro, o veículo escalaria paredes usando a
              suspensão como pé.
            </p>
          </div>
          <div className="step">
            <h4>E a conversão que é o coração da coisa</h4>
            <p>
              <code>
                outSuspensionLength = max(0, ray_length × fraction − wheel_radius)
              </code>
              . A distância medida até o chão, <b>menos o raio da roda</b>, é{' '}
              <b>o comprimento atual da mola</b>.
              <span className="learn">
                <code>VehicleCollisionTester.cpp:100</code> · aqui a geometria do
                mundo vira o estado do sistema mecânico.
              </span>
            </p>
          </div>
        </div>

        <div className="fig">
          <svg viewBox="0 0 760 330" role="img" aria-label="Raio da suspensão saindo do chassi, comprimento igual a curso máximo mais raio da roda, e a conversão em comprimento de mola">
            {/* chassi */}
            <rect x="180" y="40" width="420" height="44" rx="8" fill="var(--surface-2)" stroke="var(--line)" strokeWidth="1.5" />
            <text x="390" y="68" textAnchor="middle" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="12">
              chassi · o único RigidBody
            </text>

            {/* ponto de fixacao + rotulo a direita */}
            <circle cx="390" cy="84" r="5" fill="var(--cyan)" />
            <text x="406" y="100" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="10">
              mPosition · origem do raio
            </text>

            {/* raio */}
            <line x1="390" y1="84" x2="390" y2="252" stroke="var(--cyan)" strokeWidth="2" strokeDasharray="6 4" />
            <polygon points="390,262 384,246 396,246" fill="var(--cyan)" />

            {/* chao */}
            <line x1="100" y1="228" x2="700" y2="228" stroke="var(--ink-dim)" strokeWidth="2" />
            <text x="100" y="250" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              chão · o corpo 2 da constraint
            </text>

            {/* ponto de contato */}
            <circle cx="390" cy="228" r="5" fill="var(--amber)" />

            {/* roda imaginaria, tangente ao chao */}
            <circle cx="390" cy="186" r="42" fill="none" stroke="var(--amber)" strokeWidth="1.6" strokeDasharray="5 5" />
            <text x="446" y="182" fill="var(--amber)" fontFamily="var(--mono)" fontSize="10">
              a roda não existe na física
            </text>
            <text x="446" y="197" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="9">
              é o raio subtraído no fim da conta
            </text>

            {/* cota suspensionLength */}
            <line x1="300" y1="84" x2="300" y2="144" stroke="var(--violet)" strokeWidth="1.4" />
            <line x1="294" y1="84" x2="306" y2="84" stroke="var(--violet)" strokeWidth="1.4" />
            <line x1="294" y1="144" x2="306" y2="144" stroke="var(--violet)" strokeWidth="1.4" />
            <text x="288" y="118" textAnchor="end" fill="var(--violet)" fontFamily="var(--mono)" fontSize="10">
              suspensionLength
            </text>

            {/* cota mRadius */}
            <line x1="300" y1="144" x2="300" y2="228" stroke="var(--amber)" strokeWidth="1.4" />
            <line x1="294" y1="228" x2="306" y2="228" stroke="var(--amber)" strokeWidth="1.4" />
            <text x="288" y="190" textAnchor="end" fill="var(--amber)" fontFamily="var(--mono)" fontSize="10">
              mRadius
            </text>

            {/* cota ray_length */}
            <line x1="660" y1="84" x2="660" y2="228" stroke="var(--cyan)" strokeWidth="1.4" />
            <line x1="654" y1="84" x2="666" y2="84" stroke="var(--cyan)" strokeWidth="1.4" />
            <line x1="654" y1="228" x2="666" y2="228" stroke="var(--cyan)" strokeWidth="1.4" />
            <text x="674" y="150" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="10">
              ray_length
            </text>
            <text x="674" y="165" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="9">
              maxLength
            </text>
            <text x="674" y="178" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="9">
              + raio
            </text>

            {/* formula */}
            <text x="380" y="304" textAnchor="middle" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="11">
              suspensionLength = (distância medida) − mRadius
            </text>
          </svg>
          <div className="cap">
            <b>A bengala de cego.</b> Não existe roda na simulação: existe um raio
            que mede a distância até o chão e finge que tem uma esfera de raio{' '}
            <code>mRadius</code> na ponta. O que sobra é o curso da suspensão.
          </div>
        </div>
      </section>

      {/* 04 · os tres testers */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">04</span>
          <h2>Três bengalas diferentes, mesma interface</h2>
        </div>
        <p className="sec-intro">
          O <code>VehicleCollisionTester</code> é abstrato de propósito: o modo de
          detectar o chão é <b>plugável</b>, e a escolha é um dial explícito entre
          custo e fidelidade.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Tester</th>
                <th>O que dispara</th>
                <th>Custo × fidelidade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">…TesterRay</td>
                <td>Um raio — uma linha infinitamente fina.</td>
                <td>
                  Mais barato. Um degrau “aparece” de repente sob o raio: a roda
                  sobe num tranco.
                </td>
              </tr>
              <tr>
                <td className="mono">…TesterCastSphere</td>
                <td>Uma esfera varrida ao longo da direção da suspensão.</td>
                <td>
                  Intermediário. A esfera <b>sobe suave</b> num meio-fio, como uma
                  roda de verdade faria.
                </td>
              </tr>
              <tr className="amber">
                <td className="mono">…TesterCastCylinder</td>
                <td>Um cilindro — a forma real da roda, com largura.</td>
                <td>
                  Mais caro e mais fiel. Sente a largura do pneu e o contato
                  inclinado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout amber">
          <b>Relevância direta pro rover.</b> Rover em terreno acidentado é
          exatamente o caso em que a diferença entre raio e cilindro aparece —
          pedra, degrau, borda de cratera. Esse dial existe pronto no Jolt; no
          Godot, o <code>VehicleWheel3D</code> não me dá essa escolha. Vale
          registrar como requisito quando a{' '}
          <a href={raycastHref}>frente de integração roda–solo</a> voltar à pauta.
        </div>
      </section>

      {/* 05 · o que mais a percepcao coleta */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">05</span>
          <h2>O que mais a etapa de percepção coleta</h2>
        </div>
        <p className="sec-intro">
          Achar o chão é só o começo. Depois do contato, o Jolt monta mais duas
          coisas que eu, no meu protótipo, calculo na mão — e que explicam por que
          o veículo dele se comporta bem em situações que o meu trataria como caso
          especial.
        </p>

        <div className="duo">
          <div className="facet">
            <div className="tag">eixos no plano do chão</div>
            <h4>Ladeira sai de graça</h4>
            <p>
              As direções de tração e de derrapagem são construídas{' '}
              <b>a partir da normal do contato</b>, não do chassi:{' '}
              <code>longitudinal = normal × right</code>, depois{' '}
              <code>lateral = longitudinal × normal</code>. Numa ladeira, “pra
              frente” é a frente <b>da ladeira</b> — sem nenhum caso especial no
              código.
              <span className="learn">
                <code>VehicleConstraint.cpp:261–271</code>
              </span>
            </p>
          </div>
          <div className="facet amber">
            <div className="tag">velocidade do chão</div>
            <h4>Plataforma móvel sai de graça</h4>
            <p>
              Ele guarda{' '}
              <code>mContactBody-&gt;GetPointVelocity(contactPosition)</code> e
              trabalha com a <b>diferença</b> de velocidade, não com a velocidade
              absoluta do veículo. Resultado: andar sobre uma plataforma em
              movimento, ou sobre outro veículo, funciona sem uma linha extra.
              <span className="learn">
                <code>VehicleConstraint.cpp:246</code>
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* 06 · o ciclo */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">06</span>
          <h2>O ciclo de um passo: percepção × resolução</h2>
        </div>
        <p className="sec-intro">
          A <code>VehicleConstraint</code> é <b>duas coisas ao mesmo tempo</b>, e é
          isso que permite os dois paradigmas conviverem:
        </p>

        <div className="code-block">
          <div className="fname">Jolt/Physics/Vehicle/VehicleConstraint.h:65</div>
          <pre>
            <code>
              {`class VehicleConstraint : public Constraint, public PhysicsStepListener`}
            </code>
          </pre>
        </div>

        <div className="steps" style={{marginTop: 24}}>
          <div className="step">
            <h4>
              <code>PhysicsStepListener</code> — “me avise <em>antes</em> do passo”
            </h4>
            <p>
              É o gancho que dá à constraint uma chance de rodar código{' '}
              <b>fora</b> do solver, uma vez por passo. É onde o raycast acontece.
            </p>
          </div>
          <div className="step">
            <h4>
              <code>Constraint</code> — “e me inclua <em>dentro</em> do passo”
            </h4>
            <p>
              É o que faz o solver de impulsos considerar as equações do veículo
              junto com todas as outras restrições da cena, iterando várias vezes.
            </p>
          </div>
        </div>

        <div className="fig">
          <svg viewBox="0 0 760 250" role="img" aria-label="Linha do tempo de um passo de física: percepção uma vez, resolução várias vezes">
            <text x="20" y="26" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="11">
              um passo de física
            </text>

            {/* fase A */}
            <rect x="20" y="46" width="300" height="112" rx="10" fill="var(--surface-2)" stroke="var(--cyan)" strokeWidth="1.6" />
            <text x="40" y="72" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="11">
              FASE A · OnStep() — fora do solver
            </text>
            <text x="40" y="96" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">
              1. callback de input (volante, acelerador)
            </text>
            <text x="40" y="114" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">
              2. RAYCAST por roda → acha o chão
            </text>
            <text x="40" y="132" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">
              3. barras estabilizadoras
            </text>
            <text x="40" y="150" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">
              4. motor distribui torque
            </text>
            <text x="170" y="180" textAnchor="middle" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="12">
              acontece 1× por passo
            </text>
            <text x="170" y="198" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              percepção
            </text>

            {/* seta */}
            <line x1="330" y1="102" x2="418" y2="102" stroke="var(--line)" strokeWidth="2" />
            <polygon points="428,102 414,95 414,109" fill="var(--line)" />

            {/* fase B */}
            <rect x="438" y="46" width="300" height="112" rx="10" fill="var(--surface-2)" stroke="var(--amber)" strokeWidth="1.6" />
            <text x="458" y="72" fill="var(--amber)" fontFamily="var(--mono)" fontSize="11">
              FASE B · dentro do solver
            </text>
            <text x="458" y="96" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">
              SetupVelocityConstraint() · monta equações
            </text>
            <text x="458" y="114" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">
              SolveVelocityConstraint() · aplica impulsos
            </text>
            <text x="458" y="132" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">
              SolvePositionConstraint() · corrige deriva
            </text>
            <text x="588" y="180" textAnchor="middle" fill="var(--amber)" fontFamily="var(--mono)" fontSize="12">
              acontece N× por passo
            </text>
            <text x="588" y="198" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              resolução
            </text>

            {/* loop */}
            <path d="M 458 214 C 458 236, 718 236, 718 214" fill="none" stroke="var(--amber)" strokeWidth="1.6" strokeDasharray="5 4" />
            <polygon points="718,208 712,222 724,222" fill="var(--amber)" />
          </svg>
          <div className="cap">
            <b>Dois ritmos, nenhum conflito.</b> O raycast roda uma vez, fora do
            solver, e produz <em>estado</em>. Os impulsos rodam várias vezes,
            dentro do solver, e produzem <em>movimento</em>. Não são etapas
            concorrentes: são etapas <b>encadeadas</b>.
          </div>
        </div>
      </section>

      {/* 07 · as quatro partes */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">07</span>
          <h2>As quatro equações de cada roda</h2>
        </div>
        <p className="sec-intro">
          Encontrado o chão, cada roda passa a contribuir com quatro restrições
          para o solver — todas do mesmo tipo primitivo,{' '}
          <code>AxisConstraintPart</code> (restrição ao longo de um eixo):
        </p>

        <div className="code-block">
          <div className="fname">Jolt/Physics/Vehicle/Wheel.h:140–143</div>
          <pre>
            <code>
              {`AxisConstraintPart mSuspensionPart;      // movimento ao longo da normal — a mola
AxisConstraintPart mSuspensionMaxUpPart; // o batente rígido no fim do curso
AxisConstraintPart mLongitudinalPart;    // frente/trás — tração e freio
AxisConstraintPart mLateralPart;         // lado — derrapagem`}
            </code>
          </pre>
        </div>

        <h3 style={{marginTop: 34}}>A mola, em três detalhes que revelam cuidado</h3>

        <div className="steps">
          <div className="step">
            <h4>O erro da mola é uma subtração</h4>
            <p>
              <code>
                c = suspensionLength − mSuspensionMaxLength − mSuspensionPreloadLength
              </code>
              . Se a suspensão está totalmente estendida, <code>c = 0</code> e não
              há força. Comprimida, <code>c</code> fica negativo e a mola empurra.
              <span className="learn">
                <code>VehicleConstraint.cpp:506</code>
              </span>
            </p>
          </div>
          <div className="step">
            <h4>Rigidez em frequência, não em N/m</h4>
            <p>
              Você declara “esta suspensão oscila a <b>1.5 Hz</b> com amortecimento{' '}
              <b>0.5</b>”, e o Jolt converte pra rigidez usando a{' '}
              <b>massa efetiva</b> do veículo naquele ponto. É afinar suspensão como
              engenheiro afina, não chutando constante de mola.
            </p>
          </div>
          <div className="step">
            <h4>A mola só empurra</h4>
            <p>
              Na hora de resolver, o intervalo de impulso permitido é{' '}
              <code>[0, FLT_MAX]</code> — <b>mínimo zero</b>. O chão não gruda na
              roda. Óbvio fisicamente, mas alguém teve que escrever aquele{' '}
              <code>0.0f</code>.
              <span className="learn">
                <code>VehicleConstraint.cpp:576</code>
              </span>
            </p>
          </div>
        </div>

        <div className="callout">
          <b>E depois da mola, a parede.</b> Se a suspensão passa do curso mínimo (
          <code>VehicleConstraint.cpp:514</code>), entra a{' '}
          <code>mSuspensionMaxUpPart</code> — uma constraint <b>rígida</b> que
          simplesmente proíbe continuar afundando. Mola macia até o limite, batente
          duro depois. <b>É exatamente o par que o <code>SliderJoint3D</code> do
          Godot não consegue formar:</b> lá só sobra a segunda metade.
        </div>
      </section>

      {/* 08 · mu N */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">08</span>
          <h2>O reencontro: μ · N, o mesmo clamp do meu bug</h2>
        </div>
        <p className="sec-intro">
          Falta a pergunta mais importante pro meu projeto: como o Jolt impede que
          a tração e o grip apliquem mais força do que o pneu aguenta? O callback
          padrão responde em duas linhas:
        </p>

        <div className="code-block">
          <div className="fname">Jolt/Physics/Vehicle/WheeledVehicleController.h:193–195</div>
          <pre>
            <code>
              {`outLongitudinalImpulse = inLongitudinalFriction * inSuspensionImpulse;
outLateralImpulse      = inLateralFriction      * inSuspensionImpulse;`}
            </code>
          </pre>
        </div>

        <p className="sec-intro" style={{marginTop: 22}}>
          O <code>inSuspensionImpulse</code> vem de{' '}
          <code>w-&gt;GetSuspensionLambda()</code> — <b>o impulso que a mola
          aplicou</b>, ou seja, <b>a carga normal daquela roda</b>. Traduzindo:
        </p>

        <div className="formula">
          impulso máximo do pneu = μ × N
          <small>
            coeficiente de atrito × carga normal — o círculo de atrito
          </small>
        </div>

        <div className="stat" style={{marginTop: 24, borderColor: 'var(--amber)'}}>
          É <b>exatamente</b> o clamp que eu implementei na mão pra parar de ejetar
          o rover da cena.
        </div>

        <div className="tbl-wrap" style={{marginTop: 26}}>
          <table className="ctab">
            <thead>
              <tr>
                <th></th>
                <th>Meu protótipo raycast</th>
                <th>Jolt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fórmula do limite</td>
                <td>μ · N</td>
                <td>
                  μ · N — <b>idêntica</b>
                </td>
              </tr>
              <tr>
                <td>De onde vem o N</td>
                <td>Eu calculo a força da mola</td>
                <td>
                  <code>GetSuspensionLambda()</code> — o impulso que o solver já
                  aplicou neste passo
                </td>
              </tr>
              <tr>
                <td>Onde o limite age</td>
                <td>Eu limito a força antes de aplicar</td>
                <td>
                  Vira o <b>mín/máx do impulso</b> que o solver tem permissão de
                  usar
                </td>
              </tr>
              <tr className="amber">
                <td>Se estourar</td>
                <td>O erro cresce no quadro seguinte — foi o bug da ejeção</td>
                <td>Não há como estourar: o limite é parte da equação</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout amber">
          <b>O que eu tiro disso.</b> A correção que eu fiz no protótipo não foi
          gambiarra — é o caminho canônico, o mesmo que uma biblioteca de física
          madura usa. A diferença entre os dois não está na física; está em{' '}
          <b>onde o limite mora</b>: fora do solver, como um cuidado meu, ou dentro
          dele, como parte da formulação. Isso é a versão concreta da distinção
          “penalidade × constraint” que abriu esta frente.
        </div>

        <div className="callout">
          <b>Um refinamento a mais no carro.</b> No{' '}
          <code>WheeledVehicleController</code> o μ não é fixo: é uma{' '}
          <b>curva por deslizamento</b> — o pneu agarra mais a 6% de slip (
          <code>1.2</code>) do que parado (<code>0.0</code>) ou patinando muito (
          <code>1.0</code>). É comportamento real de pneu. No tanque, μ é{' '}
          <b>constante</b>: esteira não tem curva de slip.
          <span style={{display: 'block', marginTop: 8, opacity: 0.75}}>
            <code>WheeledVehicleController.cpp:47–55</code>
          </span>
        </div>
      </section>

      {/* 09 · dois detalhes */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">09</span>
          <h2>Dois detalhes de engenharia que valem registrar</h2>
        </div>

        <div className="duo">
          <div className="facet">
            <div className="tag">artifício de jogo</div>
            <h4>A constraint anticapotamento</h4>
            <p>
              Existe uma <code>mPitchRollPart</code> que mantém o “pra cima” do
              veículo dentro de um cone, pra ele não tombar (
              <code>VehicleConstraint.cpp:400</code>). É conveniência de jogo, não
              física pura — <b>num rover eu provavelmente vou querer desligar</b>,
              porque capotar é um resultado legítimo que eu quero medir.
            </p>
          </div>
          <div className="facet amber">
            <div className="tag">otimização</div>
            <h4>Nem toda roda faz raycast todo passo</h4>
            <p>
              Existe <code>mNumStepsBetweenCollisionTestActive</code>: nos passos
              pulados, o Jolt usa <code>PredictContactProperties</code>, que{' '}
              <b>extrapola</b> assumindo que o chão é um plano infinito com a mesma
              normal. Raycast é caro; na maior parte do tempo o chão não mudou.
              <span className="learn">
                <code>VehicleConstraint.cpp:190, 205–222</code>
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* 10 · sintese */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">10</span>
          <h2>O que essa leitura muda</h2>
        </div>

        <div className="steps">
          <div className="step">
            <h4>Raycast e constraint são etapas, não escolhas</h4>
            <p>
              O raycast é a <b>percepção</b> (1× por passo, fora do solver): acha o
              chão e converte geometria em estado. A constraint é a{' '}
              <b>resolução</b> (N× por passo, dentro do solver): converte estado em
              impulso. Dizer “raycast <em>ou</em> multicorpo” é uma falsa escolha —
              o Jolt encadeia os dois.
            </p>
          </div>
          <div className="step">
            <h4>Meu protótipo já tem a primeira metade</h4>
            <p>
              O <code>RayCast3D</code> do Godot me dá a percepção completa: eu sei
              onde bati, com que normal, contra qual corpo. O que eu faço na mão,
              com força explícita, é a <b>segunda</b> metade.
              <span className="learn">
                É por isso que o problema aparece como instabilidade: eu escrevo a
                resolução do lado de fora do solver.
              </span>
            </p>
          </div>
          <div className="step">
            <h4>E é exatamente a segunda metade que falta no Godot</h4>
            <p>
              Nem pela <code>VehicleConstraint</code> (não exposta), nem pelo{' '}
              <code>SliderJoint3D</code> (que no backend Jolt perde a mola e vira
              só batente). O levantamento feature a feature está em{' '}
              <a href={comparativoHref}>O tanque do Jolt e o teto do Godot</a>.
            </p>
          </div>
          <div className="step">
            <h4>A <code>VehicleConstraint</code> não é o rover articulado</h4>
            <p>
              Ela é um modelo <em>lumped</em> de um corpo só, muito bem feito.
              Rocker-bogie com braços que pivotam continua sendo um problema de
              multicorpo de verdade — que nem o Jolt entrega pronto.
              <span className="learn">
                Corrige uma expectativa que eu carregava: “expor a VehicleConstraint
                no Godot” resolveria o veículo, não o rover articulado.
              </span>
            </p>
          </div>
        </div>

        <div className="callout coral">
          <b>Em aberto.</b> Se o rover for <b>skid-steer</b>, o{' '}
          <code>TrackedVehicleController</code> é o modelo de referência e a via do
          nó pronto do Godot está fechada. Se for <b>rocker-bogie articulado</b>,
          nenhuma das duas vias resolve sozinha — seria multicorpo montado à mão,
          com o contato roda–solo ainda por cima. A decisão do esquema de direção
          continua pendente com o professor.
        </div>

        <h3 style={{marginTop: 34}}>Fontes</h3>
        <p className="sec-intro" style={{marginBottom: 14}}>
          Todas as citações vêm do repositório clonado localmente, commit{' '}
          <code>2e28006e</code>, pasta <code>Jolt/Physics/Vehicle/</code>. Os links
          apontam pro mesmo arquivo na branch <code>master</code>.
        </p>
        <div className="refs">
          <div className="rgrp">a constraint e seu ciclo</div>
          <a href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Vehicle/VehicleConstraint.h" target="_blank" rel="noopener noreferrer">
            <span>
              VehicleConstraint.h
              <span className="rd">
                :65 herança dupla · :218 o corpo único
              </span>
            </span>
            <span className="rk">↗ header</span>
          </a>
          <a href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Vehicle/VehicleConstraint.cpp" target="_blank" rel="noopener noreferrer">
            <span>
              VehicleConstraint.cpp
              <span className="rd">
                :152 OnStep · :201 origem do raio · :246 velocidade do chão · :261
                eixos · :425 setup · :506 erro da mola · :564 solve
              </span>
            </span>
            <span className="rk">↗ código</span>
          </a>

          <div className="rgrp">o contato pneu–solo</div>
          <a href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Vehicle/VehicleCollisionTester.h" target="_blank" rel="noopener noreferrer">
            <span>
              VehicleCollisionTester.h
              <span className="rd">os três testers: raio, esfera e cilindro</span>
            </span>
            <span className="rk">↗ header</span>
          </a>
          <a href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Vehicle/VehicleCollisionTester.cpp" target="_blank" rel="noopener noreferrer">
            <span>
              VehicleCollisionTester.cpp
              <span className="rd">
                :19 Collide · :32 comprimento do raio · :62 filtro de parede · :100
                a conversão em comprimento de mola
              </span>
            </span>
            <span className="rk">↗ código</span>
          </a>

          <div className="rgrp">a roda e o limite de atrito</div>
          <a href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Vehicle/Wheel.h" target="_blank" rel="noopener noreferrer">
            <span>
              Wheel.h
              <span className="rd">
                :136 a roda como dados · :140 as quatro AxisConstraintPart
              </span>
            </span>
            <span className="rk">↗ header</span>
          </a>
          <a href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Vehicle/WheeledVehicleController.h" target="_blank" rel="noopener noreferrer">
            <span>
              WheeledVehicleController.h
              <span className="rd">:193 o clamp μ · N como callback padrão</span>
            </span>
            <span className="rk">↗ header</span>
          </a>
          <a href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Vehicle/WheeledVehicleController.cpp" target="_blank" rel="noopener noreferrer">
            <span>
              WheeledVehicleController.cpp
              <span className="rd">:47–55 as curvas de atrito por deslizamento</span>
            </span>
            <span className="rk">↗ código</span>
          </a>
        </div>
      </section>
    </div>
  );
}
