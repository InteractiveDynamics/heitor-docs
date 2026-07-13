import React from 'react';

/**
 * Doc técnica · Powertrain e torque (Bloco 2).
 * Conteúdo destilado do estudo do Gillespie, "Fundamentals of Vehicle
 * Dynamics" (via NotebookLM). Visual-first: renderiza sob `.dossie .tecnica`
 * pra reaproveitar a assinatura do dossiê (dossie.css) + as peças de fluxo,
 * fórmula e cadeia de tecnica.css. JSX puro, sem estado.
 */
export default function DossiePowertrain() {
  return (
    <div className="dossie tecnica">
      {/* faixa de telemetria */}
      <div className="telemetry-strip">
        <span>
          <span className="dot" />
          bloco 2 · fundamentos
        </span>
        <span>
          fonte · <b>Gillespie · Vehicle Dynamics</b>
        </span>
        <span>
          eficiência típica · <b>80–90%</b>
        </span>
        <span>
          relação-chave · <b>P = τ · ω</b>
        </span>
        <span>
          frente · <b>Powertrain e tração</b>
        </span>
      </div>

      {/* hero */}
      <header className="hero-block">
        <div className="eyebrow">Fundamentos de dinâmica veicular</div>
        <h1>
          Do <span className="accent">torque do motor</span> à força que empurra
          o veículo.
        </h1>
        <p className="lede">
          O <strong>powertrain</strong> (trem de força) é a cadeia que pega a{' '}
          <strong>força de giro</strong> gerada pelo motor e a entrega no contato
          do pneu com o solo. Estas notas seguem o Gillespie: o que é torque, como
          ele vira potência, quais peças formam a cadeia e como cada uma modifica
          a força até virar <strong>tração</strong>.
        </p>

        <dl className="hero-meta">
          <div>
            <dt>O que o motor produz</dt>
            <dd>Torque (τ) — giro</dd>
          </div>
          <div>
            <dt>Potência</dt>
            <dd>P = τ × ω</dd>
          </div>
          <div>
            <dt>Estágios da cadeia</dt>
            <dd>Motor → roda (6)</dd>
          </div>
          <div>
            <dt>Eficiência do trem</dt>
            <dd>~80–90%</dd>
          </div>
        </dl>
      </header>

      {/* 01 · o que é torque */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">01</span>
          <h2>Torque é força de giro</h2>
        </div>
        <p className="sec-intro">
          Pense no torque como o esforço que você faz para girar algo emperrado —
          soltar um parafuso com uma chave de roda, abrir a tampa de um pote. Ele
          nasce de uma <b>força</b> (F) aplicada a uma certa <b>distância do eixo</b>{' '}
          (o braço de alavanca, r). Mais força, ou braço mais longo, mais torque.
        </p>

        <div className="fig">
          <svg viewBox="0 0 520 200" role="img" aria-label="Torque igual a força vezes braço de alavanca">
            {/* braço */}
            <line x1="120" y1="120" x2="400" y2="120" stroke="var(--line)" strokeWidth="10" strokeLinecap="round" />
            {/* pivô */}
            <circle cx="120" cy="120" r="15" fill="var(--surface-2)" stroke="var(--cyan)" strokeWidth="2" />
            <circle cx="120" cy="120" r="4" fill="var(--cyan)" />
            {/* arco de rotação */}
            <path d="M 152 95 A 42 42 0 0 1 96 150" fill="none" stroke="var(--cyan)" strokeWidth="2" />
            <path d="M 96 150 l 1 -13 l 10 7 z" fill="var(--cyan)" />
            {/* braço r (tracejado) */}
            <line x1="120" y1="150" x2="400" y2="150" stroke="var(--ink-dim)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="120" y1="144" x2="120" y2="156" stroke="var(--ink-dim)" strokeWidth="1" />
            <line x1="400" y1="144" x2="400" y2="156" stroke="var(--ink-dim)" strokeWidth="1" />
            {/* força F */}
            <line x1="400" y1="120" x2="400" y2="182" stroke="var(--amber)" strokeWidth="3" />
            <path d="M400 184 l -6 -12 l 12 0 z" fill="var(--amber)" />
            {/* labels */}
            <text x="132" y="100" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="15" fontWeight="700">τ</text>
            <text x="260" y="170" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="13" textAnchor="middle">braço r</text>
            <text x="412" y="160" fill="var(--amber)" fontFamily="var(--mono)" fontSize="15" fontWeight="700">F</text>
          </svg>
          <div className="cap">
            <b>τ = F × r.</b> O motor gera esse giro; ele passa pelas engrenagens e
            chega às rodas para empurrar o veículo.
          </div>
        </div>

        <div className="callout">
          <b>Torque ≠ potência.</b> O torque é o "tamanho do músculo" — a força
          bruta que gruda suas costas no banco na arrancada e sobe ladeira sem
          morrer. A potência é o quão <b>rápido</b> essa força é entregue. As duas
          andam juntas pela rotação do motor.
        </div>
      </section>

      {/* 02 · torque × potência */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">02</span>
          <h2>Torque, potência e a curva do motor</h2>
        </div>
        <p className="sec-intro">
          Potência é simplesmente torque multiplicado pela velocidade de rotação.
          Por isso um motor "fraco embaixo" precisa <b>girar mais</b> (subir a
          RPM) pra entregar sua força — e o formato da curva de torque muda com o
          tipo de motor.
        </p>

        <div className="physics">
          <div>
            <h4>A relação que amarra tudo</h4>
            <p>
              Sabendo o torque em cada rotação, a potência sai direto — e é ela
              que define a velocidade máxima que o motor sustenta.
            </p>
          </div>
          <div>
            <div className="formula">
              P = τ · ω
              <small>potência = torque × velocidade angular (RPM)</small>
            </div>
          </div>
        </div>

        <div className="fig">
          <svg viewBox="0 0 520 250" role="img" aria-label="Curvas de torque e potência em função da rotação">
            {/* eixos */}
            <line x1="55" y1="30" x2="55" y2="210" stroke="var(--line)" strokeWidth="1.5" />
            <line x1="55" y1="210" x2="495" y2="210" stroke="var(--line)" strokeWidth="1.5" />
            {/* curva de torque (âmbar) — pico no meio */}
            <path d="M60 158 C 150 96, 215 82, 285 92 C 380 106, 450 138, 492 150" fill="none" stroke="var(--amber)" strokeWidth="3" />
            {/* curva de potência (ciano) — sobe até o fim */}
            <path d="M60 200 C 190 188, 330 150, 492 58" fill="none" stroke="var(--cyan)" strokeWidth="3" />
            {/* rótulos eixos */}
            <text x="275" y="238" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="12" textAnchor="middle">rotação do motor (RPM) →</text>
            <text x="285" y="78" fill="var(--amber)" fontFamily="var(--mono)" fontSize="12" textAnchor="middle">torque</text>
            <text x="452" y="52" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="12" textAnchor="end">potência</text>
          </svg>
          <div className="cap">
            O torque costuma ter um <b>pico intermediário</b>; a potência cresce
            com a rotação. Onde as duas se cruzam depende do projeto do motor.
          </div>
        </div>

        <div className="duo">
          <div className="facet amber">
            <span className="tag">Gasolina</span>
            <h4>Precisa "gritar"</h4>
            <p>
              Curva de torque com pico na faixa <b>intermediária</b> de rotações.
              É mais fraco em baixa: pra entregar a força máxima, o motor precisa
              girar rápido.
            </p>
          </div>
          <div className="facet amber">
            <span className="tag">Diesel</span>
            <h4>Força já de cara</h4>
            <p>
              Curva de torque <b>mais plana</b> — às vezes até maior em baixas
              rotações. É o que dá a caminhões e tratores a força pra puxar
              toneladas sem "morrer".
            </p>
          </div>
        </div>
      </section>

      {/* 03 · a cadeia */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">03</span>
          <h2>A cadeia: motor → roda</h2>
        </div>
        <p className="sec-intro">
          O powertrain é o conjunto de peças que leva o torque do motor até o
          solo. Cada estágio tem um papel — e nenhum entrega o torque intacto: ele
          é amplificado, redirecionado e um pouco desperdiçado no caminho.
        </p>

        <div className="chain">
          <div className="cnode src">
            <span className="ic">⚙</span>
            <span className="nm">Motor</span>
            <span className="role">gera o torque e a potência de origem</span>
          </div>
          <span className="carrow">→</span>
          <div className="cnode">
            <span className="ic">◑</span>
            <span className="nm">Embreagem / conversor</span>
            <span className="role">acopla e desacopla a força do motor</span>
          </div>
          <span className="carrow">→</span>
          <div className="cnode">
            <span className="ic">▦</span>
            <span className="nm">Transmissão</span>
            <span className="role">as marchas: adéqua rotação à velocidade</span>
          </div>
          <span className="carrow">→</span>
          <div className="cnode">
            <span className="ic">▬</span>
            <span className="nm">Cardã (eixo)</span>
            <span className="role">leva a força ao diferencial, acompanha a pista</span>
          </div>
          <span className="carrow">→</span>
          <div className="cnode">
            <span className="ic">⊕</span>
            <span className="nm">Diferencial</span>
            <span className="role">gira o fluxo 90° e deixa uma roda girar mais que a outra</span>
          </div>
          <span className="carrow">→</span>
          <div className="cnode out">
            <span className="ic">◉</span>
            <span className="nm">Roda</span>
            <span className="role">converte torque em força de tração no solo</span>
          </div>
        </div>
        <p className="sec-intro" style={{marginTop: 18, marginBottom: 0}}>
          O <b>diferencial</b> é o que permite curvas: a roda de fora percorre um
          caminho maior e precisa girar mais rápido que a de dentro.
        </p>
      </section>

      {/* 04 · como modifica o torque */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">04</span>
          <h2>Como a cadeia modifica o torque</h2>
        </div>
        <p className="sec-intro">
          O torque que sai do motor <b>não</b> é o que chega às rodas. Três
          efeitos agem no caminho — um a favor, dois contra.
        </p>

        <div className="effects">
          <div className="eff up">
            <div className="dir">
              <span className="arrow">▲</span> amplia
            </div>
            <p>
              <b>Engrenagens.</b> A relação de marchas × a relação do diferencial
              (transmissão final) <b>multiplicam</b> o torque. É por isso que
              existem marchas baixas pra arrancar e altas pra cruzeiro.
            </p>
          </div>
          <div className="eff down">
            <div className="dir">
              <span className="arrow">▼</span> subtrai
            </div>
            <p>
              <b>Perdas inerciais.</b> Parte do torque é gasta só pra acelerar a
              inércia das próprias peças girando — motor, câmbio, cardã, rodas.
              Sobra menos pra empurrar o carro.
            </p>
          </div>
          <div className="eff down">
            <div className="dir">
              <span className="arrow">▼</span> subtrai
            </div>
            <p>
              <b>Atrito e viscosidade.</b> Engrenagens e eixos têm perdas
              mecânicas e do óleo. Na prática, o trem de força entrega uma
              eficiência típica de <span className="stat">80–90%</span>.
            </p>
          </div>
          <div className="eff up">
            <div className="dir">
              <span className="arrow">◆</span> na prática
            </div>
            <p>
              O torque do catálogo é medido <b>estável</b> num dinamômetro. O que
              chega ao pneu é sempre menor — some as perdas acima ao valor de
              placa.
            </p>
          </div>
        </div>
      </section>

      {/* 05 · força de tração */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">05</span>
          <h2>A força de tração no solo</h2>
        </div>
        <p className="sec-intro">
          O resultado final é a força no contato do pneu com o chão: o torque do
          motor, amplificado pela cadeia e descontada a eficiência, dividido pelo
          raio da roda.
        </p>

        <div className="physics">
          <div>
            <h4>O torque vira força na roda</h4>
            <p>
              Divide-se o torque na roda pelo raio pra obter a força que empurra o
              veículo. Um raio menor dá mais força — mas menos velocidade.
            </p>
          </div>
          <div>
            <div className="formula">
              F = (τ · N · η) / r
              <small>
                τ motor · N relação total (marcha × final) · η eficiência · r raio
                da roda
              </small>
            </div>
          </div>
        </div>

        <div className="fig">
          <svg viewBox="0 0 520 210" role="img" aria-label="Força de tração no contato do pneu com o solo">
            {/* solo */}
            <line x1="20" y1="168" x2="500" y2="168" stroke="var(--line)" strokeWidth="2" />
            <g stroke="var(--line-soft)" strokeWidth="1">
              <line x1="40" y1="168" x2="28" y2="182" />
              <line x1="80" y1="168" x2="68" y2="182" />
              <line x1="120" y1="168" x2="108" y2="182" />
              <line x1="160" y1="168" x2="148" y2="182" />
              <line x1="200" y1="168" x2="188" y2="182" />
            </g>
            {/* roda */}
            <circle cx="150" cy="118" r="50" fill="var(--surface-2)" stroke="var(--ink-dim)" strokeWidth="2" />
            <circle cx="150" cy="118" r="8" fill="var(--ink-dim)" />
            {/* raio r */}
            <line x1="150" y1="118" x2="150" y2="168" stroke="var(--cyan)" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="158" y="150" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="13">r</text>
            {/* torque (arco âmbar) */}
            <path d="M 150 82 A 36 36 0 0 1 186 118" fill="none" stroke="var(--amber)" strokeWidth="2.5" />
            <path d="M 186 118 l -12 -3 l 6 -9 z" fill="var(--amber)" />
            <text x="150" y="112" fill="var(--amber)" fontFamily="var(--mono)" fontSize="14" fontWeight="700" textAnchor="middle">τ</text>
            {/* força de tração */}
            <line x1="150" y1="190" x2="360" y2="190" stroke="var(--green)" strokeWidth="3" />
            <path d="M362 190 l -12 -6 l 0 12 z" fill="var(--green)" />
            <text x="255" y="182" fill="var(--green)" fontFamily="var(--mono)" fontSize="13" textAnchor="middle">F de tração →</text>
          </svg>
          <div className="cap">
            O giro (τ) no eixo da roda, dividido pelo raio r, empurra o veículo
            para frente no ponto de contato.
          </div>
        </div>

        <div className="duo">
          <div className="facet">
            <span className="tag">Baixa velocidade</span>
            <h4>Limite de tração</h4>
            <p>
              A aceleração é limitada pela <b>aderência</b>: o quanto o pneu
              consegue "agarrar" o chão antes de patinar. Sobra torque, falta
              grip.
            </p>
          </div>
          <div className="facet">
            <span className="tag">Alta velocidade</span>
            <h4>Limite de potência</h4>
            <p>
              A aceleração passa a ser limitada pela <b>potência máxima</b> que o
              motor consegue entregar. Grip sobra, força falta.
            </p>
          </div>
        </div>

        <div className="callout">
          <b>Ligando ao sandbox e ao rover.</b> No Godot, a propriedade{' '}
          <code>engine_force</code> do <code>VehicleBody3D</code> é exatamente
          essa força aplicada nas rodas de tração — mexer nela é sentir o torque.
          Num <b>rover</b>, costuma haver motores elétricos (às vezes um por roda),
          sem a complexidade do câmbio de um carro a combustão — o que simplifica
          bastante a cadeia acima.
        </div>
      </section>
    </div>
  );
}
