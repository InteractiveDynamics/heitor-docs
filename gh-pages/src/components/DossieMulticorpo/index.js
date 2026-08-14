import React from 'react';
import penduloEmAlta from './img/pendulo-em-alta.png';
import penduloEmBaixa from './img/pendulo-em-baixa.png';

/**
 * Doc técnica · Dinâmica multicorpo · Quinzena 27/jul – 10/ago/2026.
 * Consolida a documentação de aprendizado da quinzena "Rumo ao multicorpo"
 * (roadmap docs/roadmaps/semana-2026-07-27): conceito de sistema multicorpo,
 * penalidade × constraint, graus de liberdade e as juntas do Godot, o
 * experimento mínimo `TesteJunta` (dois RigidBody3D + HingeJoint3D), o solver
 * de impulsos do Jolt e o que o Godot não expõe dele.
 *
 * Fonte: sources/quinzena-multicorpo/dia-01..dia-04 (as quatro sessões de
 * estudo). As datas aqui são os intervalos reais dentro da quinzena, não os
 * dias isolados dos arquivos de origem. Cobre a *primeira metade* do roadmap —
 * a segunda (sample do Jolt, GDExtension, GDChrono) segue em aberto.
 *
 * Renderiza sob `.dossie .tecnica .mcorpo`: assinatura do dossiê (dossie.css),
 * primitivas técnicas (tecnica.css) e as peças próprias em multicorpo.css.
 */
export default function DossieMulticorpo() {
  // Curvas da figura "impulso × força" (bloco 06): amostragem da velocidade
  // proibida ao longo de alguns passos de física. Na penalidade, a força age ao
  // longo do passo e sobrecorrige (oscila em torno de zero); no constraint, o
  // impulso zera a velocidade de uma vez. JS puro no render — SVG estático.
  const penXs = Array.from({length: 61}, (_, i) => 40 + i * 5);
  const penBase = 100;
  const penPath = penXs
    .map(
      (x) =>
        `${x},${(
          penBase -
          52 * Math.exp(-(x - 40) / 120) * Math.cos((x - 40) * 0.075)
        ).toFixed(1)}`,
    )
    .join(' ');

  return (
    <div className="dossie tecnica mcorpo">
      {/* faixa de telemetria */}
      <div className="telemetry-strip">
        <span>
          <span className="dot" />
          quinzena · 27 jul – 10 ago
        </span>
        <span>
          engine · <b>Godot 4.6 · Jolt</b>
        </span>
        <span>
          paradigma · <b>constraint (multicorpo)</b>
        </span>
        <span>
          cena · <b>TesteJunta (sandbox)</b>
        </span>
        <span>
          escopo · <b>entender, não construir</b>
        </span>
      </div>

      {/* hero */}
      <header className="hero-block">
        <div className="eyebrow">Estudo · rumo ao multicorpo</div>
        <h1>
          Quando quem calcula a força{' '}
          <span className="accent">deixa de ser eu</span>.
        </h1>
        <p className="lede">
          O protótipo raycast mantém o rover de pé porque{' '}
          <strong>eu calculo e aplico uma força</strong> a cada quadro. Esta
          quinzena foi entender o paradigma oposto — o <strong>multicorpo</strong>:
          corpos rígidos ligados por juntas, onde eu apenas{' '}
          <strong>declaro a relação</strong> e o solver do motor de física
          descobre sozinho o impulso que a mantém. O arco vai do conceito até
          duas caixas oscilando numa cena de teste, e termina no que o Godot{' '}
          <strong>não</strong> me deixa alcançar do Jolt.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>Em resumo:</b> no raycast <b>eu empurro</b>; no multicorpo{' '}
          <b>eu amarro</b>. E a conclusão que mais mudou minha cabeça na quinzena
          é que os dois não são rivais — o raycast é uma versão{' '}
          <b>achatada</b> (<em>lumped</em>) do multicorpo, e o próprio modelo de
          veículo do Jolt usa os dois juntos.
        </div>

        <dl className="hero-meta">
          <div>
            <dt>Norte</dt>
            <dd>Entender o paradigma, não migrar o rover</dd>
          </div>
          <div>
            <dt>Experimento</dt>
            <dd>2 RigidBody3D + 1 HingeJoint3D</dd>
          </div>
          <div>
            <dt>Achado</dt>
            <dd>Exclude Nodes From Collision</dd>
          </div>
          <div>
            <dt>Limite</dt>
            <dd>Godot não expõe a VehicleConstraint</dd>
          </div>
        </dl>
      </header>

      {/* 00 · a quinzena */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">00</span>
          <h2>A quinzena, etapa por etapa</h2>
        </div>
        <p className="sec-intro">
          O roadmap desta quinzena está em{' '}
          <a href="/docs/roadmaps/semana-2026-07-27">
            27 jul–10 ago · Rumo ao multicorpo
          </a>
          . Ele foi montado pra semana de 27/jul e esticado pelas duas semanas
          seguintes — e foi assim que aconteceu na prática: quatro etapas de
          estudo espalhadas pelo período, e não um bloco por dia. Abaixo, o que
          cada etapa cobriu e quando.
        </p>

        <div className="tl">
          <div className="tl-stop done">
            <div className="tl-when">
              <span className="wk">semana 1</span>
              27–28 jul
            </div>
            <div className="tl-what">
              <h4>O conceito: corpo rígido, junta, penalidade × constraint</h4>
              <p>
                Definir sistema multicorpo e situar o protótipo raycast dentro do
                quadro maior. Blocos 01 a 03.
              </p>
            </div>
          </div>
          <div className="tl-stop done">
            <div className="tl-when">
              <span className="wk">semana 1</span>
              29–30 jul
            </div>
            <div className="tl-what">
              <h4>Graus de liberdade e as cinco juntas do Godot</h4>
              <p>
                A régua que mede o que uma junta permite, e a assinatura de GDL
                de cada <code>Joint3D</code>. Bloco 04.
              </p>
            </div>
          </div>
          <div className="tl-stop done">
            <div className="tl-when">
              <span className="wk">semana 1</span>
              31 jul
            </div>
            <div className="tl-what">
              <h4>Experimento mínimo: dois corpos e uma dobradiça</h4>
              <p>
                A cena <code>TesteJunta</code> rodando — restrição de GDL
                funcionando sem uma linha de código. Bloco 05.
              </p>
            </div>
          </div>
          <div className="tl-stop done">
            <div className="tl-when">
              <span className="wk">semana 2</span>
              03–07 ago
            </div>
            <div className="tl-what">
              <h4>O Jolt por dentro e os limites do Godot</h4>
              <p>
                Solver de impulsos sequenciais, as lacunas da API{' '}
                <code>Joint3D</code> e a exploração do repositório oficial.
                Blocos 06 a 08.
              </p>
            </div>
          </div>
          <div className="tl-stop done">
            <div className="tl-when">
              <span className="wk">semana 2</span>
              10 ago
            </div>
            <div className="tl-what">
              <h4>Consolidação · esta entrada</h4>
              <p>
                Mapear as juntas pro rover no papel, escrever esta doc — e a
                reunião do dia, que abriu a segunda metade do roadmap.
              </p>
            </div>
          </div>
          <div className="tl-stop open">
            <div className="tl-when">
              <span className="wk">em aberto</span>
              a partir de 10 ago
            </div>
            <div className="tl-what">
              <h4>A outra metade do roadmap</h4>
              <p>
                Comparativo Jolt × Godot a partir de um <code>Sample</code>,
                replicar esse sample no Godot, ler a doc do GDExtension e
                espelhar o GDChrono do professor pro Jolt. Nada disso entrou
                nesta entrada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 01 · os dois tijolos */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">01</span>
          <h2>Os dois tijolos: corpo rígido e junta</h2>
          <span className="when">27–28 jul</span>
        </div>
        <p className="sec-intro">
          Antes de definir "multicorpo", dois conceitos que sustentam tudo o que
          vem depois — e um número que atravessa a quinzena inteira: <b>seis</b>.
        </p>

        <div className="duo">
          <div className="facet">
            <span className="tag">Tijolo 1 · corpo rígido</span>
            <h4>Não se deforma — logo, 6 números bastam</h4>
            <p>
              Um <b>corpo rígido</b> é um objeto em que a distância entre
              quaisquer dois pontos nunca muda. Pra descrevê-lo por completo
              bastam duas informações: <b>onde está</b> (posição) e{' '}
              <b>como está orientado</b> (rotação) — três eixos cada. Daí os{' '}
              <span className="stat">6 GDL</span> de um corpo livre no espaço 3D.
            </p>
          </div>
          <div className="facet amber">
            <span className="tag">Tijolo 2 · junta</span>
            <h4>Uma conexão que proíbe movimento</h4>
            <p>
              Uma <b>junta</b> (<em>joint</em>, ou <em>constraint</em>) liga dois
              corpos e <b>proíbe</b> parte do movimento relativo entre eles. A
              dobradiça de porta é o exemplo direto: liga porta e batente e
              permite exatamente <b>um</b> movimento — girar em torno de um eixo.
            </p>
          </div>
        </div>

        <div className="fig">
          <svg
            viewBox="0 0 680 250"
            role="img"
            aria-label="Os seis graus de liberdade de um corpo rígido livre: três translações ao longo dos eixos X, Y e Z, e três rotações em torno desses mesmos eixos.">
            <defs>
              <marker id="mcT" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
                <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--cyan)" />
              </marker>
              <marker id="mcR" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
                <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--amber)" />
              </marker>
            </defs>

            {/* painel esquerdo · translações */}
            <text x="30" y="26" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="11">
              3 translações · deslizar
            </text>
            {/* cubo */}
            <polygon points="150,110 172,92 226,92 204,110" fill="var(--surface-2)" stroke="var(--line)" />
            <polygon points="204,110 226,92 226,146 204,164" fill="var(--bg-2)" stroke="var(--line)" />
            <rect x="150" y="110" width="54" height="54" fill="var(--surface)" stroke="var(--line)" />
            {/* eixos com setas duplas */}
            <line x1="70" y1="137" x2="290" y2="137" stroke="var(--cyan)" strokeWidth="2" markerStart="url(#mcT)" markerEnd="url(#mcT)" />
            <line x1="177" y1="54" x2="177" y2="228" stroke="var(--cyan)" strokeWidth="2" markerStart="url(#mcT)" markerEnd="url(#mcT)" />
            <line x1="120" y1="200" x2="256" y2="60" stroke="var(--cyan)" strokeWidth="2" strokeDasharray="7 4" markerStart="url(#mcT)" markerEnd="url(#mcT)" />
            <text x="298" y="141" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="12">X</text>
            <text x="186" y="52" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="12">Y</text>
            <text x="262" y="56" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="12">Z</text>

            {/* divisória */}
            <line x1="340" y1="20" x2="340" y2="230" stroke="var(--line-soft)" strokeWidth="1" strokeDasharray="4 6" />

            {/* painel direito · rotações */}
            <text x="380" y="26" fill="var(--amber)" fontFamily="var(--mono)" fontSize="11">
              3 rotações · girar
            </text>
            <polygon points="480,110 502,92 556,92 534,110" fill="var(--surface-2)" stroke="var(--line)" />
            <polygon points="534,110 556,92 556,146 534,164" fill="var(--bg-2)" stroke="var(--line)" />
            <rect x="480" y="110" width="54" height="54" fill="var(--surface)" stroke="var(--line)" />
            {/* arcos de rotação */}
            <path d="M430,137 A 78,30 0 0 0 586,137" fill="none" stroke="var(--amber)" strokeWidth="2" markerEnd="url(#mcR)" />
            <path d="M507,58 A 30,78 0 0 0 507,214" fill="none" stroke="var(--amber)" strokeWidth="2" markerEnd="url(#mcR)" />
            <path d="M452,192 A 60,60 0 0 1 564,84" fill="none" stroke="var(--amber)" strokeWidth="2" strokeDasharray="7 4" markerEnd="url(#mcR)" />
            <text x="596" y="141" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="12">↻Y</text>
            <text x="498" y="232" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="12">↻X</text>
            <text x="572" y="76" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="12">↻Z</text>
          </svg>
          <div className="cap">
            <b>6 graus de liberdade.</b> Não existe um sétimo modo: qualquer
            movimento, por mais complicado, é combinação destes seis. Toda junta
            é uma resposta à pergunta "quantos destes seis eu tiro?".
          </div>
        </div>

        <div className="physics">
          <div>
            <h4>Sistema multicorpo, em uma frase</h4>
            <p>
              Um conjunto de <b>corpos rígidos conectados por juntas</b>, em que
              cada junta restringe o movimento relativo entre os corpos que ela
              liga.
            </p>
            <p>
              A analogia que fixa a ideia é o <b>esqueleto</b> (ou uma marionete):
              os ossos são os corpos; as articulações, as juntas. O joelho é quase
              uma dobradiça pura — um eixo só; o ombro é mais livre, girando
              dentro de um cone. E ninguém precisa "empurrar" o antebraço pra ele
              continuar preso ao braço: a articulação garante isso{' '}
              <b>por construção</b>, não por uma força aplicada o tempo todo.
            </p>
          </div>
          <div>
            <svg viewBox="0 0 300 210" role="img" aria-label="Esqueleto esquemático: segmentos rígidos ligados por articulações — ombro como junta esférica e cotovelo como dobradiça.">
              {/* tronco */}
              <rect x="132" y="30" width="26" height="96" rx="8" fill="var(--surface-2)" stroke="var(--line)" />
              {/* braço */}
              <line x1="158" y1="52" x2="222" y2="86" stroke="var(--ink-mid)" strokeWidth="9" strokeLinecap="round" />
              <line x1="222" y1="86" x2="248" y2="150" stroke="var(--ink-mid)" strokeWidth="9" strokeLinecap="round" />
              {/* perna */}
              <line x1="140" y1="126" x2="128" y2="166" stroke="var(--ink-mid)" strokeWidth="9" strokeLinecap="round" />
              <line x1="128" y1="166" x2="140" y2="200" stroke="var(--ink-mid)" strokeWidth="9" strokeLinecap="round" />
              {/* juntas */}
              <circle cx="158" cy="52" r="8" fill="var(--bg-2)" stroke="var(--amber)" strokeWidth="2.5" />
              <circle cx="222" cy="86" r="7" fill="var(--bg-2)" stroke="var(--cyan)" strokeWidth="2.5" />
              <circle cx="128" cy="166" r="7" fill="var(--bg-2)" stroke="var(--cyan)" strokeWidth="2.5" />
              <text x="60" y="48" fill="var(--amber)" fontFamily="var(--mono)" fontSize="10">ombro · cone</text>
              <line x1="118" y1="44" x2="148" y2="50" stroke="var(--amber)" strokeWidth="1" />
              <text x="238" y="72" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="10">cotovelo</text>
              <text x="238" y="84" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="10">1 eixo</text>
              <text x="30" y="176" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="10">joelho · 1 eixo</text>
              <line x1="104" y1="172" x2="120" y2="167" stroke="var(--cyan)" strokeWidth="1" />
            </svg>
          </div>
        </div>

        <div className="callout">
          <b>Traduzindo pro rover (só no papel).</b> O chassi seria um corpo; cada
          roda, outro; cada braço de suspensão, outro — todos ligados por juntas
          apropriadas: a roda gira em torno de um eixo fixo ao chassi, a suspensão
          desliza verticalmente. Essa imagem é o pano de fundo da quinzena, mas{' '}
          <b>construir isso está fora de escopo</b>.
        </div>
      </section>

      {/* 02 · penalidade × constraint */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">02</span>
          <h2>O contraste central: penalidade × constraint</h2>
          <span className="when">27–28 jul</span>
        </div>
        <p className="sec-intro">
          Este é o núcleo conceitual da quinzena, e o que separa o protótipo
          raycast do paradigma que estudei aqui. As duas abordagens querem o mesmo
          resultado — manter uma relação física válida entre partes de um sistema
          — mas chegam nele por caminhos opostos.
        </p>

        <div className="duo">
          <div className="facet amber">
            <span className="tag">Penalidade · o que já tenho</span>
            <h4>Eu meço o erro e aplico uma força</h4>
            <p>
              A cada quadro eu meço o quanto a situação está "errada" (o quanto a
              mola está comprimida além do repouso, o quanto a roda desliza em vez
              de rolar) e calculo uma <b>força corretiva</b>. Quem escolhe e
              dimensiona essa força sou <b>eu</b> — a relação vale de forma
              aproximada, na medida em que eu tenha acertado a intensidade.
            </p>
          </div>
          <div className="facet">
            <span className="tag">Constraint · o que estudei</span>
            <h4>Eu declaro a relação e o solver resolve</h4>
            <p>
              Em vez de calcular força, eu <b>declaro a relação geométrica</b>{' '}
              ("estes dois corpos só giram um em relação ao outro em torno deste
              eixo"). O <b>solver</b> do motor calcula, a cada passo, o impulso
              exato que mantém a declaração verdadeira. A junta não <em>tenta</em>{' '}
              segurar — ela simplesmente não permite o movimento proibido.
            </p>
          </div>
        </div>

        <div className="fig">
          <svg
            viewBox="0 0 680 230"
            role="img"
            aria-label="Comparação: uma porta segura por um elástico, cuja eficácia depende da força escolhida, contra uma porta presa por uma dobradiça de metal, que torna o movimento proibido fisicamente impossível.">
            <defs>
              <marker id="mcE" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
                <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--amber)" />
              </marker>
              <marker id="mcH" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
                <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--cyan)" />
              </marker>
            </defs>

            {/* esquerda · elástico */}
            <text x="28" y="26" fill="var(--amber)" fontFamily="var(--mono)" fontSize="11">
              elástico · força que eu escolho
            </text>
            <rect x="40" y="46" width="16" height="150" fill="var(--surface-2)" stroke="var(--line)" />
            <text x="34" y="212" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">batente</text>
            <polygon points="120,58 250,84 250,190 120,164" fill="var(--surface)" stroke="var(--line)" />
            <text x="160" y="130" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">porta</text>
            {/* elástico ondulado */}
            <path
              d="M56,70 q10,-10 20,0 q10,10 20,0 q10,-10 20,0"
              fill="none"
              stroke="var(--amber)"
              strokeWidth="2.5"
            />
            <line x1="150" y1="98" x2="238" y2="98" stroke="var(--amber)" strokeWidth="2" markerEnd="url(#mcE)" />
            <text x="150" y="90" fill="var(--amber)" fontFamily="var(--mono)" fontSize="10">F corretiva</text>
            <text x="120" y="212" fill="var(--coral)" fontFamily="var(--mono)" fontSize="10">
              erro de dimensionamento → oscila, diverge
            </text>

            <line x1="340" y1="20" x2="340" y2="210" stroke="var(--line-soft)" strokeWidth="1" strokeDasharray="4 6" />

            {/* direita · dobradiça */}
            <text x="382" y="26" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="11">
              dobradiça · relação por construção
            </text>
            <rect x="394" y="46" width="16" height="150" fill="var(--surface-2)" stroke="var(--line)" />
            <polygon points="430,58 560,84 560,190 430,164" fill="var(--surface)" stroke="var(--line)" />
            <circle cx="418" cy="82" r="8" fill="var(--bg-2)" stroke="var(--cyan)" strokeWidth="2.5" />
            <circle cx="418" cy="160" r="8" fill="var(--bg-2)" stroke="var(--cyan)" strokeWidth="2.5" />
            <path d="M470,196 A 70,70 0 0 0 520,150" fill="none" stroke="var(--cyan)" strokeWidth="2" markerEnd="url(#mcH)" />
            <text x="474" y="214" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="10">
              1 rotação permitida
            </text>
            {/* movimento proibido, riscado */}
            <line x1="592" y1="120" x2="646" y2="120" stroke="var(--coral)" strokeWidth="2" strokeDasharray="5 4" />
            <line x1="604" y1="106" x2="634" y2="134" stroke="var(--coral)" strokeWidth="2.5" />
            <line x1="634" y1="106" x2="604" y2="134" stroke="var(--coral)" strokeWidth="2.5" />
            <text x="672" y="152" textAnchor="end" fill="var(--coral)" fontFamily="var(--mono)" fontSize="10">
              o resto nem existe
            </text>
          </svg>
          <div className="cap">
            <b>A distinção de autoria.</b> Na penalidade o autor da força sou eu —
            por isso instabilidade se resolve com ajuste manual. No constraint o
            autor é o motor — não há "intensidade" pra calibrar.
          </div>
        </div>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th></th>
                <th>Penalidade (raycast)</th>
                <th>Constraint (multicorpo)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Quem calcula a força</td>
                <td>Eu, a cada quadro</td>
                <td>O solver do motor de física</td>
              </tr>
              <tr>
                <td>Natureza da relação</td>
                <td>Aproximada — depende do ajuste da força</td>
                <td>Exata, por construção</td>
              </tr>
              <tr>
                <td>Risco característico</td>
                <td>Divergência, se a força corretiva for mal dimensionada</td>
                <td>Não há força a calibrar — a violação é impedida</td>
              </tr>
              <tr>
                <td>Analogia</td>
                <td>Elástico segurando a porta</td>
                <td>Dobradiça de metal</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="sec-intro" style={{marginTop: 30, marginBottom: 14}}>
          Esse risco não é teórico — eu já vivi ele no protótipo raycast, na
          implementação do atrito lateral:
        </p>
        <div className="bug">
          <div className="symptom">
            <div className="lab">sintoma</div>
            <h4>O rover era ejetado da cena</h4>
            <p>
              Ao implementar o atrito lateral, o corpo saía violentamente
              arremessado em vez de assentar.
            </p>
          </div>
          <div className="cause">
            <div className="lab">causa · e a lição</div>
            <h4>Integrador explícito divergindo</h4>
            <p>
              A força corretiva de um quadro cancelava <b>mais velocidade do que
              existia</b>: o erro invertia de sinal e crescia no quadro seguinte.
              A solução foi ancorar a força num limite físico real — o{' '}
              <em>clamp</em> do círculo de atrito (μ · N), que impede por
              construção que a correção passe do fisicamente possível. É a
              manifestação prática do risco da penalidade.
            </p>
          </div>
        </div>
      </section>

      {/* 03 · lumped */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">03</span>
          <h2>O raycast é um multicorpo achatado</h2>
          <span className="when">28 jul</span>
        </div>
        <p className="sec-intro">
          Uma correção conceitual importante, que evita um erro comum: o protótipo
          raycast <b>não tem juntas escondidas</b>. É o contrário — ele{' '}
          <b>substitui</b> as juntas por forças que eu calculo à mão.
        </p>

        <div className="fig">
          <svg
            viewBox="0 0 700 260"
            role="img"
            aria-label="À esquerda, o modelo multicorpo formal de um rover: chassi e quatro rodas como corpos separados, ligados por juntas. À direita, o protótipo raycast: um único corpo rígido com três forças calculadas por roda.">
            <defs>
              <marker id="mcF" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
                <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--amber)" />
              </marker>
              <marker id="mcC" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="var(--ink-dim)" />
              </marker>
            </defs>

            {/* esquerda · multicorpo formal */}
            <text x="20" y="24" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="11">
              multicorpo formal · 5 corpos + juntas
            </text>
            <rect x="60" y="70" width="180" height="40" rx="6" fill="var(--surface)" stroke="var(--cyan)" />
            <text x="150" y="95" textAnchor="middle" fill="var(--ink)" fontFamily="var(--mono)" fontSize="11">
              chassi (corpo)
            </text>
            {[80, 130, 180, 230].map((x, i) => (
              <g key={x}>
                <line x1={x - 5 + 5} y1="110" x2={x} y2="168" stroke="var(--amber)" strokeWidth="2" />
                <circle cx={x} cy="150" r="6" fill="var(--bg-2)" stroke="var(--amber)" strokeWidth="2" />
                <circle cx={x} cy="192" r="18" fill="var(--surface-2)" stroke="var(--line)" />
                <text x={x} y="196" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="9">
                  r{i + 1}
                </text>
              </g>
            ))}
            <text x="60" y="238" fill="var(--amber)" fontFamily="var(--mono)" fontSize="10">
              ◉ junta hinge (roda) · slider (suspensão)
            </text>

            {/* seta de colapso */}
            <line x1="300" y1="140" x2="378" y2="140" stroke="var(--ink-dim)" strokeWidth="2" markerEnd="url(#mcC)" />
            <text x="300" y="128" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              colapsa em
            </text>

            {/* direita · raycast */}
            <text x="400" y="24" fill="var(--amber)" fontFamily="var(--mono)" fontSize="11">
              raycast · 1 corpo + forças por roda
            </text>
            <rect x="420" y="70" width="230" height="60" rx="6" fill="var(--surface)" stroke="var(--amber)" />
            <text x="535" y="105" textAnchor="middle" fill="var(--ink)" fontFamily="var(--mono)" fontSize="11">
              RigidBody3D único
            </text>
            {[450, 505, 560, 615].map((x) => (
              <g key={x}>
                <line x1={x} y1="130" x2={x} y2="196" stroke="var(--cyan)" strokeWidth="1.5" strokeDasharray="5 4" />
                <circle cx={x} cy="196" r="3.5" fill="var(--cyan)" />
                <line x1={x} y1="192" x2={x} y2="150" stroke="var(--amber)" strokeWidth="2" markerEnd="url(#mcF)" />
              </g>
            ))}
            <line x1="420" y1="212" x2="655" y2="212" stroke="var(--line)" strokeWidth="2" />
            <text x="400" y="238" fill="var(--amber)" fontFamily="var(--mono)" fontSize="10">
              ↑ mola-amortecedor · grip · tração
            </text>
          </svg>
          <div className="cap">
            Cada tripla de forças por roda é uma aproximação, feita à mão, do que
            as juntas produziriam sozinhas num sistema multicorpo de verdade.
          </div>
        </div>

        <div className="steps">
          <div className="step">
            <h4>Suspensão ⇄ slider joint</h4>
            <p>
              A força de <b>mola-amortecedor</b> faz, de forma aproximada, o papel
              de um <code>SliderJoint3D</code>: restringir o movimento relativo
              entre chassi e roda a um único eixo de translação.
            </p>
          </div>
          <div className="step">
            <h4>Tração e grip ⇄ hinge joint + contato pneu-solo</h4>
            <p>
              As forças <b>longitudinal</b> e <b>lateral</b> fazem o papel de um{' '}
              <code>HingeJoint3D</code> no eixo da roda somado a um modelo de
              contato pneu-solo.
            </p>
          </div>
          <div className="step">
            <h4>
              O <code>VehicleBody3D</code> é da mesma família
            </h4>
            <p>
              Testado e descartado antes do raycast atual, ele também é — por
              baixo da abstração — um veículo raycast: corpo único, raios nas
              rodas, modelo de pneu embutido como caixa-preta. A diferença é só o
              nível de exposição: ele esconde a física dentro do nó; o{' '}
              <code>ground_contact.gd</code> a deixa à vista.
            </p>
          </div>
        </div>

        <div className="callout">
          <b>A frase que fecha o bloco.</b> Raycast e multicorpo não são
          paradigmas opostos ou competidores — o raycast é uma{' '}
          <b>aproximação concentrada</b> (<em>lumped</em>) do multicorpo. Implicação
          prática: se um dia eu migrar pra juntas, nada do que fiz no raycast vira
          lixo. O processo de implementar as forças na mão — inclusive o episódio
          de instabilidade — construiu exatamente a intuição física que o solver
          passa a executar sozinho.
        </div>
      </section>

      {/* 04 · GDL e as juntas do Godot */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">04</span>
          <h2>Graus de liberdade e as cinco juntas do Godot</h2>
          <span className="when">29–30 jul</span>
        </div>
        <p className="sec-intro">
          O bloco 01 disse que a junta restringe o movimento relativo, mas deixou
          em aberto: restringir <em>como</em>, exatamente? A resposta é a régua do
          grau de liberdade — e ela transforma "escolher como limitar" e "escolher
          qual junta usar" na <b>mesma decisão</b>.
        </p>

        <div className="formula">
          6 GDL relativos − travados = o que a junta permite
          <small>
            a palavra-chave é <b>relativos</b>: a junta não age sobre o movimento
            absoluto de cada corpo, e sim sobre o de um <b>em relação ao outro</b>
          </small>
        </div>

        <p className="sec-intro" style={{marginTop: 26, marginBottom: 10}}>
          Uma dobradiça de porta não impede a casa inteira de se mover; ela impede
          que a porta se mova <b>em relação ao batente</b>, exceto pela única
          rotação que permite. Com essa régua, cada junta do Godot vira uma
          assinatura fixa de GDL:
        </p>

        <div className="jgrid">
          <div className="jcard">
            <svg viewBox="0 0 160 90" role="img" aria-label="PinJoint3D: dois corpos presos por um ponto comum, com três rotações livres.">
              <rect x="16" y="34" width="34" height="26" rx="3" fill="var(--surface-2)" stroke="var(--line)" />
              <rect x="110" y="34" width="34" height="26" rx="3" fill="var(--surface-2)" stroke="var(--line)" />
              <line x1="50" y1="47" x2="110" y2="47" stroke="var(--line)" strokeWidth="1.5" />
              <circle cx="80" cy="47" r="8" fill="var(--bg-2)" stroke="var(--cyan)" strokeWidth="2.5" />
              <path d="M58,26 A 24,10 0 0 1 102,26" fill="none" stroke="var(--cyan)" strokeWidth="1.6" />
              <path d="M58,68 A 24,10 0 0 0 102,68" fill="none" stroke="var(--cyan)" strokeWidth="1.6" />
              <path d="M62,72 A 22,22 0 0 1 62,22" fill="none" stroke="var(--cyan)" strokeWidth="1.6" />
            </svg>
            <span className="jn">PinJoint3D</span>
            <span className="jd">
              rótula · sobram <b>3 rotações</b> — ponto de articulação sem
              restrição de giro
            </span>
          </div>

          <div className="jcard">
            <svg viewBox="0 0 160 90" role="img" aria-label="HingeJoint3D: dois corpos com uma única rotação livre em torno de um eixo.">
              <rect x="16" y="34" width="34" height="26" rx="3" fill="var(--surface-2)" stroke="var(--line)" />
              <rect x="110" y="34" width="34" height="26" rx="3" fill="var(--surface-2)" stroke="var(--line)" />
              <line x1="80" y1="14" x2="80" y2="80" stroke="var(--ink-dim)" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="50" y1="47" x2="110" y2="47" stroke="var(--line)" strokeWidth="1.5" />
              <circle cx="80" cy="47" r="8" fill="var(--bg-2)" stroke="var(--cyan)" strokeWidth="2.5" />
              <path d="M104,66 A 26,26 0 0 0 104,28" fill="none" stroke="var(--cyan)" strokeWidth="2" />
            </svg>
            <span className="jn">HingeJoint3D</span>
            <span className="jd">
              dobradiça · sobra <b>1 rotação</b> — eixo da roda; braço de suspensão
              pivotando
            </span>
          </div>

          <div className="jcard">
            <svg viewBox="0 0 160 90" role="img" aria-label="SliderJoint3D: dois corpos com uma única translação livre ao longo de um eixo.">
              <rect x="16" y="34" width="34" height="26" rx="3" fill="var(--surface-2)" stroke="var(--line)" />
              <rect x="98" y="34" width="34" height="26" rx="3" fill="var(--surface-2)" stroke="var(--line)" />
              <line x1="24" y1="47" x2="140" y2="47" stroke="var(--line)" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1="88" y1="74" x2="146" y2="74" stroke="var(--cyan)" strokeWidth="2" />
              <path d="M88,74 l7,-4 v8 z" fill="var(--cyan)" />
              <path d="M146,74 l-7,-4 v8 z" fill="var(--cyan)" />
            </svg>
            <span className="jn">SliderJoint3D</span>
            <span className="jd">
              prismática · sobra <b>1 translação</b> — curso vertical da suspensão
            </span>
          </div>

          <div className="jcard">
            <svg viewBox="0 0 160 90" role="img" aria-label="ConeTwistJoint3D: rotação limitada dentro de um cone, mais torção em torno do eixo.">
              <polygon points="52,47 132,20 132,74" fill="var(--mc-cyan-soft, rgba(63,208,192,0.09))" stroke="var(--cyan)" strokeDasharray="4 3" />
              <rect x="18" y="34" width="34" height="26" rx="3" fill="var(--surface-2)" stroke="var(--line)" />
              <circle cx="52" cy="47" r="7" fill="var(--bg-2)" stroke="var(--cyan)" strokeWidth="2.5" />
              <line x1="52" y1="47" x2="130" y2="32" stroke="var(--ink-mid)" strokeWidth="4" strokeLinecap="round" />
              <path d="M120,58 A 14,14 0 1 0 134,58" fill="none" stroke="var(--amber)" strokeWidth="1.8" />
            </svg>
            <span className="jn">ConeTwistJoint3D</span>
            <span className="jd">
              ombro · rotação <b>limitada</b> (cone + torção) — juntas com batente
              angular
            </span>
          </div>

          <div className="jcard wide">
            <svg viewBox="0 0 160 90" role="img" aria-label="Generic6DOFJoint3D: cada um dos seis graus de liberdade pode ser travado, livre ou limitado.">
              {['T·X', 'T·Y', 'T·Z', 'R·X', 'R·Y', 'R·Z'].map((lab, i) => {
                const x = 14 + (i % 3) * 46;
                const y = 20 + Math.floor(i / 3) * 34;
                const on = i === 1 || i === 3 || i === 5;
                return (
                  <g key={lab}>
                    <rect
                      x={x}
                      y={y}
                      width="38"
                      height="24"
                      rx="5"
                      fill={on ? 'var(--surface-2)' : 'var(--bg-2)'}
                      stroke={on ? 'var(--violet)' : 'var(--line)'}
                    />
                    <text
                      x={x + 19}
                      y={y + 16}
                      textAnchor="middle"
                      fontFamily="var(--mono)"
                      fontSize="9"
                      fill={on ? 'var(--violet)' : 'var(--ink-dim)'}>
                      {lab}
                    </text>
                  </g>
                );
              })}
            </svg>
            <span className="jn">Generic6DOFJoint3D</span>
            <span className="jd">
              configurável · <b>eixo a eixo</b> — trava, libera ou limita cada GDL,
              com motores opcionais
            </span>
          </div>
        </div>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Junta (Godot)</th>
                <th>Análogo mecânico</th>
                <th>GDL que sobram</th>
                <th>Uso no rover</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">PinJoint3D</td>
                <td>rótula / junta esférica</td>
                <td>3 rotações livres</td>
                <td>articulação sem restrição de giro</td>
              </tr>
              <tr>
                <td className="mono">HingeJoint3D</td>
                <td>dobradiça / revoluta</td>
                <td>1 rotação</td>
                <td>eixo da roda; braço de suspensão</td>
              </tr>
              <tr>
                <td className="mono">SliderJoint3D</td>
                <td>prismática</td>
                <td>1 translação</td>
                <td>curso vertical da suspensão</td>
              </tr>
              <tr>
                <td className="mono">ConeTwistJoint3D</td>
                <td>ombro / esférica limitada</td>
                <td>rotação limitada (cone + torção)</td>
                <td>juntas com batente angular</td>
              </tr>
              <tr>
                <td className="mono">Generic6DOFJoint3D</td>
                <td>configurável</td>
                <td>escolhido eixo a eixo</td>
                <td>casos gerais; combinações; motores</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout">
          <b>Dois detalhes de precisão.</b> O <code>SliderJoint3D</code> pode
          opcionalmente liberar também a torção ao longo do mesmo eixo — pro caso
          da suspensão, o uso pretendido é translação pura. E o{' '}
          <code>ConeTwistJoint3D</code>, diferente das duas anteriores, não deixa
          um GDL <em>totalmente</em> livre: restringe a uma faixa.
        </div>

        <h3 style={{marginTop: 34}}>Esclarecimento: junta é nó, não função</h3>
        <p className="sec-intro" style={{marginBottom: 16}}>
          Ao ver <code>PinJoint3D</code> ou <code>HingeJoint3D</code> pela primeira
          vez, a dúvida natural é se são funções do GDScript. Não são: são{' '}
          <b>nós</b> — classes que a engine oferece pra pendurar na árvore da
          cena, da mesma família de <code>RigidBody3D</code> e{' '}
          <code>RayCast3D</code>, que eu já uso no rover. <code>Joint3D</code> é a
          classe-base; as cinco são subtipos que herdam o "ligar dois corpos" e
          acrescentam seu padrão próprio de travamento.
        </p>
        <div className="duo">
          <div className="facet">
            <span className="tag">Uso 1 · no editor</span>
            <h4>Adicionar o nó e preencher dois campos</h4>
            <p>
              Adiciono o nó à árvore e preencho, no Inspector,{' '}
              <code>node_a</code> e <code>node_b</code>, apontando pros dois{' '}
              <code>RigidBody3D</code>. Toda junta do Godot liga{' '}
              <b>exatamente dois corpos</b> — é a implementação literal do "linkar
              dois corpos rígidos".
            </p>
          </div>
          <div className="facet amber">
            <span className="tag">Uso 2 · em GDScript</span>
            <h4>Como tipo instanciável</h4>
            <p>
              Em código o nome aparece como <b>classe</b>, instanciada da forma
              usual. GDScript é a linguagem; <code>HingeJoint3D</code> é um tipo
              que a engine disponibiliza — não uma função embutida.
            </p>
          </div>
        </div>
        <div className="code-block">
          <div className="fname">GDScript · instanciando uma junta</div>
          <pre>
            <code>
              <span className="cm">
                {'# HingeJoint3D é a classe; .new() é o construtor'}
              </span>
              {'\n'}
              <span className="kw">var</span>
              {' junta = '}
              <span className="ty">HingeJoint3D</span>
              {'.new()'}
            </code>
          </pre>
        </div>
        <div className="callout">
          <b>Onde a conta acontece.</b> O cálculo físico — resolver a restrição a
          cada passo — roda dentro do motor, em C++. No Godot 4.6 quem executa é o{' '}
          <b>Jolt</b>: escolher a junta certa aqui é escolher qual constraint do
          Jolt vai ser acionada.
        </div>
      </section>

      {/* 05 · experimento mínimo */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">05</span>
          <h2>Experimento mínimo: dois corpos e uma dobradiça</h2>
          <span className="when">31 jul</span>
        </div>
        <p className="sec-intro">
          Hora de sair da teoria. Objetivo: ver uma restrição de GDL funcionando
          de verdade — dois <code>RigidBody3D</code> ligados por um{' '}
          <code>HingeJoint3D</code> — <b>sem escrever código</b> e{' '}
          <b>sem aplicar nenhuma força</b>. A cena não tem relação nenhuma com o
          rover; o isolamento é deliberado, no mesmo espírito de ter separado o{' '}
          <code>ground_contact.gd</code>.
        </p>

        <div className="tree">
          <div className="row">
            <span className="n-root">◉ TesteJunta</span>
            <span className="tag">Node3D · raiz da cena de sandbox</span>
          </div>
          <div className="row">
            <span className="g">├─</span> <span className="n-cam">Camera3D</span>
            <span className="tag">só pra enxergar (F6)</span>
          </div>
          <div className="row">
            <span className="g">├─</span>{' '}
            <span className="n-cam">DirectionalLight3D</span>
            <span className="tag">só pra iluminar</span>
          </div>
          <div className="row">
            <span className="g">├─</span> <span className="n-body">Ancora</span>
            <span className="tag">RigidBody3D · Freeze = on · pos (-1, 3, 0)</span>
          </div>
          <div className="row">
            <span className="g">│&nbsp;&nbsp;├─</span>{' '}
            <span className="n-wheel">CollisionShape3D</span>
            <span className="tag">BoxShape3D · o que a física sente</span>
          </div>
          <div className="row">
            <span className="g">│&nbsp;&nbsp;└─</span>{' '}
            <span className="n-mesh">MeshInstance3D</span>
            <span className="tag">BoxMesh · o que aparece na tela</span>
          </div>
          <div className="row">
            <span className="g">├─</span> <span className="n-body">Pendulo</span>
            <span className="tag">RigidBody3D · livre · pos (1, 3, 0)</span>
          </div>
          <div className="row">
            <span className="g">│&nbsp;&nbsp;├─</span>{' '}
            <span className="n-wheel">CollisionShape3D</span>
            <span className="tag">BoxShape3D</span>
          </div>
          <div className="row">
            <span className="g">│&nbsp;&nbsp;└─</span>{' '}
            <span className="n-mesh">MeshInstance3D</span>
            <span className="tag">BoxMesh</span>
          </div>
          <div className="row">
            <span className="g">└─</span> <span className="n-col">HingeJoint3D</span>
            <span className="tag">
              pos (0, 3, 0) · ponto de pivô · Node A = Ancora · Node B = Pendulo
            </span>
          </div>
        </div>
        <div className="tree-legend">
          <span>
            <span className="swatch" style={{background: 'var(--cyan)'}} />
            <b>Raiz</b> — Node3D vazio
          </span>
          <span>
            <span className="swatch" style={{background: 'var(--violet)'}} />
            <b>Corpos rígidos</b> — o que a junta liga
          </span>
          <span>
            <span className="swatch" style={{background: 'var(--amber)'}} />
            <b>Junta</b> — filha da raiz, não dos corpos
          </span>
          <span>
            <span className="swatch" style={{background: 'var(--green)'}} />
            <b>Colisão</b> — a forma física
          </span>
          <span>
            <span className="swatch" style={{background: 'var(--ink-mid)'}} />
            <b>Malha</b> — só o visual
          </span>
        </div>

        <div className="steps" style={{marginTop: 26}}>
          <div className="step">
            <h4>A Âncora é um corpo congelado, não um tipo especial de nó</h4>
            <p>
              Usei um <code>RigidBody3D</code> com <b>Freeze</b> ligado: ele deixa
              de ser afetado pela simulação (não cai, não se move), mas continua
              sendo um corpo físico válido, apto a servir de ponto fixo pra junta —
              o "prego na parede", sem o Godot precisar de um nó dedicado a isso.
            </p>
            <div className="learn">
              Física e visual são <b>dois nós distintos</b> em Godot:{' '}
              <code>CollisionShape3D</code> é a forma que a física reconhece;{' '}
              <code>MeshInstance3D</code> é a que é desenhada.
            </div>
          </div>
          <div className="step">
            <h4>O Pêndulo é idêntico, menos o Freeze</h4>
            <p>
              Mesmo par de filhos, posição espelhada em X, mesma altura. A única
              diferença relevante: <b>sem freeze</b> — livre e sujeito à gravidade.
            </p>
          </div>
          <div className="step">
            <h4>A junta não mora dentro de nenhum dos corpos</h4>
            <p>
              O <code>HingeJoint3D</code> é filho direto da raiz, posicionado no{' '}
              <b>ponto médio</b> entre os dois corpos — o ponto físico em torno do
              qual a rotação relativa acontece. Sua função inteira é apontar pros
              dois corpos, via <b>Node A</b> e <b>Node B</b> no Inspector.
            </p>
          </div>
          <div className="step">
            <h4>Conferir o motor antes de rodar</h4>
            <p>
              Em <em>Project Settings → Advanced → Physics → 3D → Physics
              Engine</em>, confirmei <b>Jolt</b> (padrão no Godot 4.6) — garantindo
              que quem resolve a restrição é mesmo o motor que estudei na quinzena.
            </p>
          </div>
        </div>

        <p className="sec-intro" style={{marginTop: 30, marginBottom: 0}}>
          Ao rodar (F6): o Pêndulo caiu por um instante, foi contido pela junta e
          passou a <b>oscilar em torno do pivô</b>, como um pêndulo físico real.
        </p>
        <div className="shots-2">
          <figure className="shot">
            <img
              src={penduloEmAlta}
              alt="Cena TesteJunta rodando: a caixa da Âncora à esquerda e o Pêndulo à direita, inclinado no ponto alto da oscilação, com uma seta indicando o sentido do giro."
            />
            <figcaption>
              Ponto alto da oscilação — o Pêndulo já inclinado, girando em torno do
              pivô (seta).
            </figcaption>
          </figure>
          <figure className="shot">
            <img
              src={penduloEmBaixa}
              alt="Cena TesteJunta rodando: o Pêndulo na parte baixa da oscilação, pendurado abaixo e à direita da Âncora."
            />
            <figcaption>
              Ponto baixo — pendurado abaixo da Âncora, mantido pela junta, não por
              uma força que eu escrevi.
            </figcaption>
          </figure>
        </div>

        <div className="callout">
          <b>A confirmação prática do bloco 02.</b> Nenhuma linha de código,
          nenhuma força aplicada por mim — e o movimento correto aparece. No
          paradigma de constraint, quem resolve a restrição e produz o movimento é
          o <b>motor</b>.
        </div>

        <h3 style={{marginTop: 36}}>Achado: por que os dois corpos se atravessam</h3>
        <div className="bug">
          <div className="symptom">
            <div className="lab">observação</div>
            <h4>O Pêndulo atravessa a Âncora</h4>
            <p>
              Durante a oscilação os dois corpos se interpenetram em vez de
              colidir. Parece bug — não é.
            </p>
          </div>
          <div className="cause">
            <div className="lab">causa · e é intencional</div>
            <h4>Exclude Nodes From Collision, ligada por padrão</h4>
            <p>
              Toda junta derivada de <code>Joint3D</code> tem essa propriedade{' '}
              <b>ligada por padrão</b>: os dois corpos que ela conecta deixam de
              colidir entre si, mesmo com as formas sobrepostas.
            </p>
          </div>
        </div>

        <div className="fig">
          <svg
            viewBox="0 0 660 220"
            role="img"
            aria-label="No ponto de pivô, dois solvers disputam: a junta puxa os corpos pra manter o pivô fixo, e o solver de colisão empurra os corpos por considerá-los sobrepostos, resultando em vibração.">
            <defs>
              <marker id="mcJ" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
                <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--cyan)" />
              </marker>
              <marker id="mcK" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
                <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--coral)" />
              </marker>
            </defs>
            <text x="24" y="26" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="11">
              no ponto de pivô, dois solvers querem coisas opostas
            </text>
            <rect x="150" y="70" width="90" height="76" rx="4" fill="var(--surface)" stroke="var(--line)" />
            <rect x="228" y="70" width="90" height="76" rx="4" fill="var(--surface-2)" stroke="var(--line)" opacity="0.9" />
            <rect x="228" y="70" width="12" height="76" fill="var(--amber)" opacity="0.18" />
            <text x="188" y="164" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">Ancora</text>
            <text x="282" y="164" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">Pendulo</text>
            <text x="205" y="186" fill="var(--amber)" fontFamily="var(--mono)" fontSize="10">sobreposição no pivô</text>

            {/* junta puxa */}
            <line x1="120" y1="94" x2="176" y2="94" stroke="var(--cyan)" strokeWidth="2" markerEnd="url(#mcJ)" />
            <line x1="348" y1="94" x2="292" y2="94" stroke="var(--cyan)" strokeWidth="2" markerEnd="url(#mcJ)" />
            <text x="358" y="98" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="10">
              junta: mantenha o pivô junto
            </text>
            {/* colisão empurra */}
            <line x1="176" y1="128" x2="120" y2="128" stroke="var(--coral)" strokeWidth="2" markerEnd="url(#mcK)" />
            <line x1="292" y1="128" x2="348" y2="128" stroke="var(--coral)" strokeWidth="2" markerEnd="url(#mcK)" />
            <text x="358" y="132" fill="var(--coral)" fontFamily="var(--mono)" fontSize="10">
              colisão: separe os corpos sobrepostos
            </text>
            {/* resultado */}
            <polyline
              points="410,180 424,168 438,192 452,168 466,192 480,168 494,192 508,180"
              fill="none"
              stroke="var(--coral)"
              strokeWidth="2"
            />
            <text x="520" y="186" fill="var(--coral)" fontFamily="var(--mono)" fontSize="10">
              = travamento e vibração
            </text>
          </svg>
          <div className="cap">
            <b>Verificado na prática:</b> desliguei a opção, rodei de novo e o
            comportamento alternativo apareceu exatamente assim — o Pêndulo
            travando e vibrando perto do pivô.
          </div>
        </div>

        <div className="callout">
          <b>Por que isso importa direto pro rover.</b> Numa junta real — uma
          dobradiça — as partes <em>se tocam</em> no pivô, por definição. Chassi e
          roda ligados por um <code>HingeJoint3D</code> no eixo vão, quase com
          certeza, ter formas de colisão sobrepostas ali. O comportamento
          desejável é justamente o padrão do Godot: excluir a colisão mútua e
          deixar só a junta governar a relação.
        </div>

        <div className="callout amber">
          <b>Pendência desta sessão.</b> O escopo do dia previa ainda dois testes
          que <b>não fiz</b>: girar o eixo do <code>HingeJoint3D</code> no editor
          pra ver o plano da oscilação mudar, e ativar o <b>Angular Limit</b>{' '}
          (<code>lower</code>/<code>upper</code>) pra restringir ainda mais o único
          GDL que a junta permite. Fica registrado como pendência — não considerar
          concluído.
        </div>

        <div className="callout">
          <b>Organização do repositório.</b> A cena <code>.tscn</code> fica isolada
          dentro do projeto Godot (<code>Teste_junta/</code>, na raiz do repo,
          fora do Docusaurus); o registro visual do experimento vive junto desta
          doc, em <code>src/components/DossieMulticorpo/img/</code>. Optei
          deliberadamente por <b>não</b> criar uma página só pro experimento — ele
          é uma seção desta entrada consolidada.
        </div>
      </section>

      {/* 06 · como o Jolt resolve */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">06</span>
          <h2>Como o Jolt resolve um constraint</h2>
          <span className="when">03–07 ago</span>
        </div>
        <p className="sec-intro">
          O experimento produziu a restrição funcionando; a semana 2 foi investigar
          o que acontece <em>por dentro</em> desse resultado — e a primeira coisa é
          que o mecanismo nem sequer é uma força.
        </p>

        <div className="duo">
          <div className="facet amber">
            <span className="tag">Força · o que o raycast faz</span>
            <h4>Age ao longo de um intervalo</h4>
            <p>
              Uma força atua <b>continuamente</b> durante o passo de tempo. É o que
              eu faço a cada quadro: calculo uma força e deixo ela agir por{' '}
              <code>delta</code>. O efeito na velocidade é indireto — vem da
              integração.
            </p>
          </div>
          <div className="facet">
            <span className="tag">Impulso · o que o solver faz</span>
            <h4>Muda a velocidade de uma vez</h4>
            <p>
              Um <b>impulso</b> é uma mudança <b>instantânea</b> na velocidade. O
              solver não empurra aos poucos: pergunta quanta velocidade na direção
              proibida existe, e remove exatamente isso. Não há parâmetro de
              "intensidade" — a pergunta tem <b>uma</b> resposta matemática.
            </p>
          </div>
        </div>

        <div className="fig">
          <svg
            viewBox="0 0 680 210"
            role="img"
            aria-label="Gráfico da velocidade proibida ao longo do tempo: na penalidade a força sobrecorrige e a velocidade oscila em torno de zero; no constraint o impulso a zera de uma vez a cada passo.">
            {/* eixos esquerda */}
            <line x1="40" y1="30" x2="40" y2="170" stroke="var(--line)" strokeWidth="1" />
            <line x1="40" y1="100" x2="330" y2="100" stroke="var(--line)" strokeWidth="1" strokeDasharray="4 4" />
            <text x="16" y="104" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">0</text>
            <text x="40" y="22" fill="var(--amber)" fontFamily="var(--mono)" fontSize="11">
              penalidade · força ao longo do passo
            </text>
            <polyline points={penPath} fill="none" stroke="var(--amber)" strokeWidth="2" />
            <text x="120" y="188" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              sobrecorrige, oscila, pode divergir
            </text>

            <line x1="360" y1="20" x2="360" y2="190" stroke="var(--line-soft)" strokeWidth="1" strokeDasharray="4 6" />

            {/* direita · impulso */}
            <line x1="400" y1="30" x2="400" y2="170" stroke="var(--line)" strokeWidth="1" />
            <line x1="400" y1="100" x2="660" y2="100" stroke="var(--line)" strokeWidth="1" strokeDasharray="4 4" />
            <text x="400" y="22" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="11">
              constraint · impulso instantâneo
            </text>
            {[0, 1, 2, 3].map((i) => {
              const x0 = 410 + i * 62;
              return (
                <g key={i}>
                  <line x1={x0} y1="100" x2={x0 + 42} y2={100 - 44 / (i + 1)} stroke="var(--cyan)" strokeWidth="2" />
                  <line
                    x1={x0 + 42}
                    y1={100 - 44 / (i + 1)}
                    x2={x0 + 42}
                    y2="100"
                    stroke="var(--cyan)"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />
                  <circle cx={x0 + 42} cy="100" r="3" fill="var(--cyan)" />
                  <text x={x0 + 6} y="188" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="9">
                    passo {i + 1}
                  </text>
                </g>
              );
            })}
            <text x="400" y="152" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              a proibida volta a zero, passo a passo
            </text>
          </svg>
          <div className="cap">
            Eixo vertical: a velocidade <b>na direção que a restrição proíbe</b>.
            À esquerda ela é combatida por uma força que eu dimensionei; à direita,
            removida por um impulso derivado da própria formulação da restrição.
          </div>
        </div>

        <h3 style={{marginTop: 30}}>O loop iterativo — e por que é "sequencial"</h3>
        <p className="sec-intro" style={{marginBottom: 12}}>
          Dentro de <b>um único</b> passo de física o solver refaz esse cálculo
          várias vezes — tipicamente de 4 a 10 iterações — antes de avançar. Isso
          só é necessário quando um corpo participa de{' '}
          <b>mais de uma constraint ao mesmo tempo</b>: corrigir a junta 1 perturba
          de leve a relação que a junta 2 já tinha corrigido. A técnica se chama{' '}
          <b>solver de impulsos sequenciais</b> e é o que praticamente todo motor
          de jogo usa — Jolt, Bullet, PhysX.
        </p>

        <div className="fig">
          <svg
            viewBox="0 0 660 230"
            role="img"
            aria-label="Um chassi ligado a quatro rodas por quatro juntas: corrigir uma junta afeta o chassi e, por consequência, as outras três; o erro residual cai a cada iteração do solver.">
            <rect x="230" y="34" width="180" height="38" rx="6" fill="var(--surface)" stroke="var(--cyan)" />
            <text x="320" y="58" textAnchor="middle" fill="var(--ink)" fontFamily="var(--mono)" fontSize="11">
              chassi
            </text>
            {[250, 300, 350, 400].map((x, i) => (
              <g key={x}>
                <line x1="320" y1="72" x2={x} y2="112" stroke="var(--amber)" strokeWidth="1.6" />
                <circle cx={x} cy="126" r="15" fill="var(--surface-2)" stroke="var(--line)" />
                <text x={x} y="130" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="9">
                  j{i + 1}
                </text>
              </g>
            ))}
            <text x="40" y="128" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              4 juntas compartilham
            </text>
            <text x="40" y="142" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              o mesmo corpo
            </text>

            {/* barras de erro residual */}
            <text x="60" y="182" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              erro residual por iteração
            </text>
            {[
              {it: '1', w: 200},
              {it: '2', w: 104},
              {it: '3', w: 46},
              {it: '4', w: 16},
            ].map((b, i) => (
              <g key={b.it}>
                <rect x={250} y={192 + i * 9} width={b.w} height="5" rx="2.5" fill="var(--cyan)" opacity={1 - i * 0.16} />
                <text x={228} y={197 + i * 9} textAnchor="end" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="8">
                  it. {b.it}
                </text>
              </g>
            ))}
          </svg>
          <div className="cap">
            No meu experimento — uma junta, dois corpos — isso praticamente não
            aparece: converge de imediato. Vira relevante num chassi ligado a
            quatro rodas por quatro <code>HingeJoint3D</code>.
          </div>
        </div>

        <div className="callout">
          <b>Por que não diverge, ao contrário do meu atrito.</b> Lá, a força
          corretiva cancelava velocidade ao longo de um quadro inteiro{' '}
          <b>sem limite matemático embutido</b> — superestimou, o erro cresce no
          quadro seguinte, e foi preciso enfiar o <em>clamp</em> do círculo de
          atrito na mão. No solver de impulsos a correção não é escolhida por
          ninguém: é <b>derivada da formulação da própria restrição</b>, sempre
          exatamente a necessária. Não existe um parâmetro equivalente pra
          calibrar — a estabilidade vem da formulação. Referência concreta: a doc
          de migração do Godot 4.6 pro Jolt registra{' '}
          <span className="stat">4</span> como o valor padrão de{' '}
          <code>Solver Iterations</code>, ajustável — mais iterações, mais
          estabilidade, menos desempenho.
        </div>
      </section>

      {/* 07 · o que o Godot esconde */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">07</span>
          <h2>O que o Godot esconde do Jolt</h2>
          <span className="when">03–07 ago</span>
        </div>
        <p className="sec-intro">
          O Godot 4.6 tornou o Jolt o motor 3D padrão — mas o que chega até mim,
          pela API de nós, é bem menos do que a biblioteca oferece. Vale entender
          por quê.
        </p>

        <div className="duo">
          <div className="facet">
            <span className="tag">Caminho 1 · módulo embutido (core)</span>
            <h4>O que estou usando</h4>
            <p>
              Incorporado ao motor a partir da 4.4 e padrão na 4.6. É o mais
              conveniente — e, hoje, o <b>mais limitado</b> dos dois.
            </p>
          </div>
          <div className="facet amber">
            <span className="tag">Caminho 2 · godot-jolt (GDExtension)</span>
            <h4>Mais completo, mas em manutenção</h4>
            <p>
              Extensão da comunidade, anterior à incorporação, hoje mantida só pra
              correção de bugs. O próprio repositório afirma que o módulo do motor{' '}
              <b>ainda não tem paridade</b> com ela — faltam, por exemplo, os nós
              de junta específicos do Jolt (<code>JoltHingeJoint3D</code> e
              equivalentes).
            </p>
          </div>
        </div>

        <div className="fig">
          <svg
            viewBox="0 0 680 250"
            role="img"
            aria-label="Funil: o Jolt oferece onze tipos de constraint mais veículos; a API genérica Joint3D do Godot, anterior ao Jolt, deixa passar apenas cinco nós de junta.">
            <rect x="70" y="26" width="540" height="44" rx="10" fill="var(--surface)" stroke="var(--cyan)" />
            <text x="340" y="54" textAnchor="middle" fill="var(--ink)" fontFamily="var(--mono)" fontSize="12">
              Jolt · 11 constraints + veículos (rodas, esteiras, motos)
            </text>
            <polygon
              points="70,80 610,80 430,150 250,150"
              fill="var(--surface-2)"
              stroke="var(--line)"
            />
            <text x="340" y="112" textAnchor="middle" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="11">
              API genérica Joint3D
            </text>
            <text x="340" y="132" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">
              criada antes do Jolt, pra qualquer motor por trás
            </text>
            <rect x="250" y="164" width="180" height="42" rx="10" fill="var(--surface)" stroke="var(--cyan)" />
            <text x="340" y="190" textAnchor="middle" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="12">
              5 nós de junta
            </text>
            {/* o que transborda */}
            <line x1="250" y1="150" x2="150" y2="196" stroke="var(--coral)" strokeWidth="2" strokeDasharray="5 4" />
            <line x1="430" y1="150" x2="530" y2="196" stroke="var(--coral)" strokeWidth="2" strokeDasharray="5 4" />
            <text x="20" y="216" fill="var(--coral)" fontFamily="var(--mono)" fontSize="10">
              fixed · distance/mola
            </text>
            <text x="20" y="230" fill="var(--coral)" fontFamily="var(--mono)" fontSize="10">
              gear · rack &amp; pinion
            </text>
            <text x="520" y="216" fill="var(--coral)" fontFamily="var(--mono)" fontSize="10">
              pulley · path
            </text>
            <text x="520" y="230" fill="var(--coral)" fontFamily="var(--mono)" fontSize="10">
              VehicleConstraint
            </text>
          </svg>
          <div className="cap">
            <b>A raiz técnica.</b> Os cinco nós fazem parte de uma API genérica de{' '}
            <code>Joint3D</code>, criada pro <code>GodotPhysics3D</code> e
            reaproveitada pro Jolt. O sistema de constraints do Jolt, mais rico,
            precisa caber num molde que não foi desenhado pra ele.
          </div>
        </div>

        <div className="callout coral">
          <b>Não é só o que falta — é o que funciona errado.</b> Uma discussão da
          própria equipe do Godot expõe que vários parâmetros da API genérica{' '}
          <b>não funcionam corretamente</b> com o Jolt por trás, porque não deu pra
          mapear o significado de todos pro modelo dele. Exemplo citado: o Jolt não
          implementa limites suaves pro <code>PinJoint3D</code> (por design, é uma
          junta propositalmente barata) — então o módulo recorre,{' '}
          <b>silenciosamente</b>, a uma junta 6DOF por baixo sempre que esses
          limites são configurados.
        </div>

        <div className="steps" style={{marginTop: 26}}>
          <div className="step">
            <h4>Não existe junta fixa nativa</h4>
            <p>
              Sem forma direta de criar uma <em>fixed constraint</em>. A solução de
              contorno documentada é montar uma <code>Generic6DOFJoint3D</code> com
              os seis eixos travados na mão. Há PR em aberto propondo suporte
              nativo.
            </p>
          </div>
          <div className="step">
            <h4>Não dá pra fazer juntas quebráveis</h4>
            <p>
              A API não expõe forma de <b>ler a força ou o torque</b> que uma junta
              está sofrendo — o que impede juntas que se rompem ao passar de um
              limiar. As funções existem no Jolt em C++, mas não chegam nem ao
              GDScript nem ao <code>PhysicsServer3D</code>.
            </p>
          </div>
          <div className="step">
            <h4>
              A <code>VehicleConstraint</code> não é exposta
            </h4>
            <p>
              O modelo de veículo pronto do Jolt — reconhecido pela própria
              comunidade como bem superior ao <code>VehicleBody3D</code> nativo —
              não existe como nó. Há discussão aberta propondo incorporá-lo, com o
              autor relatando ter implementado por conta própria.
            </p>
          </div>
        </div>

        <div className="callout amber">
          <b>Implicação direta pra decisão arquitetural do rover.</b> Mesmo que eu
          vá <b>integralmente</b> pro caminho multicorpo — hinge nas rodas, slider
          na suspensão —, <b>não existe</b>, no Godot atual, um modelo de veículo
          pronto do Jolt pra me apoiar. A estrutura de juntas continuaria sendo
          montada na mão, e o contato pneu-solo continuaria sendo um problema em
          aberto, a resolver separadamente — dentro ou fora do paradigma de
          constraint.
        </div>
      </section>

      {/* 08 · repositório do Jolt */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">08</span>
          <h2>O que o repositório do Jolt revela</h2>
          <span className="when">06–07 ago</span>
        </div>
        <p className="sec-intro">
          Por fim, uma exploração direta do <code>jrouwe/JoltPhysics</code> — sem
          compilar nada, só reconhecendo o que a biblioteca entrega além do que
          chega ao Godot.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Pasta</th>
                <th>Conteúdo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">Jolt/</td>
                <td>todo o código-fonte da biblioteca</td>
              </tr>
              <tr>
                <td className="mono">Docs/</td>
                <td>documentação, incluindo o catálogo de demonstrações</td>
              </tr>
              <tr>
                <td className="mono">Samples/</td>
                <td>aplicativo de demonstração, com um teste por funcionalidade</td>
              </tr>
              <tr>
                <td className="mono">HelloWorld/</td>
                <td>exemplo mínimo de integração</td>
              </tr>
              <tr>
                <td className="mono">UnitTests/</td>
                <td>testes de validação do comportamento físico</td>
              </tr>
              <tr>
                <td className="mono">Assets, Build, JoltViewer…</td>
                <td>infraestrutura de apoio</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="sec-intro" style={{marginTop: 28, marginBottom: 10}}>
          E a seção "Features" do README, cruzada com os cinco nós do Godot, torna
          a lacuna numérica:
        </p>
        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Constraint no Jolt</th>
                <th>Exposta como nó no Godot?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Point</td>
                <td>
                  <span className="yes">✓ PinJoint3D</span>
                </td>
              </tr>
              <tr>
                <td>Hinge</td>
                <td>
                  <span className="yes">✓ HingeJoint3D</span>
                </td>
              </tr>
              <tr>
                <td>Slider</td>
                <td>
                  <span className="yes">✓ SliderJoint3D</span>
                </td>
              </tr>
              <tr>
                <td>Cone / Swing-twist</td>
                <td>
                  <span className="yes">✓ ConeTwistJoint3D</span>{' '}
                  <span className="no">(parcial)</span>
                </td>
              </tr>
              <tr>
                <td>6 DOF</td>
                <td>
                  <span className="yes">✓ Generic6DOFJoint3D</span>
                </td>
              </tr>
              <tr className="amber">
                <td>Fixed</td>
                <td>
                  <span className="no">✕ contorno: 6DOF com tudo travado</span>
                </td>
              </tr>
              <tr className="amber">
                <td>Distance (com molas)</td>
                <td>
                  <span className="no">✕</span>
                </td>
              </tr>
              <tr className="amber">
                <td>Gear · Rack and pinion · Pulley</td>
                <td>
                  <span className="no">✕</span>
                </td>
              </tr>
              <tr className="amber">
                <td>Path (trajetórias suaves)</td>
                <td>
                  <span className="no">✕</span>
                </td>
              </tr>
              <tr className="amber">
                <td>Veículos (rodas, esteiras, motos)</td>
                <td>
                  <span className="no">✕ VehicleConstraint não exposta</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style={{marginTop: 32}}>O catálogo de demonstrações (Docs/Samples.md)</h3>
        <div className="duo">
          <div className="facet">
            <span className="tag">Categoria · Constraints</span>
            <h4>A lacuna, em vídeo</h4>
            <p>
              Demonstrações de constraints que o Godot <b>não</b> expõe —{' '}
              <em>Path</em>, <em>Swing-Twist</em>, <em>Gear</em>,{' '}
              <em>Rack and pinion</em>, <em>Pulley</em>. Confirmação visual direta
              do bloco 07.
            </p>
          </div>
          <div className="facet amber">
            <span className="tag">Categoria · Rig (Ragdolls)</span>
            <h4>O esqueleto de volta</h4>
            <p>
              Estruturas articuladas com hinge e <em>swing-twist</em> — a mesma
              analogia do esqueleto do bloco 01, agora rodando.
            </p>
          </div>
        </div>

        <div className="callout">
          <b>O achado mais importante da exploração · categoria Vehicles.</b> A
          descrição oficial do Jolt diz que os veículos são criados via{' '}
          <code>VehicleConstraint</code> e que eles usam <b>raycasts ou
          shapecasts</b> pra detectar o solo, simulando o veículo completo com
          motor, câmbio, diferenciais e suspensão. Ou seja, com fonte primária: o
          próprio modelo de veículo do Jolt <b>combina raycast</b> (contato
          pneu-solo) <b>com o solver de constraints</b> (estrutura do chassi,
          suspensão, transmissão). Raycast e multicorpo não são concorrentes —{' '}
          <b>coexistem dentro do motor</b> que fundamenta a quinzena inteira.
        </div>
      </section>

      {/* 09 · síntese */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">09</span>
          <h2>Síntese e o que ficou em aberto</h2>
          <span className="when">10 ago</span>
        </div>

        <div className="steps">
          <div className="step">
            <h4>O paradigma</h4>
            <p>
              Corpo rígido livre = 6 GDL. Junta = travar parte dos 6 GDL{' '}
              <b>relativos</b> entre dois corpos; o que sobra é o que ela permite.
              Escolher a junta <b>é</b> escolher como restringir.
            </p>
          </div>
          <div className="step">
            <h4>A autoria da força</h4>
            <p>
              Penalidade: eu calculo e aplico; relação aproximada; risco de
              divergência (caso concreto: a ejeção por atrito, resolvida com o{' '}
              <em>clamp</em>). Constraint: eu declaro; o solver calcula o impulso
              exato; relação exata por construção.
            </p>
          </div>
          <div className="step">
            <h4>O raycast não foi trabalho perdido</h4>
            <p>
              Ele é uma versão <em>lumped</em> do modelo multicorpo formal — e o
              próprio veículo do Jolt mistura os dois. Migrar pra juntas no futuro
              não invalida nada do que já construí.
            </p>
          </div>
          <div className="step">
            <h4>O experimento</h4>
            <p>
              <code>TesteJunta</code> rodou: pêndulo oscilando sem código nem
              força. Achado de bônus:{' '}
              <b>Exclude Nodes From Collision</b> — relevante direto pra futura
              junta chassi-roda.
            </p>
          </div>
          <div className="step">
            <h4>O limite da ferramenta</h4>
            <p>
              O Godot expõe o Jolt por uma API <code>Joint3D</code> genérica e
              anterior a ele: implementa errado vários parâmetros e deixa de fora
              recursos inteiros — junta fixa, juntas quebráveis e, sobretudo, a{' '}
              <code>VehicleConstraint</code>.
            </p>
          </div>
        </div>

        <div className="callout amber">
          <b>Esta entrada cobre metade do roadmap da quinzena.</b> Fecha o arco
          conceitual (conceito → GDL → experimento → Jolt por dentro). Segue{' '}
          <b>em aberto</b>, pra próxima etapa: o comparativo Jolt × Godot a partir
          de um <code>Sample</code>, replicar esse sample no Godot com nós{' '}
          <code>Joint3D</code>, ler a doc do <b>GDExtension</b> e espelhar o{' '}
          <b>GDChrono</b> do professor pro Jolt. Também ficaram pendentes os dois
          testes do bloco 05 (girar o eixo do hinge e ativar o{' '}
          <em>Angular Limit</em>).
        </div>

        <h3 style={{marginTop: 34}}>Fontes</h3>
        <div className="refs">
          <div className="rgrp">solver de impulsos</div>
          <a
            href="https://www.strayspark.studio/blog/godot-46-jolt-physics-migration-guide"
            target="_blank"
            rel="noopener noreferrer">
            <span>
              Godot 4.6 Jolt Physics — Migration Guide and Benchmarks
              <span className="rd">
                StraySpark · onde aparece o padrão de 4 Solver Iterations
              </span>
            </span>
            <span className="rk">↗ blog</span>
          </a>

          <div className="rgrp">limitações do Godot em relação ao Jolt</div>
          <a href="https://github.com/godot-jolt/godot-jolt" target="_blank" rel="noopener noreferrer">
            <span>
              godot-jolt/godot-jolt
              <span className="rd">a extensão comunitária e a nota de não-paridade</span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/godotengine/godot-proposals/issues/14845"
            target="_blank"
            rel="noopener noreferrer">
            <span>
              Unify Joint3D spring parameters and make them understandable
              <span className="rd">godot-proposals #14845 · parâmetros que não mapeiam pro Jolt</span>
            </span>
            <span className="rk">↗ proposals</span>
          </a>
          <a
            href="https://github.com/godotengine/godot-proposals/discussions/15037"
            target="_blank"
            rel="noopener noreferrer">
            <span>
              Add Jolt Vehicle constraints
              <span className="rd">godot-proposals #15037 · a VehicleConstraint ausente</span>
            </span>
            <span className="rk">↗ proposals</span>
          </a>
          <a
            href="https://github.com/godotengine/godot-proposals/issues/13422"
            target="_blank"
            rel="noopener noreferrer">
            <span>
              Expose Jolt Joint3D get_applied_force and get_applied_torque
              <span className="rd">godot-proposals #13422 · o que bloqueia juntas quebráveis</span>
            </span>
            <span className="rk">↗ proposals</span>
          </a>
          <a
            href="https://forum.godotengine.org/t/various-issues-with-jolt-fixed-joint/132455"
            target="_blank"
            rel="noopener noreferrer">
            <span>
              Various issues with Jolt fixed joint
              <span className="rd">fórum oficial · a ausência de junta fixa nativa</span>
            </span>
            <span className="rk">↗ fórum</span>
          </a>
          <a href="https://github.com/godotengine/godot/pull/101575" target="_blank" rel="noopener noreferrer">
            <span>
              Add support for Jolt's FixedConstraint joint
              <span className="rd">godot PR #101575 · proposta de suporte nativo</span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://docs.godotengine.org/en/latest/tutorials/physics/using_jolt_physics.html"
            target="_blank"
            rel="noopener noreferrer">
            <span>
              Using Jolt Physics
              <span className="rd">documentação oficial do Godot</span>
            </span>
            <span className="rk">↗ godot docs</span>
          </a>

          <div className="rgrp">repositório do Jolt</div>
          <a href="https://github.com/jrouwe/JoltPhysics" target="_blank" rel="noopener noreferrer">
            <span>
              jrouwe/JoltPhysics
              <span className="rd">estrutura de pastas e a seção Features</span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Docs/Samples.md"
            target="_blank"
            rel="noopener noreferrer">
            <span>
              Docs/Samples.md
              <span className="rd">catálogo de demonstrações · Constraints, Vehicles, Rig</span>
            </span>
            <span className="rk">↗ github</span>
          </a>
        </div>
      </section>
    </div>
  );
}
