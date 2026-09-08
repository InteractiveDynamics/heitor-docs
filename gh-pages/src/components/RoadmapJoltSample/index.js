import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Sprint 10/ago → 7/set/2026 · Do sample rodando à ponte em C++.
 * Aterrissa os quatro pontos que saíram da reunião de 10/08 em duas faixas:
 * (A) rodar um sample do Jolt e medir o gap contra o Godot — concluída e
 * publicada em três entradas da frente multicorpo; (B) a ponte C++ via
 * GDExtension, que depois da reunião deixou de ser leitura e virou construção.
 * Estendido em 5/set pra cobrir a faixa B em etapas executáveis, com horizonte
 * na segunda 7/set. Entregáveis-âncora: o comparativo Jolt × Godot (faixa A,
 * entregue) e a extensão mínima com o Jolt por trás (faixa B, em execução).
 * Portado do HTML "Do conceito ao sample rodando" pra estética do site,
 * reutilizando src/css/roadmap.css (escopo `.roadmap`). Escrito em 1ª pessoa —
 * notas do Heitor pra si mesmo.
 */
export default function RoadmapJoltSample() {
  const quinzenaHref = useBaseUrl('/docs/multicorpo/constraints-e-jolt');
  const comparativoHref = useBaseUrl('/docs/multicorpo/jolt-vs-godot');
  const porDentroHref = useBaseUrl('/docs/multicorpo/vehicleconstraint-por-dentro');
  const ponteHref = useBaseUrl('/docs/multicorpo/ponte-gdextension');

  return (
    <div className="roadmap">
      {/* hero */}
      <header className="rm-hero">
        <div className="countdown">
          <span className="big">FAIXA B</span>
          <span className="sep mono">·······</span>
          <span className="goal">DESTINO: SEG · 7 SET</span>
        </div>
        <span className="eyebrow">Sprint estendida · 10 ago → 7 set</span>
        <h1>
          Do sample rodando à <span className="accent">ponte em C++</span>
        </h1>
        <p className="lede">
          A quinzena anterior fechou o arco conceitual do multicorpo; a reunião de{' '}
          <b>10 de agosto</b> aterrissou isso em quatro tarefas concretas,
          agrupadas em duas faixas. A <b>faixa A</b> — rodar o Jolt de verdade e
          medir o que o Godot não alcança — está <b>concluída e publicada</b>.
        </p>
        <p className="lede">
          Esta página foi <b>estendida até 7 de setembro</b> pra cobrir a{' '}
          <b>faixa B</b>, que mudou de natureza depois da reunião: não é mais
          ler a doc do GDExtension, é <b>escrever C++, compilar uma extensão e
          usar o Jolt de verdade por trás dela</b>. O modo deixa de ser
          exploratório e passa a ser construtivo — mínimo, mas construtivo.
        </p>
      </header>

      {/* 01 · entregável-âncora */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">★</span>
          <h2>Os dois entregáveis-âncora</h2>
        </div>
        <div className="firstmove">
          <div className="kick">faixa A · ✔ entregue e publicado</div>
          <h3>Comparativo formal Jolt × Godot</h3>
          <p>
            O documento <b>feature a feature</b> que fundamenta a decisão
            arquitetural — raycast × juntas × ponte C++. Não é uma opinião sobre
            qual caminho seguir: é a tabela que mostra, item por item, o que o
            Jolt entrega e o que o módulo embutido do Godot deixa passar. Publicado
            em <a href={comparativoHref}>O tanque do Jolt e o teto do Godot</a>, com
            a mecânica interna destrinchada em{' '}
            <a href={porDentroHref}>Um corpo só, quatro bengalas</a>.
          </p>
        </div>
        <div className="firstmove" style={{marginTop: 18}}>
          <div className="kick">faixa B · ▶ é o que eu faço agora</div>
          <h3>Uma GDExtension mínima com o Jolt de verdade por trás</h3>
          <p>
            Um nó custom em C++ que carrega no editor e roda um{' '}
            <code>PhysicsSystem</code> do Jolt <b>próprio</b>, compilado por mim —
            não o módulo embutido do motor. Mínima de propósito: o valor não está
            no que ela simula, e sim em <b>provar que o caminho existe</b> e que
            eu alcanço as classes que o Godot não expõe, a começar pela{' '}
            <code>VehicleConstraint</code>.
          </p>
        </div>
      </section>

      {/* 02 · as duas faixas */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⇉</span>
          <h2>Duas faixas em paralelo</h2>
        </div>
        <p className="sec-sub">
          Os quatro pontos da reunião se agrupam em dois movimentos: primeiro medir
          o limite do Godot na prática, depois olhar o caminho que existe pra
          passar por cima dele.
        </p>
        <div className="cards">
          <div className="card amber">
            <div className="kind">pontos 1 &amp; 2 · 10–12 ago · ✔ concluída</div>
            <h3>Faixa A · Provar até onde o Godot vai</h3>
            <p>
              Rodar o Jolt de verdade, mapear o gap feature a feature e testar o
              limite do Godot na prática — replicando no editor o mesmo cenário
              que o sample roda em C++.
            </p>
            <p>
              <b>Resultado:</b> o gap tem nome e sobrenome. O{' '}
              <code>VehicleBody3D</code> não é a <code>VehicleConstraint</code>, e
              o módulo embutido não expõe nem ela, nem os{' '}
              <code>VehicleCollisionTester</code>, nem os controllers.
            </p>
          </div>
          <div className="card cyan">
            <div className="kind">pontos 3 &amp; 4 · 5–7 set · ▶ em execução</div>
            <h3>Faixa B · A ponte C++ pra além do Godot</h3>
            <p>
              <b>Construir</b> a ponte, não só ler sobre ela: montar o ambiente do{' '}
              <code>godot-cpp</code>, compilar uma extensão mínima, subir um mundo
              do Jolt próprio dentro dela e chegar na{' '}
              <code>VehicleConstraint</code> — a classe que a faixa A provou estar
              fora de alcance pelo caminho normal.
            </p>
            <p>
              O <b>GDChrono</b> do professor é o molde: ele já fez exatamente isso
              ligando o Godot ao Project Chrono.
            </p>
          </div>
        </div>
        <div className="callout">
          <span className="lbl">◈ o que mudou na reunião</span>
          <b>A faixa B trocou de natureza.</b> Ela nasceu como{' '}
          <em>ler a doc e mapear o paralelo</em> — leitura, sem código. O
          professor pediu o passo seguinte:{' '}
          <b>usar o GDExtension e C++ pra testar o Jolt de verdade</b>. Os pontos
          3 e 4 continuam os mesmos no conteúdo, mas agora terminam em binário
          compilado, não em anotação.
        </div>
      </section>

      {/* 03 · dia a dia */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◷</span>
          <h2>A sprint, dia a dia</h2>
        </div>
        <p className="sec-sub">
          Segunda a quarta na faixa A, a reunião de 17/ago no meio, e a faixa B
          retomada em 5/set com horizonte na segunda dia 7. Os três primeiros dias
          já aconteceram — ficam aqui como registro do que sustentou a virada.
        </p>

        <div className="spine">
          <div className="stop seam">
            <div className="code">SEG · 10 AGO · ponto 1, parte 1</div>
            <h3>Rodar um sample do Jolt</h3>
            <ol className="steps">
              <li>
                Clonar <code>github.com/jrouwe/JoltPhysics</code>.
              </li>
              <li>
                <b>Atalho sem build:</b> abrir a página de demos web
                (JoltPhysics.js) e passar o olho nos samples — em especial os de{' '}
                <b>Constraints</b> e <b>Vehicle</b> (veículo de esteira com{' '}
                <em>hinge</em>, moto).
              </li>
              <li>
                <b>Nativo:</b> compilar o app <code>Samples</code> (precisa de
                CMake 3.23+; no Windows é o caminho mais direto — usa DirectX; se
                der erro de GPU, ativar "Graphics Tools" nas features opcionais).
                Alternativa mínima: só a pasta <code>HelloWorld</code>.
              </li>
              <li>
                Controles: começa pausado (<b>P</b> despausa),{' '}
                <b>ESC → Select Test</b> / Run All Tests.
              </li>
              <li>
                <b>Escolher O sample-âncora da semana</b> — de preferência um de
                Constraints/Vehicle, que casa direto com o <em>hinge</em> do meu{' '}
                <code>teste_junta</code>.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> sem ver o Jolt rodando, o comparativo vira achismo.
              Fixar o sample <b>agora</b> trava o alvo do resto da semana.
            </p>
            <span className="doit">
              ↳ Jolt clonado + rodando + 1 sample escolhido
            </span>
          </div>

          <div className="stop">
            <div className="code">TER · 11 AGO · ponto 1, parte 2</div>
            <h3>Comparativo feature a feature</h3>
            <ol className="steps">
              <li>
                Pro sample escolhido, listar as features que ele usa: tipo de
                constraint, motor, limites, callbacks, integrador.
              </li>
              <li>
                Pra cada uma, responder: <b>o Jolt expõe?</b> · <b>o módulo Jolt
                embutido do Godot 4.6 expõe?</b> (ex.: <code>VehicleConstraint</code>{' '}
                — o Jolt tem, o Godot não expõe).
              </li>
              <li>
                Montar a tabela:{' '}
                <b>Feature | Jolt | Godot (módulo Jolt) | Observação</b>.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> é literalmente o comparativo formal que saiu da
              reunião — o entregável-âncora tomando forma.
            </p>
            <span className="doit">↳ Rascunho da tabela comparativa</span>
          </div>

          <div className="stop">
            <div className="code">QUA · 12 AGO · ponto 2</div>
            <h3>Replicar o sample no Godot</h3>
            <ol className="steps">
              <li>
                Cena isolada nova (na linha do meu <code>teste_junta.tscn</code>):
                reconstruir o mesmo cenário do sample com nós <code>Joint3D</code>{' '}
                (<code>HingeJoint3D</code> / <code>Generic6DOFJoint3D</code>).
              </li>
              <li>
                Medir: o que reproduz 1:1, o que só dá pra aproximar e{' '}
                <b>onde bate no limite</b> do achado de terça.
              </li>
              <li>Cada limite encontrado volta anotado pra tabela do comparativo.</li>
            </ol>
            <p>
              <b>Porquê:</b> fecha o par <b>achado teórico → prova prática</b>, e
              conecta direto com o <em>hinge</em> que eu já testei na quinzena
              passada.
            </p>
            <span className="doit">
              ↳ Cena Godot replicando o sample + limites anotados
            </span>
          </div>

          <div className="stop">
            <div className="code">QUI · 13 AGO · ponto 3 · estou aqui</div>
            <h3>Ler a doc do GDExtension</h3>
            <ol className="steps">
              <li>
                Ler a doc oficial do <b>godot-cpp</b> (docs.godotengine.org → C++ /
                "GDExtension C++ example") — foco no <b>conceito</b>, não em
                construir uma extensão de produção.
              </li>
              <li>
                Entender as peças: <b>ABI estável</b>, o arquivo{' '}
                <code>.gdextension</code>, <code>compatibility_minimum</code>,{' '}
                <code>godot-cpp</code> + <code>godot-cpp-template</code>.
              </li>
              <li>
                Anotar o essencial: o que é preciso pra{' '}
                <b>expor pro Godot algo que o motor não expõe</b> — é o caminho
                pra, um dia, alcançar a <code>VehicleConstraint</code> do Jolt.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> é a ponte que, no futuro, resolve o gap que o
              comparativo vai apontar. <b>Ler, não implementar.</b>
            </p>
            <span className="doit">↳ Notas de conceito do GDExtension</span>
          </div>

          <div className="stop">
            <div className="code">SEX · 14 AGO · ponto 4</div>
            <h3>Espelhar o GDChrono → Jolt</h3>
            <ol className="steps">
              <li>
                Estudar a GDExtension do professor (<b>GDChrono</b>): como ele liga
                o Godot ao Project Chrono — estrutura, o que expôs, como bindou as
                classes.
              </li>
              <li>
                Traçar o raciocínio equivalente pro Jolt: se fosse um "GDJolt",{' '}
                <b>que classe/constraint</b> eu precisaria expor pra fechar o gap
                do comparativo? (ex.: <code>VehicleConstraint</code>).
              </li>
              <li>
                Não construir — só mapear o paralelo. Mesmo espírito do ponto 2
                ("pegar um sample e replicar"), agora pela via da extensão.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> casa o ponto 2 (replicar) com o ponto 3
              (GDExtension), e mostra o caminho concreto usando um exemplo que{' '}
              <b>já existe dentro do meu grupo</b>.
            </p>
            <span className="doit">
              ↳ Esboço "GDChrono → GDJolt": o que eu espelharia
            </span>
          </div>

          <div className="stop">
            <div className="code">FDS · 15–16 AGO · leve, opcional</div>
            <h3>Consolidar as notas</h3>
            <ol className="steps">
              <li>
                Passar a tabela comparativa e as notas a limpo → rascunho de uma
                entrada nova no dossiê do Docusaurus.
              </li>
              <li>
                Escrever com minhas palavras, a partir do que levantei na semana.
              </li>
            </ol>
            <span className="doit">↳ Rascunho da entrada do dossiê</span>
          </div>

          <div className="stop">
            <div className="code">SEG · 17 AGO · ▲ reunião</div>
            <h3>Fechamento: o que eu levo</h3>
            <p>
              Os três entregáveis da semana chegam juntos — o comparativo é o que
              importa, os outros dois são a evidência que o sustenta.
            </p>
          </div>

          <div className="stop">
            <div className="code">18 → 24 AGO · consolidação</div>
            <h3>A faixa A vira documentação publicada</h3>
            <p>
              O material foi passado a limpo em duas entradas novas da frente
              multicorpo: o{' '}
              <a href={comparativoHref}>comparativo Jolt × Godot</a> e a leitura
              do código-fonte que destrincha a{' '}
              <a href={porDentroHref}>VehicleConstraint por dentro</a>. É de lá
              que sai o alvo da faixa B — <b>o nome exato da classe</b> que
              precisa ser alcançada.
            </p>
            <span className="doit">↳ Pontos 1 e 2 fechados e no ar</span>
          </div>

          <div className="stop seam">
            <div className="code">▲ REUNIÃO · a virada</div>
            <h3>A faixa B deixa de ser leitura</h3>
            <p>
              O combinado passou a ser <b>usar</b> o GDExtension e o C++ pra testar
              o Jolt. O ponto 3 vira <b>etapa de ambiente</b> (compilar de fato) e
              o ponto 4 vira <b>arquitetura</b> — o GDChrono deixa de ser
              curiosidade e vira o molde do que eu construo.
            </p>
            <p>
              <b>Consequência prática:</b> o clone em{' '}
              <code>~/Projects/JoltPhysics</code> deixa de ser material de leitura
              e vira <b>dependência de build</b> do meu projeto.
            </p>
          </div>

          <div className="stop">
            <div className="code">SÁB–DOM · 5–6 SET · etapas 0 e 1</div>
            <h3>Levantar o ambiente e ver um nó meu no editor</h3>
            <p>
              Sem física nenhuma ainda: instalar o <code>scons</code>, clonar o{' '}
              <code>godot-cpp</code> na branch da versão do editor, compilar o
              template e ver a classe aparecer na lista de nós. É a prova de que a
              ponte existe <b>antes</b> de ter o que passar por ela.
            </p>
            <span className="doit">↳ Extensão "vazia" carregando no Godot</span>
          </div>

          <div className="stop final">
            <div className="code">SEG · 7 SET · ▲ checkpoint · ✔ fechado</div>
            <h3>Onde eu cheguei</h3>
            <p>
              As cinco etapas saíram: extensão carregando no editor, o Jolt
              compilando e rodando fora do Godot, e o nó{' '}
              <code>JoltVehicle</code> com a <code>VehicleConstraint</code>{' '}
              dirigível dentro da cena. Está tudo em{' '}
              <a href={ponteHref}>Dois mundos, uma cena</a>, com vídeo.
            </p>
            <p>
              <b>O bloqueio caiu:</b> o <b>GDChrono</b> chegou e foi lido. A
              decisão de arquitetura que eu tinha tomado sozinha <b>bate com a do
              professor</b> — mundo de física próprio, o mesmo formato de nó — e
              rendeu três pontos a copiar, além de mostrar o rover{' '}
              <b>Viper</b> sobre terreno <b>SCM</b> já rodando no código dele.
            </p>
          </div>
        </div>
      </section>

      {/* 04 · faixa B em etapas */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⌁</span>
          <h2>Faixa B · o plano de execução</h2>
        </div>
        <p className="sec-sub">
          Cinco etapas, em ordem de dependência: cada uma só faz sentido se a
          anterior fechou. As três primeiras cabem no fim de semana; a 3 é o que
          eu levo pra conversa; a 4 é o entregável do ciclo seguinte.
        </p>

        <div className="spine">
          <div className="stop seam">
            <div className="code">ETAPA 0 · ponto 3 · começa agora</div>
            <h3>O ambiente de build</h3>
            <ol className="steps">
              <li>
                Instalar o <code>scons</code> — a máquina já tem{' '}
                <code>g++</code> e <code>python3</code>; falta ele e, pro Jolt, o{' '}
                <code>cmake</code>.
              </li>
              <li>
                Clonar <code>godotengine/godot-cpp</code> na branch que casa com a
                versão do editor — os projetos aqui estão em <b>Godot 4.7</b>.
              </li>
              <li>
                Compilar em debug (<code>scons platform=linux
                target=template_debug</code>) e conferir que o binário saiu.
              </li>
              <li>
                Partir do <code>godot-cpp-template</code>, apontar o arquivo{' '}
                <code>.gdextension</code> pro binário e abrir o projeto no editor.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> é o único passo que, se falhar, invalida todos os
              outros. Erro aqui quase sempre é <b>versão do godot-cpp × versão do
              editor</b> — vale conferir isso antes de culpar o código.
            </p>
            <span className="doit">
              ↳ Binário compilado + .gdextension carregando sem erro no console
            </span>
          </div>

          <div className="stop">
            <div className="code">ETAPA 1 · ponto 3</div>
            <h3>Um nó que só existe</h3>
            <ol className="steps">
              <li>
                Declarar uma classe <code>JoltProbe</code> herdando de{' '}
                <code>Node3D</code>, com a macro <code>GDCLASS</code>, e registrá-la
                com <code>GDREGISTER_CLASS</code>.
              </li>
              <li>
                Em <code>_bind_methods()</code>, expor um método e uma propriedade —
                e ver essa propriedade aparecer no <b>Inspector</b>.
              </li>
              <li>
                Implementar <code>_physics_process</code> imprimindo o{' '}
                <code>delta</code>: confirma que o Godot chama o <b>meu C++</b> a
                cada passo de física.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> as peças do GDExtension (<code>.gdextension</code>,{' '}
              <code>compatibility_minimum</code>, registro de classe, binding de
              métodos) só ficam claras quando o Inspector responde. É a leitura do
              ponto 3, só que verificada.
            </p>
            <span className="doit">
              ↳ Nó custom na lista "Create New Node", com propriedade editável
            </span>
          </div>

          <div className="stop">
            <div className="code">ETAPA 2 · o teste que o professor pediu</div>
            <h3>Jolt puro, sem o Godot no caminho</h3>
            <ol className="steps">
              <li>
                Compilar o <code>HelloWorld/HelloWorld.cpp</code> do clone (CMake) —
                valida a biblioteca sozinha, sem nenhuma ponte envolvida.
              </li>
              <li>
                Trocar a esfera caindo por um <code>VehicleConstraint</code> de
                quatro rodas: <code>WheeledVehicleController</code> +{' '}
                <code>VehicleCollisionTesterRay</code> em chão plano. O gabarito é{' '}
                <code>Samples/Tests/Vehicle/VehicleConstraintTest.cpp</code>.
              </li>
              <li>
                Rodar N passos e imprimir, por roda: <code>mSuspensionLength</code>,
                o impulso de suspensão e o impulso lateral.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> isola o problema. Se mais adiante a extensão der
              errado, eu já sei se o Jolt sozinho estava certo. E é a primeira vez
              que eu <b>escrevo</b> a <code>VehicleConstraint</code> em vez de só
              ler o header dela.
            </p>
            <span className="doit">
              ↳ Telemetria das quatro rodas no terminal, sem Godot envolvido
            </span>
          </div>

          <div className="stop">
            <div className="code">ETAPA 3 · ponto 4 · o que eu levo</div>
            <h3>A decisão de arquitetura</h3>
            <ol className="steps">
              <li>
                Escrever a escolha entre os dois desenhos (tabela abaixo) e o porquê
                — com a evidência da faixa A sustentando o descarte.
              </li>
              <li>
                Anotar as consequências: as <b>flags de compilação do Jolt precisam
                bater</b> entre a lib e a extensão (senão a ABI quebra em silêncio),
                o passo tem que ser fixo, e é preciso definir quem é dono do estado.
              </li>
              <li>
                <b>Pedir o GDChrono ao professor</b> e comparar a minha escolha com a
                que ele já fez.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> é o ponto 4 na sua forma útil. Não é mais "espelhar o
              raciocínio": é decidir o desenho do meu projeto tendo o dele como
              referência.
            </p>
            <span className="doit">
              ↳ Página de decisão publicada + pedido do GDChrono enviado
            </span>
          </div>

          <div className="stop final">
            <div className="code">ETAPA 4 · o entregável do próximo ciclo</div>
            <h3>Juntar as duas metades</h3>
            <ol className="steps">
              <li>
                Um nó <code>JoltVehicle</code> que chama{' '}
                <code>PhysicsSystem::Update</code> com passo fixo dentro do{' '}
                <code>_physics_process</code>.
              </li>
              <li>
                Copiar as transforms do corpo e das quatro rodas pros{' '}
                <code>MeshInstance3D</code> da cena — o Godot só desenha.
              </li>
              <li>
                Ligar o input do Godot em{' '}
                <code>SetDriverInput(forward, right, brake, handBrake)</code>.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> é a prova visual de que a ponte fechou o vão que o
              comparativo apontou — o veículo do Jolt rodando dentro do Godot,{' '}
              <b>com a suspensão que o <code>VehicleBody3D</code> não dá</b>.
            </p>
            <span className="doit">
              ↳ Cena no Godot dirigida pela física do Jolt compilada por mim
            </span>
          </div>
        </div>

        <div className="tbl cyan">
          <div className="cap">os dois desenhos possíveis · o que cada um implica</div>
          <div className="trow">
            <div className="a">A · mundo Jolt próprio</div>
            <div className="b">
              A extensão compila e roda o <b>seu</b> <code>PhysicsSystem</code>; o
              Godot vira renderizador e input. Acesso total à{' '}
              <code>VehicleConstraint</code> e aos testers. <b>É o caminho.</b>
            </div>
          </div>
          <div className="trow">
            <div className="a">B · alcançar o Jolt embutido</div>
            <div className="b">
              Reaproveitaria o mundo do motor, mas o módulo <b>não expõe os
              símbolos</b> — descartado com evidência levantada na faixa A.
            </div>
          </div>
          <div className="trow seam">
            <div className="a">o que A custa</div>
            <div className="b">
              O Jolt vira <b>dependência de build</b>; passam a existir dois mundos
              pra sincronizar (física minha, cena do Godot) e o passo precisa ser
              fixo pra não dessincronizar.
            </div>
          </div>
        </div>

        <div className="qbox">
          <h3>O que o GDChrono respondeu — e o que sobrou</h3>
          <ul>
            <li>
              <b>Respondido:</b> a arquitetura. O professor também roda um mundo
              de física <b>próprio</b> dentro da extensão, com o mesmo formato de
              nó. A escolha da etapa 3 estava certa.
            </li>
            <li>
              <b>Respondido de graça:</b> onde isso chega. O código dele já tem o
              rover <b>Viper</b> articulado sobre <b>SCMTerrain</b> deformável —
              o destino das frentes de roda–solo e validação, em código legível.
            </li>
            <li>
              <b>Ainda em aberto:</b> se vale migrar o build todo para CMake, como
              ele fez — na estrutura dele o problema de paridade de ABI{' '}
              <b>não existe</b>, em vez de ser administrado.
            </li>
            <li>
              <b>Ainda em aberto:</b> quando saltar do veículo de um corpo para o{' '}
              <b>rover articulado</b>. Agora dá pra fazer a pergunta com o exemplo
              dele na mão.
            </li>
          </ul>
        </div>
      </section>

      {/* 05 · entregáveis */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">↹</span>
          <h2>O que sai desta sprint</h2>
        </div>
        <div className="deliver">
          <h3>Pra reunião de 17 de agosto · ✔ entregue</h3>
          <ul>
            <li>
              <b>Comparativo formal Jolt × Godot</b> — a decisão arquitetural
              fundamentada feature a feature{' '}
              <em>(o entregável-âncora da faixa A)</em>.
            </li>
            <li>
              <b>Cena Godot replicando o sample</b> — com os limites do módulo Jolt
              anotados onde eu bati na parede.
            </li>
            <li>
              <b>Três entradas publicadas</b> na frente multicorpo, incluindo a
              leitura do código-fonte da <code>VehicleConstraint</code>.
            </li>
          </ul>
        </div>
        <div className="deliver" style={{marginTop: 18}}>
          <h3>Pra segunda, 7 de setembro · em execução</h3>
          <ul>
            <li>
              <b>GDExtension mínima carregando no editor</b> — nó custom em C++
              com propriedade no Inspector <em>(etapas 0 e 1)</em>.
            </li>
            <li>
              <b>Jolt compilado fora do Godot</b> rodando um{' '}
              <code>VehicleConstraint</code> de quatro rodas, com telemetria no
              terminal <em>(etapa 2)</em>.
            </li>
            <li>
              <b>A decisão de arquitetura escrita</b> — mundo Jolt próprio, com as
              consequências de build anotadas <em>(etapa 3)</em>.
            </li>
            <li>
              <b>O pedido do GDChrono</b> feito ao professor — o item bloqueante,
              que sai primeiro.
            </li>
          </ul>
        </div>
      </section>

      {/* 06 · trava de escopo */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⚠</span>
          <h2>Na faixa B eu NÃO vou</h2>
        </div>
        <div className="rm-guard">
          <span className="lbl">✕ trava de escopo</span>
          <p className="sub">
            Construir, sim — mas <b>o mínimo que prova o caminho</b>. A extensão
            existe pra demonstrar acesso, não pra virar produto.
          </p>
          <ul>
            <li>Montar o rover articulado em multicorpo</li>
            <li>Mexer em powertrain, suspensão ou terreno deformável</li>
            <li>
              Empacotar a extensão pra <b>produção</b> — multiplataforma, CI,
              release
            </li>
            <li>
              Reescrever a <code>VehicleConstraint</code> (usar a do Jolt, não
              refazer)
            </li>
            <li>Trocar ou aposentar o protótipo raycast</li>
          </ul>
        </div>
        <div className="callout">
          <span className="lbl">◈ modo da faixa B</span>
          <b>Construtivo, mas mínimo.</b> A pergunta que fecha cada etapa é sempre
          a mesma: <em>compilou e carregou?</em> Se compilou, seguir; se não,
          o problema é quase sempre <b>versão</b> ou <b>flag de build</b>, não
          lógica.
        </div>
      </section>

      {/* 07 · de onde eu parto */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◉</span>
          <h2>De onde eu parto</h2>
        </div>
        <div className="flip">
          <span className="lbl">◈ o que a quinzena anterior já entregou</span>
          <p>
            O arco conceitual está fechado e publicado em{' '}
            <a href={quinzenaHref}>
              Constraints, juntas e o Jolt por dentro
            </a>
            : penalidade × constraint, a tabela de GDL das juntas do Godot, o
            experimento <code>TesteJunta</code> com <code>HingeJoint3D</code> e o
            levantamento das lacunas do módulo Jolt embutido.
          </p>
          <p>
            Ou seja: <b>eu já sabia qual era o gap no papel</b>. A faixa A provou
            esse gap rodando o Jolt de verdade e o transformou numa tabela. A faixa
            B é o passo seguinte — <b>atravessar</b> o gap, em vez de continuar
            medindo ele.
          </p>
        </div>
      </section>

      {/* 08 · referências */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">↗</span>
          <h2>O que abrir</h2>
        </div>
        <div className="res">
          <a href="https://github.com/jrouwe/JoltPhysics" target="_blank" rel="noopener noreferrer">
            <span className="rt">
              Jolt Physics — repo do jrouwe
              <span className="rd">
                Samples, Constraints, Vehicle e o doc de arquitetura
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Docs/Samples.md"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              Docs/Samples.md — catálogo de demonstrações
              <span className="rd">
                de onde sai o sample-âncora (Constraints e Vehicles)
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a href="https://jrouwe.github.io/JoltPhysics.js/" target="_blank" rel="noopener noreferrer">
            <span className="rt">
              JoltPhysics.js — demos no navegador
              <span className="rd">o atalho sem build pra ver os samples rodando</span>
            </span>
            <span className="rk">↗ web demo</span>
          </a>
          <a
            href="https://docs.godotengine.org/en/stable/tutorials/scripting/gdextension/index.html"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              GDExtension — documentação oficial
              <span className="rd">godot-cpp, .gdextension e a ABI estável (ponto 3)</span>
            </span>
            <span className="rk">↗ godot docs</span>
          </a>
          <a href="https://github.com/godotengine/godot-cpp" target="_blank" rel="noopener noreferrer">
            <span className="rt">
              godot-cpp — os bindings C++
              <span className="rd">
                etapa 0: clonar na branch que casa com a versão do editor
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/godotengine/godot-cpp-template"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              godot-cpp-template — esqueleto pronto
              <span className="rd">
                etapa 1: de onde sai o primeiro nó custom sem montar tudo à mão
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Samples/Tests/Vehicle/VehicleConstraintTest.cpp"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              VehicleConstraintTest.cpp — o gabarito
              <span className="rd">
                etapa 2: como montar um VehicleConstraint de quatro rodas em código
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a href="https://github.com/godot-jolt/godot-jolt" target="_blank" rel="noopener noreferrer">
            <span className="rt">
              godot-jolt — uma GDExtension de física que já existe
              <span className="rd">
                referência de estrutura: como alguém já empacotou o Jolt pro Godot
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
        </div>
      </section>
    </div>
  );
}
