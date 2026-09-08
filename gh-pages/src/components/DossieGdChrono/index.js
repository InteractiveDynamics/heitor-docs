import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Doc técnica · Dinâmica multicorpo · Sessão de leitura de código de 7/set/2026.
 * Quinta entrada da frente. A entrada anterior construiu a ponte C++ e registrou
 * a decisão de arquitetura; esta confere essa decisão contra a implementação que
 * o professor já tinha feito — o GDChrono, ligando o Godot ao Project Chrono.
 *
 * Fonte: leitura do repositório InteractiveDynamics/GdChrono no commit fde5589.
 * As citações de arquivo valem para esse commit.
 *
 * Renderiza sob `.dossie .tecnica .mcorpo`, sem CSS próprio.
 */
export default function DossieGdChrono() {
  const ponteHref = useBaseUrl('/docs/multicorpo/ponte-gdextension');
  const comparativoHref = useBaseUrl('/docs/multicorpo/jolt-vs-godot');
  const porDentroHref = useBaseUrl('/docs/multicorpo/vehicleconstraint-por-dentro');
  const rodaSoloHref = useBaseUrl('/docs/roda-solo/visao-geral');

  return (
    <div className="dossie tecnica mcorpo">
      {/* faixa de telemetria */}
      <div className="telemetry-strip">
        <span>
          <span className="dot" />
          sessão · 7 set
        </span>
        <span>
          fonte · <b>InteractiveDynamics/GdChrono</b>
        </span>
        <span>
          commit · <b>fde5589</b>
        </span>
        <span>
          método · <b>leitura de código</b>
        </span>
        <span>
          objetivo · <b>conferir a decisão</b>
        </span>
      </div>

      {/* hero */}
      <header className="hero-block">
        <div className="eyebrow">O molde do professor · conferência cega</div>
        <h1>
          Duas pontes, <span className="accent">um desenho</span>.
        </h1>
        <p className="lede">
          O professor já tinha atravessado esta mesma ponte antes de mim — com
          outro rio. O <strong>GDChrono</strong> é uma GDExtension que liga o
          Godot ao <strong>Project Chrono</strong>, uma biblioteca de física de
          engenharia. Eu construí a minha ligação com o Jolt{' '}
          <strong>sem ter visto o código dele</strong>, e só depois abri o
          repositório para conferir.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>O resultado da conferência:</b> a decisão grande — a única que seria
          cara de desfazer — <b>bate</b>. As diferenças estão todas em como a
          decisão é executada, e nas três ele está à frente. Uma delas não é
          refinamento: é o que separa simular <b>um carro</b> de simular{' '}
          <b>um rover</b>.
        </div>

        <div className="hero-meta">
          <span>
            a decisão conferida · <a href={ponteHref}>Dois mundos, uma cena</a>
          </span>
          <span>
            repositório · <b>github.com/InteractiveDynamics/GdChrono</b>
          </span>
        </div>
      </header>

      {/* 01 · a bifurcação */}
      <section>
        <div className="sec-head">
          <span className="sec-num">01</span>
          <h2>Por que a coincidência vale como prova</h2>
        </div>
        <p className="sec-intro">
          Quem quer usar uma biblioteca de física de fora dentro do Godot encara
          uma bifurcação logo no primeiro dia. Ela não tem resposta óbvia, e
          errar custa reescrever tudo.
        </p>

        <div className="duo">
          <div className="facet">
            <h4>Caminho B · pegar carona</h4>
            <p>
              Reaproveitar o mundo de física que o Godot já mantém e apenas
              acrescentar nele a peça que falta. É o caminho <em>econômico</em>:
              não duplica nada, herda tudo que o motor já resolve — colisão da
              cena, corpos, camadas.
            </p>
            <p>
              É também o que a maioria tentaria primeiro, e por isso vale
              registrar que <b>nenhum de nós dois foi por aqui</b>.
            </p>
          </div>
          <div className="facet">
            <h4>Caminho A · trazer o seu mundo</h4>
            <p>
              A extensão compila a biblioteca como dependência própria e cria o{' '}
              <b>seu próprio mundo de física</b>, paralelo ao do motor. O Godot
              fica com desenho e entrada.
            </p>
            <p>
              Custa manter dois mundos em sincronia e assumir a biblioteca como
              dependência de build. Em troca, <b>nada fica fora de alcance</b>.
            </p>
          </div>
        </div>

        <div className="callout amber" style={{marginTop: 22}}>
          <b>O ponto metodológico:</b> se eu tivesse lido o GDChrono antes de
          decidir, a coincidência não provaria nada — provaria só que sei copiar.
          Como as duas decisões foram tomadas <b>separadamente</b>, o encontro é
          evidência de verdade. É a diferença entre <em>"acho que essa é a
          arquitetura certa"</em> e <em>"duas pessoas resolvendo o mesmo problema
          sem se falar chegaram nela"</em>.
        </div>
      </section>

      {/* 02 · o mesmo esqueleto */}
      <section>
        <div className="sec-head">
          <span className="sec-num">02</span>
          <h2>O mesmo esqueleto, lado a lado</h2>
        </div>
        <p className="sec-intro">
          Não é "parecido". A classe central das duas extensões tem a mesma forma:
          um nó do Godot que <b>carrega dentro de si</b> um mundo de física
          próprio, monta esse mundo no <code>_ready</code> e o avança no{' '}
          <code>_physics_process</code>.
        </p>

        <div className="code-block">
          <div className="fname">
            GdChrono/Godot/ChManager.h &nbsp;×&nbsp; gdjolt/src/jolt_vehicle.h
          </div>
          <pre>
            <code>{`// o dele                        // o meu
class ChManager               class JoltVehicle
    : public Node3D {             : public Node3D {

  void _ready();                void _ready();
  void _physics_process(d);     void _physics_process(d);

  Ch::World world;              unique_ptr<PhysicsSystem> sys;
  // ↑ ChSystemSMC dele          // ↑ PhysicsSystem meu
};                            };`}</code>
          </pre>
        </div>

        <p style={{marginTop: 22}}>
          A classe <code>Ch::World</code> dele (em{' '}
          <code>Chrono/ChWorld.h</code>) guarda um{' '}
          <code>chrono::ChSystemSMC</code> como membro — o mundo de física é{' '}
          <b>dele</b>, não do motor. O <code>ChManager</code> chama{' '}
          <code>world.Init()</code> no <code>_ready</code> e{' '}
          <code>world.Update(delta)</code> no <code>_physics_process</code>.
          Trocando os nomes, é o meu arquivo.
        </p>
        <p>
          Os arquivos que registram a extensão no motor —{' '}
          <code>Godot/Register.cpp</code> no dele,{' '}
          <code>src/register_types.cpp</code> no meu — são quase linha a linha o
          mesmo arquivo: <code>GDREGISTER_CLASS</code> dentro de um{' '}
          <code>InitObject</code>, com{' '}
          <code>MODULE_INITIALIZATION_LEVEL_SCENE</code>. Isso é menos
          surpreendente (é o padrão da documentação do Godot), mas confirma que
          estamos usando o mecanismo do mesmo jeito.
        </p>
      </section>

      {/* 03 · diferença 1 */}
      <section>
        <div className="sec-head">
          <span className="sec-num">03</span>
          <h2>Diferença 1 · a cena nasce da física</h2>
        </div>
        <p className="sec-intro">
          Esta é a diferença que importa de verdade — as outras duas são
          engenharia, esta é <b>capacidade</b>.
        </p>

        <div className="duo">
          <div className="facet">
            <h4>O meu · fantoches montados à mão</h4>
            <p>
              O <code>JoltVehicle</code> procura filhos chamados{' '}
              <code>Wheel0</code> a <code>Wheel3</code> e escreve a transform
              deles a cada passo. A cena é montada no editor, por mim, antes de
              rodar.
            </p>
            <p>
              O código <b>sabe de cor que são quatro rodas</b>. Um rover de seis
              exigiria mexer no C++.
            </p>
          </div>
          <div className="facet">
            <h4>O dele · fantoches construídos pelo código</h4>
            <p>
              O <code>CreateMeshes</code> percorre o <code>ChAssembly</code>{' '}
              <b>recursivamente</b> — corpos, links, malhas, e sub-assemblies
              dentro de sub-assemblies — e <b>cria</b> um nó para cada item que
              encontrar, carregando o arquivo OBJ de cada um.
            </p>
            <p>
              A cena não é montada antes: ela é <b>descoberta</b> quando o mundo
              de física é ligado.
            </p>
          </div>
        </div>

        <p style={{marginTop: 22}}>
          E há um segundo movimento, ainda mais elegante. Cada nó criado é um{' '}
          <code>ChVisualNode</code>, que guarda um <code>weak_ptr</code> para o
          seu próprio item de física e <b>se sincroniza sozinho</b> no próprio{' '}
          <code>_physics_process</code>:
        </p>

        <div className="code-block">
          <div className="fname">GdChrono/Godot/ChVisualNode.cpp</div>
          <pre>
            <code>{`void ChVisualNode::_physics_process(double delta) {
    if (physicsItem.expired()) return;

    auto item  = physicsItem.lock();
    auto frame = item->GetVisualModelFrame();

    set_position(ToGodotVec(frame.GetPos()));
    set_basis(FrameRotToBasis(frame));
}`}</code>
          </pre>
        </div>

        <p style={{marginTop: 22}}>
          A sincronia é <b>distribuída</b>: cada nó puxa a sua própria posição.
          No meu, ela é <b>centralizada</b> — um laço em{' '}
          <code>push_transforms()</code> que precisa conhecer a cena inteira. O
          dele não precisa conhecer nada; e o <code>weak_ptr</code> ainda faz o nó
          se desligar sozinho se o corpo de física deixar de existir.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>Por que isso é capacidade e não estilo:</b> é exatamente por causa
          deste desenho que o GDChrono consegue hospedar um{' '}
          <b>rover articulado inteiro</b> — dezenas de corpos e juntas — sem uma
          linha de código específica sobre rovers. O meu alcança um veículo de
          quatro rodas porque eu escrevi "quatro" no código. O dele{' '}
          <b>não precisa saber o que vai simular</b>.
        </div>
      </section>

      {/* 04 · diferença 2 */}
      <section>
        <div className="sec-head">
          <span className="sec-num">04</span>
          <h2>Diferença 2 · um sistema de build só</h2>
        </div>
        <p className="sec-intro">
          A entrada anterior descreve o erro que me custou mais tempo na semana:
          a <a href={ponteHref}>paridade de ABI</a>. A biblioteca e o meu código
          precisam ser compilados com o mesmo conjunto de opções, porque essas
          opções mudam o tamanho das estruturas por dentro. Divergiu, quebra.
        </p>
        <p>
          Minha solução foi ler o <code>compile_commands.json</code> que o CMake
          deixa ao compilar a lib e espelhar os flags de lá. Funciona, e é
          automática. Mas ela só existe porque eu tenho <b>dois</b> sistemas de
          build: CMake para o Jolt, SCons para a extensão.
        </p>
        <p>
          O <code>CMakeLists.txt</code> dele traz o <code>godot-cpp</code> para
          dentro do mesmo projeto —{' '}
          <code>add_subdirectory(ThirdParty/godot-cpp SYSTEM)</code> — junto com o
          Chrono, o <code>fmt</code> e o <code>tinyobjloader</code>. Com um
          projeto só, as opções propagam pelos alvos e a divergência{' '}
          <b>não tem como acontecer</b>.
        </p>

        <div className="callout amber" style={{marginTop: 22}}>
          <b>A lição não é "ele resolveu melhor o meu problema".</b> É que, na
          estrutura dele, <b>o problema não existe</b>. A minha solução é
          correta e automática, mas administra um risco que poderia
          simplesmente não estar lá. Vale como regra geral: preferir a estrutura
          que elimina a classe de erro à ferramenta que a detecta.
        </div>
      </section>

      {/* 05 · diferença 3 */}
      <section>
        <div className="sec-head">
          <span className="sec-num">05</span>
          <h2>Diferença 3 · o passo desacoplado do quadro</h2>
        </div>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Como avança o tempo</th>
                <th>GdChrono</th>
                <th>gdjolt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Passo por quadro</td>
                <td className="mono">0,5 ms (fixo)</td>
                <td className="mono">16,7 ms (o delta do Godot)</td>
              </tr>
              <tr>
                <td>Usa o <code>delta</code> recebido?</td>
                <td>
                  <b className="no">não</b> — é ignorado
                </td>
                <td>
                  <b className="yes">sim</b>, com <em>clamp</em>
                </td>
              </tr>
              <tr>
                <td>Tempo simulado × relógio</td>
                <td>anda mais devagar</td>
                <td>acompanha</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{marginTop: 22}}>
          O <code>Ch::World::Update(double dt)</code> dele recebe o{' '}
          <code>dt</code> do Godot e <b>não o usa</b>: chama{' '}
          <code>sys.DoStepDynamics(5e-4)</code>, um passo fixo de meio
          milissegundo, e depois <code>viper-&gt;Update()</code>. São{' '}
          <b>33 vezes</b> menos tempo simulado por quadro do que no meu.
        </p>
        <p>
          Faz sentido para o problema dele: solo deformável exige passo curto
          para o cálculo convergir. O preço é que a simulação roda em{' '}
          <em>câmera lenta</em> em relação ao relógio — o que é irrelevante se o
          objetivo é estudar o comportamento, e fatal se o objetivo é dirigir em
          tempo real.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>É uma escolha, não um detalhe.</b> "Tempo real" e "passo estável"
          puxam para lados opostos, e cada projeto escolhe onde ficar. A minha
          escolha foi tempo real porque eu queria <em>dirigir</em>; a dele foi
          estabilidade porque ele quer <em>medir</em>. Saber que existe a escolha
          é o que essa leitura entregou.
        </div>
      </section>

      {/* 06 · o que ele já roda */}
      <section>
        <div className="sec-head">
          <span className="sec-num">06</span>
          <h2>O achado que não estava no plano</h2>
        </div>
        <p className="sec-intro">
          Eu abri o repositório para conferir arquitetura. O que encontrei dentro
          do <code>ChWorld.cpp</code> vale mais do que a conferência.
        </p>

        <div className="steps">
          <div className="step">
            <h4>Um rover articulado de verdade</h4>
            <p>
              O mundo dele monta um <code>Viper</code> — o rover lunar dos modelos
              prontos do Chrono, com chassi, braços, juntas e quatro rodas
              acionadas por <code>ViperDCMotorControl</code>. Não é um corpo só
              com molas: é um <b>sistema multicorpo</b>, exatamente o que a
              frente inteira persegue.
            </p>
            <span className="learn">
              o destino da frente já existe rodando, e o código está aberto
            </span>
          </div>

          <div className="step">
            <h4>Solo deformável com terramecânica</h4>
            <p>
              Sobre <code>SCMTerrain</code>, com parâmetros de <b>Bekker</b> e{' '}
              <b>Janosi</b> preenchidos: rigidez do solo, limite de coesão,
              ângulo de atrito interno, coeficiente de cisalhamento. Com{' '}
              <em>bulldozing</em> ligado — o material deslocado se acumula na
              borda do sulco.
            </p>
            <span className="learn">
              é a frente de integração roda–solo, em código, não em plano
            </span>
          </div>

          <div className="step">
            <h4>E domínios ativos por roda</h4>
            <p>
              O terreno só é recalculado numa caixa ao redor de cada roda
              (<code>AddActiveDomain</code>), do tamanho do pneu. É o truque que
              torna solo deformável viável em tempo de execução: não se
              recalcula o mapa inteiro, só onde alguém está pisando.
            </p>
            <span className="learn">
              a ideia é transferível para qualquer implementação, inclusive no Jolt
            </span>
          </div>
        </div>

        <div className="callout coral" style={{marginTop: 26}}>
          <b>O contraste honesto com o Jolt.</b> O Jolt <b>não tem
          terramecânica</b> — não há Bekker, não há Janosi, não há modelo de
          solo. Ele tem <code>HeightFieldShape::SetHeights()</code>, que permite{' '}
          <b>deformar a geometria</b> do terreno em tempo real. São coisas
          diferentes: dá para abrir o sulco onde a roda passou, mas a força que o
          solo devolve — resistência ao afundamento, cisalhamento — teria que ser
          escrita à mão. As duas frentes de{' '}
          <a href={rodaSoloHref}>roda–solo</a> e validação passam por essa
          distinção.
        </div>
      </section>

      {/* 07 · o que eu levo */}
      <section>
        <div className="sec-head">
          <span className="sec-num">07</span>
          <h2>O que eu levo desta leitura</h2>
        </div>

        <div className="tl">
          <div className="tl-stop">
            <h4>Adotar a construção da cena a partir da física</h4>
            <p>
              Trocar os nós fixos <code>Wheel0..3</code> por descoberta em tempo
              de execução, com cada nó se sincronizando sozinho. <b>É
              pré-requisito do rover</b>, não melhoria cosmética — enquanto o
              número de rodas estiver escrito no código, não há rover.
            </p>
          </div>
          <div className="tl-stop">
            <h4>Considerar migrar o build para CMake</h4>
            <p>
              Eliminaria a paridade de ABI como classe de problema, e alinharia a
              estrutura do projeto com a que já existe no grupo.
            </p>
          </div>
          <div className="tl-stop">
            <h4>Tratar o passo como decisão explícita</h4>
            <p>
              Medir quanto cálculo cabe em um quadro, e escolher conscientemente
              entre tempo real e fidelidade — em vez de herdar o passo do Godot
              por omissão.
            </p>
          </div>
          <div className="tl-stop">
            <h4>Levar a ideia de domínio ativo</h4>
            <p>
              Recalcular o terreno só ao redor das rodas é a técnica que torna
              solo deformável possível. Vale mesmo se a implementação for outra.
            </p>
          </div>
        </div>

        <div className="callout" style={{marginTop: 26}}>
          <b>O saldo:</b> a decisão cara estava certa e não precisa ser desfeita.
          O que a leitura entregou foi um <b>mapa do que vem depois</b> — e a
          confirmação de que o caminho já foi percorrido uma vez dentro do grupo,
          com o resultado disponível para ler.
        </div>
      </section>

      {/* fontes */}
      <section className="refs">
        <div className="sec-head">
          <span className="sec-num">↗</span>
          <h2>Fontes</h2>
        </div>

        <div className="rgrp">
          <h4>O repositório lido</h4>
          <a
            href="https://github.com/InteractiveDynamics/GdChrono"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">
              InteractiveDynamics/GdChrono — commit fde5589. Arquivos:
              Chrono/ChWorld.{'{'}h,cpp{'}'}, Godot/ChManager.{'{'}h,cpp{'}'},
              Godot/ChVisualNode.{'{'}h,cpp{'}'}, Godot/Register.cpp,
              CMakeLists.txt
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://api.projectchrono.org/classchrono_1_1vehicle_1_1_s_c_m_terrain.html"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">
              SCMTerrain — o modelo de solo deformável do Chrono
            </span>
            <span className="rk">↗ chrono docs</span>
          </a>
        </div>

        <div className="rgrp">
          <h4>As entradas relacionadas</h4>
          <a href={ponteHref}>
            <span className="rd">
              Dois mundos, uma cena — a decisão que esta leitura confere
            </span>
            <span className="rk">→ nesta frente</span>
          </a>
          <a href={comparativoHref}>
            <span className="rd">
              O tanque do Jolt e o teto do Godot — o comparativo
            </span>
            <span className="rk">→ nesta frente</span>
          </a>
          <a href={porDentroHref}>
            <span className="rd">
              Um corpo só, quatro bengalas — por que o veículo do Jolt não é o rover
            </span>
            <span className="rk">→ nesta frente</span>
          </a>
        </div>
      </section>
    </div>
  );
}
