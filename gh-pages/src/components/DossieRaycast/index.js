import React from 'react';

/**
 * Doc técnica · Integração roda–solo · Protótipo raycast (Tema 1).
 * Registra a sessão em que o rover foi refeito em Godot com modelo de veículo
 * por raycast (força-baseado), abandonando VehicleBody3D/VehicleWheel3D, e o
 * contato roda-solo foi isolado numa fronteira de API (GroundContact) pensando
 * na futura troca pela ExoPhysics. Visual-first: renderiza sob `.dossie
 * .tecnica`, reaproveitando hero/meta/bug/callout/duo do dossiê + o code-block
 * de tecnica.css. Fonte de verdade: prototipo-veiculo/scripts/.
 */
export default function DossieRaycast() {
  // Curvas da figura de oscilação (conceito c): amostragem de duas senoides —
  // uma sem amortecimento (amplitude constante) e uma amortecida (decai). É só
  // JS puro no render, sem lib de gráfico; o SVG final é estático.
  const oscXs = Array.from({length: 49}, (_, i) => 60 + i * 10);
  const oscY0 = 130;
  const oscAmp = 66;
  const oscW = 0.046;
  const oscTau = 185;
  const oscUndamped = oscXs
    .map((x) => `${x},${(oscY0 - oscAmp * Math.sin(oscW * (x - 60))).toFixed(1)}`)
    .join(' ');
  const oscDamped = oscXs
    .map(
      (x) =>
        `${x},${(
          oscY0 -
          oscAmp * Math.exp(-(x - 60) / oscTau) * Math.sin(oscW * (x - 60))
        ).toFixed(1)}`,
    )
    .join(' ');

  return (
    <div className="dossie tecnica">
      {/* faixa de telemetria */}
      <div className="telemetry-strip">
        <span>
          <span className="dot" />
          tema 1 · protótipo
        </span>
        <span>
          engine · <b>Godot · Jolt Physics</b>
        </span>
        <span>
          modelo · <b>raycast (força-baseado)</b>
        </span>
        <span>
          sinkage · <b>0 · terreno rígido</b>
        </span>
        <span>
          frente · <b>Integração roda–solo</b>
        </span>
      </div>

      {/* hero */}
      <header className="hero-block">
        <div className="eyebrow">Protótipo · rover por raycast</div>
        <h1>
          O contato roda-solo virou uma{' '}
          <span className="accent">fronteira de API</span>.
        </h1>
        <p className="lede">
          Refiz o rover em Godot trocando o <code>VehicleBody3D</code> pronto por
          um modelo <strong>força-baseado por raycast</strong>: um corpo rígido,
          quatro raios, e cada roda calculando as próprias forças. O ganho real
          não é o carro andar — é que <strong>todo o contato roda-solo agora
          mora numa única função</strong>, uma fronteira de API pensada pra ser
          trocada pela ExoPhysics sem mexer no resto. Estas notas registram o que
          foi construído, o bug que ensinou uma lição de simulação discreta e
          como isso se encaixa (ou não) no modelo multicorpo do Bloco&nbsp;5.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>Em resumo:</b> troquei o motor de veículo pronto do Godot por um
          feito à mão, roda por roda. É mais trabalho — mas assim a física do
          contato com o chão fica <b>isolada num único lugar</b>. E é justamente
          esse lugar que vai ser substituído, mais pra frente, pela física de
          solo real (a ExoPhysics).
        </div>

        <dl className="hero-meta">
          <div>
            <dt>Corpo</dt>
            <dd>RigidBody3D + 4 RayCast3D</dd>
          </div>
          <div>
            <dt>Forças por roda</dt>
            <dd>Suspensão · grip · tração</dd>
          </div>
          <div>
            <dt>Fronteira</dt>
            <dd>query_wheel_contact()</dd>
          </div>
          <div>
            <dt>Futuro</dt>
            <dd>Mesma assinatura → ExoPhysics</dd>
          </div>
        </dl>
      </header>

      {/* 00 · conceitos-base */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">00</span>
          <h2>Conceitos-base</h2>
        </div>
        <p className="sec-intro">
          Antes do "como resolvemos", três peças que o resto do dossiê assume
          conhecidas. Nada aprofundado — só o suficiente pra acompanhar quem não
          vive de Godot nem de física de simulação.
        </p>

        {/* a · RigidBody3D e o loop de física */}
        <div className="duo">
          <div className="facet">
            <span className="tag">Base · o que a Godot faz</span>
            <h4>RigidBody3D: resolvido sozinho</h4>
            <p>
              Um <code>RigidBody3D</code> é um corpo que a Godot move segundo a
              física: ela cuida sozinha da <b>gravidade</b>, da integração do
              movimento e da <b>detecção de colisão</b>. O rover inteiro é um
              único corpo desses.
            </p>
          </div>
          <div className="facet amber">
            <span className="tag">Base · o que fica pra nós</span>
            <h4>As forças de contato</h4>
            <p>
              O que a Godot <b>não</b> sabe é como a roda toca o chão. Toda força
              de suspensão, grip e tração é <b>nossa</b> pra calcular e aplicar —
              é justamente o assunto deste dossiê.
            </p>
          </div>
        </div>

        <div className="callout">
          <b>Dois detalhes que o resto do texto usa.</b> Primeiro: a massa do
          rover foi ajustada pra <span className="stat">12 kg</span> (o padrão do
          <code>RigidBody3D</code> é 1 kg) — leve demais, ele reagiria a qualquer
          força como uma bola de pingue-pongue, sem a inércia que assenta o corpo.
          Segundo, e mais importante: a física não roda contínua, e sim em{' '}
          <b>fatias discretas de tempo</b> — o método{' '}
          <code>_physics_process</code> é chamado ~60×/s, cada chamada avançando um{' '}
          <code>delta</code> ≈ 1/60 s. Esse passo discreto é o que abre a porta pro
          bug da seção 06.
        </div>
        <div className="code-block">
          <div className="fname">prototipo-veiculo/scripts/rover.gd</div>
          <pre>
            <code>
              <span className="cm">{'# chamado a cada fatia de física (~1/60 s); delta = duração da fatia'}</span>{'\n'}
              <span className="kw">func</span>{' _physics_process(delta):'}
            </code>
          </pre>
        </div>

        {/* b · RayCast3D como sensor */}
        <div className="facet" style={{marginTop: 8}}>
          <span className="tag">Base · RayCast3D</span>
          <h4>Um sensor, não um atuador</h4>
          <p>
            Cada roda é representada por um <code>RayCast3D</code>: uma "régua
            invisível" presa ao chassi, apontando pra baixo. Ele{' '}
            <b>não aplica força nenhuma</b> — só <b>informa</b>. Tem uma{' '}
            <b>origem</b> (fixa no chassi), um <b>alcance</b> (
            <code>target_position</code>, que faz o papel do curso da suspensão) e,
            quando encosta em algo, devolve o <b>ponto de contato</b> e a{' '}
            <b>normal</b> — a inclinação do chão ali. Transformar isso em força é
            trabalho nosso, na seção 03.
          </p>
        </div>
        <div className="fig">
          <svg viewBox="0 0 420 300" role="img" aria-label="Vista lateral: um RayCast3D preso ao chassi mede a distância até o solo e devolve o ponto de contato e a normal">
            <defs>
              <marker id="mkGrn00" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="var(--green)" />
              </marker>
            </defs>
            {/* solo levemente inclinado */}
            <path d="M40,232 L380,270 L380,300 L40,300 Z" fill="var(--bg-2)" stroke="var(--line-soft)" />
            <line x1="40" y1="232" x2="380" y2="270" stroke="var(--line)" strokeWidth="2" />
            <text x="52" y="292" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="11">solo</text>
            {/* chassi */}
            <rect x="110" y="40" width="200" height="22" rx="4" fill="var(--surface-2)" stroke="var(--line)" />
            <text x="210" y="34" textAnchor="middle" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="11">chassi · origem do raio</text>
            {/* raio */}
            <line x1="210" y1="62" x2="210" y2="251" stroke="var(--cyan)" strokeWidth="2" strokeDasharray="6 5" />
            <text x="150" y="150" textAnchor="end" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="11">raio</text>
            <text x="150" y="164" textAnchor="end" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="11">(RayCast3D)</text>
            {/* medida do alcance */}
            <line x1="250" y1="62" x2="250" y2="251" stroke="var(--ink-dim)" strokeWidth="1" />
            <line x1="245" y1="62" x2="255" y2="62" stroke="var(--ink-dim)" strokeWidth="1" />
            <line x1="245" y1="251" x2="255" y2="251" stroke="var(--ink-dim)" strokeWidth="1" />
            <text x="262" y="148" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">target_position</text>
            <text x="262" y="161" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">(alcance = curso)</text>
            {/* ponto de contato */}
            <circle cx="210" cy="251" r="5" fill="var(--amber)" />
            <text x="198" y="243" textAnchor="end" fill="var(--amber)" fontFamily="var(--mono)" fontSize="11">ponto de contato</text>
            {/* normal */}
            <line x1="210" y1="251" x2="216" y2="193" stroke="var(--green)" strokeWidth="3" markerEnd="url(#mkGrn00)" />
            <text x="226" y="192" fill="var(--green)" fontFamily="var(--mono)" fontSize="11" fontWeight="700">normal</text>
          </svg>
          <div className="cap">
            O <b>RayCast3D</b> é só um sensor — uma régua invisível presa ao
            chassi. Ele não empurra nada: informa <b>se</b> colidiu, <b>onde</b>{' '}
            (ponto de contato) e a <b>inclinação</b> do chão ali (a normal). O
            alcance (<b>target_position</b>) faz o papel do curso da suspensão.
          </div>
        </div>

        {/* c · mola E amortecedor */}
        <div className="facet" style={{marginTop: 8}}>
          <span className="tag">Base · suspensão</span>
          <h4>Por que precisa de mola E amortecedor</h4>
          <p>
            A <b>mola</b> sozinha devolve toda a energia que recebe: comprime,
            empurra de volta, e o chassi <b>balança pra sempre</b> — nada tira
            energia do sistema. O <b>amortecedor</b> é a peça que <b>dissipa</b>{' '}
            essa energia a cada ciclo, fazendo a oscilação decair até o corpo{' '}
            <b>assentar</b>. Um sem o outro não estabiliza — e é por isso que a
            força de suspensão (seção 03) soma as duas.
          </p>
        </div>
        <div className="fig">
          <svg viewBox="0 0 560 260" role="img" aria-label="Duas curvas de oscilação ao longo do tempo: só mola oscila com amplitude constante; mola mais amortecedor decai até assentar">
            {/* linha zero */}
            <line x1="60" y1="130" x2="540" y2="130" stroke="var(--line)" strokeWidth="1" strokeDasharray="4 4" />
            <text x="540" y="150" textAnchor="end" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">tempo →</text>
            <text transform="rotate(-90 22 130)" x="22" y="130" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">altura do chassi</text>
            {/* curvas */}
            <polyline points={oscUndamped} fill="none" stroke="var(--coral)" strokeWidth="2" strokeLinejoin="round" />
            <polyline points={oscDamped} fill="none" stroke="var(--cyan)" strokeWidth="2.5" strokeLinejoin="round" />
            {/* legenda */}
            <line x1="70" y1="30" x2="96" y2="30" stroke="var(--coral)" strokeWidth="2" />
            <text x="102" y="34" fill="var(--coral)" fontFamily="var(--mono)" fontSize="11">só mola — balança pra sempre</text>
            <line x1="70" y1="48" x2="96" y2="48" stroke="var(--cyan)" strokeWidth="2.5" />
            <text x="102" y="52" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="11">mola + amortecedor — assenta</text>
          </svg>
          <div className="cap">
            Resposta do chassi a um baque, ao longo do tempo. Só a mola conserva a
            energia e oscila com amplitude constante — o carro viraria um
            pula-pula. O amortecedor <b>dissipa</b> energia a cada ciclo, então a
            oscilação decai e o corpo assenta.
          </div>
        </div>
      </section>

      {/* 02 · o que foi construído */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">02</span>
          <h2>O que foi construído</h2>
        </div>
        <p className="sec-intro">
          O rover é um único <code>RigidBody3D</code> com quatro{' '}
          <code>RayCast3D</code> — um por roda — apontando pra baixo. Nada de{' '}
          <code>VehicleBody3D</code> nem <code>VehicleWheel3D</code>: as rodas não
          existem como corpos, são apenas pontos onde um raio toca o chão e uma
          força é aplicada. A cada passo de física, <code>rover.gd</code> percorre
          os quatro raios, monta o estado de cada roda e aplica no ponto de
          contato a força que a fronteira devolve.
        </p>

        <div className="duo">
          <div className="facet">
            <span className="tag">Antes</span>
            <h4>VehicleBody3D (arcade)</h4>
            <p>
              Motor de veículo pronto do Godot. Anda de imediato, mas a física do
              pneu é uma caixa-preta — sem lugar limpo pra plugar outro modelo de
              contato depois.
            </p>
          </div>
          <div className="facet amber">
            <span className="tag">Agora</span>
            <h4>Raycast força-baseado</h4>
            <p>
              Corpo rígido + 4 raios. Cada roda calcula três forças nomeadas e as
              soma no ponto de contato. Mais trabalho manual, mas{' '}
              <b>cada força fica visível e isolada</b> — e o contato vira uma
              fronteira trocável.
            </p>
          </div>
        </div>

        <div className="callout">
          <b>Arquivos.</b> Projeto Godot isolado em{' '}
          <code>prototipo-veiculo/</code>, fora do Docusaurus. O laço de física e
          a montagem do estado ficam em{' '}
          <code>prototipo-veiculo/scripts/rover.gd</code>; a cena, em{' '}
          <code>scenes/rover.tscn</code>.
        </div>
      </section>

      {/* 03 · as três forças por roda */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">03</span>
          <h2>Três forças por roda</h2>
        </div>
        <p className="sec-intro">
          Toda a física de contato vive em{' '}
          <code>prototipo-veiculo/scripts/ground_contact.gd</code>. Para cada roda
          em contato, três forças são calculadas e somadas.
        </p>

        <div className="duo">
          <div className="facet">
            <span className="tag">Força 1 · normal</span>
            <h4>Suspensão (mola–amortecedor)</h4>
            <p>
              Ao longo da normal do contato. A <b>mola</b> é proporcional à
              compressão do raio; o <b>amortecedor</b>, à velocidade de
              compressão. Juntas, seguram o rover em pé sobre os quatro raios.
            </p>
          </div>
          <div className="facet amber">
            <span className="tag">Forças 2 e 3 · no plano</span>
            <h4>Grip lateral + tração</h4>
            <p>
              No plano do solo: o <b>grip</b> mata a velocidade lateral (evita
              derrapar) e a <b>tração/freio</b> empurra na direção de rolagem.
              Ambas limitadas pelo <b>círculo de atrito</b>.
            </p>
          </div>
        </div>

        <div className="formula">
          |F<sub>plano</sub>| ≤ μ · N
          <small>
            círculo de atrito — a força no plano nunca passa do coeficiente de
            atrito μ vezes a carga normal N (mola + amortecedor)
          </small>
        </div>

        <p className="sec-intro" style={{marginBottom: 0}}>
          A carga normal <code>N</code> sai da própria suspensão daquele frame, e
          tanto o grip quanto a tração entram num <code>clamp</code> dentro de{' '}
          <code>±μN</code>. Esse teto não é cosmético — é o que impede a
          divergência descrita na seção 06.
        </p>
      </section>

      {/* 04 · a fronteira de API */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">04</span>
          <h2>A fronteira: WheelState → ContactResult</h2>
        </div>
        <p className="sec-intro">
          O ponto central do refactor: <code>rover.gd</code> não lê raycast nem
          calcula física. Ele só monta um <code>WheelState</code> (o que a roda
          sabe de si), chama uma função e aplica a força que volta num{' '}
          <code>ContactResult</code>. Toda a implementação do contato fica atrás
          dessa única porta — quando a <b>ExoPhysics</b> existir, o miolo é
          trocado e a assinatura fica igual.
        </p>

        <div className="code-block">
          <div className="fname">prototipo-veiculo/scripts/ground_contact.gd</div>
          <pre>
            <code>
              <span className="cm">{'# única função que sabe calcular contato roda-solo.'}</span>{'\n'}
              <span className="cm">{'# v0: raycast + mola-amortecedor + atrito. v1: miolo trocado pela ExoPhysics.'}</span>{'\n'}
              <span className="kw">static func</span>{' query_wheel_contact(\n'}
              {'    ray: RayCast3D, state: WheelState,\n'}
              {'    input_acelerar: '}<span className="ty">float</span>{', params: Dictionary, delta: '}<span className="ty">float</span>
              {'\n) -> ContactResult:'}
            </code>
          </pre>
        </div>

        <div className="duo">
          <div className="facet">
            <span className="tag">Entra · wheel_state.gd</span>
            <h4>WheelState</h4>
            <p>
              Posição, base (orientação), velocidades linear e angular, massa e a{' '}
              <code>compressao_anterior</code> — o que a roda "sabe de si mesma"
              antes de consultar o solo.
            </p>
          </div>
          <div className="facet amber">
            <span className="tag">Sai · contact_result.gd</span>
            <h4>ContactResult</h4>
            <p>
              <code>in_contact</code>, ponto, normal, a <code>force</code>{' '}
              resultante e <code>sinkage</code> — o afundamento, <b>sempre 0</b>{' '}
              nesta versão de terreno rígido.
            </p>
          </div>
        </div>

        <div className="callout">
          <b>O campo <code>sinkage</code> é uma promessa.</b> Ele fica zerado na
          v0 porque o terreno é rígido, mas já está no contrato: é o lugar
          reservado pra quando a ExoPhysics substituir o raycast como fonte da
          força e o solo passar a ser deformável — a ponte pra terramecânica
          desta frente. A <b>ExoPhysics</b> é a biblioteca em <b>C++/GPU</b> que
          implementa a modelagem <b>híbrida</b> de solo descrita na proposta do
          PIBIC: partículas <b>SPH</b> perto do contato — onde o solo escoa e
          afunda de verdade — e uma malha contínua/semi-empírica longe dele, onde
          uma aproximação barata basta. Ou seja, ela não é só "um substituto
          futuro": é a peça que resolve o <b>trade-off entre fidelidade física e
          tempo real</b> que motiva o projeto inteiro — e o <code>sinkage</code> é
          o primeiro fio desse contrato já aparecendo aqui.
        </div>
      </section>

      {/* 05 · o bug — sintoma e pista */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">05</span>
          <h2>O bug: o sintoma e a pista</h2>
        </div>
        <p className="sec-intro">
          A suspensão mola–amortecedor já rodava <b>estável</b> antes deste bug
          aparecer. Ele foi introduzido num ponto muito específico: ao ligar a
          <b> força de atrito lateral</b> (o grip). Assim que o rover tocava o
          chão, em vez de assentar sobre os quatro raios, ele era{' '}
          <b>imediatamente arremessado pra fora da cena</b>, girando sem controle.
        </p>

        <div className="bug">
          <div className="symptom">
            <div className="lab">sintoma</div>
            <h4>Ejetado no primeiro toque</h4>
            <p>
              No frame em que o raio encostava no solo, o corpo disparava pra
              longe com rotação descontrolada — nada de assentar. Acontecia
              sempre, com qualquer valor de ganho.
            </p>
          </div>
          <div className="cause">
            <div className="lab">a pista</div>
            <h4>Mudar o ganho mudava a direção, não resolvia</h4>
            <p>
              Variar <code>grip_lateral</code> não eliminava o arremesso — só
              trocava <b>pra onde</b> o rover voava. Ganho 12 saía pela diagonal
              inferior esquerda; 20, pela inferior direita; 30, pela superior
              esquerda.
            </p>
          </div>
        </div>

        <div className="fig">
          <svg viewBox="0 0 520 240" role="img" aria-label="Diagrama de cena vista de cima: o rover no centro e três setas de arremesso em direções diferentes conforme o ganho">
            <defs>
              <marker id="mkColA" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="var(--coral)" />
              </marker>
              <marker id="mkAmbA" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="var(--amber)" />
              </marker>
              <marker id="mkCyaA" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="var(--cyan)" />
              </marker>
            </defs>
            <rect x="20" y="20" width="480" height="200" rx="14" fill="var(--bg-2)" stroke="var(--line-soft)" />
            <text x="40" y="42" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="11">cena (vista de cima)</text>
            {/* setas de arremesso */}
            <line x1="260" y1="120" x2="102" y2="196" stroke="var(--coral)" strokeWidth="3" markerEnd="url(#mkColA)" />
            <line x1="260" y1="120" x2="428" y2="196" stroke="var(--amber)" strokeWidth="3" markerEnd="url(#mkAmbA)" />
            <line x1="260" y1="120" x2="102" y2="50" stroke="var(--cyan)" strokeWidth="3" markerEnd="url(#mkCyaA)" />
            {/* rover */}
            <circle cx="260" cy="120" r="9" fill="var(--ink)" />
            <text x="276" y="124" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="12">rover</text>
            {/* rótulos de ganho */}
            <text x="96" y="214" fill="var(--coral)" fontFamily="var(--mono)" fontSize="12" fontWeight="700">ganho 12</text>
            <text x="424" y="214" textAnchor="end" fill="var(--amber)" fontFamily="var(--mono)" fontSize="12" fontWeight="700">ganho 20</text>
            <text x="96" y="40" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="12" fontWeight="700">ganho 30</text>
          </svg>
          <div className="cap">
            O mesmo bug, três ganhos. Mudar <b>grip_lateral</b> (12 → 20 → 30) só
            mudava a direção do arremesso, nunca o eliminava. Essa foi a pista
            central: erro de <b>sinal</b> ou de <b>referencial</b> daria sempre o
            mesmo tipo de erro; um sintoma que muda de forma sensível e
            aparentemente aleatória com o ganho é a cara de uma{' '}
            <b>instabilidade numérica</b>.
          </div>
        </div>

        <p className="sec-intro" style={{marginBottom: 12}}>
          A implementação que causava tudo isso tinha três linhas — e uma intenção
          física perfeitamente razoável:
        </p>
        <div className="code-block">
          <div className="fname">atrito lateral · primeira versão (com o bug)</div>
          <pre>
            <code>
              {'var vel_lateral = lateral * vel_no_ponto.dot(lateral)\n'}
              {'var forca_grip  = '}<span className="kw">-</span>
              {'vel_lateral * grip_lateral * (forca_mola + forca_amortecedor)\n'}
              {'apply_force(forca_grip, braco)'}
            </code>
          </pre>
        </div>
        <p className="sec-intro" style={{marginBottom: 0}}>
          A intenção: <i>"olhe a velocidade lateral atual do ponto de contato e
          aplique uma força proporcional, no sentido oposto, pra cancelar o
          deslizamento"</i>. O conceito está certo. O problema é o que falta:{' '}
          <b>nenhum limite de magnitude</b>.
        </p>
      </section>

      {/* 06 · causa raiz */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">06</span>
          <h2>A causa raiz: realimentação com atraso de um passo</h2>
        </div>
        <p className="sec-intro">
          O Godot resolve a física em <b>passos discretos</b> (por padrão,{' '}
          <code>1/60 s</code>). Não existe realimentação instantânea entre "a
          força que aplico agora" e "o efeito que ela produz" — o efeito só
          aparece no frame seguinte. Sem um teto, a fórmula multiplicava{' '}
          <code>grip_lateral</code> (12–30) pela carga de suspensão (já na casa de{' '}
          <b>centenas de newtons</b>), gerando <b>milhares de newtons</b> pra
          velocidades laterais de frações de m/s. Esse atraso de um passo entre
          causa e efeito fecha um laço de <b>realimentação positiva</b>:
        </p>

        <div className="chain">
          <div className="cnode src">
            <span className="ic">➜</span>
            <span className="nm">v_lat pequena</span>
            <span className="role">deslizamento do ponto de contato (ex.: 0,3 m/s)</span>
          </div>
          <span className="carrow">→</span>
          <div className="cnode">
            <span className="ic">✱</span>
            <span className="nm">F = −v · ganho · N</span>
            <span className="role">força sem teto — milhares de N</span>
          </div>
          <span className="carrow">→</span>
          <div className="cnode">
            <span className="ic">Δv</span>
            <span className="nm">aplica por Δt</span>
            <span className="role">corpo de ~12 kg, passo de ~0,016 s</span>
          </div>
          <span className="carrow">→</span>
          <div className="cnode bad">
            <span className="ic">↺</span>
            <span className="nm">v_lat maior e invertida</span>
            <span className="role">ultrapassa o alvo, inverte o sinal — e realimenta</span>
          </div>
        </div>
        <p className="sec-intro" style={{marginTop: 14}}>
          Frame a frame, a correção não converge pra zero — ela passa do ponto e
          volta amplificada:
        </p>

        <div className="steps">
          <div className="step">
            <h4>Frame N — a semente</h4>
            <p>
              Uma velocidade lateral pequena (ex.: <b>0,3 m/s</b>) gera uma força
              de correção de magnitude desproporcional — milhares de N.
            </p>
          </div>
          <div className="step">
            <h4>Ainda no frame N — a ultrapassagem</h4>
            <p>
              Essa força, aplicada por um <code>delta</code> de ~0,016 s a um corpo
              de ~12 kg, produz uma mudança de velocidade que não só cancela o
              deslizamento: <b>ultrapassa e inverte o sinal com folga</b> — de{' '}
              +0,3 m/s pra algo como −4 m/s.
            </p>
            <div className="learn">
              Correção maior que o alvo é a semente da divergência: o erro do
              próximo frame já nasce maior que o deste.
            </div>
          </div>
          <div className="step">
            <h4>Frame N+1 — a amplificação</h4>
            <p>
              A mesma fórmula, agora vendo uma velocidade <b>maior e invertida</b>,
              calcula uma força de correção ainda maior, no sentido oposto.
            </p>
          </div>
          <div className="step">
            <h4>Frames N+2, N+3… — a explosão</h4>
            <p>
              O padrão se repete e cada frame produz uma força maior que o
              anterior: crescimento <b>exponencial</b>. Em cerca de{' '}
              <span className="stat">7–8 frames</span> físicos a força já está na
              casa de dezenas de milhares de N e o corpo é ejetado da cena.
            </p>
            <div className="learn">
              Assinatura clássica da integração explícita: quando o ganho de uma
              força corretiva é grande demais pro passo de tempo, a correção
              supera o alvo sistematicamente em vez de convergir.
            </div>
          </div>
        </div>

        <div className="fig">
          <svg viewBox="0 0 640 320" role="img" aria-label="Gráfico da velocidade lateral por frame: oscila em torno de zero com amplitude crescente até sair da escala">
            <defs>
              <marker id="mkColB" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="var(--coral)" />
              </marker>
            </defs>
            {/* eixo y label */}
            <text transform="rotate(-90 22 160)" x="22" y="160" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="11">velocidade lateral (m/s)</text>
            {/* gridlines verticais */}
            <line x1="70" y1="36" x2="70" y2="284" stroke="var(--line-soft)" strokeWidth="1" />
            <line x1="147" y1="36" x2="147" y2="284" stroke="var(--line-soft)" strokeWidth="1" />
            <line x1="224" y1="36" x2="224" y2="284" stroke="var(--line-soft)" strokeWidth="1" />
            <line x1="301" y1="36" x2="301" y2="284" stroke="var(--line-soft)" strokeWidth="1" />
            <line x1="378" y1="36" x2="378" y2="284" stroke="var(--line-soft)" strokeWidth="1" />
            {/* linha zero */}
            <line x1="60" y1="160" x2="612" y2="160" stroke="var(--line)" strokeWidth="1" strokeDasharray="4 4" />
            <text x="614" y="164" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">0</text>
            {/* zigue-zague divergente */}
            <polyline points="70,154 147,200 224,80 301,276 378,40" fill="none" stroke="var(--coral)" strokeWidth="2.5" strokeLinejoin="round" />
            {/* segmento de explosão */}
            <line x1="378" y1="40" x2="496" y2="300" stroke="var(--coral)" strokeWidth="2.5" strokeDasharray="7 5" markerEnd="url(#mkColB)" />
            {/* pontos */}
            <circle cx="70" cy="154" r="4" fill="var(--coral)" />
            <circle cx="147" cy="200" r="4" fill="var(--coral)" />
            <circle cx="224" cy="80" r="4" fill="var(--coral)" />
            <circle cx="301" cy="276" r="4" fill="var(--coral)" />
            <circle cx="378" cy="40" r="4" fill="var(--coral)" />
            {/* valores */}
            <text x="64" y="146" textAnchor="end" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">+0,3</text>
            <text x="156" y="214" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">−4</text>
            <text x="232" y="72" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">+12</text>
            <text x="309" y="290" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">−28</text>
            <text x="386" y="34" fill="var(--ink-mid)" fontFamily="var(--mono)" fontSize="10">+60</text>
            <text x="500" y="292" textAnchor="end" fill="var(--coral)" fontFamily="var(--mono)" fontSize="11" fontWeight="700">estoura → ejeção</text>
            {/* rótulos de frame */}
            <text x="70" y="304" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">N</text>
            <text x="147" y="304" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">N+1</text>
            <text x="224" y="304" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">N+2</text>
            <text x="301" y="304" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">N+3</text>
            <text x="378" y="304" textAnchor="middle" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="10">N+4</text>
          </svg>
          <div className="cap">
            Velocidade lateral do ponto de contato, frame a frame. Cada correção{' '}
            <b>ultrapassa o zero e inverte o sinal</b>, com amplitude crescente —
            em poucos passos a magnitude sai da faixa estável e o corpo é ejetado.
          </div>
        </div>

        <div className="callout">
          <b>Por que a direção mudava com o ganho.</b> Não era aleatório — era
          determinístico, só que sensível de um jeito não intuitivo. Cada valor de
          ganho determina a <b>taxa de crescimento</b> e o <b>número de inversões
          de sinal</b> antes de a simulação estourar. A direção final do arremesso
          depende de em qual fase do ciclo (positiva ou negativa) a explosão
          numérica atingiu magnitude suficiente pra dominar o corpo. Daí o sintoma
          parecer errático.
        </div>
      </section>

      {/* 07 · a correção */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">07</span>
          <h2>A correção: o círculo de atrito</h2>
        </div>
        <p className="sec-intro">
          Fisicamente, a força de atrito <b>nunca</b> pode exceder{' '}
          <code>μ · N</code> — o círculo de atrito —, não importa quão rápido o
          corpo deslize. Essa restrição simplesmente não existia na primeira
          versão. A correção calcula a mesma força "ideal" que cancelaria a
          velocidade lateral num frame, mas a <b>limita</b> (com{' '}
          <code>clamp</code>) ao teto físico do atrito disponível naquele contato:
        </p>

        <div className="code-block">
          <div className="fname">prototipo-veiculo/scripts/ground_contact.gd · correção</div>
          <pre>
            <code>
              {'var carga_normal  = forca_mola + forca_amortecedor\n'}
              {'var limite_atrito = carga_normal * coef_atrito'}
              <span className="cm">{'          # μ · N\n'}</span>
              {'\n'}
              {'var forca_grip_ideal = '}<span className="kw">-</span>
              {'vel_lateral_escalar * mass / delta\n'}
              {'var forca_grip_mag   = '}<span className="kw">clamp</span>
              {'(forca_grip_ideal, '}<span className="kw">-</span>
              {'limite_atrito, limite_atrito)\n'}
              {'var forca_grip       = lateral * forca_grip_mag'}
            </code>
          </pre>
        </div>

        <div className="fig">
          <svg viewBox="0 0 380 330" role="img" aria-label="Círculo de atrito: a força ideal excede o raio μN e é projetada de volta para a borda pelo clamp">
            <defs>
              <marker id="mkColC" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="var(--coral)" />
              </marker>
              <marker id="mkCyaC" markerWidth="11" markerHeight="11" refX="8" refY="5.5" orient="auto">
                <path d="M0,0 L11,5.5 L0,11 Z" fill="var(--cyan)" />
              </marker>
            </defs>
            <circle cx="190" cy="180" r="100" fill="var(--cyan-soft)" stroke="var(--cyan)" strokeWidth="2" />
            {/* raio μN */}
            <line x1="190" y1="180" x2="290" y2="180" stroke="var(--amber)" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="236" y="172" fill="var(--amber)" fontFamily="var(--mono)" fontSize="11">R = μN</text>
            {/* vetor ideal (excede o círculo) */}
            <line x1="190" y1="180" x2="82" y2="72" stroke="var(--coral)" strokeWidth="3" strokeDasharray="6 5" markerEnd="url(#mkColC)" />
            <text x="78" y="60" textAnchor="end" fill="var(--coral)" fontFamily="var(--mono)" fontSize="12" fontWeight="700">F_ideal ≫ μN</text>
            {/* vetor limitado (na borda) */}
            <line x1="190" y1="180" x2="119" y2="109" stroke="var(--cyan)" strokeWidth="4" markerEnd="url(#mkCyaC)" />
            <text x="128" y="102" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="12" fontWeight="700">clamp → μN</text>
            {/* centro */}
            <circle cx="190" cy="180" r="4" fill="var(--ink)" />
            <text x="190" y="305" textAnchor="middle" fill="var(--amber)" fontFamily="var(--mono)" fontSize="13" fontWeight="700">|F| ≤ μN</text>
          </svg>
          <div className="cap">
            O <b>círculo de atrito</b>. A força que cancelaria a velocidade lateral
            num único frame (<b>F_ideal</b>) pode ser enorme; o <code>clamp</code>{' '}
            a projeta de volta pra borda <b>μN</b>. Como a força nunca supera o
            atrito real disponível, o excesso que iniciava o ciclo de
            realimentação deixa de existir — a estabilidade vira{' '}
            <b>garantia por construção</b>.
          </div>
        </div>

        <div className="bars">
          <div className="bar bad">
            <span className="k">
              <b>Sem teto (bug)</b>
              força de correção, ~frame 6
            </span>
            <span className="track">
              <span className="fill" style={{width: '100%'}} />
            </span>
            <span className="v">~10.000+ N ↗</span>
          </div>
          <div className="bar">
            <span className="k">
              <b>Com clamp (μN)</b>
              qualquer frame
            </span>
            <span className="track">
              <span className="fill" style={{width: '13%'}} />
            </span>
            <span className="v">≤ μN</span>
          </div>
        </div>
        <p className="sec-intro" style={{marginTop: 14}}>
          O mesmo teto foi aplicado à força de <b>tração/frenagem</b>. Duas forças,
          uma regra: nenhuma passa de <code>±μN</code>.
        </p>

        <div className="callout" style={{borderLeftColor: 'var(--amber)'}}>
          <b>Lição geral — vale como princípio, não só como fix pontual.</b>{' '}
          Qualquer força que dependa da <b>velocidade atual</b> de um corpo pra
          corrigir <b>essa mesma velocidade</b>, numa simulação de passos
          discretos, precisa de um <b>limite físico explícito</b> no cálculo. Sem
          esse teto, o sistema pode divergir mesmo com a intenção física correta —
          o erro não está no conceito ("cancele o deslizamento"), está na ausência
          de um limite que impeça a correção de ultrapassar o problema que deveria
          resolver.
        </div>
      </section>

      {/* 08 · mapeamento com o Bloco 5 */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">08</span>
          <h2>Como isso se encaixa no Bloco 5</h2>
        </div>
        <p className="sec-intro">
          A tabela do Bloco 5 descrevia o contato em termos de <b>juntas</b>{' '}
          (prismática pra suspensão, revoluta pro giro da roda). O modelo raycast{' '}
          <b>não usa junta nenhuma</b>: ele chega no mesmo lugar por{' '}
          <b>força de penalidade</b>. Vale registrar o contraste explicitamente.
        </p>

        <div className="duo">
          <div className="facet">
            <span className="tag">Abordagem "jogo"</span>
            <h4>Força-baseada (raycast)</h4>
            <p>
              Mola–amortecedor + atrito resolvem por <b>penalidade</b> o que seria
              junta: o raio "empurra de volta" quando penetra. Simples, estável se
              limitada, ideal pra tempo real. É a rota deste protótipo.
            </p>
          </div>
          <div className="facet amber">
            <span className="tag">Abordagem "engenharia"</span>
            <h4>Multicorpo com restrições</h4>
            <p>
              Cada roda é um corpo ligado por juntas reais, resolvidas por um
              solver de restrições (tipo <b>Chrono::Vehicle</b>). Mais fiel e mais
              caro — o modelo rigoroso do Bloco 5.
            </p>
          </div>
        </div>
      </section>

      {/* 09 · pendência em aberto */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">09</span>
          <h2>Pendência em aberto</h2>
        </div>
        <p className="sec-intro">
          Uma decisão que ainda não é minha e precisa passar pelo orientador.
        </p>

        <div className="callout" style={{borderLeftColor: 'var(--amber)'}}>
          <b>A confirmar com o orientador.</b> O modelo veicular definitivo será{' '}
          <b>força-baseado por raycast</b> (a rota seguida neste protótipo) ou{' '}
          <b>multicorpo com restrições</b> (a rota do Chrono)? O material indicado
          pelo professor esta semana sugere a primeira — mas isso ainda não foi
          confirmado por ele. Até lá, o protótipo raycast segue como a aposta de
          trabalho, e a fronteira <code>query_wheel_contact()</code> mantém as
          duas portas abertas.
        </div>
      </section>
    </div>
  );
}
