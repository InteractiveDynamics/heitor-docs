import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Doc técnica · Dinâmica multicorpo · Sessão de construção de 9–10/set/2026.
 * Sexta entrada da frente, e a primeira que MEDE em vez de descrever: monta a
 * plataforma articulada (7 corpos, 6 juntas) e a compara com a VehicleConstraint
 * de um corpo só, na mesma manobra.
 *
 * Fonte: o código em gdjolt/ (tools/vehicle_probe.cpp, src/rocker_rig.h,
 * src/jolt_rocker.cpp) e as execuções do banco de ensaio. Todas as tabelas
 * vieram de rodar, não de estimar.
 *
 * Renderiza sob `.dossie .tecnica .mcorpo`, sem CSS próprio.
 */
export default function DossieRockerArticulado() {
  const porDentroHref = useBaseUrl('/docs/multicorpo/vehicleconstraint-por-dentro');
  const ponteHref = useBaseUrl('/docs/multicorpo/ponte-gdextension');
  const gdchronoHref = useBaseUrl('/docs/multicorpo/gdchrono-comparado');
  const comparativoHref = useBaseUrl('/docs/multicorpo/jolt-vs-godot');
  const roadmapHref = useBaseUrl('/docs/roadmaps/semana-2026-09-14');

  return (
    <div className="dossie tecnica mcorpo">
      {/* faixa de telemetria */}
      <div className="telemetry-strip">
        <span>
          <span className="dot" />
          sessão · 9–10 set
        </span>
        <span>
          modo · <b>medição</b>
        </span>
        <span>
          montagem · <b>7 corpos · 6 juntas</b>
        </span>
        <span>
          código · <b>gdjolt/</b>
        </span>
        <span>
          estado · <b>articulação medida</b>
        </span>
      </div>

      {/* hero */}
      <header className="hero-block">
        <div className="eyebrow">Multicorpo de verdade · o ensaio</div>
        <h1>
          Sete corpos, <span className="accent">seis juntas</span>.
        </h1>
        <p className="lede">
          A entrada <a href={porDentroHref}>Um corpo só, quatro bengalas</a>{' '}
          terminou com uma afirmação que ficou sem prova: a{' '}
          <code>VehicleConstraint</code> é um modelo <em>lumped</em> e{' '}
          <strong>não é o rover</strong>. Esta entrada constrói a alternativa —
          corpos rígidos ligados por juntas, com motor no eixo de cada roda — e
          submete as duas montagens <strong>à mesma manobra</strong>, para trocar
          a afirmação por número.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>O resultado em uma linha:</b> passando pelo mesmo degrau, na mesma
          velocidade e com a mesma massa, o chassi articulado inclina{' '}
          <b>0,00°</b> e o de corpo único inclina <b>4,34°</b>. Mas o ensaio
          entregou duas coisas que não estavam no plano — uma delas obriga a
          reler tudo que foi medido com o modelo antigo.
        </div>

        <div className="hero-meta">
          <span>
            a ponte que tornou isto possível ·{' '}
            <a href={ponteHref}>Dois mundos, uma cena</a>
          </span>
          <span>
            plano · <a href={roadmapHref}>roadmap 14–21 set</a>
          </span>
        </div>
      </header>

      {/* 01 · o que muda */}
      <section>
        <div className="sec-head">
          <span className="sec-num">01</span>
          <h2>O que "articulado" quer dizer, concretamente</h2>
        </div>

        <div className="duo">
          <div className="facet">
            <h4>O que existia · lumped</h4>
            <p>
              <b>Um</b> corpo rígido e quatro conjuntos de números fingindo ser
              rodas. As rodas não têm massa, não têm forma e não colidem com
              nada: <code>mSteerAngle</code>, <code>mAngularVelocity</code> e{' '}
              <code>mAngle</code> são <code>float</code>.
            </p>
            <p>
              Um raio desce até o chão, mede, e uma fórmula devolve a força.
              Nenhuma peça mecânica existe.
            </p>
          </div>
          <div className="facet">
            <h4>O que foi construído · rocker</h4>
            <p>
              <b>Sete</b> corpos rígidos — chassi, dois braços, quatro rodas — e{' '}
              <b>seis juntas</b>. Cada roda é um cilindro com massa que colide
              com o chão de verdade.
            </p>
            <p>
              E <b>nenhuma mola</b>: quem absorve o degrau é a geometria, quando
              o braço gira. Esse é o princípio do rocker-bogie, e é impossível
              num bloco único porque não há o que girar.
            </p>
          </div>
        </div>

        <div className="code-block" style={{marginTop: 26}}>
          <div className="fname">gdjolt/src/rocker_rig.h · a montagem</div>
          <pre>
            <code>{`chassi
 ├─ Hinge (curso ±30°) ──→ braço esq ─┬─ Hinge + motor → roda 0
 │                                    └─ Hinge + motor → roda 1
 └─ Hinge (curso ±30°) ──→ braço dir ─┬─ Hinge + motor → roda 2
                                      └─ Hinge + motor → roda 3`}</code>
          </pre>
        </div>

        <p className="sec-intro" style={{marginTop: 26}}>
          O detalhe que mais importa está no <b>motor na junta</b>. Em vez de
          empurrar o corpo para a frente — que é o atalho —, o código manda{' '}
          <b>o eixo girar</b>:{' '}
          <code>SetMotorState(EMotorState::Velocity)</code> e{' '}
          <code>SetTargetAngularVelocity(v / raio)</code>. A roda gira, o atrito
          com o chão faz o conjunto andar. É como um veículo anda de verdade: o
          motor não empurra o carro, ele gira o eixo.
        </p>

        <div className="callout amber" style={{marginTop: 22}}>
          <b>Uma armadilha que teria custado um dia:</b> o atrito padrão de corpo
          no Jolt é <code>0.2</code> (<code>BodyCreationSettings.h:107</code>).
          Com esse valor a roda acionada por motor <b>patina em vez de andar</b>.
          Foi elevado a <code>1.0</code> em roda e chão, e isso virou parâmetro
          declarado do experimento — não detalhe escondido.
        </div>
      </section>

      {/* 02 · o banco de ensaio */}
      <section>
        <div className="sec-head">
          <span className="sec-num">02</span>
          <h2>O banco de ensaio, e as duas vezes que ele estava errado</h2>
        </div>
        <p className="sec-intro">
          O <code>vehicle_probe</code>, que antes rodava um veículo só, virou um
          banco capaz de montar <b>as duas plataformas</b> e submeter as duas à{' '}
          <b>mesma manobra</b>: acelerar em reta contra um degrau. Mesma massa
          (1500 kg), mesma bitola, mesmo raio de roda, mesma velocidade.
        </p>
        <p>
          Essa parte — igualar as condições — é o trabalho de verdade da semana,
          e ela precisou de duas correções antes de produzir um número em que dê
          para acreditar.
        </p>

        <div className="bug">
          <div className="symptom">
            <h4>Erro 1 · as velocidades não batiam</h4>
            <p>
              Na primeira rodada o lumped percorreu <b>79 m</b> e o rocker{' '}
              <b>9,6 m</b> no mesmo tempo — 19 m/s contra 1,8 m/s. Comparar
              inclinação assim mede a <b>velocidade</b>, não o mecanismo.
            </p>
          </div>
          <div className="cause">
            <h4>Correção</h4>
            <p>
              Velocidade-alvo comum de <b>1,5 m/s</b>. O rocker deriva a rotação
              do eixo de <code>ω = v/r</code>; o lumped ganhou um acelerador
              proporcional, porque o <code>WheeledVehicleController</code> tem
              curva de torque própria e dispara se receber <code>1.0</code> fixo.
            </p>
          </div>
        </div>

        <div className="bug" style={{marginTop: 18}}>
          <div className="symptom">
            <h4>Erro 2 · o chassi era um pêndulo invertido</h4>
            <p>
              O chassi ficava com <b>10° de inclinação permanente</b>, até parado
              em chão plano. Sem explicação física.
            </p>
          </div>
          <div className="cause">
            <h4>Causa</h4>
            <p>
              As duas juntas dos braços são <b>coaxiais em X</b>, e eu as tinha
              posto <b>abaixo</b> do centro de massa do chassi. O chassi ficava
              equilibrado sobre elas como uma vassoura na palma da mão — não há
              nada segurando a inclinação, e ela cresce sozinha. O pivô subiu
              para a altura do centro de massa e os 10° sumiram.
            </p>
          </div>
        </div>

        <div className="callout" style={{marginTop: 22}}>
          <b>Por que registrar os dois erros:</b> os dois produziam tabelas de
          aparência perfeitamente respeitável. Se a primeira rodada tivesse sido
          publicada, o número estaria errado e nada denunciaria. O produto da
          semana não é a montagem — é a <b>desconfiança dos dois primeiros
          resultados</b>.
        </div>
      </section>

      {/* 03 · resultado 1 */}
      <section>
        <div className="sec-head">
          <span className="sec-num">03</span>
          <h2>Resultado 1 · a articulação funciona</h2>
        </div>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Degrau de 0,20 m · mesma velocidade, mesma massa</th>
                <th>lumped</th>
                <th>rocker</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Inclinação do chassi <b>no obstáculo</b></td>
                <td className="mono">4,34°</td>
                <td className="mono">
                  <b className="yes">0,00°</b>
                </td>
              </tr>
              <tr>
                <td>Inclinação máxima na manobra inteira</td>
                <td className="mono">4,43°</td>
                <td className="mono">0,10°</td>
              </tr>
              <tr>
                <td>Altura final do chassi</td>
                <td className="mono">1,044</td>
                <td className="mono">0,850</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{marginTop: 22}}>
          E o mecanismo aparece na telemetria: quando a roda dianteira encontra o
          degrau, os braços giram <b>−4,1°</b> e o chassi <b>não se mexe</b>. O
          braço absorveu o obstáculo inteiro. Conferindo do outro lado, a roda
          dianteira termina em <code>y = 0,500</code> — que é exatamente o raio
          (0,30) mais o degrau (0,20): ela está <b>em cima</b> do degrau,
          enquanto o chassi seguiu nivelado.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>A verificação que fecha:</b> a montagem vive num header
          compartilhado entre o banco de ensaio e o nó do Godot, de propósito —
          duas cópias divergiriam sem ninguém notar. O terminal mede{' '}
          <b>0,10°</b> e <code>z = 8,50</code>; o Godot mede <b>0,10°</b> e{' '}
          <code>z = 8,47</code>. É a mesma física rodando nos dois lugares.
        </div>
      </section>

      {/* 04 · a reviravolta */}
      <section>
        <div className="sec-head">
          <span className="sec-num">04</span>
          <h2>Resultado 2 · o modelo antigo estava trapaceando</h2>
        </div>
        <p className="sec-intro">
          Varrendo a altura do degrau, o resultado parece se inverter — e é aqui
          que o ensaio entrega mais do que prometia.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Degrau</th>
                <th>lumped</th>
                <th>rocker</th>
                <th>incl. do lumped</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">0,10 m</td>
                <td><b className="yes">sobe</b></td>
                <td><b className="yes">sobe</b></td>
                <td className="mono">2,23°</td>
              </tr>
              <tr>
                <td className="mono">0,20 m</td>
                <td><b className="yes">sobe</b></td>
                <td><b className="yes">sobe</b></td>
                <td className="mono">4,34°</td>
              </tr>
              <tr>
                <td className="mono">0,30 m</td>
                <td><b className="yes">sobe</b></td>
                <td><b className="no">não sobe</b></td>
                <td className="mono">6,45°</td>
              </tr>
              <tr>
                <td className="mono">0,50 m</td>
                <td><b className="yes">sobe</b></td>
                <td><b className="no">não sobe</b></td>
                <td className="mono">10,78°</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{marginTop: 22}}>
          À primeira vista o lumped ganha. Só que a roda tem <b>0,30 m de
          raio</b> — e ele está subindo um degrau de <b>0,50 m</b>. Isso é
          fisicamente impossível: é um carro de passeio subindo um meio-fio na
          altura do capô.
        </p>

        <div className="code-block" style={{marginTop: 22}}>
          <div className="fname">
            vehicle_probe --rig=lumped --step-height=0.50 · a batota em flagrante
          </div>
          <pre>
            <code>{`passo |   z    | altura | incl.° | susp0  susp1  susp2  susp3
  180 |   3.70 |  0.844 |   0.00 |  0.364  0.364  0.364  0.364
  210 |   4.61 |  0.984 |   8.24 |  0.160  0.160  0.319  0.319   ← salta
  240 |   5.51 |  1.090 |  10.70 |  0.385  0.385  0.365  0.365
  330 |   8.15 |  1.356 |   0.00 |  0.377  0.377  0.376  0.376   ← em cima`}</code>
          </pre>
        </div>

        <p style={{marginTop: 22}}>
          A suspensão dianteira comprime de <code>0,364</code> para{' '}
          <code>0,160</code> de repente e o chassi salta —{' '}
          <b>sem a roda nunca encostar na parede do degrau</b>. O motivo já
          estava descrito em <a href={porDentroHref}>Um corpo só, quatro
          bengalas</a>, mas agora está medido: naquele modelo a roda não existe,
          existe um <b>raio apontado para baixo</b>. Quando o raio passa da quina,
          encontra o topo, e a fórmula puxa o veículo para lá.{' '}
          <b>A parede vertical do degrau não está no modelo</b> — e a caixa do
          chassi passa por cima dela porque está mais alta.
        </p>
        <p>
          O rocker falha em <b>0,30 m — exatamente o raio da roda</b>, que é o
          limite geométrico correto de uma roda rígida sem ajuda.
        </p>

        <div className="callout coral" style={{marginTop: 22}}>
          <b>A leitura certa da tabela:</b> o articulado não é pior — ele é{' '}
          <b>o único dos dois que obedece a geometria</b>. O outro não vence por
          ser capaz, e sim por não representar o obstáculo. Isso obriga a reler
          qualquer conclusão anterior tirada do modelo <em>lumped</em> sobre
          terreno acidentado: ele descreve <b>altura de terreno</b>, não{' '}
          <b>forma de obstáculo</b>.
        </div>
      </section>

      {/* 05 · o solver */}
      <section>
        <div className="sec-head">
          <span className="sec-num">05</span>
          <h2>Resultado 3 · o custo, medido uma semana antes</h2>
        </div>
        <p className="sec-intro">
          No meio do ensaio, o chassi articulado <b>afundava 15 cm</b> andando em
          chão plano. Sem explicação física: não há mola, e as rodas são rígidas.
          Investigar isso entregou, de graça, a medição que a{' '}
          <a href={roadmapHref}>faixa A do roadmap</a> ia buscar.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Esforço de cálculo</th>
                <th>Altura final</th>
                <th>Incl. máx</th>
                <th>µs/quadro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10 vel / 2 pos · <b>o padrão do Jolt</b></td>
                <td className="mono">
                  <b className="no">0,727</b>
                </td>
                <td className="mono">1,09°</td>
                <td className="mono">103</td>
              </tr>
              <tr>
                <td>30 vel / 6 pos</td>
                <td className="mono">0,828</td>
                <td className="mono">0,12°</td>
                <td className="mono">132</td>
              </tr>
              <tr>
                <td>60 vel / 12 pos</td>
                <td className="mono">0,843</td>
                <td className="mono">0,49°</td>
                <td className="mono">172</td>
              </tr>
              <tr>
                <td>
                  <b>4 sub-passos</b>
                </td>
                <td className="mono">
                  <b className="yes">0,850</b>
                </td>
                <td className="mono">0,10°</td>
                <td className="mono">335</td>
              </tr>
              <tr>
                <td>8 sub-passos</td>
                <td className="mono">0,850</td>
                <td className="mono">0,24°</td>
                <td className="mono">673</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{marginTop: 22}}>
          A altura geometricamente correta é <b>0,850</b>. Portanto:{' '}
          <b>não era física, era o cálculo não terminando</b> — e o padrão do
          Jolt erra <b>12 centímetros</b> nesta montagem.
        </p>
        <p>
          A causa é a <b>razão de massa</b>: o chassi tem 1200 kg e cada braço
          tem 50 kg. Vinte e quatro para um através de uma junta é duro para um
          solver que resolve por aproximações sucessivas — com poucas rodadas ele
          para antes da resposta, e a junta "estica". É exatamente o tipo de
          montagem que a <code>VehicleConstraint</code> nunca produz, porque lá
          existe um corpo só.
        </p>

        <div className="stat" style={{marginTop: 22}}>
          <div className="formula">
            o joelho está em <b>4 sub-passos</b>
            <br />
            de 4 para 8, o resultado <b>não muda mais</b> — e o custo dobra
            <br />
            mesmo a configuração mais cara usa <b>673 µs</b> de{' '}
            <b>16 700 µs</b> por quadro
          </div>
        </div>

        <div className="callout" style={{marginTop: 22}}>
          <b>Três coisas ficam decididas com número:</b> o passo padrão do Jolt{' '}
          <b>não serve</b> para esta montagem; a configuração recomendada é{' '}
          <b>4 sub-passos</b>; e o orçamento de um quadro a 60 Hz é gasto em{' '}
          <b>4 %</b>. Sobra folga — o que responde, do lado do Jolt, a pergunta
          que o <a href={gdchronoHref}>passo de 0,5 ms do GDChrono</a> tinha
          levantado.
        </div>
      </section>

      {/* 06 · o que muda */}
      <section>
        <div className="sec-head">
          <span className="sec-num">06</span>
          <h2>O que isso muda</h2>
        </div>

        <div className="steps">
          <div className="step">
            <h4>A frente passou a fazer jus ao nome</h4>
            <p>
              "Dinâmica multicorpo" descrevia, até esta semana, um projeto cuja
              simulação tinha <b>um corpo</b>. Agora tem sete, ligados por
              juntas, com a articulação medida fazendo o que deveria.
            </p>
            <span className="learn">
              de leitura sobre multicorpo para multicorpo rodando
            </span>
          </div>
          <div className="step">
            <h4>O modelo antigo ganhou um limite conhecido</h4>
            <p>
              Não é "menos preciso": ele <b>não representa a forma do
              obstáculo</b>. Serve para terreno de altura suave; não serve para
              degrau, pedra ou quina — que é o cenário de rover.
            </p>
            <span className="learn">
              o que foi medido com ele antes precisa ser relido com isso em mente
            </span>
          </div>
          <div className="step">
            <h4>O caminho do rover está aberto e orçado</h4>
            <p>
              A montagem articulada existe, roda no Godot, e custa 4 % de um
              quadro. O que separa isto de um rover não é mais viabilidade — é
              quantidade de peças.
            </p>
            <span className="learn">
              a pergunta virou "quando", não "se"
            </span>
          </div>
        </div>
      </section>

      {/* 07 · o que falta */}
      <section>
        <div className="sec-head">
          <span className="sec-num">07</span>
          <h2>O que falta</h2>
        </div>

        <div className="tl">
          <div className="tl-stop">
            <h4>O bogie — seis rodas</h4>
            <p>
              O rocker de quatro rodas para no degrau igual ao raio da roda.{' '}
              <b>É exatamente esse limite que o bogie existe para vencer</b>: a
              perna dianteira é erguida sobre o obstáculo pela geometria do
              conjunto. É a continuação natural, e agora com um número concreto
              para bater — <code>0,30 m</code>.
            </p>
          </div>
          <div className="tl-stop">
            <h4>O terreno</h4>
            <p>
              Trocar o chão de caixa por <code>HeightFieldShape</code> e deformar
              o sulco com <code>SetHeights</code>. Continua valendo a distinção:
              o Jolt deforma a <b>geometria</b>, mas não tem terramecânica.
            </p>
          </div>
          <div className="tl-stop">
            <h4>A cena nascer da física</h4>
            <p>
              A lição nº 1 do <a href={gdchronoHref}>GDChrono</a>. Foi adiada de
              propósito: com <b>duas</b> montagens concretas na mão, a abstração
              certa fica muito mais fácil de enxergar do que com uma só. Agora
              existem duas.
            </p>
          </div>
        </div>
      </section>

      {/* fontes */}
      <section className="refs">
        <div className="sec-head">
          <span className="sec-num">↗</span>
          <h2>Fontes</h2>
        </div>

        <div className="rgrp">
          <h4>O código desta entrada</h4>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Samples/Tests/Vehicle/VehicleSixDOFTest.cpp"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">
              VehicleSixDOFTest.cpp — o gabarito: veículo feito de corpos e juntas
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Constraints/HingeConstraint.h"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">
              HingeConstraint.h — SetMotorState, SetTargetAngularVelocity, GetCurrentAngle
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Collision/GroupFilterTable.h"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">
              GroupFilterTable.h — impedir que peças ligadas por junta colidam entre si
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/PhysicsSettings.h"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">
              PhysicsSettings.h — mNumVelocitySteps e mNumPositionSteps
            </span>
            <span className="rk">↗ github</span>
          </a>
        </div>

        <div className="rgrp">
          <h4>As entradas relacionadas</h4>
          <a href={porDentroHref}>
            <span className="rd">
              Um corpo só, quatro bengalas — a afirmação que esta entrada mede
            </span>
            <span className="rk">→ nesta frente</span>
          </a>
          <a href={ponteHref}>
            <span className="rd">Dois mundos, uma cena — a ponte C++</span>
            <span className="rk">→ nesta frente</span>
          </a>
          <a href={gdchronoHref}>
            <span className="rd">
              Duas pontes, um desenho — de onde veio a pergunta do passo
            </span>
            <span className="rk">→ nesta frente</span>
          </a>
          <a href={comparativoHref}>
            <span className="rd">O tanque do Jolt e o teto do Godot</span>
            <span className="rk">→ nesta frente</span>
          </a>
        </div>
      </section>
    </div>
  );
}
