import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Doc técnica · Dinâmica multicorpo · Sessão de construção de 5/set/2026.
 * Quarta entrada da frente, e a primeira que produz binário em vez de leitura.
 * As três anteriores mediram o gap entre o Jolt e o que o Godot expõe; esta
 * atravessa o gap por uma GDExtension em C++ com um PhysicsSystem do Jolt
 * próprio, e registra a decisão de arquitetura que sustenta o resto da frente.
 *
 * Fonte: o código em gdjolt/ deste repositório, mais os números medidos nas
 * duas verificações headless e no vehicle_probe. Nada aqui é estimativa —
 * cada tabela veio de uma execução real.
 *
 * Renderiza sob `.dossie .tecnica .mcorpo` — mesma família visual das outras
 * entradas da frente, sem CSS próprio.
 */
export default function DossiePonteGDExtension() {
  const quinzenaHref = useBaseUrl('/docs/multicorpo/constraints-e-jolt');
  const comparativoHref = useBaseUrl('/docs/multicorpo/jolt-vs-godot');
  const porDentroHref = useBaseUrl('/docs/multicorpo/vehicleconstraint-por-dentro');
  const roadmapHref = useBaseUrl('/docs/roadmaps/semana-2026-08-10');
  const treeShot = useBaseUrl('/img/gdjolt-demo-tree.png');

  return (
    <div className="dossie tecnica mcorpo">
      {/* faixa de telemetria */}
      <div className="telemetry-strip">
        <span>
          <span className="dot" />
          sessão · 5 set
        </span>
        <span>
          modo · <b>construção</b>
        </span>
        <span>
          alvo · <b>Godot 4.7 + Jolt 5.6</b>
        </span>
        <span>
          código · <b>gdjolt/</b>
        </span>
        <span>
          estado · <b>ponte atravessada</b>
        </span>
      </div>

      {/* hero */}
      <header className="hero-block">
        <div className="eyebrow">Decisão de arquitetura · a faixa B</div>
        <h1>
          Dois mundos, <span className="accent">uma cena</span>.
        </h1>
        <p className="lede">
          As três entradas anteriores desta frente terminaram no mesmo lugar: o
          Godot <strong>não expõe</strong> a <code>VehicleConstraint</code> do
          Jolt, e não há arranjo de nós <code>Joint3D</code> que a substitua.
          Medir esse vão já estava feito. Esta entrada é sobre{' '}
          <strong>atravessá-lo</strong> — e a travessia tem um nome: uma{' '}
          <strong>GDExtension</strong> em C++ que roda um{' '}
          <code>PhysicsSystem</code> do Jolt <em>próprio</em>, compilado por mim,
          em vez de tentar alcançar o que está embutido no motor.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>Em resumo:</b> o Godot deixa de ser o dono da física e passa a ser{' '}
          <b>renderizador e input</b>. Quem simula é o Jolt, num mundo paralelo
          que a extensão cria e avança. A prova de que isso funciona não é
          estética: o veículo rodando <b>dentro</b> do Godot produz{' '}
          <b>exatamente os mesmos números</b> que o mesmo veículo rodando num
          binário de terminal sem Godot nenhum.
        </div>

        <div className="hero-meta">
          <span>
            leitura anterior ·{' '}
            <a href={porDentroHref}>Um corpo só, quatro bengalas</a>
          </span>
          <span>
            plano · <a href={roadmapHref}>roadmap 10 ago – 7 set</a>
          </span>
        </div>
      </header>

      {/* 01 · a bifurcação */}
      <section>
        <div className="sec-head">
          <span className="sec-num">01</span>
          <h2>A bifurcação: dois desenhos possíveis</h2>
        </div>
        <p className="sec-intro">
          Antes de escrever uma linha, havia duas maneiras de chegar na{' '}
          <code>VehicleConstraint</code>. Uma delas já estava descartada pela{' '}
          <a href={comparativoHref}>evidência da faixa A</a> — mas vale registrar
          por quê, porque é a pergunta que qualquer pessoa faz primeiro.
        </p>

        <div className="duo">
          <div className="facet">
            <h4>Desenho B · alcançar o Jolt embutido</h4>
            <p>
              O Godot 4 já usa o Jolt como backend de física. A ideia óbvia é
              pegar carona: pedir ao motor o <code>PhysicsSystem</code> que ele já
              mantém e adicionar a constraint lá dentro.
            </p>
            <p>
              <b>Não funciona.</b> O módulo embutido não expõe os símbolos do
              Jolt na API de extensão — nem a <code>VehicleConstraint</code>, nem
              os <code>VehicleCollisionTester</code>, nem os controllers. Não é
              questão de dificuldade: a superfície simplesmente não existe.
            </p>
          </div>
          <div className="facet">
            <h4>Desenho A · mundo Jolt próprio</h4>
            <p>
              A extensão compila o Jolt <b>como dependência sua</b> e cria o
              próprio <code>PhysicsSystem</code>. Tem acesso total à biblioteca,
              porque a biblioteca é dela.
            </p>
            <p>
              <b>É o caminho escolhido.</b> Custa manter dois mundos em sincronia
              — o da física e o da cena — e transforma o clone do Jolt em
              dependência de build. Em troca, nada fica fora de alcance.
            </p>
          </div>
        </div>

        <div className="callout amber" style={{marginTop: 22}}>
          <b>A consequência que importa:</b> a partir daqui,{' '}
          <code>~/Projects/JoltPhysics</code> deixa de ser material de leitura e
          vira <b>dependência de compilação</b>. A versão do Jolt passa a ser uma
          decisão do projeto, não um detalhe do motor — o que é exatamente o
          controle que faltava.
        </div>
      </section>

      {/* 02 · o que foi construído */}
      <section>
        <div className="sec-head">
          <span className="sec-num">02</span>
          <h2>O que foi construído, em ordem de dependência</h2>
        </div>
        <p className="sec-intro">
          Quatro peças, cada uma só fazendo sentido se a anterior fechou. A ordem
          não é burocracia: é o que permite saber <b>onde</b> está o erro quando
          algo quebra.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Peça</th>
                <th>O que ela prova</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">godot-cpp</td>
                <td>
                  Que os bindings compilam contra a versão do editor que eu tenho
                  de fato. Sem isso, nada mais é verificável.
                </td>
              </tr>
              <tr>
                <td className="mono">JoltProbe</td>
                <td>
                  Que a <b>ponte existe</b> — a extensão carrega, a classe aparece
                  no <code>ClassDB</code>, a propriedade chega ao Inspector e o
                  Godot chama o meu <code>_physics_process</code> em C++ a cada
                  passo. <b>Sem uma linha de física.</b>
                </td>
              </tr>
              <tr>
                <td className="mono">vehicle_probe</td>
                <td>
                  Que o <b>Jolt sozinho está certo</b>. Mesmo veículo, mesma{' '}
                  <code>VehicleConstraint</code>, num binário de terminal — sem
                  Godot em lugar nenhum.
                </td>
              </tr>
              <tr>
                <td className="mono">JoltVehicle</td>
                <td>
                  Que as duas metades se juntam: o mundo do Jolt avança dentro do
                  loop do Godot e o resultado chega nas transforms da cena.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="sec-intro" style={{marginTop: 26}}>
          O <code>vehicle_probe</code> existir separado é o que torna o resto
          diagnosticável. Quando algo der errado adiante, a pergunta{' '}
          <em>"é o Jolt ou é a ponte?"</em> tem resposta em um comando.
        </p>

        {/* diagrama do fluxo de um passo */}
        <div className="fig" style={{marginTop: 26}}>
          <svg viewBox="0 0 780 250" role="img" aria-label="Fluxo de um passo de física entre Godot e Jolt">
            <defs>
              <marker id="pg-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
                <path d="M0,0 L9,4.5 L0,9 z" fill="#6ee7d7" />
              </marker>
            </defs>

            {/* lado Godot */}
            <rect x="20" y="30" width="230" height="190" rx="10" fill="#12181f" stroke="#2a3644" />
            <text x="135" y="55" textAnchor="middle" fill="#8fa3b8" fontSize="13" fontFamily="monospace">
              GODOT
            </text>
            <rect x="45" y="72" width="180" height="34" rx="6" fill="#1a2430" stroke="#3a4a5c" />
            <text x="135" y="94" textAnchor="middle" fill="#dbe7f2" fontSize="12.5">
              input do teclado
            </text>
            <rect x="45" y="120" width="180" height="34" rx="6" fill="#1a2430" stroke="#3a4a5c" />
            <text x="135" y="142" textAnchor="middle" fill="#dbe7f2" fontSize="12.5">
              _physics_process
            </text>
            <rect x="45" y="168" width="180" height="34" rx="6" fill="#1a2430" stroke="#3a4a5c" />
            <text x="135" y="190" textAnchor="middle" fill="#dbe7f2" fontSize="12.5">
              MeshInstance3D
            </text>

            {/* lado Jolt */}
            <rect x="530" y="30" width="230" height="190" rx="10" fill="#12181f" stroke="#2a3644" />
            <text x="645" y="55" textAnchor="middle" fill="#8fa3b8" fontSize="13" fontFamily="monospace">
              JOLT (meu)
            </text>
            <rect x="555" y="72" width="180" height="34" rx="6" fill="#1a2430" stroke="#4a7f74" />
            <text x="645" y="94" textAnchor="middle" fill="#6ee7d7" fontSize="12.5">
              SetDriverInput
            </text>
            <rect x="555" y="120" width="180" height="34" rx="6" fill="#1a2430" stroke="#4a7f74" />
            <text x="645" y="142" textAnchor="middle" fill="#6ee7d7" fontSize="12.5">
              PhysicsSystem::Update
            </text>
            <rect x="555" y="168" width="180" height="34" rx="6" fill="#1a2430" stroke="#4a7f74" />
            <text x="645" y="190" textAnchor="middle" fill="#6ee7d7" fontSize="12.5">
              GetWorldTransform
            </text>

            {/* a ponte */}
            <rect x="290" y="90" width="200" height="70" rx="10" fill="#161f1c" stroke="#6ee7d7" strokeWidth="1.5" />
            <text x="390" y="118" textAnchor="middle" fill="#6ee7d7" fontSize="13" fontFamily="monospace">
              JoltVehicle
            </text>
            <text x="390" y="139" textAnchor="middle" fill="#8fa3b8" fontSize="11.5">
              a GDExtension em C++
            </text>

            {/* setas */}
            <line x1="228" y1="89" x2="285" y2="105" stroke="#6ee7d7" strokeWidth="1.4" markerEnd="url(#pg-arrow)" />
            <line x1="495" y1="105" x2="551" y2="89" stroke="#6ee7d7" strokeWidth="1.4" markerEnd="url(#pg-arrow)" />
            <line x1="228" y1="137" x2="285" y2="128" stroke="#6ee7d7" strokeWidth="1.4" markerEnd="url(#pg-arrow)" />
            <line x1="495" y1="130" x2="551" y2="137" stroke="#6ee7d7" strokeWidth="1.4" markerEnd="url(#pg-arrow)" />
            <line x1="551" y1="185" x2="495" y2="152" stroke="#6ee7d7" strokeWidth="1.4" markerEnd="url(#pg-arrow)" />
            <line x1="285" y1="150" x2="228" y2="183" stroke="#6ee7d7" strokeWidth="1.4" markerEnd="url(#pg-arrow)" />
          </svg>
          <div className="cap">
            Um passo de física. O Godot fornece o tique e o input; o Jolt resolve;
            as transforms voltam para a cena. O motor <b>não simula nada</b> aqui.
          </div>
        </div>

        <p className="sec-intro" style={{marginTop: 26}}>
          E é assim que a extensão aparece do lado do editor: <code>JoltVehicle</code>{' '}
          é um nó como qualquer outro na árvore, com os quatro filhos que recebem
          a transform de cada roda. Nada aqui denuncia que a física por trás não é
          a do motor.
        </p>
        {/* o print tem 280px de largura nativa: esticar borraria a captura */}
        <figure className="shot" style={{maxWidth: 280, marginLeft: 'auto', marginRight: 'auto'}}>
          <img
            src={treeShot}
            alt="Árvore de nós do projeto de demo no editor do Godot, com o nó Vehicle e os filhos Chassis, Wheel0 a Wheel3"
          />
          <figcaption>
            A cena de demo no editor. <code>Vehicle</code> é a classe registrada
            pela GDExtension; <code>Wheel0..3</code> são só malhas que ela
            posiciona.
          </figcaption>
        </figure>
      </section>

      {/* 03 · o bug de ABI */}
      <section>
        <div className="sec-head">
          <span className="sec-num">03</span>
          <h2>A armadilha: paridade de ABI</h2>
        </div>
        <p className="sec-intro">
          O erro mais caro da sessão não foi de lógica nem de física. Foi de{' '}
          <b>flag de compilação</b> — e é o tipo de coisa que só se aprende
          batendo.
        </p>

        <div className="bug">
          <div className="symptom">
            <h4>Sintoma</h4>
            <p>
              A <code>libJolt.a</code> compilou. O programa de teste compilou. O
              link falhou com dezenas de{' '}
              <code>undefined reference to JPH::AssertFailed</code> — um símbolo
              que eu nunca escrevi e não estava tentando usar.
            </p>
          </div>
          <div className="cause">
            <h4>Causa</h4>
            <p>
              A lib foi compilada em modo <code>Distribution</code>, que define{' '}
              <code>NDEBUG</code> e portanto <b>desliga</b> os asserts do Jolt. O
              meu programa compilou <b>sem</b> <code>NDEBUG</code>, então os
              headers do Jolt ligaram <code>JPH_ENABLE_ASSERTS</code> e passaram a
              esperar um símbolo que a lib não tinha.
            </p>
          </div>
        </div>

        <p style={{marginTop: 22}}>
          O <code>NDEBUG</code> foi só o sintoma visível. O problema real é maior:
          o Jolt muda o <b>layout das structs</b> conforme um punhado de defines e
          conforme as instruções SIMD habilitadas. Quando esses conjuntos
          divergem entre a lib e quem a inclui, o caso <em>gentil</em> é um erro
          de link como este. O caso ruim é <b>compilar, linkar e quebrar em
          runtime</b>, sem mensagem nenhuma.
        </p>

        <div className="tbl-wrap" style={{marginTop: 22}}>
          <table className="ctab">
            <thead>
              <tr>
                <th>O que precisa bater</th>
                <th>Por quê</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">NDEBUG</td>
                <td>
                  Decide se <code>JPH_ENABLE_ASSERTS</code> existe — e portanto se
                  o símbolo <code>JPH::AssertFailed</code> é esperado no link.
                </td>
              </tr>
              <tr>
                <td className="mono">JPH_OBJECT_STREAM</td>
                <td>Adiciona RTTI e atributos de serialização às classes.</td>
              </tr>
              <tr>
                <td className="mono">JPH_DOUBLE_PRECISION</td>
                <td>
                  Troca o tipo <code>Real</code> — muda o tamanho de{' '}
                  <b>toda</b> posição no sistema.
                </td>
              </tr>
              <tr>
                <td className="mono">JPH_PROFILE_ENABLED</td>
                <td>Insere campos de profiling dentro das structs.</td>
              </tr>
              <tr>
                <td className="mono">-mavx2, -mfma, ...</td>
                <td>
                  Mudam alinhamento e a implementação SIMD inline nos headers.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout" style={{marginTop: 22}}>
          <b>A solução não foi anotar os flags certos.</b> Foi parar de
          digitá-los: tanto o <code>SConstruct</code> da extensão quanto o script
          do programa de teste <b>leem</b> o{' '}
          <code>compile_commands.json</code> que o CMake gerou ao compilar a
          própria lib, e espelham dali. Se o build do Jolt for reconfigurado, os
          dois acompanham sozinhos — a paridade deixa de depender de disciplina.
        </div>

        <div className="code-block" style={{marginTop: 22}}>
          <div className="fname">gdjolt/SConstruct · o trecho que garante a paridade</div>
          <pre>
            <code>{`entry = next(e for e in entries if "/Jolt/" in e["file"])
args = shlex.split(entry["command"])

defines = [a[2:] for a in args if DEFINE_RE.match(a)]   # JPH_* e NDEBUG
simd    = [a for a in args if SIMD_RE.match(a)]         # -mavx2, -mfma, ...`}</code>
          </pre>
        </div>
      </section>

      {/* 04 · a versão */}
      <section>
        <div className="sec-head">
          <span className="sec-num">04</span>
          <h2>O detalhe de versão que o plano não previa</h2>
        </div>
        <p className="sec-intro">
          O <a href={roadmapHref}>roadmap</a> dizia "clonar o{' '}
          <code>godot-cpp</code> na branch que casa com o editor". Não dá: o
          repositório <b>não tem branch 4.7</b> — as branches vão até a{' '}
          <code>4.5</code>, mais a <code>master</code>, e a tag mais recente é{' '}
          <code>godot-4.5-stable</code>.
        </p>
        <p>
          O que resolve é que a <code>master</code> já <b>embute</b> o arquivo{' '}
          <code>extension_api-4-7.json</code>, e o parâmetro{' '}
          <code>api_version=4.7</code> seleciona esse arquivo. Antes de confiar
          nisso, comparei o arquivo embutido com o{' '}
          <code>--dump-extension-api</code> tirado do binário do editor instalado
          aqui: mesmo <code>version_full_name</code>, mesmo conjunto de classes.
        </p>
        <div className="callout amber" style={{marginTop: 22}}>
          <b>Vale guardar:</b> o binário do Godot sabe descrever a própria API.{' '}
          <code>--dump-extension-api</code> e{' '}
          <code>--dump-gdextension-interface</code> geram exatamente o que o{' '}
          <code>godot-cpp</code> consome. Se um dia a versão do editor não tiver
          correspondente no repositório dos bindings, o caminho é compilar contra
          o dump do próprio binário via <code>custom_api_file=</code>.
        </div>
      </section>

      {/* 05 · a prova */}
      <section>
        <div className="sec-head">
          <span className="sec-num">05</span>
          <h2>A prova: os mesmos números dos dois lados</h2>
        </div>
        <p className="sec-intro">
          Uma ponte que <em>parece</em> funcionar não vale nada. O teste que
          decide é comparar o veículo rodando dentro do Godot com o{' '}
          <b>mesmo veículo</b> rodando num binário de terminal sem Godot algum —
          e ver se os números batem.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Grandeza (após 3 s, acelerando)</th>
                <th>Jolt puro</th>
                <th>Dentro do Godot</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Altura do corpo</td>
                <td className="mono">0.844</td>
                <td className="mono">0.844</td>
              </tr>
              <tr>
                <td>Comprimento da suspensão · dianteira</td>
                <td className="mono">0.3773</td>
                <td className="mono">0.3773</td>
              </tr>
              <tr>
                <td>Comprimento da suspensão · traseira</td>
                <td className="mono">0.3513</td>
                <td className="mono">0.3513</td>
              </tr>
              <tr>
                <td>Impulso de suspensão · dianteira</td>
                <td className="mono">55.4</td>
                <td className="mono">55.4</td>
              </tr>
              <tr>
                <td>Impulso de suspensão · traseira</td>
                <td className="mono">67.1</td>
                <td className="mono">67.1</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{marginTop: 22}}>
          Iguais até a última casa. Isso diz uma coisa específica e valiosa:{' '}
          <b>a ponte não distorce a física</b>. O que o Godot mostra é o que o
          Jolt calculou, não uma aproximação atravessada por conversão de
          unidades ou por um passo de tempo diferente.
        </p>

        <div className="stat" style={{marginTop: 22}}>
          <div className="formula">
            medido: Σ impulso de suspensão = <b>245,0</b> N·s
            <br />
            teoria: m·g·Δt = 1500 × 9,81 / 60 = <b>245,2</b> N·s
            <br />
            erro: <b>0,1 %</b>
          </div>
        </div>

        <p style={{marginTop: 22}}>
          E os números fecham com a teoria, não só entre si. Em regime, a soma dos
          quatro impulsos de suspensão tem que sustentar o peso do veículo em um
          passo — e sustenta, com 0,1 % de erro. A repartição também é a esperada:{' '}
          <b>a traseira comprime mais que a dianteira</b> (0,3513 contra 0,3773) e
          carrega mais impulso (67,1 contra 55,4). É transferência de carga sob
          aceleração, aparecendo sozinha, sem ninguém ter programado
          "transferência de carga".
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>O que essa tabela substitui:</b> até aqui, a frente multicorpo
          argumentava a partir de <em>leitura</em> — headers, proposals,
          código-fonte. Esta é a primeira vez que a afirmação vem de{' '}
          <b>medição</b>, com o número ao lado.
        </div>

        <p className="sec-intro" style={{marginTop: 26, marginBottom: 0}}>
          E, finalmente, o que os números descrevem — dirigindo o carrinho na
          cena de demo, com a física resolvida pelo Jolt compilado aqui:
        </p>
        <figure className="shot">
          <iframe
            src="https://www.youtube.com/embed/s3Q-pGynNzY"
            title="Veículo do Jolt rodando dentro do Godot pela GDExtension"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <figcaption>
            O <code>JoltVehicle</code> dirigido no Godot. A suspensão que
            trabalha aqui é a <code>VehicleConstraint</code> — a mesma que o{' '}
            <code>VehicleBody3D</code> do motor não expõe.
          </figcaption>
        </figure>
      </section>

      {/* 06 · quem é dono do quê */}
      <section>
        <div className="sec-head">
          <span className="sec-num">06</span>
          <h2>Quem é dono de quê</h2>
        </div>
        <p className="sec-intro">
          Rodar dois mundos exige decidir, sem ambiguidade, quem manda em cada
          coisa. Ambiguidade aqui vira <em>jitter</em>, corpo tremendo ou
          simulação que diverge da imagem.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Responsabilidade</th>
                <th>Dono</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Estado físico (posição, velocidade, contatos)</td>
                <td>
                  <b className="yes">Jolt</b> — a cena é só reflexo
                </td>
              </tr>
              <tr>
                <td>Quando o passo acontece</td>
                <td>
                  <b>Godot</b> — o <code>_physics_process</code> dá o tique
                </td>
              </tr>
              <tr>
                <td>Tamanho do passo</td>
                <td>
                  <b>Fixo</b>, com <em>clamp</em> — um travamento do processo não
                  pode virar um salto grande demais pro solver
                </td>
              </tr>
              <tr>
                <td>Transforms dos nós</td>
                <td>
                  <b>Escritas pela extensão</b> a cada passo; mexer nelas por
                  fora é sobrescrito
                </td>
              </tr>
              <tr>
                <td>Input do motorista</td>
                <td>
                  <b>Godot</b>, repassado via <code>SetDriverInput</code>
                </td>
              </tr>
              <tr>
                <td>Colisão do veículo com o mundo</td>
                <td>
                  <b className="no">Não é do Godot</b> — corpos{' '}
                  <code>StaticBody3D</code> da cena <b>não</b> existem para o
                  Jolt. O mundo precisa ser construído dos dois lados
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout coral" style={{marginTop: 22}}>
          <b>A limitação honesta desta versão:</b> o chão é um corpo criado{' '}
          <em>dentro</em> da extensão, e a malha que aparece na tela é só
          decoração alinhada com ele. Fazer a geometria da cena virar geometria do
          Jolt automaticamente é trabalho de verdade, e não estava no escopo desta
          etapa — mas é o próximo obstáculo real, não um detalhe.
        </div>
      </section>

      {/* 07 · o molde do professor */}
      <section>
        <div className="sec-head">
          <span className="sec-num">07</span>
          <h2>O molde do professor: o que o GDChrono já resolvia</h2>
        </div>
        <p className="sec-intro">
          A decisão de arquitetura acima foi tomada <b>antes</b> de eu ver o{' '}
          <a
            href="https://github.com/InteractiveDynamics/GdChrono"
            target="_blank"
            rel="noopener noreferrer">
            GDChrono
          </a>{' '}
          — a GDExtension que o professor escreveu ligando o Godot ao{' '}
          <b>Project Chrono</b>. Ler o código dele depois é o melhor tipo de
          conferência: ou eu tinha acertado por conta, ou aprenderia onde errei.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>A escolha central bate.</b> A classe <code>Ch::World</code> dele
          guarda um <code>chrono::ChSystemSMC</code> <b>próprio</b>, e o{' '}
          <code>ChManager</code> é um <code>Node3D</code> com{' '}
          <code>_ready()</code> e <code>_physics_process(double delta)</code> —
          exatamente o desenho A, exatamente a mesma forma de nó. O{' '}
          <code>Register.cpp</code> dele e o meu são quase linha a linha o mesmo
          arquivo. Duas pessoas chegaram no mesmo lugar sem combinar, o que é a
          melhor evidência de que o lugar está certo.
        </div>

        <p style={{marginTop: 22}}>
          As diferenças, porém, são as partes interessantes — e nas três ele está
          à frente.
        </p>

        <div className="steps">
          <div className="step">
            <h4>A cena nasce da física, não o contrário</h4>
            <p>
              O meu <code>JoltVehicle</code> procura filhos chamados{' '}
              <code>Wheel0..3</code> e escreve transform neles: a cena é montada à
              mão e o código sabe de cor quantas rodas existem. O dele faz o
              inverso — <code>CreateMeshes</code> percorre o{' '}
              <code>ChAssembly</code> recursivamente e <b>cria</b> um nó para cada
              corpo, link e malha que encontrar, carregando o OBJ de cada um.
            </p>
            <p>
              Melhor ainda: cada <code>ChVisualNode</code> guarda um{' '}
              <code>weak_ptr</code> para o seu item de física e{' '}
              <b>se sincroniza sozinho</b> no próprio{' '}
              <code>_physics_process</code>. A sincronia é distribuída, não
              centralizada num laço que precisa conhecer a cena inteira.
            </p>
            <span className="learn">
              é por isso que ele consegue hospedar um rover inteiro, e eu só um
              veículo de quatro rodas
            </span>
          </div>

          <div className="step">
            <h4>Um único sistema de build dissolve o problema de ABI</h4>
            <p>
              O bloco 03 desta entrada descreve como eu resolvi a paridade de
              flags: lendo o <code>compile_commands.json</code> da lib. Funciona,
              mas é remendo — existe porque eu tenho <b>dois</b> sistemas de build
              (CMake para o Jolt, SCons para a extensão).
            </p>
            <p>
              O professor usa <b>CMake para tudo</b>, com o{' '}
              <code>godot-cpp</code> entrando como{' '}
              <code>add_subdirectory(ThirdParty/godot-cpp)</code>. Com um projeto
              só, os flags propagam pelos alvos e a divergência{' '}
              <b>não tem como acontecer</b>. Não é que ele resolveu melhor o meu
              problema: é que, na estrutura dele, o problema não existe.
            </p>
            <span className="learn">o remendo tem prazo de validade</span>
          </div>

          <div className="step">
            <h4>O passo de física é desacoplado do quadro</h4>
            <p>
              O meu <code>_physics_process</code> passa o <code>delta</code> do
              Godot direto para o <code>PhysicsSystem::Update</code>. O dele{' '}
              <b>ignora</b> o delta e chama{' '}
              <code>DoStepDynamics(5e-4)</code> — um passo fixo de 0,5 ms por
              quadro. Faz sentido para o Chrono com solo deformável, que precisa
              de passo curto para convergir, mas significa que o tempo simulado
              anda mais devagar que o tempo do relógio.
            </p>
            <span className="learn">
              escolher entre "tempo real" e "passo estável" é decisão de
              projeto, não detalhe
            </span>
          </div>
        </div>

        <div className="tbl-wrap" style={{marginTop: 26}}>
          <table className="ctab">
            <thead>
              <tr>
                <th>Ponto</th>
                <th>GDChrono</th>
                <th>gdjolt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mundo de física</td>
                <td>
                  <b className="yes">próprio</b> (<code>ChSystemSMC</code>)
                </td>
                <td>
                  <b className="yes">próprio</b> (<code>PhysicsSystem</code>)
                </td>
              </tr>
              <tr>
                <td>Construção da cena</td>
                <td>gerada da física, recursiva</td>
                <td>nós fixos, achados por nome</td>
              </tr>
              <tr>
                <td>Sincronia das transforms</td>
                <td>distribuída (cada nó se atualiza)</td>
                <td>centralizada (um laço escreve)</td>
              </tr>
              <tr>
                <td>Build</td>
                <td>CMake para tudo</td>
                <td>CMake + SCons, paridade lida do JSON</td>
              </tr>
              <tr>
                <td>Passo</td>
                <td>fixo, 0,5 ms por quadro</td>
                <td>o delta do Godot, com <em>clamp</em></td>
              </tr>
              <tr>
                <td>Empacotamento</td>
                <td>todas as plataformas, precisão simples e dupla</td>
                <td>linux x86_64, precisão simples</td>
              </tr>
              <tr>
                <td>Modelo simulado</td>
                <td>
                  rover <b>Viper</b> articulado + terreno <b>SCM</b> deformável
                </td>
                <td>
                  veículo <em>lumped</em> de um corpo
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout amber" style={{marginTop: 22}}>
          <b>A linha que mais importa é a última.</b> O GDChrono já roda o{' '}
          <code>Viper</code> — um rover articulado de verdade, vindo dos modelos
          do Chrono — sobre <code>SCMTerrain</code>, o solo deformável com
          parâmetros de Bekker e Janosi. Ou seja: o destino das frentes de{' '}
          <b>integração roda–solo</b> e <b>validação comparativa</b> não é
          hipótese, é código que existe e que eu posso ler. O que eu construí
          alcança o degrau anterior — mas agora dá pra ver o degrau seguinte de
          perto.
        </div>
      </section>

      {/* 08 · o que muda */}
      <section>
        <div className="sec-head">
          <span className="sec-num">08</span>
          <h2>O que isso muda na frente</h2>
        </div>

        <div className="steps">
          <div className="step">
            <h4>O teto do Godot deixou de ser o teto do projeto</h4>
            <p>
              A <a href={comparativoHref}>tabela comparativa</a> listava features
              do Jolt marcadas como "o Godot não expõe". Essa coluna não é mais
              uma parede: é uma lista de coisas que agora <b>dá para alcançar</b>,
              uma a uma, pela extensão.
            </p>
            <span className="learn">
              o gap virou backlog em vez de impedimento
            </span>
          </div>
          <div className="step">
            <h4>A leitura de código virou execução</h4>
            <p>
              Tudo que a entrada{' '}
              <a href={porDentroHref}>Um corpo só, quatro bengalas</a> descreveu
              lendo os headers — o raycast que acha o chão, a mola que vira
              constraint, o <em>clamp</em> μ·N — agora está rodando e imprimindo
              número. As duas entradas se checam.
            </p>
            <span className="learn">
              dá pra medir o que antes só dava pra descrever
            </span>
          </div>
          <div className="step">
            <h4>O protótipo raycast ganhou um par de comparação</h4>
            <p>
              Existe agora, na mesma máquina, um veículo por{' '}
              <b>penalidade</b> (o protótipo em GDScript) e um por{' '}
              <b>constraint</b> (este). O contraste que a{' '}
              <a href={quinzenaHref}>primeira entrada</a> tratou no conceito pode
              ser medido lado a lado.
            </p>
            <span className="learn">o mesmo cenário, os dois paradigmas</span>
          </div>
        </div>
      </section>

      {/* 09 · o que falta */}
      <section>
        <div className="sec-head">
          <span className="sec-num">09</span>
          <h2>O que continua em aberto</h2>
        </div>

        <div className="tl">
          <div className="tl-stop">
            <h4>Adotar o padrão do GDChrono para a cena</h4>
            <p>
              Trocar os nós fixos <code>Wheel0..3</code> por construção a partir
              da física, com cada nó se sincronizando sozinho — e considerar
              migrar o build inteiro para CMake, que dissolve a paridade de ABI em
              vez de administrá-la.
            </p>
          </div>
          <div className="tl-stop">
            <h4>Geometria da cena → mundo do Jolt</h4>
            <p>
              Enquanto o chão for construído dentro da extensão, não dá pra
              modelar terreno no editor. É o obstáculo mais concreto entre este
              estado e um cenário de verdade.
            </p>
          </div>
          <div className="tl-stop">
            <h4>O rover articulado</h4>
            <p>
              Vale repetir o que a entrada anterior estabeleceu: a{' '}
              <code>VehicleConstraint</code> é um modelo <em>lumped</em>, de{' '}
              <b>um corpo só</b>. Ela não é o rover articulado — é o degrau
              anterior. O rover pede corpos e juntas de verdade, e agora existe
              por onde construí-los.
            </p>
          </div>
        </div>

        <div className="callout" style={{marginTop: 26}}>
          <b>O estado da frente, em uma frase:</b> parou de ser sobre{' '}
          <em>descobrir o que dá para fazer</em> e passou a ser sobre{' '}
          <em>escolher o que fazer primeiro</em> — agora com um exemplo
          funcionando dentro do próprio grupo para usar de referência.
        </div>
      </section>

      {/* fontes */}
      <section className="refs">
        <div className="sec-head">
          <span className="sec-num">↗</span>
          <h2>Fontes e código</h2>
        </div>

        <div className="rgrp">
          <h4>O código desta entrada</h4>
          <a href="https://github.com/godotengine/godot-cpp" target="_blank" rel="noopener noreferrer">
            <span className="rd">godot-cpp — os bindings C++ do Godot</span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://docs.godotengine.org/en/stable/tutorials/scripting/gdextension/index.html"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">GDExtension — documentação oficial</span>
            <span className="rk">↗ godot docs</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Samples/Tests/Vehicle/VehicleConstraintTest.cpp"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">
              VehicleConstraintTest.cpp — o gabarito do veículo de quatro rodas
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/HelloWorld/HelloWorld.cpp"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">
              HelloWorld.cpp — a base do programa de teste sem Godot
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a href="https://github.com/godot-jolt/godot-jolt" target="_blank" rel="noopener noreferrer">
            <span className="rd">
              godot-jolt — outra GDExtension de física, como referência de estrutura
            </span>
            <span className="rk">↗ github</span>
          </a>
        </div>

        <div className="rgrp">
          <h4>O molde</h4>
          <a
            href="https://github.com/InteractiveDynamics/GdChrono"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">
              GdChrono — a GDExtension do professor ligando o Godot ao Project Chrono
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a href="https://youtu.be/s3Q-pGynNzY" target="_blank" rel="noopener noreferrer">
            <span className="rd">
              O JoltVehicle rodando na cena de demo — vídeo
            </span>
            <span className="rk">↗ youtube</span>
          </a>
        </div>

        <div className="rgrp">
          <h4>As entradas que levaram até aqui</h4>
          <a href={quinzenaHref}>
            <span className="rd">Constraints, juntas e o Jolt por dentro — o paradigma</span>
            <span className="rk">→ nesta frente</span>
          </a>
          <a href={comparativoHref}>
            <span className="rd">O tanque do Jolt e o teto do Godot — o comparativo</span>
            <span className="rk">→ nesta frente</span>
          </a>
          <a href={porDentroHref}>
            <span className="rd">Um corpo só, quatro bengalas — a mecânica interna</span>
            <span className="rk">→ nesta frente</span>
          </a>
        </div>
      </section>
    </div>
  );
}
