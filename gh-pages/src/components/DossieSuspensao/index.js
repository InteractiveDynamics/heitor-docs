import React from 'react';

/**
 * Doc técnica · Suspensão (Bloco 3).
 * Conteúdo destilado do estudo do Gillespie, "Fundamentals of Vehicle
 * Dynamics" (via NotebookLM). Visual-first: renderiza sob `.dossie .tecnica`,
 * reaproveitando a assinatura do dossiê (hero, effects, param, callout) + as
 * peças de figura, régua de frequência e barras de tecnica.css.
 */
export default function DossieSuspensao() {
  return (
    <div className="dossie tecnica">
      {/* faixa de telemetria */}
      <div className="telemetry-strip">
        <span>
          <span className="dot" />
          bloco 3 · fundamentos
        </span>
        <span>
          fonte · <b>Gillespie · Vehicle Dynamics</b>
        </span>
        <span>
          alvo de conforto · <b>~1 Hz</b>
        </span>
        <span>
          esportivo · <b>2–2,5 Hz</b>
        </span>
        <span>
          frente · <b>Suspensão</b>
        </span>
      </div>

      {/* hero */}
      <header className="hero-block">
        <div className="eyebrow">Fundamentos de dinâmica veicular</div>
        <h1>
          A suspensão são os <span className="accent">joelhos do carro</span> — e
          um eterno cobertor curto.
        </h1>
        <p className="lede">
          Assim como dobrar os joelhos ao cair suaviza o impacto, a suspensão
          deixa as rodas subirem e descerem pra isolar a cabine e{' '}
          <strong>manter o pneu colado no chão</strong>. Estas notas seguem o
          Gillespie: os dois trabalhos da suspensão, a dupla mola–amortecedor e as
          variáveis que os engenheiros equilibram — onde melhorar o conforto
          costuma piorar a estabilidade.
        </p>

        <dl className="hero-meta">
          <div>
            <dt>Trabalho 1</dt>
            <dd>Conforto</dd>
          </div>
          <div>
            <dt>Trabalho 2 (vital)</dt>
            <dd>Pneu no chão</dd>
          </div>
          <div>
            <dt>A dupla</dt>
            <dd>Mola + amortecedor</dd>
          </div>
          <div>
            <dt>O trade-off</dt>
            <dd>Conforto × aderência</dd>
          </div>
        </dl>
      </header>

      {/* 01 · os dois trabalhos */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">01</span>
          <h2>Dois trabalhos, um em tensão com o outro</h2>
        </div>
        <p className="sec-intro">
          A suspensão existe pra fazer duas coisas ao mesmo tempo — e é o conflito
          entre elas que torna o projeto difícil.
        </p>

        <div className="duo">
          <div className="facet">
            <span className="tag">Trabalho 1</span>
            <h4>Conforto</h4>
            <p>
              Deixar as rodas acompanharem buracos e lombadas de modo que a{' '}
              <b>cabine fique parada</b>, isolando o passageiro da trepidação.
            </p>
          </div>
          <div className="facet amber">
            <span className="tag">Trabalho 2 · vital</span>
            <h4>Manter o pneu no chão</h4>
            <p>
              Pneu que quica e fica no ar não freia nem faz curva — sem contato,
              sem atrito. A suspensão <b>empurra a roda contra o solo</b> o tempo
              todo, e ainda segura o carro pra não deitar nas curvas nem afundar o
              nariz na freada.
            </p>
          </div>
        </div>
      </section>

      {/* 02 · mola + amortecedor */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">02</span>
          <h2>A dupla: mola e amortecedor</h2>
        </div>
        <p className="sec-intro">
          São duas peças com papéis diferentes — e o nome "amortecedor" engana: não
          é ele quem absorve a pancada.
        </p>

        <div className="physics">
          <div>
            <div className="fig" style={{margin: 0, background: 'transparent', border: 'none', boxShadow: 'none', padding: 0}}>
              <svg viewBox="0 0 320 250" role="img" aria-label="Anatomia de uma suspensão: mola e amortecedor entre dois apoios">
                {/* apoio superior */}
                <rect x="80" y="34" width="160" height="11" rx="3" fill="var(--surface-2)" stroke="var(--line)" />
                {/* apoio inferior */}
                <rect x="80" y="206" width="160" height="11" rx="3" fill="var(--surface-2)" stroke="var(--line)" />
                {/* mola (zigue-zague) */}
                <path
                  d="M115 45 L115 62 L140 74 L90 88 L140 102 L90 116 L140 130 L90 144 L140 158 L90 172 L115 186 L115 206"
                  fill="none"
                  stroke="var(--amber)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* amortecedor: haste + cilindro */}
                <line x1="205" y1="45" x2="205" y2="120" stroke="var(--cyan)" strokeWidth="4" />
                <rect x="190" y="120" width="30" height="86" rx="5" fill="var(--surface-2)" stroke="var(--cyan)" strokeWidth="2" />
                <line x1="190" y1="132" x2="220" y2="132" stroke="var(--cyan)" strokeWidth="2" />
                {/* labels */}
                <text x="70" y="120" fill="var(--amber)" fontFamily="var(--mono)" fontSize="13" fontWeight="700" textAnchor="end">mola</text>
                <text x="70" y="136" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="11" textAnchor="end">rigidez k</text>
                <text x="252" y="166" fill="var(--cyan)" fontFamily="var(--mono)" fontSize="13" fontWeight="700">amort.</text>
                <text x="252" y="182" fill="var(--ink-dim)" fontFamily="var(--mono)" fontSize="11">taxa c</text>
              </svg>
            </div>
          </div>
          <div>
            <h4>Quem faz o quê</h4>
            <p>
              A <b>mola</b> aguenta o peso do carro e realmente "engole" a pancada
              do buraco, encolhendo. Sozinha, ela deixaria o carro quicando sem
              parar, feito pula-pula.
            </p>
            <p>
              O <b>amortecedor</b> (um tubo cheio de óleo) não amortece o choque
              inicial — ele <b>controla a mola</b>, dissipando a energia pra o
              carro parar de balançar rápido.
            </p>
          </div>
        </div>

        <div className="callout">
          <b>Resumo.</b> A mola serve pra o carro não dar uma pancada seca no
          buraco; o amortecedor serve pra ele não ficar pulando depois. Juntos,
          garantem que o pneu nunca perca o contato com a rua.
        </div>
      </section>

      {/* 03 · rigidez e frequência natural */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">03</span>
          <h2>Rigidez e frequência natural</h2>
        </div>
        <p className="sec-intro">
          A rigidez não é "achismo": ela é escolhida buscando uma{' '}
          <b>frequência natural</b> de oscilação do chassi (em Hertz). Mais macia,
          mais confortável; mais dura, mais aderência — nunca os dois.
        </p>

        <div className="fig">
          <div className="ruler">
            <div className="ruler-scale">
              <div className="track">
                <span className="tick" style={{left: '14%'}} />
                <span className="tick" style={{left: '30%'}} />
                <span className="tick" style={{left: '84%'}} />
              </div>
              <div className="lab" style={{left: '14%'}}>
                <span className="hz">~1 Hz</span>
                <span className="who">conforto de passeio — mola bem macia</span>
              </div>
              <div className="lab" style={{left: '30%'}}>
                <span className="hz">2–2,5 Hz</span>
                <span className="who">esportivo — dureza troca conforto por grip</span>
              </div>
              <div className="lab" style={{left: '84%'}}>
                <span className="hz">10–15 Hz</span>
                <span className="who">massa não-suspensa (roda + freio)</span>
              </div>
            </div>
          </div>
          <div className="cap">
            Régua esquemática de frequências. Molas macias (~1 Hz) dão conforto,
            mas deixam a carroceria rolar nas curvas; carros esportivos sobem pra{' '}
            <b>2–2,5 Hz</b> pra maximizar aderência.
          </div>
        </div>

        <div className="callout">
          <b>Massa não-suspensa.</b> Roda, pneu e freio ficam <b>abaixo</b> da
          mola e quicam numa frequência bem mais alta —{' '}
          <span className="stat">10–15 Hz</span>. A suspensão também precisa
          isolar essa vibração frenética vinda da roda, além da do chassi.
        </div>
      </section>

      {/* 04 · curso */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">04</span>
          <h2>Curso: o espaço pra roda se mexer</h2>
        </div>
        <p className="sec-intro">
          Curso (<i>stroke</i>) é o espaço físico pra roda comprimir ou estender.
          Anda de mãos dadas com a rigidez: mola macia afunda muito, então precisa
          de curso pra não bater o <b>batente</b> — o "fim de curso", uma pancada
          seca quando a suspensão atinge o limite.
        </p>

        <div className="bars">
          <div className="bar warn">
            <span className="k">
              <b>Mínimo</b>
              p/ solavanco 0,5 g
            </span>
            <span className="track">
              <span className="fill" style={{width: '59%'}} />
            </span>
            <span className="v">≈ 5 pol (12,7 cm)</span>
          </div>
          <div className="bar">
            <span className="k">
              <b>Compacto</b>
              curso utilizável
            </span>
            <span className="track">
              <span className="fill" style={{width: '68%'}} />
            </span>
            <span className="v">5–6 pol</span>
          </div>
          <div className="bar">
            <span className="k">
              <b>Carro grande</b>
              curso utilizável
            </span>
            <span className="track">
              <span className="fill" style={{width: '94%'}} />
            </span>
            <span className="v">7–8 pol (17–20 cm)</span>
          </div>
        </div>
        <p className="sec-intro" style={{marginTop: 18, marginBottom: 0}}>
          Pra absorver um solavanco médio (<span className="stat">0,5 g</span>) sem
          bater no fundo, são necessárias ao menos <b>5 polegadas</b> de curso
          livre — por isso mola macia exige carroceria com espaço.
        </p>
      </section>

      {/* 05 · amortecimento assimétrico */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">05</span>
          <h2>Amortecimento assimétrico</h2>
        </div>
        <p className="sec-intro">
          O amortecedor não trabalha igual pra cima e pra baixo: as válvulas são
          projetadas de forma diferente pra compressão e pra extensão.
        </p>

        <div className="effects">
          <div className="eff down">
            <div className="dir">
              <span className="arrow">▼</span> compressão (jounce)
            </div>
            <p>
              Roda subindo no buraco: o amortecimento é deixado{' '}
              <b>mais livre/suave</b>. Resistir demais aqui transmitiria a pancada
              direto pras costas do passageiro.
            </p>
          </div>
          <div className="eff up">
            <div className="dir">
              <span className="arrow">▲</span> extensão (rebound)
            </div>
            <p>
              Empurrando a roda de volta ao chão: o amortecimento costuma ser{' '}
              <span className="stat">~3× mais firme</span> que na compressão. É
              aqui que ele "freia" a mola e libera a energia armazenada.
            </p>
          </div>
        </div>

        <div className="callout">
          <b>Ordem de grandeza.</b> A taxa de amortecimento de um carro de passeio
          comum fica entre <span className="stat">20% e 40%</span> (0,2–0,4) do
          máximo possível antes de a suspensão "travar".
        </div>
      </section>

      {/* 06 · atrito / stiction */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">06</span>
          <h2>Atrito e não-linearidade (stiction)</h2>
        </div>
        <p className="sec-intro">
          Na teoria a mola reage proporcional ao buraco. Na vida real, eixos,
          buchas e hastes esfregam entre si e geram atrito.
        </p>

        <div className="callout">
          Por causa dessa fricção, em movimentos <b>bem pequenos</b> (asfalto
          levemente enrugado) a suspensão custa a começar a se mover — comportando-se
          momentaneamente como se fosse até <span className="stat">3× mais dura</span>{' '}
          que sua mola. É por isso que reduzir atritos (lubrificar, otimizar) é
          crucial pra não transmitir trepidações irritantes ao motorista.
        </div>
      </section>

      {/* 07 · suspensão ativa */}
      <section className="block">
        <div className="sec-head">
          <span className="sec-num">07</span>
          <h2>A saída moderna: suspensão ativa</h2>
        </div>
        <p className="sec-intro">
          Numa suspensão passiva, tudo acima é <b>fixo</b> — o engenheiro escolhe
          um meio-termo entre carro mole e carro duro. A ativa quebra essa regra.
        </p>

        <div className="duo">
          <div className="facet">
            <span className="tag">Passiva</span>
            <h4>Características fixas</h4>
            <p>
              Mola e amortecedor com valores definidos no projeto. Obriga a
              escolher um único ponto no trade-off conforto × aderência.
            </p>
          </div>
          <div className="facet amber">
            <span className="tag">Ativa</span>
            <h4>Adapta em tempo real</h4>
            <p>
              Cilindros hidráulicos controlados por computador leem sensores e
              ajustam tudo instantaneamente — reduzindo até{' '}
              <span className="stat">30%</span> a aceleração vertical sentida pelos
              passageiros. Confortável <b>e</b> boa de curva ao mesmo tempo.
            </p>
          </div>
        </div>

        <div className="callout">
          <b>Ligando ao sandbox.</b> No Godot, o <code>VehicleWheel3D</code> expõe
          justamente esses parâmetros: <code>suspension_stiffness</code>,{' '}
          <code>suspension_travel</code>, <code>damping_compression</code> e{' '}
          <code>damping_relaxation</code>. Variar cada um e observar constrói a
          intuição de rigidez, curso e amortecimento descritos aqui.
        </div>
      </section>
    </div>
  );
}
