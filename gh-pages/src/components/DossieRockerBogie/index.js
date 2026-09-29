import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Doc técnica · Dinâmica multicorpo · Sessão de construção de 28/set/2026.
 * Sétima entrada da frente: o bogie, que era o entregável-âncora do roadmap de
 * 14–21/set. Estende a montagem articulada para seis rodas (11 corpos, 10
 * juntas) e varre a altura do degrau nas três montagens.
 *
 * Fonte: o código em gdjolt/ (src/rocker_rig.h, tools/vehicle_probe.cpp,
 * demo/comparativo.tscn) e as execuções do banco de ensaio. Todas as tabelas
 * vieram de rodar, não de estimar.
 *
 * Renderiza sob `.dossie .tecnica .mcorpo`, sem CSS próprio.
 */
export default function DossieRockerBogie() {
  const rockerHref = useBaseUrl('/docs/multicorpo/rocker-articulado');
  const porDentroHref = useBaseUrl('/docs/multicorpo/vehicleconstraint-por-dentro');
  const gdchronoHref = useBaseUrl('/docs/multicorpo/gdchrono-comparado');
  const roadmapHref = useBaseUrl('/docs/roadmaps/semana-2026-09-14');

  return (
    <div className="dossie tecnica mcorpo">
      {/* faixa de telemetria */}
      <div className="telemetry-strip">
        <span>
          <span className="dot" />
          sessão · 28 set
        </span>
        <span>
          modo · <b>medição</b>
        </span>
        <span>
          montagem · <b>11 corpos · 10 juntas</b>
        </span>
        <span>
          código · <b>gdjolt/</b>
        </span>
        <span>
          estado · <b>bogie medido</b>
        </span>
      </div>

      {/* hero */}
      <header className="hero-block">
        <div className="eyebrow">Multicorpo de verdade · o bogie</div>
        <h1>
          Seis rodas, <span className="accent">uma vez e meia o raio</span>.
        </h1>
        <p className="lede">
          A entrada <a href={rockerHref}>Sete corpos, seis juntas</a> terminou
          com um limite e um alvo: o rocker de quatro rodas empaca no degrau do
          tamanho do raio da roda, e o <b>bogie</b> é o mecanismo que existe para
          passar desse ponto. Esta entrada monta o bogie e varre a altura do
          degrau nas três montagens, com a mesma manobra e a mesma massa.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>O resultado em uma linha:</b> com roda de <b>0,30 m</b> de raio, o
          rocker de quatro rodas sobe até <b>0,30 m</b> e o rocker-bogie de seis
          sobe até <b>0,45 m</b>, com o chassi abaixo de <b>2°</b> até 0,40 m.
          O mesmo ensaio corrigiu um número da entrada anterior, e a correção
          está registrada abaixo.
        </div>

        <div className="hero-meta">
          <span>
            a montagem que esta entrada estende ·{' '}
            <a href={rockerHref}>Sete corpos, seis juntas</a>
          </span>
          <span>
            plano · <a href={roadmapHref}>roadmap 14–21 set</a>
          </span>
        </div>
      </header>

      {/* 01 · a montagem */}
      <section>
        <div className="sec-head">
          <span className="sec-num">01</span>
          <h2>A montagem de seis rodas</h2>
        </div>
        <p className="sec-intro">
          De cada lado há um <b>rocker</b> preso ao chassi. Ele segura a roda
          traseira numa ponta e, na outra, um <b>bogie</b>: um segundo braço
          articulado que carrega as duas rodas da frente. Continua sem mola
          nenhuma. Tudo é corpo rígido, junta e motor no eixo.
        </p>

        <div className="code-block">
          <div className="fname">gdjolt/src/rocker_rig.h · a variante de seis rodas</div>
          <pre>
            <code>{`chassi
 └─ Hinge (curso ±30°) ──→ rocker ─┬─ Hinge + motor → roda traseira
    (um de cada lado)              └─ Hinge (curso ±35°) → bogie ─┬─ Hinge + motor → roda dianteira
                                                                  └─ Hinge + motor → roda do meio`}</code>
          </pre>
        </div>

        <div className="duo" style={{marginTop: 26}}>
          <div className="facet">
            <h4>O que ficou igual</h4>
            <p>
              A roda dianteira e a traseira estão nas <b>mesmas posições</b> do
              rocker de quatro rodas. Entre-eixos, bitola, raio de roda (0,30 m),
              massa total (1500 kg), atrito (1,0) e velocidade-alvo (1,5 m/s) são
              os mesmos.
            </p>
            <p>A única diferença entre as duas montagens é o mecanismo.</p>
          </div>
          <div className="facet">
            <h4>A proporção 2:1</h4>
            <p>
              O pivô do rocker fica em <code>z = 0</code>, a roda traseira em{' '}
              <code>−1,4</code> e o pivô do bogie em <code>+0,7</code>. Pela
              alavanca, o bogie recebe <b>2/3</b> da carga do lado e a roda
              traseira <b>1/3</b>. O bogie divide os seus 2/3 entre duas rodas.
            </p>
            <p>
              No fim, <b>as seis rodas carregam o mesmo peso</b>, que é a
              proporção do desenho clássico do rocker-bogie.
            </p>
          </div>
        </div>

        <div className="callout" style={{marginTop: 22}}>
          <b>Um header só, de novo:</b> a variante é um parâmetro (
          <code>RockerParams::bogie</code>) do mesmo <code>BuildRocker</code> que
          monta o rocker de quatro rodas, e o nó do Godot usa esse mesmo código.
          O rocker de quatro rodas refeito depois da mudança dá os mesmos números
          da entrada anterior, <b>0,10°</b> e <code>z = 8,50</code>, até a
          segunda casa decimal.
        </div>
      </section>

      {/* 02 · a correção */}
      <section>
        <div className="sec-head">
          <span className="sec-num">02</span>
          <h2>Uma correção na entrada anterior</h2>
        </div>

        <div className="bug">
          <div className="symptom">
            <h4>O que estava publicado</h4>
            <p>
              "O rocker de quatro rodas <b>para em 0,30 m</b>, que é o raio da
              roda." O número veio de um ensaio de <b>7 s</b>, e o critério de
              "subiu" era o centro do chassi passar 1 m da face do degrau.
            </p>
          </div>
          <div className="cause">
            <h4>O que acontece de verdade</h4>
            <p>
              Em 0,30 m o rocker <b>trava na face por uns 2 s</b> e depois sobe.
              Os 7 s acabavam no meio dessa espera. Com uma manobra de 12 s ele
              atravessa em <b>6,7 s</b>, contra 5,1 s andando livre.
            </p>
          </div>
        </div>

        <div className="code-block" style={{marginTop: 22}}>
          <div className="fname">
            vehicle_probe --rig=rocker --step-height=0.30 --steps=720 · a espera na face
          </div>
          <pre>
            <code>{`passo |   z    | altura | incl.° | braco_e braco_d
  240 |   4.29 |  0.688 |   0.00 |   -1.42   -1.45   ← roda dianteira encosta na face
  300 |   4.28 |  0.669 |   0.75 |   -0.21   -1.25   ← parado
  360 |   5.36 |  0.798 |   0.03 |   -6.12   -6.13   ← roda dianteira em cima
  480 |   8.14 |  0.950 |   0.00 |   +0.04   +0.04   ← as quatro em cima`}</code>
          </pre>
        </div>

        <p style={{marginTop: 22}}>
          O banco de ensaio mudou em três pontos para não repetir o erro:
        </p>
        <ul>
          <li>
            <b>"Subiu" agora quer dizer que a roda traseira passou da face.</b>{' '}
            No rocker-bogie a frente pode estar em cima com a traseira ainda
            presa embaixo, e o critério antigo contaria isso como sucesso.
          </li>
          <li>
            <b>A varredura dá 12 s de manobra</b>, e o banco passou a medir o{' '}
            <b>tempo de travessia</b>. O tempo acima dos 5,1 s de andar livre é
            o tempo que a montagem passou brigando com a face.
          </li>
          <li>
            <b>A inclinação só conta durante a subida.</b> Com a manobra mais
            longa, as montagens chegavam à ponta final da laje e caíam do outro
            lado, e essa queda estava entrando na inclinação máxima.
          </li>
        </ul>

        <div className="callout amber" style={{marginTop: 22}}>
          <b>O que a correção não muda:</b> o limite do rocker de quatro rodas
          continua sendo o raio da roda. Ele sobe 0,30 m e não sobe 0,35 m.
          Mudou a leitura: 0,30 m não é onde ele <b>para</b>, é o{' '}
          <b>último degrau que ele ainda sobe</b>, e com esforço.
        </div>
      </section>

      {/* 03 · a varredura */}
      <section>
        <div className="sec-head">
          <span className="sec-num">03</span>
          <h2>A varredura · quem sobe o quê</h2>
        </div>
        <p className="sec-intro">
          Degrau de 0,10 a 0,50 m, as três montagens, 4 sub-passos por quadro.
          Em cada célula: o tempo de travessia e a inclinação máxima do chassi
          durante a subida.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Degrau</th>
                <th>lumped · 1 corpo</th>
                <th>rocker · 4 rodas</th>
                <th>bogie · 6 rodas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">0,10 m</td>
                <td className="mono">4,2 s · 2,30°</td>
                <td className="mono">5,3 s · 0,08°</td>
                <td className="mono">5,3 s · 0,00°</td>
              </tr>
              <tr>
                <td className="mono">0,20 m</td>
                <td className="mono">4,2 s · 4,43°</td>
                <td className="mono">5,5 s · 0,10°</td>
                <td className="mono">5,5 s · 0,03°</td>
              </tr>
              <tr>
                <td className="mono">0,25 m</td>
                <td className="mono">4,2 s · 5,50°</td>
                <td className="mono">5,8 s · 0,44°</td>
                <td className="mono">5,6 s · 0,08°</td>
              </tr>
              <tr>
                <td className="mono">0,30 m</td>
                <td className="mono">4,2 s · 6,58°</td>
                <td className="mono">
                  <b className="yes">6,7 s</b> · 1,47°
                </td>
                <td className="mono">5,8 s · 0,13°</td>
              </tr>
              <tr>
                <td className="mono">0,35 m</td>
                <td className="mono">4,2 s · 7,67°</td>
                <td>
                  <b className="no">não sobe</b>
                </td>
                <td className="mono">8,0 s · 1,16°</td>
              </tr>
              <tr>
                <td className="mono">0,40 m</td>
                <td className="mono">4,2 s · 8,77°</td>
                <td>
                  <b className="no">não sobe</b>
                </td>
                <td className="mono">9,8 s · 1,58°</td>
              </tr>
              <tr>
                <td className="mono">0,45 m</td>
                <td className="mono">4,2 s · 9,89°</td>
                <td>
                  <b className="no">não sobe</b>
                </td>
                <td className="mono">
                  <b className="yes">9,7 s</b> · 14,89°
                </td>
              </tr>
              <tr>
                <td className="mono">0,50 m</td>
                <td className="mono">4,2 s · 11,02°</td>
                <td>
                  <b className="no">não sobe</b>
                </td>
                <td>
                  <b className="no">não sobe</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{marginTop: 22}}>Três leituras:</p>
        <ul>
          <li>
            <b>O bogie passa do limite.</b> Sobe 0,35 m, 0,40 m e 0,45 m, que o
            rocker de quatro rodas não sobe. O teto dele fica entre 0,45 e
            0,50 m, ou seja, entre <b>1,5 e 1,67 vezes o raio da roda</b>.
          </li>
          <li>
            <b>Até o limite do rocker, o bogie sobe mais nivelado e mais
            rápido.</b> Em 0,30 m ele atravessa em 5,8 s com o chassi a 0,13°. O
            rocker leva 6,7 s e inclina 1,47°.
          </li>
          <li>
            <b>O lumped continua trapaceando.</b> Ele "sobe" tudo no mesmo tempo,
            4,2 s, porque a face do degrau não existe no modelo dele (ver{' '}
            <a href={rockerHref}>a entrada anterior</a>). A inclinação cresce com
            o degrau porque o chassi é arrastado para cima, não porque uma roda
            escalou.
          </li>
        </ul>

        <div className="callout coral" style={{marginTop: 22}}>
          <b>O 0,45 m custa caro:</b> o bogie fica uns <b>4 s</b> brigando com a
          face, e nesse tempo o chassi balança até <b>15°</b> antes de a roda
          dianteira achar o topo. Passa, mas é o limite: em 0,50 m ele não
          passa.
        </div>

        <p style={{marginTop: 22}}>
          <b>Não é efeito do solver.</b> Com <b>8 sub-passos</b> em vez de 4, as
          três colunas de "sobe/não sobe" ficam iguais. Os tempos mudam no
          décimo de segundo, e a inclinação do bogie em 0,45 m vai a 21,7°: é o
          trecho caótico da briga com a face, e ele é sensível a qualquer
          detalhe.
        </p>
      </section>

      {/* 04 · custo */}
      <section>
        <div className="sec-head">
          <span className="sec-num">04</span>
          <h2>O custo de onze peças</h2>
        </div>
        <p className="sec-intro">
          Mediana de µs por quadro de 60 Hz com 4 sub-passos e degrau de
          0,20 m, em cinco execuções de cada montagem na mesma máquina.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Montagem</th>
                <th>Corpos · juntas</th>
                <th>µs/quadro (mediana)</th>
                <th>do orçamento de 16 700 µs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>lumped</td>
                <td className="mono">1 · 1 constraint</td>
                <td className="mono">355</td>
                <td className="mono">2,1 %</td>
              </tr>
              <tr>
                <td>rocker · 4 rodas</td>
                <td className="mono">7 · 6</td>
                <td className="mono">452</td>
                <td className="mono">2,7 %</td>
              </tr>
              <tr>
                <td>
                  <b>bogie · 6 rodas</b>
                </td>
                <td className="mono">11 · 10</td>
                <td className="mono">
                  <b>522</b>
                </td>
                <td className="mono">
                  <b className="yes">3,1 %</b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{marginTop: 22}}>
          O bogie tem <b>onze vezes</b> mais corpos que o lumped e custa{' '}
          <b>47 % a mais</b>, e não onze vezes. Quase todo o custo é{' '}
          <b>fixo</b>: preparar o passo, distribuir o trabalho entre as threads e
          juntar o resultado, quatro vezes por quadro. As peças em si pesam
          pouco. Isso também explica por que o número oscila tanto: o rocker deu{' '}
          <b>335 µs</b> em 10/set e <b>452 µs</b> hoje, na mesma configuração.
          O que manda é o estado da máquina, não a montagem.
        </p>
        <p>
          Por isso a pergunta útil não é "quanto custa um bogie", e sim{' '}
          <b>quantos cabem num quadro</b>. Com custo fixo alto, dez veículos no
          mesmo <code>PhysicsSystem</code> devem custar bem menos que dez vezes
          um. Medir isso é o próximo passo da faixa A.
        </p>
      </section>

      {/* 05 · a ressalva */}
      <section>
        <div className="sec-head">
          <span className="sec-num">05</span>
          <h2>A ressalva · o chassi está em equilíbrio neutro</h2>
        </div>
        <p className="sec-intro">
          Olhando a telemetria do 0,45 m apareceu uma coisa que vale para esta
          entrada e para a anterior, e que precisa ser dita antes de alguém
          citar o "0,00°".
        </p>
        <p>
          Os dois pivôs do chassi são <b>coaxiais</b> e passam pelo{' '}
          <b>centro de massa</b>. Isso foi a correção do pêndulo invertido na{' '}
          <a href={rockerHref}>entrada anterior</a>. Só que, com o eixo passando
          pelo centro de massa, <b>a gravidade não faz torque nenhum</b> sobre o
          chassi. Nada o puxa de volta para o nível. Ele fica em equilíbrio{' '}
          <b>neutro</b>: parado, fica onde está, e um empurrão o inclina sem que
          nada o endireite.
        </p>
        <p>
          Então o 0,00° não prova que a geometria segura o chassi nivelado.
          Mostra que, na manobra em reta, <b>nada o tirou do nível</b>. Quando
          alguma coisa tira, como a briga com a face em 0,45 m, ele balança.
        </p>

        <div className="callout amber" style={{marginTop: 22}}>
          <b>Como o rover de verdade resolve:</b> com um <b>diferencial</b>, uma
          barra ou engrenagem que liga os dois rockers e faz o chassi ficar no{' '}
          <b>ângulo médio</b> entre eles. No Jolt, o caminho mais direto parece
          ser montar a barra como mais um corpo, ligado ao chassi e aos dois
          rockers por juntas. O <code>GearConstraint</code> é candidato a
          estudar, mas acopla a rotação dos dois corpos, e não o ângulo relativo
          ao chassi, então não resolve sozinho. É o próximo passo desta
          montagem.
        </div>
      </section>

      {/* 06 · no Godot */}
      <section>
        <div className="sec-head">
          <span className="sec-num">06</span>
          <h2>As três lado a lado, no Godot</h2>
        </div>
        <p className="sec-intro">
          A cena <code>gdjolt/demo/comparativo.tscn</code> põe as três
          montagens na mesma tela, cada uma no seu próprio{' '}
          <code>PhysicsSystem</code>, com piloto automático e a manobra do banco
          de ensaio. O placar mostra a inclinação ao vivo, a máxima e o tempo de
          travessia.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Degrau de 0,40 m · Godot, headless</th>
                <th>lumped</th>
                <th>rocker</th>
                <th>bogie</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Travessia</td>
                <td className="mono">4,5 s</td>
                <td>
                  <b className="no">não passou</b>
                </td>
                <td className="mono">
                  <b className="yes">8,9 s</b>
                </td>
              </tr>
              <tr>
                <td>Inclinação máxima</td>
                <td className="mono">8,98°</td>
                <td className="mono">1,80°</td>
                <td className="mono">1,82°</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="refs" style={{marginTop: 22}}>
          <div className="rgrp">
            <h4>Os vídeos · gravados desta cena</h4>
          <a href="https://youtu.be/asxpnhdJ-Lk" target="_blank" rel="noopener noreferrer">
            <span className="rd">
              As três lado a lado, degrau de 0,40 m — o bogie sobe, o rocker empaca, o lumped atravessa a face
            </span>
            <span className="rk">↗ youtube</span>
          </a>
          <a href="https://youtu.be/aOc7P4dhIiA" target="_blank" rel="noopener noreferrer">
            <span className="rd">
              O bogie de perto, degrau de 0,40 m — a articulação trabalhando com o chassi nivelado
            </span>
            <span className="rk">↗ youtube</span>
          </a>
          <a href="https://youtu.be/LW7gbjetI8E" target="_blank" rel="noopener noreferrer">
            <span className="rd">
              O lumped de perto, degrau de 0,40 m — a roda atravessando a face do degrau
            </span>
            <span className="rk">↗ youtube</span>
          </a>
          <a href="https://youtu.be/9ldDGWAAwVI" target="_blank" rel="noopener noreferrer">
            <span className="rd">
              As três lado a lado, degrau de 0,20 m — a comparação original de inclinação
            </span>
            <span className="rk">↗ youtube</span>
          </a>
          </div>
        </div>

        <p style={{marginTop: 22}}>
          Os números batem com o terminal nas quatro alturas conferidas (0,20,
          0,30, 0,40 e 0,50 m). As diferenças ficam no décimo de segundo e vêm
          do passo do Godot. É a mesma física, porque é o mesmo header.
        </p>

        <div className="code-block" style={{marginTop: 22}}>
          <div className="fname">gravar · sem depender do tamanho da janela</div>
          <pre>
            <code>{`godot --path demo --fixed-fps 60 comparativo.tscn -- \\
      --step=0.40 --cam=0 --secs=13 --record=/tmp/quadros
ffmpeg -framerate 60 -i /tmp/quadros/%05d.png -pix_fmt yuv420p video.mp4`}</code>
          </pre>
        </div>
        <p style={{marginTop: 22}}>
          O <code>--write-movie</code> do Godot perdia o placar quando o
          gerenciador de janelas em mosaico redimensionava a janela. A cena
          passou a gravar de um <code>SubViewport</code> de tamanho fixo, e o{' '}
          <code>--fixed-fps</code> desliga o relógio real, então cada quadro do
          vídeo é exatamente um passo de física.
        </p>
      </section>

      {/* 07 · o que falta */}
      <section>
        <div className="sec-head">
          <span className="sec-num">07</span>
          <h2>O que falta</h2>
        </div>
        <div className="tl">
          <div className="tl-stop">
            <h4>O diferencial</h4>
            <p>
              Ligar os dois rockers para o chassi ficar no ângulo médio, e medir
              de novo. É o que transforma o "0,00°" de equilíbrio neutro em
              nivelamento de verdade.
            </p>
          </div>
          <div className="tl-stop">
            <h4>Vários veículos num quadro</h4>
            <p>
              O que sobra da faixa A. O orçamento é do quadro inteiro, e um
              bogie sozinho não diz quantos cabem.
            </p>
          </div>
          <div className="tl-stop">
            <h4>O terreno</h4>
            <p>
              <code>HeightFieldShape</code> e o sulco com{' '}
              <code>SetHeights</code>. O degrau de face vertical mostrou que a
              forma do obstáculo decide o resultado, então o terreno deixou de
              ser cenário e virou variável do ensaio.
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
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Constraints/HingeConstraint.h"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">
              HingeConstraint.h — as juntas do rocker, do bogie e das rodas
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Constraints/GearConstraint.h"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">
              GearConstraint.h — candidato a estudar para o diferencial
            </span>
            <span className="rk">↗ github</span>
          </a>
        </div>

        <div className="rgrp">
          <h4>Os vídeos</h4>
          <a href="https://youtu.be/asxpnhdJ-Lk" target="_blank" rel="noopener noreferrer">
            <span className="rd">
              As três montagens, degrau de 0,40 m
            </span>
            <span className="rk">↗ youtube</span>
          </a>
          <a href="https://youtu.be/aOc7P4dhIiA" target="_blank" rel="noopener noreferrer">
            <span className="rd">
              O bogie de perto, degrau de 0,40 m
            </span>
            <span className="rk">↗ youtube</span>
          </a>
        </div>

        <div className="rgrp">
          <h4>As entradas relacionadas</h4>
          <a href={rockerHref}>
            <span className="rd">
              Sete corpos, seis juntas — a montagem que esta entrada estende
            </span>
            <span className="rk">→ nesta frente</span>
          </a>
          <a href={porDentroHref}>
            <span className="rd">
              Um corpo só, quatro bengalas — por que o lumped ignora a face
            </span>
            <span className="rk">→ nesta frente</span>
          </a>
          <a href={gdchronoHref}>
            <span className="rd">
              Duas pontes, um desenho — o rover Viper do professor, no Chrono
            </span>
            <span className="rk">→ nesta frente</span>
          </a>
        </div>
      </section>
    </div>
  );
}
