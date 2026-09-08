import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Roadmap da semana 14–21/set/2026 · Quanto de física cabe num quadro.
 * Nasce de uma ideia do Heitor depois de ler o GDChrono: se o professor usa
 * passo de 0,5 ms para dar conta de solo deformável, quanto cálculo dá para
 * espremer num quadro do Jolt antes de perder tempo real? A semana transforma
 * essa pergunta numa medição — uma curva de custo × fidelidade — e investiga
 * o que "solo deformável" pode significar dentro do Jolt, que não tem
 * terramecânica.
 *
 * Entregável-âncora: a curva do orçamento do quadro.
 * Portado para a estética do site reutilizando src/css/roadmap.css (`.roadmap`).
 */
export default function RoadmapOrcamentoFisica() {
  const ponteHref = useBaseUrl('/docs/multicorpo/ponte-gdextension');
  const gdchronoHref = useBaseUrl('/docs/multicorpo/gdchrono-comparado');
  const porDentroHref = useBaseUrl('/docs/multicorpo/vehicleconstraint-por-dentro');
  const rodaSoloHref = useBaseUrl('/docs/roda-solo/visao-geral');

  return (
    <div className="roadmap">
      {/* hero */}
      <header className="rm-hero">
        <div className="countdown">
          <span className="big">16,7 ms</span>
          <span className="sep mono">·······</span>
          <span className="goal">O ORÇAMENTO DE UM QUADRO</span>
        </div>
        <span className="eyebrow">Semana · 14 → 21 set</span>
        <h1>
          Quanto de física <span className="accent">cabe num quadro</span>
        </h1>
        <p className="lede">
          A leitura do <a href={gdchronoHref}>GDChrono</a> deixou uma pergunta
          incômoda: o professor usa passo de <b>0,5 ms</b> — 33 vezes menor que o
          meu — porque solo deformável exige isso para convergir. Eu herdei o
          passo do Godot <b>por omissão</b>, não por escolha.
        </p>
        <p className="lede">
          Esta semana transforma isso em medição. Cada quadro tem{' '}
          <b>16,7 milissegundos</b> de orçamento. A pergunta é:{' '}
          <b>quanto cálculo de física cabe ali dentro</b>, e a partir de que ponto
          gastar mais deixa de melhorar o resultado?
        </p>
      </header>

      {/* 01 · entregável-âncora */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">★</span>
          <h2>O entregável-âncora</h2>
        </div>
        <div className="firstmove">
          <div className="kick">tudo nesta semana existe pra sustentar isto</div>
          <h3>A curva custo × fidelidade</h3>
          <p>
            Um gráfico, ou uma tabela, respondendo com número:{' '}
            <b>quantos sub-passos e quantas iterações do solver</b> cabem em 16,7
            ms, e <b>a partir de onde o resultado para de mudar</b>. Não é
            opinião sobre "o que é mais realista": é a fronteira medida entre o
            que melhora a simulação e o que só queima processador.
          </p>
          <p>
            Com essa curva na mão, escolher o passo deixa de ser herança e passa a
            ser decisão — que foi exatamente a lição que a leitura do GDChrono
            entregou.
          </p>
        </div>
      </section>

      {/* 02 · as duas faixas */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⇉</span>
          <h2>Duas faixas</h2>
        </div>
        <p className="sec-sub">
          A primeira mede o que já existe. A segunda descobre o que o Jolt
          consegue fazer de terreno — e o que ele simplesmente não faz.
        </p>
        <div className="cards">
          <div className="card amber">
            <div className="kind">faixa A · seg a qua</div>
            <h3>O orçamento do quadro</h3>
            <p>
              Instrumentar o <code>vehicle_probe</code> para cronometrar cada
              passo, varrer os parâmetros de custo do Jolt e levantar a curva.
              Termina com um número por configuração, não com uma impressão.
            </p>
          </div>
          <div className="card cyan">
            <div className="kind">faixa B · qui e sex</div>
            <h3>O que "solo deformável" pode ser no Jolt</h3>
            <p>
              O Jolt permite <b>deformar a geometria</b> do terreno em tempo real,
              mas não tem <b>modelo de solo</b>. Separar essas duas coisas na
              prática, e medir quanto custa a parte que existe.
            </p>
          </div>
        </div>

        <div className="callout">
          <span className="lbl">◈ de onde veio a ideia</span>
          <b>A pergunta é minha, o gatilho foi o código do professor.</b> Ver{' '}
          <code>DoStepDynamics(5e-4)</code> ao lado de <code>SCMTerrain</code>{' '}
          deixou claro que passo curto e solo deformável andam juntos — e que eu
          nunca tinha testado o limite do meu lado.
        </div>
      </section>

      {/* 03 · faixa A */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◷</span>
          <h2>Faixa A · medir o orçamento</h2>
        </div>
        <p className="sec-sub">
          Quatro parâmetros controlam quanto o Jolt calcula por passo. Nenhum
          deles foi tocado até agora — todos estão no padrão.
        </p>

        <div className="tbl cyan">
          <div className="cap">os botões de custo · o que cada um compra</div>
          <div className="trow">
            <div className="a">sub-passos</div>
            <div className="b">
              Chamar <code>Update</code> várias vezes por quadro com{' '}
              <code>dt/N</code> · <b>o botão principal</b> · é o que aproxima do
              passo curto do professor
            </div>
          </div>
          <div className="trow">
            <div className="a">mNumVelocitySteps</div>
            <div className="b">
              Iterações do solver de velocidade · padrão <b>10</b> · quanto o
              solver insiste até as restrições fecharem
            </div>
          </div>
          <div className="trow">
            <div className="a">mNumPositionSteps</div>
            <div className="b">
              Iterações de correção de posição · padrão <b>2</b> · corrige
              penetração acumulada
            </div>
          </div>
          <div className="trow seam">
            <div className="a">colisão da roda</div>
            <div className="b">
              <code>SetNumStepsBetweenCollisionTestActive</code> · de quantos em
              quantos passos o <b>raycast</b> da roda é refeito — hoje todo passo
            </div>
          </div>
        </div>

        <div className="spine">
          <div className="stop seam">
            <div className="code">SEG · 14 SET</div>
            <h3>Instrumentar o medidor</h3>
            <ol className="steps">
              <li>
                Cronometrar cada <code>PhysicsSystem::Update</code> no{' '}
                <code>vehicle_probe</code> e reportar mínimo, mediana e máximo —
                a mediana engana quando o pico é o que estoura o quadro.
              </li>
              <li>
                Definir uma <b>manobra padrão</b> reproduzível: acelerar em reta,
                subir rampa, curva fechada. Sem isso não dá pra comparar
                configurações.
              </li>
              <li>
                Escolher as <b>métricas de fidelidade</b>: erro no impulso de
                suspensão contra m·g·Δt, penetração máxima da roda, e se o corpo
                treme parado.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> sem manobra fixa e métrica definida, a varredura
              vira coleção de números incomparáveis.
            </p>
            <span className="doit">↳ vehicle_probe cronometrado e repetível</span>
          </div>

          <div className="stop">
            <div className="code">TER · 15 SET</div>
            <h3>A varredura</h3>
            <ol className="steps">
              <li>
                Rodar a manobra padrão variando <b>um parâmetro por vez</b>:
                sub-passos 1, 2, 4, 8, 16, 32 — até chegar perto do 0,5 ms do
                professor (33 sub-passos).
              </li>
              <li>
                Repetir para as iterações do solver e para a frequência do
                raycast.
              </li>
              <li>
                Registrar, para cada configuração: <b>tempo por quadro</b> e as
                métricas de fidelidade.
              </li>
            </ol>
            <p>
              <b>A pergunta que fecha o dia:</b> onde está o joelho da curva — o
              ponto em que dobrar o custo para de melhorar o resultado?
            </p>
            <span className="doit">↳ tabela bruta da varredura</span>
          </div>

          <div className="stop">
            <div className="code">QUA · 16 SET</div>
            <h3>A curva e o teto</h3>
            <ol className="steps">
              <li>
                Transformar a tabela na <b>curva custo × fidelidade</b> e marcar
                onde os 16,7 ms estouram.
              </li>
              <li>
                Repetir com <b>vários veículos</b> na cena (1, 4, 16) — o
                orçamento é do quadro inteiro, não de um veículo.
              </li>
              <li>
                Anotar a configuração recomendada e <b>por quê</b>.
              </li>
            </ol>
            <span className="doit">↳ o entregável-âncora</span>
          </div>
        </div>
      </section>

      {/* 04 · faixa B */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⌁</span>
          <h2>Faixa B · o terreno</h2>
        </div>

        <div className="callout">
          <span className="lbl">⚠ a distinção que organiza a faixa</span>
          <b>Deformar a geometria não é modelar o solo.</b> O Jolt tem{' '}
          <code>HeightFieldShape::SetHeights()</code>, que permite <b>abrir o
          sulco</b> onde a roda passou, em tempo de execução. O que ele{' '}
          <b>não</b> tem é terramecânica: nenhum Bekker, nenhum Janosi, nenhuma
          força de resistência ao afundamento ou de cisalhamento. Essa parte
          existe no Chrono e teria que ser escrita à mão no Jolt.
        </div>

        <div className="spine">
          <div className="stop seam">
            <div className="code">QUI · 17 SET</div>
            <h3>Terreno de altura, e o sulco</h3>
            <ol className="steps">
              <li>
                Trocar o chão de caixa por um <code>HeightFieldShape</code> e
                confirmar que a suspensão responde ao relevo — a telemetria por
                roda deve deixar de ser simétrica.
              </li>
              <li>
                Deformar o terreno onde a roda tocou, usando{' '}
                <code>SetHeights</code> numa janela pequena ao redor do contato —
                a ideia de <b>domínio ativo</b> copiada do GDChrono.
              </li>
              <li>
                <b>Medir o custo</b> disso por quadro e somar ao orçamento da
                faixa A.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> responde, com número, se solo deformável geométrico é
              viável em tempo real no Jolt — antes de discutir modelo de solo.
            </p>
            <span className="doit">↳ sulco aparecendo + custo medido</span>
          </div>

          <div className="stop final">
            <div className="code">SEX · 18 SET</div>
            <h3>O que falta para ser terramecânica</h3>
            <ol className="steps">
              <li>
                Listar o que o <code>SCMTerrain</code> calcula e o Jolt não:
                pressão de afundamento, cisalhamento, acúmulo na borda.
              </li>
              <li>
                Estimar o que seria escrever isso à mão sobre o Jolt —{' '}
                <b>e se vale</b>, dado que o Chrono já entrega pronto.
              </li>
              <li>
                Escrever a comparação honesta para a frente de{' '}
                <a href={rodaSoloHref}>roda–solo</a>.
              </li>
            </ol>
            <p>
              <b>Esta é a pergunta estratégica da semana:</b> o rover em solo
              deformável é trabalho de Jolt, de Chrono, ou dos dois?
            </p>
            <span className="doit">↳ nota de decisão para a frente roda–solo</span>
          </div>
        </div>
      </section>

      {/* 05 · trava de escopo */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⚠</span>
          <h2>Esta semana eu NÃO vou</h2>
        </div>
        <div className="rm-guard">
          <span className="lbl">✕ trava de escopo</span>
          <p className="sub">
            A semana é de <b>medição</b>. Medir é o produto; construir é a
            tentação.
          </p>
          <ul>
            <li>
              Montar o rover articulado — <b>precisa</b> da refatoração da cena
              primeiro
            </li>
            <li>Migrar o build para CMake (decidido, mas não é esta semana)</li>
            <li>Escrever um modelo de terramecânica do zero</li>
            <li>Mexer em powertrain ou aposentar o protótipo raycast</li>
            <li>Otimizar o que ainda não foi medido</li>
          </ul>
        </div>
        <div className="callout">
          <span className="lbl">◈ modo da semana</span>
          <b>Experimental.</b> Toda afirmação da semana tem que vir com{' '}
          <em>o número ao lado</em>. Se não deu pra medir, não entra na conclusão.
        </div>
      </section>

      {/* 06 · perguntas */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">?</span>
          <h2>Perguntas para o professor</h2>
        </div>
        <div className="qbox">
          <h3>Sobre a semana</h3>
          <ul>
            <li>
              O <b>passo de 0,5 ms</b> do GDChrono foi escolhido por convergência
              do SCM, por estabilidade das juntas do Viper, ou empiricamente? Isso
              me diz o que eu deveria estar olhando na minha varredura.
            </li>
            <li>
              Para o objetivo do projeto, o rover precisa rodar em{' '}
              <b>tempo real</b> ou pode rodar mais devagar que o relógio? A
              resposta muda toda a leitura da curva.
            </li>
            <li>
              Faz sentido perseguir solo deformável <b>no Jolt</b>, sabendo que
              ele deforma a geometria mas não tem terramecânica — ou terreno
              deformável é território do Chrono e o Jolt fica com o veículo?
            </li>
          </ul>
        </div>
        <div className="qbox">
          <h3>Sobre o rumo</h3>
          <ul>
            <li>
              O alvo final é <b>uma</b> ponte ou <b>duas</b>? Faz sentido o
              projeto ter Jolt e Chrono lado a lado — um para tempo real, outro
              para fidelidade — ou é para convergir numa só?
            </li>
            <li>
              Posso usar o <b>Viper</b> como referência de rover articulado, ou o
              alvo é um rover específico da ExoTerra com geometria própria?
            </li>
            <li>
              O que conta como <b>validação</b> para o PIBIC: comparar o meu
              resultado contra o Chrono na mesma manobra, ou contra dado
              experimental?
            </li>
          </ul>
        </div>
      </section>

      {/* 07 · de onde parto */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◉</span>
          <h2>De onde eu parto</h2>
        </div>
        <div className="flip">
          <span className="lbl">◈ o que a sprint anterior entregou</span>
          <p>
            A ponte C++ está de pé e verificada — ver{' '}
            <a href={ponteHref}>Dois mundos, uma cena</a>. Tenho um{' '}
            <code>vehicle_probe</code> que roda o veículo sem Godot e imprime
            telemetria, o que torna esta semana quase só questão de instrumentar o
            que já existe.
          </p>
          <p>
            E tenho a <a href={porDentroHref}>leitura do código da
            VehicleConstraint</a>, que explica <b>o que</b> cada iteração do
            solver está resolvendo — sem isso, a varredura seria mexer em botões
            no escuro.
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
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/PhysicsSettings.h"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              PhysicsSettings.h
              <span className="rd">
                mNumVelocitySteps e mNumPositionSteps — os botões do solver
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Collision/Shape/HeightFieldShape.h"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              HeightFieldShape.h
              <span className="rd">
                SetHeights — deformar o terreno em tempo de execução
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Docs/Architecture.md"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              Docs/Architecture.md
              <span className="rd">
                a seção de simulação: sub-passos, colisão e determinismo
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/InteractiveDynamics/GdChrono"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              GdChrono — o molde
              <span className="rd">
                ChWorld.cpp: o passo de 0,5 ms, o SCMTerrain e os domínios ativos
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
        </div>
      </section>
    </div>
  );
}
