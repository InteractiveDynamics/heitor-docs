import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Doc técnica · Dinâmica multicorpo · Semana 10–17/ago/2026, dias 1 a 3.
 * Executa a Faixa A do roadmap docs/roadmaps/semana-2026-08-10 (pontos 1 e 2 da
 * reunião de 10/08): rodar um sample real do Jolt (Tank Controller), montar o
 * comparativo formal Jolt × Godot verificado nos headers do próprio Jolt, e
 * tentar replicar o cenário no Godot com nós Joint3D até bater no limite.
 *
 * Fonte: sources/semana-jolt-sample/anotacoes-dias-1-3.md (anotações do Heitor).
 * Cobre segunda, terça e quarta — a Faixa B (GDExtension, GDChrono) segue em
 * aberto.
 *
 * Renderiza sob `.dossie .tecnica .mcorpo .jgodot`: assinatura do dossiê
 * (dossie.css), primitivas técnicas (tecnica.css) e as peças de multicorpo.css —
 * mesma família visual da entrada anterior desta frente. O que é só desta doc
 * (a tabela comparativa de 4 colunas) fica em jolt-godot.css, sob `.jgodot`.
 */
export default function DossieJoltGodot() {
  const roadmapHref = useBaseUrl('/docs/roadmaps/semana-2026-08-10');
  const quinzenaHref = useBaseUrl('/docs/multicorpo/constraints-e-jolt');
  const dossieHref = useBaseUrl('/docs/notas/dossie-godot');
  const porDentroHref = useBaseUrl('/docs/multicorpo/vehicleconstraint-por-dentro');

  return (
    <div className="dossie tecnica mcorpo jgodot">
      {/* faixa de telemetria */}
      <div className="telemetry-strip">
        <span>
          <span className="dot" />
          dias · 10 a 12 ago
        </span>
        <span>
          engine · <b>Godot 4.6.3 · Jolt</b>
        </span>
        <span>
          sample-âncora · <b>Tank Controller</b>
        </span>
        <span>
          fonte · <b>headers do Jolt</b>
        </span>
        <span>
          escopo · <b>medir o limite</b>
        </span>
      </div>

      {/* hero */}
      <header className="hero-block">
        <div className="eyebrow">Execução · pontos 1 e 2 da reunião de 10/08</div>
        <h1>
          O tanque do Jolt e o <span className="accent">teto do Godot</span>.
        </h1>
        <p className="lede">
          A quinzena anterior fechou o arco conceitual do multicorpo no papel.
          Esta entrada é a parte empírica: rodei um sample <strong>real</strong>{' '}
          do Jolt, abri os headers em C++ pra descobrir de que peças ele é feito,
          e depois tentei remontar a mesma ideia no editor do Godot com nós{' '}
          <code>Joint3D</code>. O resultado é o{' '}
          <strong>comparativo formal Jolt × Godot</strong> — o entregável-âncora
          da semana — e a confirmação, na prática, de onde o caminho pelo nó
          pronto termina.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>Em resumo:</b> o Jolt tem uma peça chamada{' '}
          <code>VehicleConstraint</code> que resolve suspensão, contato e atrito
          de roda dentro do solver. O Godot tem um nó chamado{' '}
          <code>VehicleBody3D</code> que <b>não é</b> essa peça — é uma
          reimplementação própria, com nome parecido. E as juntas primitivas que
          sobram (<code>SliderJoint3D</code>) perdem a mola quando rodam sobre
          Jolt. Ou seja: pela via dos nós prontos, <b>não dá</b>.
        </div>

        <dl className="hero-meta">
          <div>
            <dt>Sample-âncora</dt>
            <dd>Tank Controller Demo (JoltPhysics.js)</dd>
          </div>
          <div>
            <dt>Método</dt>
            <dd>Fonte primária: headers e issues</dd>
          </div>
          <div>
            <dt>Achado central</dt>
            <dd>VehicleBody3D ≠ VehicleConstraint</dd>
          </div>
          <div>
            <dt>Regra de ouro</dt>
            <dd>Junta conecta irmãos, nunca pai-filho</dd>
          </div>
        </dl>
      </header>

      {/* 00 · os três dias */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">00</span>
          <h2>Os três dias, etapa por etapa</h2>
        </div>
        <p className="sec-intro">
          O plano da semana está no roadmap{' '}
          <a href={roadmapHref}>10–17 ago · Do conceito ao sample rodando</a>. Ele
          separa a semana em duas faixas: a <b>Faixa A</b> (pontos 1 e 2 — provar
          até onde o Godot vai) de segunda a quarta, e a <b>Faixa B</b> (pontos 3
          e 4 — a ponte C++) de quinta em diante. Esta entrada documenta a Faixa A
          inteira; a Faixa B segue em aberto.
        </p>

        <div className="tl">
          <div className="tl-stop done">
            <div className="tl-when">
              <span className="wk">dia 1</span>
              seg · 10 ago
            </div>
            <div className="tl-what">
              <h4>Rodar o sample do Jolt</h4>
              <p>
                Demo web do JoltPhysics.js, categoria Constraints e o{' '}
                <b>Tank Controller</b> dirigido na mão. Bloco 01.
              </p>
            </div>
          </div>
          <div className="tl-stop done">
            <div className="tl-when">
              <span className="wk">dia 2</span>
              ter · 11 ago
            </div>
            <div className="tl-what">
              <h4>Comparativo formal Jolt × Godot</h4>
              <p>
                Anatomia do tanque lida nos headers, a distinção{' '}
                <code>VehicleBody3D</code> × <code>VehicleConstraint</code> e a
                tabela consolidada. Blocos 02 a 05.
              </p>
            </div>
          </div>
          <div className="tl-stop done">
            <div className="tl-when">
              <span className="wk">dia 3</span>
              qua · 12 ago
            </div>
            <div className="tl-what">
              <h4>Replicar no Godot com <code>Joint3D</code></h4>
              <p>
                Chassi + suspensão por <code>SliderJoint3D</code>, dois achados
                duros e o teste que bate seco. Bloco 06.
              </p>
            </div>
          </div>
          <div className="tl-stop open">
            <div className="tl-when">
              <span className="wk">em aberto</span>
              a partir de 13 ago
            </div>
            <div className="tl-what">
              <h4>Faixa B · a ponte C++</h4>
              <p>
                Ponto 3: ler a doc do <b>GDExtension</b> (conceito, não construir
                extensão de produção). Ponto 4: espelhar o <b>GDChrono</b> do
                professor pro Jolt. Nada disso entrou nestes três dias.
              </p>
            </div>
          </div>
        </div>

        <div className="callout">
          <b>Nota de método.</b> Tudo aqui foi verificado em{' '}
          <b>fonte primária</b> — código-fonte do Jolt e issues oficiais do
          Godot —, não em documentação secundária ou tutorial. Quando a conclusão
          depende de uma evidência específica, o link está no fim da página.
        </div>
      </section>

      {/* 01 · dia 1 */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">01</span>
          <h2>Dia 1 · o tanque rodando</h2>
          <span className="when">10 ago</span>
        </div>
        <p className="sec-intro">
          O caminho mais curto pra ver o Jolt de verdade não é compilar os samples
          nativos: é a build <b>WebAssembly</b> (JoltPhysics.js), que roda no
          navegador sem nenhum setup. Passei pela categoria{' '}
          <b>Constraints</b> — as juntas “puras”, o vocabulário primitivo do motor
          — e escolhi como <b>sample-âncora da semana</b> o{' '}
          <b>Tank Controller Demo</b>: um tanque de esteiras acionado por{' '}
          <code>VehicleConstraint</code> + <code>TrackedVehicleController</code>.
          Dirigi na mão pra ver o comportamento.
        </p>

        <div className="stat">
          O tanque gira em torno do próprio eixo, com uma física visivelmente mais
          estável que a do meu protótipo raycast. Saí do dia com duas dúvidas — e
          as duas viraram achado.
        </div>

        <div className="duo" style={{marginTop: 26}}>
          <div className="facet">
            <div className="tag">dúvida 1 · esclarecida</div>
            <h4>Por que ele gira no próprio eixo?</h4>
            <p>
              É <b>direção diferencial</b> (<em>skid-steering</em>): cada esteira
              recebe uma velocidade diferente — uma pra frente, a outra pra trás
              ou mais devagar — e o torque resultante dos dois lados faz o corpo
              pivotar. Não tem nada de mágico nem hardcoded: é distribuição de
              forças normal, com um <b>controlador específico</b> por trás
              decidindo a velocidade de cada lado.
            </p>
          </div>
          <div className="facet amber">
            <div className="tag">dúvida 2 · esclarecida</div>
            <h4>Por que a física parece tão mais estável?</h4>
            <p>
              O solver do Jolt resolve <b>todas</b> as constraints e contatos{' '}
              <b>simultaneamente e de forma implícita</b>, a cada passo. Meu{' '}
              <code>ground_contact.gd</code> aplica força <b>explícita</b> por
              raycast, quadro a quadro. Foi essa diferença de{' '}
              <b>arquitetura</b> — não a matemática em si — que causou o bug de
              ejeção que resolvi com o clamp do círculo de atrito.
            </p>
          </div>
        </div>

        <div className="fig">
          <svg viewBox="0 0 720 250" role="img" aria-label="Direção diferencial: esteiras com velocidades opostas geram torque de guinada">
            <text x="18" y="26" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="11">
              vista de cima · skid-steering
            </text>

            {/* corpo do tanque */}
            <rect x="270" y="70" width="180" height="110" rx="10" fill="var(--surface-2)" stroke="var(--line)" strokeWidth="1.5" />
            <text x="360" y="130" textAnchor="middle" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="12">
              chassi
            </text>

            {/* esteira esquerda */}
            <rect x="238" y="60" width="26" height="130" rx="8" fill="none" stroke="var(--cyan)" strokeWidth="2" />
            <line x1="251" y1="170" x2="251" y2="82" stroke="var(--cyan)" strokeWidth="3" />
            <polygon points="251,64 245,84 257,84" fill="var(--cyan)" />
            <text x="222" y="215" textAnchor="middle" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="11">
              esteira E · +v
            </text>

            {/* esteira direita */}
            <rect x="456" y="60" width="26" height="130" rx="8" fill="none" stroke="var(--amber)" strokeWidth="2" />
            <line x1="469" y1="80" x2="469" y2="168" stroke="var(--amber)" strokeWidth="3" />
            <polygon points="469,186 463,166 475,166" fill="var(--amber)" />
            <text x="500" y="215" textAnchor="middle" fill="var(--amber)" fontFamily="var(--mono)" fontSize="11">
              esteira D · −v
            </text>

            {/* torque resultante */}
            <path d="M 322 125 A 38 38 0 1 1 398 125" fill="none" stroke="var(--violet)" strokeWidth="2.5" strokeDasharray="5 4" />
            <polygon points="398,125 390,112 406,112" fill="var(--violet)" />
            <text x="360" y="60" textAnchor="middle" fill="var(--violet)" fontFamily="var(--mono)" fontSize="11">
              torque de guinada
            </text>

            {/* origem do comando */}
            <text x="18" y="120" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="11">
              input L/R
            </text>
            <line x1="90" y1="115" x2="196" y2="115" stroke="var(--line)" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="143" y="106" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              TrackedVehicleController
            </text>
          </svg>
          <div className="cap">
            <b>Nenhuma roda gira pra virar.</b> A direção sai da diferença de
            velocidade entre os dois lados — é isso que o{' '}
            <code>VehicleWheel3D.steering</code> do Godot, que só cobre esquema
            Ackermann, não sabe fazer.
          </div>
        </div>

        <div className="callout amber">
          <b>Anotação-chave do dia.</b> “Tanque usa{' '}
          <code>VehicleConstraint</code> com direção diferencial — Godot não expõe
          isso.” Foi essa frase que virou a pergunta do dia 2.
        </div>
      </section>

      {/* 02 · anatomia do tank */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">02</span>
          <h2>Dia 2 · de que peças o tanque é feito</h2>
          <span className="when">11 ago</span>
        </div>
        <p className="sec-intro">
          Pra montar um comparativo que sustente decisão arquitetural, não dá pra
          confiar em descrição de tutorial. Clonei o{' '}
          <code>jrouwe/JoltPhysics</code> e fui ler os headers direto, na branch{' '}
          <code>master</code>, dentro de <code>Jolt/Physics/Vehicle/</code>. Cada
          linha da tabela abaixo saiu de um arquivo real.
        </p>

        <div className="code-block">
          <div className="fname">Jolt/Physics/Vehicle/ · os headers lidos</div>
          <pre>
            <code>
              {`VehicleConstraint.h        // a constraint composta — o container de tudo
Wheel.h                    // roda: raycast/shape-cast, suspensão, atrito
TrackedVehicleController.h // o controlador do tanque: motor + transmissão
VehicleTrack.h             // uma esteira: razão própria + multiplicador E/D
VehicleDifferential.h      // divisão de torque (usado no controlador de carro)`}
            </code>
          </pre>
        </div>

        <div className="tbl-wrap" style={{marginTop: 26}}>
          <table className="ctab">
            <thead>
              <tr>
                <th>Peça</th>
                <th>O que faz (confirmado em código)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">VehicleConstraint</td>
                <td>
                  Constraint <b>composta</b> — containeriza tudo abaixo e entrega
                  o conjunto pronto pro solver.
                </td>
              </tr>
              <tr>
                <td className="mono">Wheel · contato</td>
                <td>
                  Raycast ou shape-cast por roda. <b>Mesmo princípio</b> do meu{' '}
                  <code>RayCast3D</code> — só que embutido na constraint, não
                  solto num script.
                </td>
              </tr>
              <tr>
                <td className="mono">Wheel · suspensão</td>
                <td>
                  Mola por roda, com curso dedicado (
                  <code>mSuspensionMinLength</code> /{' '}
                  <code>mSuspensionMaxLength</code>).
                </td>
              </tr>
              <tr>
                <td className="mono">TrackedVehicleController</td>
                <td>
                  Dono do <b>motor</b> (<code>VehicleEngine</code>, curva de
                  torque × RPM) e da <b>transmissão</b> (
                  <code>VehicleTransmission</code>) — <b>únicos</b>, compartilhados
                  pelas duas esteiras.
                </td>
              </tr>
              <tr>
                <td className="mono">VehicleTrack</td>
                <td>
                  Uma por lado. Tem razão de engrenagem própria (
                  <code>mDifferentialRatio</code>) mais um multiplicador (
                  <code>mLeftRatio</code> / <code>mRightRatio</code>) — <b>é esse
                  multiplicador que produz o skid-steer</b>.
                </td>
              </tr>
              <tr>
                <td className="mono">Atrito por roda</td>
                <td>
                  Coeficientes fixos (<code>mLongitudinalFriction</code>,{' '}
                  <code>mLateralFriction</code>) — mais simples que o modelo de
                  carro, que usa curva de <em>slip</em>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout coral">
          <b>Correção que registrei.</b> Minha primeira leitura foi “cada esteira
          tem seu próprio motor”. <b>Errado.</b> São <b>um motor e uma transmissão
          únicos</b>; o que diferencia esquerda de direita é só o multiplicador de
          razão de cada <code>VehicleTrack</code>. A diferença importa: o torque
          disponível é um recurso compartilhado, não dois independentes.
        </div>

        <p className="sec-intro" style={{marginTop: 26}}>
          Este bloco levanta <b>de que peças</b> o veículo do Jolt é feito. Como
          elas operam por dentro — o raycast que encontra o chão, o ciclo de um
          passo de física e as equações de cada roda — está em{' '}
          <a href={porDentroHref}>Um corpo só, quatro bengalas</a>.
        </p>
      </section>

      {/* 03 · VehicleBody3D ≠ VehicleConstraint */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">03</span>
          <h2>
            A dúvida grande: <code>VehicleBody3D</code> é o{' '}
            <code>VehicleConstraint</code>?
          </h2>
          <span className="when">11 ago</span>
        </div>
        <p className="sec-intro">
          O Godot 4.6 passou a usar o Jolt como backend padrão de física. A
          pergunta óbvia, então: quando eu ponho um <code>VehicleBody3D</code> na
          cena rodando sobre Jolt, estou usando o <code>VehicleConstraint</code>{' '}
          real por baixo? A resposta muda tudo — se fosse sim, a semana inteira
          seria desnecessária.
        </p>

        <div className="stat" style={{borderColor: 'var(--coral)'}}>
          Não. São duas implementações completamente separadas, com nome parecido.
        </div>

        <div className="fig">
          <svg viewBox="0 0 760 300" role="img" aria-label="VehicleBody3D passa pelo PhysicsServer3D e é reimplementado por cada backend; VehicleConstraint vive dentro do Jolt">
            {/* coluna Godot */}
            <text x="20" y="26" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="11">
              caminho do nó do Godot
            </text>
            <rect x="20" y="42" width="200" height="48" rx="8" fill="var(--surface-2)" stroke="var(--cyan)" strokeWidth="1.6" />
            <text x="120" y="66" textAnchor="middle" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="12">
              VehicleBody3D
            </text>
            <text x="120" y="82" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              nó da cena
            </text>

            <line x1="120" y1="90" x2="120" y2="122" stroke="var(--line)" strokeWidth="1.6" />
            <polygon points="120,128 115,118 125,118" fill="var(--line)" />

            <rect x="20" y="128" width="200" height="44" rx="8" fill="var(--surface)" stroke="var(--line)" strokeWidth="1.5" />
            <text x="120" y="155" textAnchor="middle" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="11">
              PhysicsServer3D
            </text>

            <line x1="90" y1="172" x2="70" y2="204" stroke="var(--line)" strokeWidth="1.6" />
            <line x1="150" y1="172" x2="170" y2="204" stroke="var(--line)" strokeWidth="1.6" />

            <rect x="12" y="208" width="112" height="60" rx="8" fill="var(--surface)" stroke="var(--amber)" strokeWidth="1.4" />
            <text x="68" y="232" textAnchor="middle" fill="var(--amber)" fontFamily="var(--mono)" fontSize="10">
              GodotPhysics
            </text>
            <text x="68" y="250" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="9">
              lógica própria
            </text>

            <rect x="132" y="208" width="112" height="60" rx="8" fill="var(--surface)" stroke="var(--amber)" strokeWidth="1.4" />
            <text x="188" y="232" textAnchor="middle" fill="var(--amber)" fontFamily="var(--mono)" fontSize="10">
              backend Jolt
            </text>
            <text x="188" y="250" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="9">
              lógica própria
            </text>

            {/* divisor */}
            <line x1="300" y1="30" x2="300" y2="276" stroke="var(--line-soft)" strokeWidth="1.5" strokeDasharray="6 6" />

            {/* coluna Jolt */}
            <text x="330" y="26" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="11">
              o que existe dentro do Jolt (C++)
            </text>
            <rect x="330" y="42" width="240" height="48" rx="8" fill="var(--surface-2)" stroke="var(--cyan)" strokeWidth="1.6" />
            <text x="450" y="66" textAnchor="middle" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="12">
              VehicleConstraint
            </text>
            <text x="450" y="82" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              API C++ · nunca exposta
            </text>

            <line x1="450" y1="90" x2="450" y2="122" stroke="var(--line)" strokeWidth="1.6" />
            <polygon points="450,128 445,118 455,118" fill="var(--line)" />

            <rect x="330" y="128" width="115" height="44" rx="8" fill="var(--surface)" stroke="var(--line)" strokeWidth="1.5" />
            <text x="387" y="155" textAnchor="middle" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">
              Wheel[]
            </text>
            <rect x="455" y="128" width="115" height="44" rx="8" fill="var(--surface)" stroke="var(--line)" strokeWidth="1.5" />
            <text x="512" y="155" textAnchor="middle" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">
              Controller
            </text>

            <rect x="330" y="208" width="240" height="60" rx="8" fill="var(--surface)" stroke="var(--cyan-deep)" strokeWidth="1.4" />
            <text x="450" y="232" textAnchor="middle" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="10">
              solver de constraints
            </text>
            <text x="450" y="250" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="9">
              tudo resolvido junto, por passo
            </text>

            {/* a ponte que não existe */}
            <line x1="244" y1="238" x2="326" y2="238" stroke="var(--coral)" strokeWidth="2" strokeDasharray="6 5" />
            <line x1="278" y1="222" x2="294" y2="254" stroke="var(--coral)" strokeWidth="2.5" />
            <line x1="294" y1="222" x2="278" y2="254" stroke="var(--coral)" strokeWidth="2.5" />
            <text x="286" y="288" textAnchor="middle" fill="var(--coral)" fontFamily="var(--mono)" fontSize="10">
              essa ligação não existe
            </text>
          </svg>
          <div className="cap">
            <b>Nome parecido, caminho diferente.</b> O <code>VehicleBody3D</code>{' '}
            é uma abstração <b>do próprio Godot</b>, no nível do{' '}
            <code>PhysicsServer3D</code> — cada backend implementa a lógica de
            veículo por conta própria. O <code>VehicleConstraint</code> do Jolt
            fica do outro lado da linha, sem porta de entrada pelo editor.
          </div>
        </div>

        <div className="steps">
          <div className="step">
            <h4>É anterior ao Jolt no engine</h4>
            <p>
              O <code>VehicleBody3D</code> existe desde antes de o Jolt ser opção
              no Godot, baseado no sistema clássico de veículo por raycast. Ele
              vive no nível do <code>PhysicsServer3D</code>, e{' '}
              <b>cada backend de física precisa implementar aquela lógica por
              conta própria</b>.
            </p>
          </div>
          <div className="step">
            <h4>O comportamento diverge entre backends</h4>
            <p>
              O guia de migração do Godot 4.6 confirma: suspensão, atrito de pneu
              e trem de força produzem <b>resultados diferentes</b> no
              GodotPhysics e no Jolt. Se o nó chamasse a mesma peça C++ por baixo,
              não haveria divergência a documentar.
              <span className="learn">
                Divergência entre backends é a assinatura de reimplementação, não
                de reaproveitamento.
              </span>
            </p>
          </div>
          <div className="step">
            <h4>A prova mais forte: alguém está pedindo</h4>
            <p>
              Existe uma <em>proposal</em> aberta e recente nos{' '}
              <code>godot-proposals</code> pedindo exatamente{' '}
              <b>a exposição das vehicle constraints reais do Jolt</b> — o que só
              faz sentido se elas <b>ainda não</b> estiverem expostas. Há também
              uma proposal mais geral sobre as constraints do Jolt indisponíveis
              no Godot.
            </p>
          </div>
        </div>

        <div className="callout">
          <b>A analogia que fixou o conceito.</b> O <code>VehicleBody3D</code> é um{' '}
          <b>controle remoto universal</b>: os botões (acelerar, frear, virar) são
          sempre os mesmos, mas cada “TV” — cada motor de física — reage do seu
          próprio jeito por trás. O <code>VehicleConstraint</code> é o{' '}
          <b>controle de fábrica</b>, feito sob medida pras peças internas do
          Jolt.
        </div>

        <div className="callout amber">
          <b>Implicação prática pro rover.</b> O{' '}
          <code>VehicleWheel3D.steering</code> só cobre esquema Ackermann — roda
          que gira, como num carro. Não achei suporte nativo a direção
          diferencial / skid-steer no <code>VehicleBody3D</code>. Pra ter isso de
          verdade, o caminho é <b>GDExtension</b>, não o nó pronto.
        </div>
      </section>

      {/* 04 · o Controller */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">04</span>
          <h2>O que é, exatamente, um “Controller”</h2>
          <span className="when">11 ago</span>
        </div>
        <p className="sec-intro">
          O <code>VehicleConstraint</code> resolve só a parte <b>genérica</b> de
          um veículo: contato de roda, suspensão e atrito. Quem traduz o input do
          jogador em força nas rodas é uma camada plugável em cima dele — o{' '}
          <b>Controller</b>. Essa separação é a peça de arquitetura que mais me
          interessa a longo prazo.
        </p>

        <div className="steps">
          <div className="step">
            <h4>Motor</h4>
            <p>
              A curva de <b>torque × RPM</b> — quanta força o conjunto tem
              disponível em cada regime.
            </p>
          </div>
          <div className="step">
            <h4>Câmbio</h4>
            <p>
              As <b>relações de marcha</b>: como o torque do motor é convertido
              antes de chegar às rodas.
            </p>
          </div>
          <div className="step">
            <h4>Diferencial</h4>
            <p>
              Como o torque <b>se divide</b> entre as rodas — a peça que existe no
              controlador de carro e não no de tanque.
            </p>
          </div>
        </div>

        <div className="duo" style={{marginTop: 26}}>
          <div className="facet">
            <div className="tag">carro</div>
            <h4>WheeledVehicleController</h4>
            <p>
              Diferencial de verdade mais direção por <b>ângulo de roda</b>{' '}
              (Ackermann). É o modelo que o <code>VehicleBody3D</code> do Godot
              tenta cobrir.
            </p>
          </div>
          <div className="facet amber">
            <div className="tag">tanque</div>
            <h4>TrackedVehicleController</h4>
            <p>
              Sem diferencial e sem roda que gira: a velocidade de cada esteira
              vem <b>direto do input L/R</b>. É o modelo que o rover
              provavelmente vai usar.
            </p>
          </div>
        </div>

        <div className="callout">
          <b>Por que isso importa pro projeto.</b> Essa separação — contato
          genérico de um lado, lógica de acionamento do outro — é o{' '}
          <b>modelo de referência pro Mês 4 do cronograma</b> (motores/atuadores e
          modelos de roda). O Jolt já resolveu essa arquitetura; não preciso
          inventá-la, preciso entendê-la.
        </div>
      </section>

      {/* 05 · tabela consolidada */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">05</span>
          <h2>O comparativo formal · entregável-âncora</h2>
          <span className="when">11 ago</span>
        </div>
        <p className="sec-intro">
          A tabela que o roadmap da semana pede: feature a feature, o que o Jolt
          tem nativamente e o que o Godot 4.6 expõe. Não é opinião sobre qual
          caminho seguir — é o levantamento que <b>fundamenta</b> a decisão.
        </p>

        <div className="tbl-wrap">
          <table className="ctab quad">
            <colgroup>
              <col className="col-feature" />
              <col className="col-jolt" />
              <col className="col-godot" />
              <col className="col-obs" />
            </colgroup>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Jolt</th>
                <th>Godot expõe?</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              <tr className="amber">
                <td>
                  <code>VehicleConstraint</code> · a constraint composta
                </td>
                <td>
                  <span className="yes">sim</span>
                </td>
                <td>
                  <span className="no">não</span>
                </td>
                <td>Só existe como API C++.</td>
              </tr>
              <tr>
                <td>
                  <code>VehicleBody3D</code> · o nó do Godot
                </td>
                <td>—</td>
                <td>
                  <span className="yes">sim, mas…</span>
                </td>
                <td>
                  Reimplementação própria do Godot; não usa o{' '}
                  <code>VehicleConstraint</code> por baixo e diverge no
                  comportamento mesmo rodando sobre Jolt.
                </td>
              </tr>
              <tr>
                <td>Raycast de contato por roda</td>
                <td>
                  <span className="yes">sim</span>
                </td>
                <td>parcial</td>
                <td>
                  No Jolt vem <b>embutido</b> na constraint. No Godot o{' '}
                  <code>RayCast3D</code> genérico existe, mas solto — não
                  integrado a um sistema de veículo.
                </td>
              </tr>
              <tr>
                <td>Suspensão spring-damper por roda</td>
                <td>
                  <span className="yes">sim</span>
                </td>
                <td>parcial</td>
                <td>
                  No Jolt, com curso mín/máx dedicado por roda. No Godot, via{' '}
                  <code>VehicleWheel3D</code> — mas com a física própria do
                  backend.
                </td>
              </tr>
              <tr className="amber">
                <td>
                  <code>TrackedVehicleController</code> · motor + câmbio
                  compartilhados
                </td>
                <td>
                  <span className="yes">sim</span>
                </td>
                <td>
                  <span className="no">não</span>
                </td>
                <td>—</td>
              </tr>
              <tr className="amber">
                <td>
                  <code>VehicleTrack</code> · razão + multiplicador E/D →
                  skid-steer
                </td>
                <td>
                  <span className="yes">sim</span>
                </td>
                <td>
                  <span className="no">não</span>
                </td>
                <td>
                  <code>VehicleWheel3D.steering</code> só cobre Ackermann.
                </td>
              </tr>
              <tr className="amber">
                <td>Atrito da roda · círculo de atrito embutido</td>
                <td>
                  <span className="yes">sim</span>
                </td>
                <td>
                  <span className="no">não</span>
                </td>
                <td>
                  Reimplementei isso na mão no protótipo raycast — foi de onde
                  veio o bug da ejeção.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 06 · dia 3 */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">06</span>
          <h2>
            Dia 3 · replicar no Godot com <code>Joint3D</code>
          </h2>
          <span className="when">12 ago</span>
        </div>
        <p className="sec-intro">
          O ponto 2 do roadmap pede pra tentar reconstruir o cenário do sample
          usando só nós <code>Joint3D</code> — não pra entregar um veículo, mas
          pra <b>medir onde a coisa bate no limite</b>. O ajuste de escopo veio
          antes de abrir o editor.
        </p>

        <div className="callout coral">
          <b>Ajuste de escopo.</b> O <code>VehicleConstraint</code> não tem{' '}
          <b>nenhum</b> equivalente em <code>Joint3D</code> — é uma peça composta
          própria. Replicar o Tank literalmente exigiria simular uma corrente de
          corpos rígidos (as esteiras), o que é projeto próprio, não tarefa de um
          dia. <b>Decisão:</b> em vez do tanque, testar o limite com o veículo de
          rodas físico mais simples possível, reaproveitando a arquitetura já
          projetada na quinzena anterior — <b>1 chassi + 4{' '}
          <code>SliderJoint3D</code> (suspensão) + 4 <code>HingeJoint3D</code>{' '}
          (rodas)</b>. Montei só o chassi e uma roda (frente-esquerda): o
          suficiente pra encontrar o teto.
        </div>

        <h3 style={{marginTop: 34}}>
          Achado 1 · <code>SliderJoint3D</code> no Jolt não tem mola de verdade
        </h3>
        <p className="sec-intro">
          A issue rastreadora do <code>godot-jolt</code> lista, parâmetro a
          parâmetro, o que o backend Jolt suporta do{' '}
          <code>SliderJoint3D</code>. O status dela é{' '}
          <b>“Done — as much as it can be”</b>: não é um item pendente que um dia
          será feito, é o teto do que dá pra mapear.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Parâmetro do <code>SliderJoint3D</code></th>
                <th>Funciona no Jolt?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Limite superior / inferior (curso)</td>
                <td>
                  <span className="yes">sim</span>
                </td>
              </tr>
              <tr className="amber">
                <td>Softness / Restitution / Damping do limite</td>
                <td>
                  <span className="no">não</span> · incompatível com a{' '}
                  <code>SliderConstraint</code>
                </td>
              </tr>
              <tr className="amber">
                <td>Softness / Restitution / Damping do movimento livre</td>
                <td>
                  <span className="no">não</span>
                </td>
              </tr>
              <tr>
                <td>Limites e motor angulares</td>
                <td>
                  <span className="no">não</span> · a própria issue recomenda{' '}
                  <code>Generic6DOFJoint3D</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout">
          <b>Traduzindo.</b> No backend Jolt, o <code>SliderJoint3D</code> dá
          apenas um <b>batente rígido</b>. Todos os parâmetros que produziriam
          efeito de mola são <b>ignorados silenciosamente</b> — sem erro, sem
          aviso no editor. O inspetor mostra campos que não fazem nada.
        </div>

        <h3 style={{marginTop: 34}}>
          Achado 2 · <code>RigidBody3D</code> não pode ser filho de outro{' '}
          <code>RigidBody3D</code> em movimento
        </h3>

        <div className="bug">
          <div className="symptom">
            <div className="lab">sintoma</div>
            <h4>O conjunto tombava sozinho em queda livre</h4>
            <p>
              Montei <code>RodaSuporte_FE</code> como <b>filho</b> do{' '}
              <code>Chassi</code> — os dois <code>RigidBody3D</code>. O conjunto
              tombava sozinho durante a queda, <b>mesmo sem tocar o chão</b>, e
              sempre pro lado onde estava o corpo aninhado.
            </p>
          </div>
          <div className="cause">
            <div className="lab">causa · e a correção</div>
            <h4>Aninhamento de corpos rígidos não é confiável</h4>
            <p>
              Isolei tirando o chão da equação — só queda livre —, o que confirmou
              que o problema era <b>estrutural</b>, não de contato. A causa está
              registrada na issue <code>godotengine/godot#120067</code>: um{' '}
              <code>RigidBody3D</code> não segue de forma confiável um{' '}
              <code>RigidBody3D</code> pai em movimento. É comportamento de longa
              data do engine, não particularidade do meu setup.{' '}
              <b>Correção:</b> corpos ligados por junta devem ser <b>irmãos</b> na
              árvore — a junta já faz a ligação física, a hierarquia de nós não
              precisa (e não deve) refleti-la.
            </p>
          </div>
        </div>

        <div className="tree" style={{marginTop: 26}}>
          <div className="row">
            <span className="n-root">◉ MundoTeste</span>
            <span className="tag">Node3D · raiz da cena</span>
          </div>
          <div className="row">
            <span className="g">├─</span>{' '}
            <span className="n-static">Chao</span>
            <span className="tag">StaticBody3D · o piso</span>
          </div>
          <div className="row">
            <span className="g">├─</span> <span className="n-body">Chassi</span>
            <span className="tag">RigidBody3D · o corpo principal</span>
          </div>
          <div className="row">
            <span className="g">├─</span>{' '}
            <span className="n-wheel">RodaSuporte_FE</span>
            <span className="tag">
              RigidBody3D · <b>irmão</b> do chassi, não filho
            </span>
          </div>
          <div className="row">
            <span className="g">└─</span> <span className="n-col">Susp_FE</span>
            <span className="tag">
              SliderJoint3D · nodes A e B apontando pros dois irmãos
            </span>
          </div>
        </div>
        <div className="tree-legend">
          <span>
            <span className="swatch" style={{background: 'var(--coral)'}} />
            <b>A regra:</b> a junta é quem conecta. Aninhar corpo rígido dentro de
            corpo rígido não “prende” nada — só quebra.
          </span>
        </div>

        <h3 style={{marginTop: 34}}>O teste final</h3>
        <p className="sec-intro">
          Com a estrutura corrigida (chassi e suporte de roda como irmãos, ligados
          pelo <code>Susp_FE</code>) e o chão de volta, rodei a cena. O contato
          aconteceu — e o conjunto <b>bateu seco, sem nenhum efeito de suspensão
          visível</b>.
        </p>

        <div className="fig">
          <svg viewBox="0 0 720 210" role="img" aria-label="Comparação entre suspensão com mola e batente rígido do SliderJoint3D no Jolt">
            <text x="20" y="24" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="11">
              o que eu esperava · mola
            </text>
            <text x="400" y="24" fill="var(--coral)" fontFamily="var(--mono)" fontSize="11">
              o que aconteceu · batente
            </text>

            {/* esperado: curva amortecida */}
            <line x1="20" y1="150" x2="350" y2="150" stroke="var(--line)" strokeWidth="1.2" />
            <path d="M 30 60 C 90 60, 100 178, 150 150 C 185 130, 195 162, 230 150 C 260 141, 270 155, 300 150 L 345 150" fill="none" stroke="var(--cyan)" strokeWidth="2.2" />
            <text x="185" y="188" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              curso comprime, oscila, assenta
            </text>

            {/* obtido: queda e parada seca */}
            <line x1="400" y1="150" x2="700" y2="150" stroke="var(--line)" strokeWidth="1.2" />
            <path d="M 410 60 L 470 150 L 700 150" fill="none" stroke="var(--coral)" strokeWidth="2.2" />
            <circle cx="470" cy="150" r="4" fill="var(--coral)" />
            <text x="555" y="188" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              cai, encosta, para — curso zero de amortecimento
            </text>
          </svg>
          <div className="cap">
            <b>Confirmação empírica do Achado 1.</b> O comportamento observado é
            exatamente o previsto pela issue <code>godot-jolt#109</code> — o
            limite existe, a mola não.
          </div>
        </div>

        <div className="callout amber">
          <b>Anotação-chave do dia.</b> “Tentativa de suspensão via{' '}
          <code>SliderJoint3D</code> no Godot/Jolt: bate seco, sem mola. Confirma
          empiricamente a limitação documentada no <code>godot-jolt#109</code> — a{' '}
          <code>VehicleConstraint</code> nativa do Jolt resolve isso internamente;
          a via <code>Joint3D</code> não tem substituto.” Isso fecha o ponto 2 da
          reunião: medir até onde o Godot chega, e onde bate no limite.
        </div>
      </section>

      {/* 07 · síntese */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">07</span>
          <h2>Síntese dos três dias</h2>
        </div>
        <p className="sec-intro">
          Três achados sustentam a decisão arquitetural, todos verificados em
          fonte primária — código-fonte ou issue oficial, não documentação
          secundária.
        </p>

        <div className="steps">
          <div className="step">
            <h4>Lacuna de API</h4>
            <p>
              O <code>VehicleConstraint</code> do Jolt não tem equivalente em{' '}
              <code>Joint3D</code>, e o <code>VehicleBody3D</code> do Godot{' '}
              <b>não é</b> uma exposição dele — é uma reimplementação própria e
              paralela.
            </p>
          </div>
          <div className="step">
            <h4>Lacuna de suporte no backend Jolt</h4>
            <p>
              Mesmo as juntas primitivas que existem perdem funcionalidade quando
              rodam sobre Jolt: o <code>SliderJoint3D</code> fica sem mola.{' '}
              <b>Documentado, e não vai mudar.</b>
            </p>
          </div>
          <div className="step">
            <h4>Gotcha de implementação</h4>
            <p>
              <code>RigidBody3D</code> aninhado em outro <code>RigidBody3D</code>{' '}
              móvel é estruturalmente não confiável no Godot.
              <span className="learn">
                Regra de ouro pra qualquer rig multicorpos daqui pra frente:
                juntas conectam irmãos, nunca pai-filho.
              </span>
            </p>
          </div>
        </div>

        <div className="duo" style={{marginTop: 26}}>
          <div className="facet amber">
            <div className="tag">em aberto</div>
            <h4>Esquema de direção do rover</h4>
            <p>
              Skid-steer como o tanque, ou Ackermann como o carro? É decisão do
              professor e ainda não foi definida — e ela muda qual dos dois
              controllers do Jolt vira o modelo de referência.
            </p>
          </div>
          <div className="facet">
            <div className="tag">opcional</div>
            <h4>As outras três rodas</h4>
            <p>
              Montar o resto do veículo físico é opcional a partir daqui: o achado
              central já está confirmado e documentado. Só faz sentido se eu
              precisar do rig pra outra coisa.
            </p>
          </div>
        </div>

        <div className="callout">
          <b>Próximos passos da semana · Faixa B.</b> <b>Ponto 3:</b> ler a doc do{' '}
          <b>GDExtension</b> — o conceito, não construir uma extensão de produção.{' '}
          <b>Ponto 4:</b> espelhar o <b>GDChrono</b> do professor pro Jolt. É o
          caminho que, se aberto, contorna os três achados acima.
        </div>

        <p className="sec-intro" style={{marginTop: 26}}>
          Contexto anterior: o arco conceitual está em{' '}
          <a href={quinzenaHref}>Constraints, juntas e o Jolt por dentro</a>, e o
          ponto de partida — por que o <code>VehicleBody3D</code> não é um
          multicorpo de verdade — está na{' '}
          <a href={dossieHref}>nota do sandbox no Godot</a>.
        </p>

        <h3 style={{marginTop: 34}}>Fontes</h3>
        <div className="refs">
          <div className="rgrp">dia 1 · o sample do Jolt</div>
          <a href="https://jrouwe.github.io/JoltPhysics.js/" target="_blank" rel="noopener noreferrer">
            <span>
              JoltPhysics.js — demos web
              <span className="rd">build WebAssembly · roda sem nenhum setup</span>
            </span>
            <span className="rk">↗ demo</span>
          </a>
          <a href="https://jrouwe.github.io/JoltPhysics.js/vehicle_tank.html" target="_blank" rel="noopener noreferrer">
            <span>
              Tank Controller Demo
              <span className="rd">o sample-âncora da semana</span>
            </span>
            <span className="rk">↗ demo</span>
          </a>
          <a href="https://jrouwe.github.io/JoltPhysics.js/vehicle_wheeled.html" target="_blank" rel="noopener noreferrer">
            <span>
              Wheeled Vehicle Controller Demo
              <span className="rd">o contraponto de carro, com Ackermann</span>
            </span>
            <span className="rk">↗ demo</span>
          </a>
          <a href="https://jrouwe.github.io/JoltPhysics.js/constraints.html" target="_blank" rel="noopener noreferrer">
            <span>
              Constraints Demo
              <span className="rd">as juntas “puras” — o vocabulário primitivo</span>
            </span>
            <span className="rk">↗ demo</span>
          </a>
          <a href="https://github.com/jrouwe/JoltPhysics" target="_blank" rel="noopener noreferrer">
            <span>
              jrouwe/JoltPhysics
              <span className="rd">repositório clonado pra verificação em código</span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a href="https://github.com/jrouwe/JoltPhysics/blob/master/Docs/Samples.md" target="_blank" rel="noopener noreferrer">
            <span>
              Docs/Samples.md
              <span className="rd">doc oficial dos samples nativos</span>
            </span>
            <span className="rk">↗ github</span>
          </a>

          <div className="rgrp">dia 2 · headers verificados (branch master)</div>
          <a href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Vehicle/VehicleConstraint.h" target="_blank" rel="noopener noreferrer">
            <span>
              VehicleConstraint.h
              <span className="rd">a constraint composta</span>
            </span>
            <span className="rk">↗ header</span>
          </a>
          <a href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Vehicle/Wheel.h" target="_blank" rel="noopener noreferrer">
            <span>
              Wheel.h
              <span className="rd">contato, suspensão e atrito por roda</span>
            </span>
            <span className="rk">↗ header</span>
          </a>
          <a href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Vehicle/TrackedVehicleController.h" target="_blank" rel="noopener noreferrer">
            <span>
              TrackedVehicleController.h
              <span className="rd">motor e transmissão únicos, compartilhados</span>
            </span>
            <span className="rk">↗ header</span>
          </a>
          <a href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Vehicle/VehicleTrack.h" target="_blank" rel="noopener noreferrer">
            <span>
              VehicleTrack.h
              <span className="rd">razão por esteira · onde nasce o skid-steer</span>
            </span>
            <span className="rk">↗ header</span>
          </a>
          <a href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Vehicle/VehicleDifferential.h" target="_blank" rel="noopener noreferrer">
            <span>
              VehicleDifferential.h
              <span className="rd">divisão de torque · usado no controlador de carro</span>
            </span>
            <span className="rk">↗ header</span>
          </a>
          <a href="https://github.com/jrouwe/JoltPhysics/tree/master/Jolt/Physics/Constraints" target="_blank" rel="noopener noreferrer">
            <span>
              Jolt/Physics/Constraints
              <span className="rd">lista completa das constraints primitivas</span>
            </span>
            <span className="rk">↗ pasta</span>
          </a>

          <div className="rgrp">
            dia 2 · evidência de que VehicleBody3D ≠ VehicleConstraint
          </div>
          <a href="https://www.strayspark.studio/blog/godot-46-jolt-physics-migration-guide" target="_blank" rel="noopener noreferrer">
            <span>
              Godot 4.6 Jolt Physics — Migration Guide
              <span className="rd">
                Jolt vira padrão · a divergência de comportamento do VehicleBody3D
              </span>
            </span>
            <span className="rk">↗ blog</span>
          </a>
          <a href="https://github.com/godotengine/godot-proposals/discussions/15037" target="_blank" rel="noopener noreferrer">
            <span>
              Add Jolt Vehicle constraints
              <span className="rd">
                proposal aberta pedindo as vehicle constraints reais do Jolt
              </span>
            </span>
            <span className="rk">↗ proposals</span>
          </a>
          <a href="https://github.com/godotengine/godot-proposals/issues/11338" target="_blank" rel="noopener noreferrer">
            <span>
              Constraints do Jolt não disponíveis no Godot
              <span className="rd">proposal relacionada, mais geral</span>
            </span>
            <span className="rk">↗ proposals</span>
          </a>
          <a href="https://docs.godotengine.org/en/stable/classes/class_vehiclebody3d.html" target="_blank" rel="noopener noreferrer">
            <span>
              VehicleBody3D
              <span className="rd">doc oficial do nó · a API que o Godot expõe</span>
            </span>
            <span className="rk">↗ godot docs</span>
          </a>

          <div className="rgrp">dia 3 · os dois achados</div>
          <a href="https://github.com/godot-jolt/godot-jolt/issues/109" target="_blank" rel="noopener noreferrer">
            <span>
              SliderJoint3D não suporta mola no Jolt
              <span className="rd">
                godot-jolt #109 · issue rastreadora, status “Done — as much as it
                can be”
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a href="https://github.com/godotengine/godot/issues/120067" target="_blank" rel="noopener noreferrer">
            <span>
              RigidBody3D não confiável como filho de outro RigidBody3D em
              movimento
              <span className="rd">godot #120067 · a causa do tombamento em queda livre</span>
            </span>
            <span className="rk">↗ github</span>
          </a>
        </div>
      </section>
    </div>
  );
}
