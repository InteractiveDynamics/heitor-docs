import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Roadmap da semana 14–21/set/2026 · O rover cabe no Jolt?
 *
 * Nasce de duas ideias do Heitor depois de ler o GDChrono: medir quanto cálculo
 * de física cabe num quadro (o passo de 0,5 ms do professor contra os 16,7 ms
 * herdados do Godot), e testar se dá para montar dinâmica multicorpo de verdade
 * com o Jolt — corpos e juntas, em vez do modelo lumped da VehicleConstraint.
 *
 * ATUALIZADO EM 10/set: a reunião de 8/set foi cancelada em definitivo, e sem
 * motivo para segurar trabalho a faixa B foi executada nos dias 9 e 10 — antes
 * da sprint começar. A pergunta do título está respondida e publicada em
 * docs/multicorpo/rocker-articulado. O entregável-âncora passou a ser o BOGIE,
 * que é o mecanismo que vence o limite exato que o ensaio encontrou: uma roda
 * rígida não sobe degrau maior que o próprio raio.
 * Reutiliza src/css/roadmap.css (escopo `.roadmap`).
 */
export default function RoadmapOrcamentoFisica() {
  const ponteHref = useBaseUrl('/docs/multicorpo/ponte-gdextension');
  const gdchronoHref = useBaseUrl('/docs/multicorpo/gdchrono-comparado');
  const porDentroHref = useBaseUrl('/docs/multicorpo/vehicleconstraint-por-dentro');
  const quinzenaHref = useBaseUrl('/docs/multicorpo/constraints-e-jolt');
  const rodaSoloHref = useBaseUrl('/docs/roda-solo/visao-geral');
  const rockerHref = useBaseUrl('/docs/multicorpo/rocker-articulado');

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
          O rover cabe <span className="accent">no Jolt</span>?
        </h1>
        <p className="lede">
          A entrada anterior fechou a ponte C++ e provou que o Jolt roda dentro do
          Godot. Mas o que roda hoje é um <b>veículo de um corpo só</b> — a{' '}
          <code>VehicleConstraint</code> é um modelo <em>lumped</em>, sem
          articulação nenhuma. Rover não é isso.
        </p>
        <p className="lede">
          A pergunta que decide o rumo do projeto era:{' '}
          <b>dá para montar dinâmica multicorpo de verdade com o Jolt — corpos e
          juntas — e ainda caber no orçamento de um quadro?</b> Ela foi respondida
          antes da sprint começar. O que a semana faz agora é ir <b>além</b> do
          limite que a resposta revelou.
        </p>

        <div className="callout amber" style={{marginTop: 22}}>
          <span className="lbl">◈ atualização de 10/set · a faixa B foi antecipada</span>
          A reunião de 8/set foi cancelada e não será remarcada. Sem motivo para
          segurar trabalho esperando por ela, a <b>faixa B foi executada nos dias
          9 e 10</b>, antes da sprint começar — e está publicada em{' '}
          <a href={rockerHref}>Sete corpos, seis juntas</a>.
          <br />
          <br />
          <b>A pergunta do título está respondida:</b> a plataforma articulada
          existe, mantém o chassi a <b>0,00°</b> onde o modelo de um corpo só
          inclina <b>4,34°</b>, e custa <b>4 %</b> do orçamento de um quadro.
          Boa parte da faixa A veio junto, de brinde. O que sobra para a sprint
          está reorganizado abaixo.
        </div>
      </header>

      {/* 01 · entregável-âncora */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">★</span>
          <h2>O entregável-âncora</h2>
        </div>
        <div className="firstmove">
          <div className="kick">faixa B · ✔ respondida em 9–10/set</div>
          <h3>O rover articulado cabe no Jolt — sim, e está medido</h3>
          <p>
            Sete corpos, seis juntas, motor no eixo de cada roda. Chassi a{' '}
            <b>0,00°</b> contra <b>4,34°</b> do modelo <em>lumped</em> no mesmo
            degrau, com <b>4 sub-passos</b> por quadro consumindo 4 % do
            orçamento. Publicado em{' '}
            <a href={rockerHref}>Sete corpos, seis juntas</a>.
          </p>
        </div>
        <div className="firstmove" style={{marginTop: 18}}>
          <div className="kick">o novo âncora · ▶ é o que falta</div>
          <h3>O bogie: vencer o degrau de 0,30 m</h3>
          <p>
            O ensaio encontrou um limite <b>exato</b>: o rocker de quatro rodas
            sobe degrau de 0,20 m e para em <b>0,30 m</b> — que é o raio da roda,
            o limite geométrico de uma roda rígida sem ajuda.
          </p>
          <p>
            <b>É precisamente esse limite que o bogie existe para vencer.</b> A
            perna dianteira é erguida sobre o obstáculo pela geometria do
            conjunto. O entregável tem número para bater: <b>subir um degrau que
            a montagem de quatro rodas não sobe</b>.
          </p>
        </div>
      </section>

      {/* 02 · as três faixas */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⇉</span>
          <h2>Três faixas, uma pergunta</h2>
        </div>
        <div className="cards">
          <div className="card cyan">
            <div className="kind">faixa B · ✔ feita em 9–10/set</div>
            <h3>Multicorpo de verdade</h3>
            <p>
              Plataforma articulada montada, medida e rodando no Godot. Trouxe
              junto duas descobertas: o modelo <em>lumped</em>{' '}
              <b>sobe degraus maiores que a própria roda</b> porque ignora a face
              do obstáculo, e o passo padrão do Jolt <b>erra 12 cm</b> nesta
              montagem.
            </p>
          </div>
          <div className="card amber">
            <div className="kind">faixa A · ~70 % adiantada</div>
            <h3>Quanto cabe num quadro</h3>
            <p>
              O cronômetro está no <code>vehicle_probe</code> e a curva do solver
              já foi levantada para a montagem articulada. <b>Falta</b> repetir
              com vários veículos na cena — o orçamento é do quadro inteiro, não
              de um veículo.
            </p>
          </div>
          <div className="card amber">
            <div className="kind">faixa C · intacta</div>
            <h3>O terreno</h3>
            <p>
              Chão de altura variável e deformação do sulco. Nada feito ainda, e
              agora com um motivo a mais: o obstáculo de face vertical mostrou que
              a forma do terreno importa.
            </p>
          </div>
        </div>

        <div className="callout">
          <span className="lbl">◈ o que a antecipação mudou</span>
          A sprint deixou de ser <b>três faixas espremidas em cinco dias</b> — que
          eu mesmo tinha admitido ser apertado — e virou{' '}
          <b>uma faixa nova com espaço</b>. O bogie é a continuação direta do
          limite medido, e as duas faixas restantes deixam de competir por tempo.
        </div>
      </section>

      {/* 03 · faixa A */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">◷</span>
          <h2>Faixa A · o orçamento do quadro</h2>
        </div>
        <p className="sec-sub">
          Quatro parâmetros controlam quanto o Jolt calcula por passo. Os três
          primeiros já foram varridos na montagem articulada — o resultado está em{' '}
          <a href={rockerHref}>Sete corpos, seis juntas</a>, e a conclusão é que a
          configuração recomendada é <b>4 sub-passos</b>. Falta repetir com{' '}
          <b>vários veículos na cena</b>: o orçamento é do quadro inteiro, não de
          um veículo.
        </p>

        <div className="tbl cyan">
          <div className="cap">os botões de custo · o que cada um compra</div>
          <div className="trow">
            <div className="a">sub-passos</div>
            <div className="b">
              Chamar <code>Update</code> várias vezes por quadro com{' '}
              <code>dt/N</code> · <b>o botão principal</b> · é o que aproxima do
              passo de 0,5 ms do professor
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
                Cronometrar cada <code>PhysicsSystem::Update</code> e reportar
                mínimo, mediana e <b>máximo</b> — o pico é o que estoura o quadro,
                não a média.
              </li>
              <li>
                Definir uma <b>manobra padrão</b> reproduzível: acelerar em reta,
                subir um degrau, curva fechada. Sem ela, nada é comparável.
              </li>
              <li>
                Fixar as <b>métricas de fidelidade</b>: erro no impulso de
                suspensão contra m·g·Δt, penetração máxima da roda, tremor do corpo
                parado.
              </li>
            </ol>
            <span className="doit">↳ vehicle_probe cronometrado e repetível</span>
          </div>

          <div className="stop">
            <div className="code">TER · 15 SET</div>
            <h3>A varredura e a curva</h3>
            <ol className="steps">
              <li>
                Variar <b>um parâmetro por vez</b>: sub-passos 1, 2, 4, 8, 16, 32 —
                até encostar no 0,5 ms do professor (33 sub-passos).
              </li>
              <li>
                Repetir para as iterações do solver e a frequência do raycast.
              </li>
              <li>
                Montar a curva e <b>marcar o joelho</b>: o ponto em que dobrar o
                custo para de melhorar o resultado. E marcar onde os 16,7 ms
                estouram.
              </li>
            </ol>
            <p>
              <b>Porquê:</b> a partir daqui, "quanto isso custa" tem resposta em
              número para qualquer coisa que eu adicionar depois.
            </p>
            <span className="doit">↳ curva custo × fidelidade</span>
          </div>
        </div>
      </section>

      {/* 04 · faixa B — feita, e a continuação */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⚙</span>
          <h2>Faixa B · feita — e o que ela abriu</h2>
        </div>
        <p className="sec-sub">
          Executada em 9–10/set. O relato completo, com as tabelas e os dois erros
          de projeto que o ensaio precisou corrigir antes de valer alguma coisa,
          está em <a href={rockerHref}>Sete corpos, seis juntas</a>.
        </p>

        <div className="deliv">
          <div className="drow">
            <span className="dn mono">a articulação funciona</span>
            <span className="dt">
              Sete corpos, seis juntas, motor no eixo de cada roda. No mesmo
              degrau, mesma velocidade e mesma massa: chassi a <b>0,00°</b> contra{' '}
              <b>4,34°</b> do modelo de um corpo só. Os braços giram <b>−4,1°</b> e
              absorvem o obstáculo inteiro.
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">o lumped trapaceia</span>
            <span className="dt">
              Ele "sobe" degraus de <b>0,50 m com rodas de 0,30 m</b> — porque a
              face vertical do degrau <b>não existe no modelo</b>. O raycast acha o
              topo e a fórmula puxa o veículo. Isso obriga a reler o que foi medido
              com ele sobre terreno acidentado.
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">o custo, medido</span>
            <span className="dt">
              A razão de massa (chassi 1200 kg em braços de 50 kg) deixa o solver
              padrão <b>12 cm abaixo</b> da altura correta. O joelho da curva está
              em <b>4 sub-passos</b>; mesmo 8 usam só <b>4 %</b> do quadro.
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">o limite encontrado</span>
            <span className="dt">
              O rocker de quatro rodas sobe 0,20 m e <b>para em 0,30 m</b> — o raio
              da roda. É o limite geométrico correto, e é o alvo da semana.
            </span>
          </div>
        </div>
      </section>

      {/* 05 · o bogie */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">★</span>
          <h2>O bogie · o entregável da sprint</h2>
        </div>
        <p className="sec-sub">
          Uma roda rígida sozinha não sobe degrau maior que o próprio raio. O
          rocker-bogie resolve isso com <b>geometria</b>: a perna dianteira é
          erguida sobre o obstáculo pelo conjunto, em vez de ter que escalá-lo.
        </p>

        <div className="callout">
          <span className="lbl">◈ por que este é o passo certo agora</span>
          Não é "mais rodas por ser mais bonito". O ensaio produziu um{' '}
          <b>número exato</b> — 0,30 m — e o bogie é o mecanismo cuja razão de
          existir é justamente vencer esse número. O critério de sucesso já está
          definido antes de começar: <b>subir um degrau que a montagem de quatro
          rodas não sobe</b>.
        </div>

        <div className="spine">
          <div className="stop seam">
            <div className="code">SEG · 14 SET</div>
            <h3>A geometria de seis rodas</h3>
            <ol className="steps">
              <li>
                Estender <code>src/rocker_rig.h</code>: cada rocker ganha, na
                ponta traseira, um <b>bogie</b> — um segundo braço articulado com
                duas rodas. Total: 11 corpos, 10 juntas.
              </li>
              <li>
                O <code>GroupFilterTable</code> e o filtro de auto-colisão já
                existem e escalam sozinhos; o header foi escrito com isso em mente.
              </li>
              <li>
                Ajustar o curso de cada junta. O curso errado trava o mecanismo
                antes dele trabalhar.
              </li>
            </ol>
            <span className="doit">↳ rocker-bogie montado e de pé</span>
          </div>

          <div className="stop final">
            <div className="code">TER · 15 SET</div>
            <h3>A varredura de degrau, de novo</h3>
            <ol className="steps">
              <li>
                Rodar a <b>mesma manobra padrão</b> nas três montagens — lumped,
                rocker de quatro, rocker-bogie de seis — varrendo o degrau de
                0,10 a 0,50 m.
              </li>
              <li>
                A tabela responde de uma vez: até onde cada uma sobe, e com quanta
                inclinação de chassi.
              </li>
              <li>
                Medir o custo por quadro das 11 peças e conferir se ainda cabe nos
                16,7 ms.
              </li>
            </ol>
            <p>
              <b>A pergunta que fecha:</b> o bogie passa dos 0,30 m? Se passar, o
              rover está a uma refatoração de distância. Se não passar, saber{' '}
              <b>por quê</b> vale igual.
            </p>
            <span className="doit">
              ↳ tabela das três montagens + vídeo do bogie subindo o que o rocker não sobe
            </span>
          </div>
        </div>
      </section>

      {/* 06 · faixa C — terreno */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⌁</span>
          <h2>Faixa C · o terreno, se sobrar tempo</h2>
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
          <div className="stop final">
            <div className="code">SEX · 18 SET</div>
            <h3>Relevo, sulco e o custo dos dois</h3>
            <ol className="steps">
              <li>
                Trocar o chão de caixa por um <code>HeightFieldShape</code> e
                confirmar que a suspensão responde ao relevo — a telemetria por
                roda deve deixar de ser simétrica.
              </li>
              <li>
                Deformar onde a roda tocou, com <code>SetHeights</code> numa janela
                pequena ao redor do contato — a ideia de <b>domínio ativo</b>{' '}
                copiada do <a href={gdchronoHref}>GDChrono</a>.
              </li>
              <li>
                <b>Medir o custo</b> por quadro e somar ao orçamento da faixa A.
              </li>
              <li>
                Listar o que o <code>SCMTerrain</code> calcula e o Jolt não, e
                estimar o que seria escrever isso à mão — <b>e se vale</b>, dado
                que o Chrono entrega pronto.
              </li>
            </ol>
            <span className="doit">
              ↳ sulco aparecendo, custo medido, nota de decisão para a frente{' '}
              <a href={rodaSoloHref}>roda–solo</a>
            </span>
          </div>
        </div>
      </section>

      {/* 06 · fechamento */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">↹</span>
          <h2>O que sai desta sprint</h2>
        </div>
        <div className="deliver">
          <h3>Já entregue · 9–10 set</h3>
          <ul>
            <li>
              <b>A plataforma articulada</b> rodando no terminal e no Godot, com a
              comparação contra o modelo de um corpo só.
            </li>
            <li>
              <b>A curva do solver</b> — o joelho em 4 sub-passos, e a constatação
              de que o padrão do Jolt erra 12 cm nesta montagem.
            </li>
            <li>
              <b>O limite geométrico medido</b> — 0,30 m, o raio da roda.
            </li>
            <li>
              <b>A entrada publicada</b>:{' '}
              <a href={rockerHref}>Sete corpos, seis juntas</a>.
            </li>
          </ul>
        </div>
        <div className="deliver" style={{marginTop: 18}}>
          <h3>Até terça, 15 de setembro</h3>
          <ul>
            <li>
              <b>O rocker-bogie de seis rodas</b> — 11 corpos, 10 juntas{' '}
              <em>(o entregável-âncora)</em>.
            </li>
            <li>
              <b>A tabela das três montagens</b> — até onde cada uma sobe, e com
              quanta inclinação.
            </li>
            <li>
              <b>O custo por quadro das 11 peças</b>, conferido contra os 16,7 ms.
            </li>
            <li>
              <b>Vídeo</b> do bogie subindo o degrau que o rocker de quatro não
              sobe.
            </li>
          </ul>
        </div>
      </section>

      {/* 07 · trava de escopo */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⚠</span>
          <h2>Esta semana eu NÃO vou</h2>
        </div>
        <div className="rm-guard">
          <span className="lbl">✕ trava de escopo</span>
          <p className="sub">
            <b>Um mecanismo, não um veículo.</b> O bogie existe para responder uma
            pergunta com número — não para virar o rover final.
          </p>
          <ul>
            <li>
              Modelar o rover da ExoTerra com geometria real — a montagem é
              genérica de propósito
            </li>
            <li>
              Refatorar a cena para nascer da física — agora há <b>duas</b>{' '}
              montagens, o que torna a abstração fácil, mas não é esta semana
            </li>
            <li>Migrar o build para CMake</li>
            <li>Escrever terramecânica do zero</li>
            <li>Recuperar o modelo de pneu perdido na troca</li>
          </ul>
        </div>
        <div className="callout">
          <span className="lbl">◈ modo da semana</span>
          <b>Experimental.</b> Toda afirmação tem que vir com{' '}
          <em>o número ao lado</em>. Se não deu pra medir, não entra na conclusão.
        </div>
      </section>

      {/* 08 · perguntas */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">?</span>
          <h2>Perguntas para o professor</h2>
        </div>
        <p className="sec-sub">
          Continuam abertas — a reunião de 8/set foi adiada. Duas delas a semana
          responde sozinha, e isso está marcado.
        </p>

        <div className="qbox">
          <h3>Sobre o rumo · as que só ele responde</h3>
          <ul>
            <li>
              O alvo é <b>uma</b> ponte ou <b>duas</b>? Faz sentido o projeto ter
              Jolt e Chrono lado a lado — um para tempo real, outro para fidelidade
              — ou é para convergir numa só?
            </li>
            <li>
              Posso usar o <b>Viper</b> como referência de rover articulado, ou o
              alvo é um rover da ExoTerra com geometria própria?
            </li>
            <li>
              O que conta como <b>validação</b> para o PIBIC: comparar contra o
              Chrono na mesma manobra, ou contra dado experimental?
            </li>
            <li>
              O rover precisa rodar em <b>tempo real</b>, ou pode rodar mais devagar
              que o relógio? Isso muda toda a leitura da curva da faixa A.
            </li>
          </ul>
        </div>

        <div className="qbox">
          <h3>Sobre o código dele</h3>
          <ul>
            <li>
              O <b>passo de 0,5 ms</b> do GDChrono foi escolhido por convergência do
              SCM, por estabilidade das juntas do Viper, ou empiricamente?
            </li>
            <li>
              Em <code>ChWorld.cpp</code>, o <code>SCMTerrain terrain(&amp;sys)</code>{' '}
              é variável local dentro do <code>Init()</code> — o terreno continua
              vivo depois que a função retorna?
            </li>
          </ul>
        </div>

        <div className="qbox">
          <h3>As que eu mesmo respondi</h3>
          <ul>
            <li>
              <b>Dá para montar multicorpo articulado no Jolt?</b> ✔ Sim — 7
              corpos, 6 juntas, chassi a 0,00° contra 4,34°.
            </li>
            <li>
              <b>Cabe no orçamento de um quadro?</b> ✔ Sim, com folga — 4 % em 4
              sub-passos, que é onde a curva para de melhorar.
            </li>
            <li>
              <b>Solo deformável é viável no Jolt em tempo real?</b> → ainda em
              aberto, faixa C.
            </li>
          </ul>
        </div>
      </section>

      {/* 09 · de onde parto */}
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
            telemetria, o que torna a faixa A quase só instrumentar o que já
            existe.
          </p>
          <p>
            E tenho as duas leituras que sustentam a faixa B: a{' '}
            <a href={porDentroHref}>mecânica interna da VehicleConstraint</a>, que
            explica por que ela não articula, e a{' '}
            <a href={quinzenaHref}>tabela de graus de liberdade das juntas</a>, que
            é exatamente o material para montar a perna.
          </p>
        </div>
      </section>

      {/* 10 · referências */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">↗</span>
          <h2>O que abrir</h2>
        </div>
        <div className="res">
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Samples/Tests/Vehicle/VehicleSixDOFTest.cpp"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              VehicleSixDOFTest.cpp — o gabarito da faixa B
              <span className="rd">
                veículo feito de corpos e juntas, com motor no eixo da roda
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Constraints/HingeConstraint.h"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rt">
              HingeConstraint.h
              <span className="rd">
                SetMotorState e SetTargetAngularVelocity — como se aciona um eixo
              </span>
            </span>
            <span className="rk">↗ github</span>
          </a>
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
