import React from 'react';

// Screenshots de evidência do sandbox no Godot, co-locadas com o componente.
// Importadas (não referenciadas por URL) pro webpack resolver baseUrl e hash.
import carOnWorld from './img/car_on_world.png';
import arvoreWorld from './img/arvore_world.png';
import arvoreCar from './img/arvore_car.png';
import car from './img/car.png';
import configsRoda from './img/configs_da_roda.png';

/**
 * Dossiê · Sandbox de dinâmica veicular no Godot.
 * Conteúdo portado do HTML original para JSX, usando os componentes-assinatura
 * definidos em src/css/dossie.css (escopados sob `.dossie`).
 */
export default function DossieGodot() {
  return (
    <div className="dossie">
      {/* faixa de telemetria */}
      <div className="telemetry-strip">
        <span>
          <span className="dot" />
          sandbox · operacional
        </span>
        <span>
          engine · <b>Godot 4.7</b>
        </span>
        <span>
          física · <b>Jolt / raycast vehicle</b>
        </span>
        <span>
          modelo · <b>Kenney · hatchback-sports.glb</b>
        </span>
        <span>
          frente · <b>PIBIC · Notas</b>
        </span>
      </div>

      {/* hero */}
      <header className="hero-block">
        <div className="eyebrow">Dossiê de dinâmica veicular</div>
        <h1>
          Construindo um carro que{' '}
          <span className="accent">dirige, freia e capota</span> — e entendendo
          o porquê.
        </h1>
        <p className="lede">
          Registro do que aprendi montando um protótipo de veículo com{' '}
          <strong>VehicleBody3D</strong> no Godot. Não é o modelo multicorpo em
          C++ que vou escrever pro Tema 1 — é o <strong>arcade car</strong>: um
          corpo rígido único com rodas por raycast. Serve pra construir intuição
          sobre torque, suspensão, aderência e transferência de carga antes de
          partir pro modelo rigoroso.
        </p>

        <dl className="hero-meta">
          <div>
            <dt>Raiz da cena</dt>
            <dd>VehicleBody3D</dd>
          </div>
          <div>
            <dt>Rodas</dt>
            <dd>4 × VehicleWheel3D</dd>
          </div>
          <div>
            <dt>Tração</dt>
            <dd>Traseira (2 rodas)</dd>
          </div>
          <div>
            <dt>Direção</dt>
            <dd>Dianteira (2 rodas)</dd>
          </div>
          <div>
            <dt>Massa do corpo</dt>
            <dd>40 (padrão)</dd>
          </div>
        </dl>

        <figure className="shot">
          <img
            src={carOnWorld}
            alt="O carro hatchback renderizado sobre o chão do world.tscn no Godot, com iluminação e ambiente."
          />
          <figcaption>
            O resultado rodando: o carro instanciado sobre o mundo, com chão, sol
            e ambiente — o ponto de chegada deste dossiê.
          </figcaption>
        </figure>
      </header>

      {/* 1 · ARQUITETURA */}
      <section className="block" id="arquitetura">
        <div className="sec-head">
          <span className="sec-num">01</span>
          <h2>A arquitetura da cena</h2>
        </div>
        <p className="sec-intro">
          Duas cenas separadas. O <code>car.tscn</code> é o veículo
          autossuficiente (corpo + rodas + câmera + script). O{' '}
          <code>world.tscn</code> é o palco: instancia o carro e adiciona o
          chão, a luz e o ambiente. A separação importa — se o chão fosse filho
          do carro, cairia junto com ele.
        </p>

        <div className="tree">
          <div className="row">
            <span className="n-world">◉ World</span>
            <span className="tag">Node3D · raiz do mundo</span>
          </div>
          <div className="row">
            <span className="g">├─</span> <span className="n-root">🚗 Car</span>{' '}
            <span className="tag">VehicleBody3D · instância de car.tscn</span>
          </div>
          <div className="row">
            <span className="g">│&nbsp;&nbsp;├─</span>{' '}
            <span className="n-body">▢ hatchback-sports</span>
            <span className="tag">modelo glTF · scale 0.7</span>
          </div>
          <div className="row">
            <span className="g">│&nbsp;&nbsp;│&nbsp;&nbsp;└─</span>{' '}
            <span className="n-mesh">body</span>
            <span className="tag">só o visual da carroceria</span>
          </div>
          <div className="row">
            <span className="g">│&nbsp;&nbsp;├─</span>{' '}
            <span className="n-col">⬢ CollisionShape3D</span>
            <span className="tag">BoxShape3D · a física do chassi</span>
          </div>
          <div className="row">
            <span className="g">│&nbsp;&nbsp;├─</span>{' '}
            <span className="n-wheel">◎ WheelFrontLeft</span>
            <span className="tag">steering</span>
          </div>
          <div className="row">
            <span className="g">│&nbsp;&nbsp;├─</span>{' '}
            <span className="n-wheel">◎ WheelFrontRight</span>
            <span className="tag">steering</span>
          </div>
          <div className="row">
            <span className="g">│&nbsp;&nbsp;├─</span>{' '}
            <span className="n-wheel">◎ WheelBackLeft</span>
            <span className="tag">traction</span>
          </div>
          <div className="row">
            <span className="g">│&nbsp;&nbsp;├─</span>{' '}
            <span className="n-wheel">◎ WheelBackRight</span>
            <span className="tag">traction</span>
          </div>
          <div className="row">
            <span className="g">│&nbsp;&nbsp;└─</span>{' '}
            <span className="n-cam">🎥 Camera3D</span>
            <span className="tag">câmera de perseguição, filha do carro</span>
          </div>
          <div className="row">
            <span className="g">├─</span>{' '}
            <span className="n-static">▦ StaticBody3D</span>
            <span className="tag">o chão · irmão do carro, não filho</span>
          </div>
          <div className="row">
            <span className="g">├─</span>{' '}
            <span className="n-cam">☀ DirectionalLight3D</span>
            <span className="tag">o "sol" da cena</span>
          </div>
          <div className="row">
            <span className="g">└─</span>{' '}
            <span className="n-cam">◐ WorldEnvironment</span>
            <span className="tag">céu e iluminação ambiente</span>
          </div>
        </div>

        <div className="shots-2">
          <figure className="shot">
            <img
              src={arvoreWorld}
              alt="Dock SceneTree do Godot mostrando a cena world.tscn com o World na raiz, o Car instanciado, o chão, a luz e o WorldEnvironment."
            />
            <figcaption>world.tscn — o palco: carro, chão, sol e ambiente.</figcaption>
          </figure>
          <figure className="shot">
            <img
              src={arvoreCar}
              alt="Dock SceneTree do Godot mostrando a cena car.tscn com o VehicleBody3D na raiz, o modelo, a colisão, as quatro rodas e a câmera."
            />
            <figcaption>car.tscn — o veículo: corpo, colisão, 4 rodas e câmera.</figcaption>
          </figure>
        </div>

        <div className="tree-legend">
          <span>
            <span className="swatch" style={{background: 'var(--cyan)'}} />
            <b>Corpo do veículo</b> — recebe as forças
          </span>
          <span>
            <span className="swatch" style={{background: 'var(--green)'}} />
            <b>Rodas</b> — raycast + tração/direção
          </span>
          <span>
            <span className="swatch" style={{background: 'var(--amber)'}} />
            <b>Colisão</b> — o que a física "sente"
          </span>
          <span>
            <span className="swatch" style={{background: 'var(--violet)'}} />
            <b>Malha</b> — só o visual
          </span>
        </div>

        <div className="callout">
          <b>A pegadinha do multicorpo.</b> O VehicleBody3D não é um modelo
          multicorpo de verdade: é um corpo rígido único onde as rodas são
          raycasts com uma mola. A própria doc do Godot avisa que não foi feito
          pra física de veículo realista. Justamente por isso ele é um bom
          sandbox — no Tema 1, cada roda/corpo vira um nó rígido próprio ligado
          por articulações, com as forças resolvidas por restrições, não por
          raycast.
        </div>
      </section>

      {/* 2 · MONTAGEM */}
      <section className="block" id="montagem">
        <div className="sec-head">
          <span className="sec-num">02</span>
          <h2>O processo de montagem</h2>
        </div>
        <p className="sec-intro">
          A ordem importou menos que os detalhes de transform que quase passaram
          batido. Cada etapa abaixo traz a lição que só apareceu quando algo saiu
          do lugar.
        </p>

        <div className="steps">
          <div className="step">
            <h4>Importar o modelo em glTF (GLB)</h4>
            <p>
              O Kenney Car Kit traz FBX, OBJ e GLB. Usei o <code>.glb</code> — é
              o glTF binário, com malha, materiais e texturas num arquivo só. É o
              mesmo formato aberto que o rover vai usar depois.
            </p>
            <div className="learn">
              GLB carrega texturas embutidas; OBJ não, e FBX é proprietário.
              Arrastar o <code>.glb</code> pra dentro da cena já instancia tudo
              pronto.
            </div>
          </div>
          <div className="step">
            <h4>Ajustar o CollisionShape3D do chassi</h4>
            <p>
              Um <code>BoxShape3D</code> com <code>Size (1, 0.5, 2)</code>{' '}
              cobrindo a carroceria. É essa caixa que a física usa — o modelo
              visual não colide sozinho.
            </p>
            <div className="learn">
              O CollisionShape é irmão do modelo, não filho. Mover o modelo não
              arrasta a colisão junto: os transforms são independentes.
            </div>
          </div>
          <div className="step">
            <h4>Extrair as rodas do modelo</h4>
            <p>
              O <code>hatchback-sports</code> já vinha com as 4 rodas modeladas
              dentro. Com <code>Editable Children</code>, copiei cada malha de
              roda pra dentro do VehicleWheel3D correspondente e escondi as
              originais.
            </p>
            <div className="learn">
              Nós vindos de uma cena importada não podem ser apagados ("foreign
              scene") — a saída é escondê-los pelo ícone de olho.
            </div>
          </div>
          <div className="step">
            <h4>Posicionar as rodas — e a conta da escala</h4>
            <p>
              As posições locais das rodas <code>(±0.3, 0.3, ±0.81)</code> só
              valiam porque o modelo estava em <code>(0,0,0)</code>. Como o{' '}
              <code>hatchback-sports</code> tem <code>scale 0.7</code>, a posição
              real de cada VehicleWheel3D é a local <b>multiplicada por 0.7</b>.
            </p>
            <div className="learn">
              Posição de um nó é sempre relativa ao pai. Quando o pai tem escala
              ≠ 1, ela multiplica tanto o tamanho quanto a posição dos filhos.
            </div>
          </div>
          <div className="step">
            <h4>Fechar o mundo: chão, luz e câmera</h4>
            <p>
              Um <code>StaticBody3D</code> largo e fino como chão, uma{' '}
              <code>DirectionalLight3D</code> como sol e uma <code>Camera3D</code>{' '}
              atrás do carro. Sem isso, a cena roda preta ou o carro cai no
              vazio.
            </p>
            <div className="learn">
              A luz e a câmera do editor são só prévia — não existem no jogo
              rodando. Toda cena precisa das suas próprias.
            </div>
          </div>
        </div>

        <figure className="shot">
          <img
            src={car}
            alt="O veículo montado no editor do Godot: carroceria hatchback com as quatro rodas extraídas posicionadas nos cantos do chassi."
          />
          <figcaption>
            O carro montado: carroceria, colisão e as 4 rodas já extraídas e
            reposicionadas com a escala 0.7 aplicada.
          </figcaption>
        </figure>
      </section>

      {/* 3 · PARÂMETROS DA RODA */}
      <section className="block" id="rodas">
        <div className="sec-head">
          <span className="sec-num">03</span>
          <h2>Os campos da VehicleWheel3D</h2>
        </div>
        <p className="sec-intro">
          O núcleo do aprendizado. Cada roda tem um conjunto de parâmetros que
          definem tamanho, suspensão, amortecimento e aderência. Abaixo, o que
          cada um faz — e, principalmente, o que muda <b>quando diminuo</b> e{' '}
          <b>quando aumento</b>. O valor à direita é o que usei neste sandbox.
        </p>

        <figure className="shot">
          <img
            src={configsRoda}
            alt="Painel Inspector do Godot com os campos de uma VehicleWheel3D: raio, comprimento de repouso, rigidez e amortecimento da suspensão, e aderência."
          />
          <figcaption>
            Os campos da VehicleWheel3D no Inspector — é isso que cada medidor
            abaixo destrincha.
          </figcaption>
        </figure>

        <Param
          nome="Raio da roda"
          code="wheel_radius"
          usado="0.21 m"
          desc="O tamanho físico da roda, em metros. Precisa bater com o raio visual do modelo (0.3 × escala 0.7 = 0.21), senão o carro flutua ou afunda no chão."
          menor="A roda encosta mais embaixo da origem: o carro fica mais baixo e pode raspar o chassi no chão."
          maior="Roda maior levanta o corpo; se destoar do visual, a roda parece 'boiar' longe do pneu desenhado."
        />

        <Param
          nome="Comprimento de repouso"
          code="wheel_rest_length"
          usado="0.05 m"
          desc="Quanto a roda 'desce' da sua origem quando o carro está parado, em repouso. É a folga que a suspensão usa pra acomodar o peso."
          menor="Suspensão trabalha num curso curto: resposta mais 'seca', o carro fica colado à altura da origem."
          maior="A roda parte de mais baixo, elevando o corpo em repouso — carro mais alto e com mais margem pra comprimir."
        />

        <Param
          nome="Influência de rolagem"
          code="wheel_roll_influence"
          usado="0.1 (padrão)"
          desc="Parâmetro específico do Godot: quanto do torque de rolagem lateral aquela roda transmite ao corpo. É o 'atalho' mais direto pra domar o tombamento sem mexer na geometria."
          menorLabel="Menor (→0)"
          menor="O carro fica mais 'grudado': resiste muito mais a capotar nas curvas, de forma artificial mas eficaz."
          maior="Mais torque lateral chega ao corpo: o carro inclina e tomba com mais facilidade."
        />

        <Param
          nome="Aderência (grip)"
          code="wheel_friction_slip"
          usado="1.0"
          desc="Quanto de agarre a roda tem contra o chão. Combina com o atrito da superfície. 0 é gelo, 1 é aderência normal."
          menor="A roda escorrega: o carro derrapa, perde tração e desliza nas curvas. Bom pra simular desgaste ou drift."
          maior="Mais agarre: aceleração e curva mais firmes — mas grip alto demais deixa o carro mais sujeito a capotar (a força vira torque em vez de escorregão)."
        />

        <Param
          nome="Curso da suspensão"
          code="suspension_travel"
          usado="0.15 m"
          desc="A distância que a suspensão pode percorrer comprimindo e estendendo. Como as unidades do Godot são metros, mantém-se baixo (0.1 a 0.3)."
          menor="Suspensão rígida e curta: o carro sente cada irregularidade, quica menos mas absorve pior os impactos."
          maior="Curso longo: absorve buracos e rampas com mais suavidade, mas o corpo balança e mergulha mais."
        />

        <Param
          nome="Rigidez da mola"
          code="suspension_stiffness"
          usado="60 N/mm"
          desc="A dureza da mola da suspensão. A doc dá faixas de referência: abaixo de 50 pra off-road, 50–100 pra carro de corrida, ~200 pra Fórmula 1."
          menor="Mola macia (perfil off-road/rover): o carro 'boia', inclina mais nas curvas e mergulha ao frear. Bom pra terreno irregular."
          maior="Mola dura (perfil esportivo): o corpo balança pouco, fica firme e estável — parecido com o efeito de uma barra estabilizadora."
        />

        <Param
          nome="Força máxima da suspensão"
          code="suspension_max_force"
          usado="40"
          desc="O limite de força que a mola consegue resistir. A regra: precisa ser maior que ¼ da massa do veículo, senão a mola não aguenta o peso e o carro afunda."
          menor="Se cair abaixo de ¼ da massa, a suspensão 'cede': o carro afunda e senta no chão, como se não tivesse mola."
          maior="Margem folgada pra segurar o peso mesmo em impactos fortes; bons resultados costumam vir com 3× a 4× o mínimo."
        />

        <Param
          nome="Amortecimento — compressão"
          code="damping_compression"
          usado="0.3"
          desc="Quanto a suspensão amortece ao comprimir (roda subindo em relação ao corpo). Entre 0 (sem amortecimento) e ~1."
          menor="A mola comprime livremente e devolve rápido: o carro quica ('boing') a cada solavanco."
          maior="O impacto é absorvido de forma controlada, sem quicar — mas exagerar deixa a suspensão 'dura' e lenta."
        />

        <Param
          nome="Amortecimento — relaxamento"
          code="damping_relaxation"
          usado="0.5"
          desc="Quanto a suspensão amortece ao estender (roda descendo, mola voltando). Regra prática: sempre um pouco maior que a compressão — pra 0.3 de compressão, 0.5 de relaxamento."
          menor="A mola volta muito rápido depois de comprimir: o carro é 'cuspido' pra cima, ganhando instabilidade."
          maior="O retorno é suave e controlado; o carro se reassenta calmamente depois de um buraco ou rampa."
        />

        <div className="param">
          <div className="param-top">
            <h4>Papéis da roda</h4>
            <span className="param-code">
              use_as_traction · use_as_steering
            </span>
            <span className="param-used">
              traseiras · <b>tração</b> · dianteiras · <b>direção</b>
            </span>
          </div>
          <p className="param-desc">
            Duas flags que definem o papel de cada roda.{' '}
            <code>use_as_traction</code> recebe o <code>engine_force</code>{' '}
            global e empurra o carro. <code>use_as_steering</code> gira com o{' '}
            <code>steering</code>. Definem a arquitetura de tração.
          </p>
          <div className="effects">
            <div className="eff up" style={{borderColor: 'var(--cyan-deep)'}}>
              <div className="dir" style={{color: 'var(--cyan)'}}>
                Traseiras · tração
              </div>
              <p>
                Só as rodas com tração marcada movem o carro. Se nenhuma estiver
                marcada, o motor gira mas o carro não sai do lugar.
              </p>
            </div>
            <div className="eff up" style={{borderColor: 'var(--cyan-deep)'}}>
              <div className="dir" style={{color: 'var(--cyan)'}}>
                Dianteiras · direção
              </div>
              <p>
                Só as rodas com direção marcada giram na curva. Marcá-las nas 4
                dá comportamento de tração/direção integral.
              </p>
            </div>
          </div>
        </div>

        <div className="callout">
          <b>Atalho perigoso que aprendi.</b> Usar{' '}
          <code>Copy Properties → Paste Properties</code> pra replicar a config
          nas 4 rodas copia <b>tudo</b>, inclusive as flags de tração/direção.
          Isso igualou as 4 rodas sem eu perceber — a direção funcionava, mas a
          tração não. Vale conferir cada roda uma a uma depois de copiar.
        </div>
      </section>

      {/* 4 · CONTROLE */}
      <section className="block" id="controle">
        <div className="sec-head">
          <span className="sec-num">04</span>
          <h2>O controle: engine_force, brake, steering</h2>
        </div>
        <p className="sec-intro">
          Estas três propriedades ficam no VehicleBody3D (o corpo), não na roda.
          O script lê o teclado no <code>_physics_process</code> e escreve nelas
          a cada passo de física.
        </p>

        <div className="ctrl-grid">
          <div className="ctrl">
            <h4>engine_force</h4>
            <p>
              O torque que as rodas de tração aplicam contra o chão pra empurrar
              o carro. Não é um valor em Newtons reais — é um botão de sensação.
              Negativo = ré. Mais força = mais aceleração e maior velocidade
              final.
            </p>
          </div>
          <div className="ctrl">
            <h4>brake</h4>
            <p>
              A força de frenagem. Só age com as rodas em contato com o chão.
              Depende da massa: pra massa 1000, a doc sugere 25–30 pra freada
              forte.
            </p>
          </div>
          <div className="ctrl">
            <h4>steering</h4>
            <p>
              O ângulo de esterço, em radianos no código (graus no Inspector).
              Suavizado com <code>move_toward</code> pra virar como um carro de
              verdade, não instantâneo.
            </p>
          </div>
        </div>

        <div className="callout">
          <b>A descoberta do "força bruta".</b> Com <code>engine_force = 40</code>{' '}
          o carro nem saía do lugar (a velocidade ficava travada em zero no log).
          Subir pra <code>2000</code> provou que a física funcionava — era só
          ordem de grandeza. Acabei em <b>~250</b>: forte o bastante pra andar
          bem, e é aí que o tombamento nas curvas começou a aparecer.
        </div>
      </section>

      {/* 5 · FÍSICA DO TOMBAMENTO */}
      <section className="block" id="tombamento">
        <div className="sec-head">
          <span className="sec-num">05</span>
          <h2>Por que o carro capota na curva</h2>
        </div>
        <p className="sec-intro">
          O <code>engine_force</code> não capota o carro — ele só empurra pra
          frente. Quem capota é a <b>velocidade</b> que ela permite atingir: a
          força lateral numa curva cresce com o <b>quadrado</b> da velocidade.
          Dobrar a velocidade no mesmo raio = 4× a força lateral tentando
          derrubar o carro.
        </p>

        <div className="physics">
          <div>
            <h4>Transferência de carga</h4>
            <p>
              Numa curva, a inércia atua no centro de gravidade (CG) puxando o
              carro pra fora. Isso transfere peso da roda de dentro pra roda de
              fora. Se a de dentro fica sem carga, o carro pivota sobre a de fora
              e tomba.
            </p>
            <div className="formula">
              SSF = t / (2·h)
              <small>
                Static Stability Factor · t = bitola (distância entre rodas) · h
                = altura do CG
              </small>
            </div>
            <p>
              Se a aceleração lateral (em g) passar do SSF, o carro tende a
              capotar. Baixo e largo (t grande, h pequeno) = estável. Alto e
              estreito = tomba fácil — por isso carros de corrida são baixos e
              largos, e SUVs capotam mais.
            </p>
          </div>
          <div>
            <svg
              viewBox="0 0 300 260"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Diagrama de um carro visto de trás numa curva: força lateral no centro de gravidade transfere carga da roda interna para a externa.">
              <line x1="20" y1="205" x2="280" y2="205" stroke="#26324a" strokeWidth="2" />
              <circle cx="95" cy="188" r="20" fill="none" stroke="#57c98a" strokeWidth="2.5" />
              <circle cx="205" cy="188" r="20" fill="none" stroke="#57c98a" strokeWidth="2.5" />
              <rect x="72" y="92" width="156" height="78" rx="12" fill="rgba(63,208,192,.08)" stroke="#3fd0c0" strokeWidth="2" />
              <circle cx="150" cy="128" r="6" fill="#e8635b" />
              <text x="150" y="112" fill="#aab6c8" fontFamily="'JetBrains Mono',monospace" fontSize="11" textAnchor="middle">CG</text>
              <line x1="150" y1="205" x2="150" y2="128" stroke="#6f7d93" strokeWidth="1.2" strokeDasharray="4 4" />
              <text x="158" y="172" fill="#6f7d93" fontFamily="'JetBrains Mono',monospace" fontSize="11">h</text>
              <line x1="95" y1="212" x2="95" y2="232" stroke="#6f7d93" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="205" y1="212" x2="205" y2="232" stroke="#6f7d93" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="95" y1="228" x2="205" y2="228" stroke="#6f7d93" strokeWidth="1.4" />
              <text x="150" y="248" fill="#6f7d93" fontFamily="'JetBrains Mono',monospace" fontSize="11" textAnchor="middle">t (bitola)</text>
              <line x1="150" y1="128" x2="238" y2="128" stroke="#e8635b" strokeWidth="3" />
              <polygon points="238,128 228,122 228,134" fill="#e8635b" />
              <text x="215" y="118" fill="#e8635b" fontFamily="'JetBrains Mono',monospace" fontSize="10" textAnchor="middle">F lateral</text>
              <line x1="205" y1="148" x2="205" y2="172" stroke="#eaa93c" strokeWidth="4" />
              <polygon points="205,172 200,163 210,163" fill="#eaa93c" />
              <text x="205" y="88" fill="#eaa93c" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" textAnchor="middle">+carga</text>
              <line x1="95" y1="152" x2="95" y2="168" stroke="#6f7d93" strokeWidth="2" />
              <polygon points="95,168 91,161 99,161" fill="#6f7d93" />
              <text x="95" y="88" fill="#6f7d93" fontFamily="'JetBrains Mono',monospace" fontSize="9.5" textAnchor="middle">−carga</text>
            </svg>
          </div>
        </div>

        <div className="callout">
          <b>O que dá pra brincar pra sentir isso.</b> Baixar{' '}
          <code>wheel_roll_influence</code> (0.1 → 0.05 → 0.02) deixa o carro
          cada vez mais colado. Baixar a <code>Position.y</code> do
          CollisionShape reduz o CG (h menor). Afastar as rodas aumenta a bitola
          (t maior). Enrijecer a suspensão reduz a inclinação na curva. Todos
          empurram o SSF pra cima.
        </div>
      </section>

      {/* 6 · DIÁRIO DE BUGS */}
      <section className="block" id="bugs">
        <div className="sec-head">
          <span className="sec-num">06</span>
          <h2>Diário de bugs</h2>
        </div>
        <p className="sec-intro">
          Metade do aprendizado veio das coisas que deram errado. Registro dos
          sintomas e das causas — porque quase todos vão reaparecer no modelo de
          verdade, só que mais difíceis de enxergar.
        </p>

        <Bug
          sintoma="Roda pula pra longe ao colar"
          sintomaP={<>Usei <code>Paste as Child</code> e a roda apareceu longe do carro.</>}
          causa="Posição local somada duas vezes"
          causaP="A posição era relativa ao modelo; ao virar filha do wheel já deslocado, o offset entrou de novo. Zerar a Position da cópia resolveu."
        />
        <Bug
          sintoma="Roda fica gigante"
          sintomaP="Ao mover a roda pra fora do modelo, ela dobrou de tamanho."
          causa="Perdeu a escala herdada"
          causaP={<>O <code>hatchback-sports</code> tem scale 0.7. Dentro dele a roda herdava isso; fora, voltou a 1.0. Reaplicar 0.7 corrigiu.</>}
        />
        <Bug
          sintoma={'"Can\'t operate on nodes from a foreign scene"'}
          sintomaP="Não deixava apagar as rodas originais."
          causa="Nó de cena importada é protegido"
          causaP="Editable Children deixa editar e copiar, mas não apagar. Esconder pelo ícone de olho basta."
        />
        <Bug
          sintoma="Tela cinza ao rodar"
          sintomaP="O jogo abriu, mas tudo cinza."
          causa="Faltava Camera3D"
          causaP="A câmera do editor é só prévia. Sem uma Camera3D na cena, não há o que renderizar."
        />
        <Bug
          sintoma="Cena escura demais"
          sintomaP="O carro aparecia, mas quase preto."
          causa="Faltava DirectionalLight3D"
          causaP="A luz de prévia do editor não existe no jogo. Um 'sol' + WorldEnvironment resolveram."
        />
        <Bug
          sintoma="Carro não anda (velocity travada em 0)"
          sintomaP={<>O log confirmava <code>engine_force: 40</code>, mas a velocidade não subia.</>}
          causa="Força fraca demais pra vencer a inércia"
          causaP="Freeze e Axis Lock estavam OK; o chassi não raspava. Era ordem de grandeza — subir o engine_force resolveu."
        />
      </section>

      {/* 7 · APRESENTAR */}
      <section className="block" id="rodar">
        <div className="sec-head">
          <span className="sec-num">07</span>
          <h2>Como rodar pra apresentar</h2>
        </div>
        <p className="sec-intro">Dois níveis, do mais rápido ao mais "produto pronto".</p>

        <div className="ctrl-grid">
          <div className="ctrl">
            <h4>Main Scene</h4>
            <p>
              Em{' '}
              <code>
                Project → Project Settings → Application → Run → Main Scene
              </code>
              , aponto pra <code>world.tscn</code>. Aí o botão ▶ grande sempre
              roda o mundo direto, sem escolher aba.
            </p>
          </div>
          <div className="ctrl">
            <h4>Executável</h4>
            <p>
              Em <code>Project → Export</code>, com o preset Linux/X11 e os
              export templates instalados, gero um binário que roda com
              duplo-clique — sem abrir o Godot.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* medidor de parâmetro reutilizável */
function Param({nome, code, usado, desc, menor, maior, menorLabel = 'Menor', maiorLabel = 'Maior'}) {
  return (
    <div className="param">
      <div className="param-top">
        <h4>{nome}</h4>
        <span className="param-code">{code}</span>
        <span className="param-used">
          usado · <b>{usado}</b>
        </span>
      </div>
      <p className="param-desc">{desc}</p>
      <div className="meter">
        <div className="mid" />
      </div>
      <div className="effects">
        <div className="eff down">
          <div className="dir">
            <span className="arrow">←</span> {menorLabel}
          </div>
          <p>{menor}</p>
        </div>
        <div className="eff up">
          <div className="dir">
            {maiorLabel} <span className="arrow">→</span>
          </div>
          <p>{maior}</p>
        </div>
      </div>
    </div>
  );
}

/* entrada do log de bugs reutilizável */
function Bug({sintoma, sintomaP, causa, causaP}) {
  return (
    <div className="bug">
      <div className="symptom">
        <div className="lab">Sintoma</div>
        <h4>{sintoma}</h4>
        <p>{sintomaP}</p>
      </div>
      <div className="cause">
        <div className="lab">Causa</div>
        <h4>{causa}</h4>
        <p>{causaP}</p>
      </div>
    </div>
  );
}
