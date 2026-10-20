import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Doc técnica · Dinâmica multicorpo · Sessão de 14/out/2026.
 * Oitava entrada da frente: o teste do shapecast que o professor pediu depois
 * de ver os vídeos do bogie. A VehicleConstraint com raio, esfera e cilindro,
 * contra o rocker e o bogie, que têm roda de verdade.
 *
 * Fonte: gdjolt/tools/vehicle_probe.cpp (modo --testers), a propriedade
 * collision_tester do JoltVehicle e a cena gdjolt/demo/testadores.tscn. Todas
 * as tabelas vieram de rodar, não de estimar.
 *
 * Renderiza sob `.dossie .tecnica .mcorpo`, sem CSS próprio.
 */

// Ids do YouTube (ordem conferida pelo título, via oEmbed).
const VIDEOS = {
  geral40: '2sCWzqj28dc',
  raio20: 'nPd9hw5bX70',
  cilindro20: 'ed2WvEs70sw',
  cilindro40: 'ZlS30D6Si8E',
};

/** Um vídeo do YouTube embutido, com a legenda e o link direto logo abaixo. */
function Video({id, title, children}) {
  return (
    <figure className="shot">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      <figcaption>
        {children}{' '}
        <a href={`https://youtu.be/${id}`} target="_blank" rel="noopener noreferrer">
          ↗ youtube
        </a>
      </figcaption>
    </figure>
  );
}

// Saída de `vehicle_probe --testers --substeps=4`: [degrau, raio, esfera,
// cilindro, rocker, bogie]; cada célula é [subiu, penetração m, pulo m/s].
const LINHAS = [
  ['0,10', [1, '0,100', '6,2'], [1, '0,078', '2,2'], [1, '0,025', '1,4'], [1, '0,010', '1,0'], [1, '0,010', '1,0']],
  ['0,20', [1, '0,200', '12,8'], [1, '0,162', '5,4'], [1, '0,024', '2,4'], [1, '0,013', '1,2'], [1, '0,013', '1,2']],
  ['0,30', [1, '0,300', '19,3'], [1, '0,205', '10,8'], [1, '0,021', '4,4'], [1, '0,013', '1,5'], [1, '0,012', '1,2']],
  ['0,40', [1, '0,306', '25,9'], [0, '0,208', '17,2'], [0, '0,001', '3,9'], [0, '0,003', '1,6'], [1, '0,012', '1,4']],
  ['0,50', [1, '0,306', '32,9'], [0, '0,215', '23,6'], [0, '0,001', '3,1'], [0, '0,000', '0,1'], [0, '0,000', '0,2']],
];

function Celula({c}) {
  const [subiu, pen, pulo] = c;
  return (
    <td className="mono">
      {subiu ? <b className="yes">sobe</b> : <b className="no">não</b>} · {pen} m · {pulo} m/s
    </td>
  );
}

export default function DossieRaioCilindro() {
  const bogieHref = useBaseUrl('/docs/multicorpo/rocker-bogie');
  const porDentroHref = useBaseUrl('/docs/multicorpo/vehicleconstraint-por-dentro');

  return (
    <div className="dossie tecnica mcorpo">
      {/* faixa de telemetria */}
      <div className="telemetry-strip">
        <span>
          <span className="dot" />
          sessão · 14 out
        </span>
        <span>
          modo · <b>medição</b>
        </span>
        <span>
          testadores · <b>raio · esfera · cilindro</b>
        </span>
        <span>
          código · <b>gdjolt/</b>
        </span>
        <span>
          estado · <b>diagnóstico confirmado</b>
        </span>
      </div>

      {/* hero */}
      <header className="hero-block">
        <div className="eyebrow">Multicorpo de verdade · a colisão da roda</div>
        <h1>
          O raio <span className="accent">não vê a parede</span>.
        </h1>
        <p className="lede">
          Nos vídeos do bogie, a roda do modelo de um corpo só entrava no degrau
          e depois saltava para cima. O diagnóstico do professor: a
          VehicleConstraint procura o chão com um <b>raio</b>, que enxerga um
          ponto só embaixo da roda, e num degrau de face vertical esse ponto
          muda de altura de uma vez. Ele propôs dois caminhos: um{' '}
          <b>shapecast</b>, que varre a forma da roda em vez de um ponto, ou a
          roda como <b>corpo com colisor de verdade</b>, presa por junta e mola.
          Esta entrada mede o primeiro e compara com o segundo.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>O resultado em uma linha:</b> no degrau de 0,20 m, a roda com raio
          entra <b>20 cm</b> no degrau e pula a <b>12,8 m/s</b>. Com o
          cilindro, entra <b>2,4 cm</b> e pula a <b>2,4 m/s</b>, perto da roda
          de verdade do rocker (1,3 cm e 1,2 m/s). E o cilindro passa a parar
          no mesmo limite real do rocker: sobe 0,30 m, não sobe 0,40 m.
        </div>

        <div className="hero-meta">
          <span>
            os vídeos que levantaram a questão ·{' '}
            <a href={bogieHref}>Seis rodas, uma vez e meia o raio</a>
          </span>
        </div>
      </header>

      {/* 01 · os três testadores */}
      <section>
        <div className="sec-head">
          <span className="sec-num">01</span>
          <h2>Três jeitos de achar o chão</h2>
        </div>
        <p className="sec-intro">
          A VehicleConstraint não tem roda como corpo: a cada passo ela pergunta
          "onde está o chão embaixo desta roda?" e põe a mola entre o chassi e
          esse ponto. Quem responde é o <b>testador de colisão</b>, e o Jolt
          traz três. Os três procuram ao longo da suspensão, de cima para
          baixo; o que muda é o que varre.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Testador</th>
                <th>O que varre</th>
                <th>No degrau</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">VehicleCollisionTesterRay</td>
                <td>um raio a partir do eixo</td>
                <td>
                  só "vê" o degrau quando o eixo já está em cima dele, e aí o
                  chão sobe de uma vez
                </td>
              </tr>
              <tr>
                <td className="mono">VehicleCollisionTesterCastSphere</td>
                <td>uma esfera (aqui, meia largura da roda: 0,10 m)</td>
                <td>vê um pouco antes, mas a esfera é bem menor que a roda</td>
              </tr>
              <tr>
                <td className="mono">VehicleCollisionTesterCastCylinder</td>
                <td>um cilindro com o raio e a largura da roda</td>
                <td>vê a quina do degrau assim que a roda encosta nela</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="code-block" style={{marginTop: 22}}>
          <div className="fname">a troca é uma linha · gdjolt/src/jolt_vehicle.cpp</div>
          <pre>
            <code>{`constraint->SetVehicleCollisionTester(new VehicleCollisionTesterRay(Layers::MOVING));
// vira
constraint->SetVehicleCollisionTester(new VehicleCollisionTesterCastCylinder(Layers::MOVING));`}</code>
          </pre>
        </div>
      </section>

      {/* 02 · o que medir */}
      <section>
        <div className="sec-head">
          <span className="sec-num">02</span>
          <h2>Duas medidas novas no banco</h2>
        </div>
        <p className="sec-intro">
          "Sobe ou não sobe" não mostra o problema: o raio sobe tudo. O banco de
          ensaio ganhou o modo <code>--testers</code>, que mede duas coisas na
          roda dianteira enquanto ela passa pelo degrau.
        </p>
        <div className="duo">
          <div className="facet">
            <h4>Penetração</h4>
            <p>
              Vista de lado, a roda é um círculo de 0,30 m e o degrau é um
              retângulo. A penetração é o <b>quanto o círculo invade o
              retângulo</b>. Roda de verdade fica perto de zero; a roda com raio
              entra até a altura do degrau.
            </p>
          </div>
          <div className="facet">
            <h4>Pulo</h4>
            <p>
              A <b>maior velocidade vertical</b> da roda dianteira. É o salto
              que aparece no vídeo: a roda que estava dentro do degrau é
              colocada em cima dele num passo só.
            </p>
          </div>
        </div>
      </section>

      {/* 03 · a tabela */}
      <section>
        <div className="sec-head">
          <span className="sec-num">03</span>
          <h2>A medição</h2>
        </div>
        <p className="sec-intro">
          Degrau de 0,10 a 0,50 m, roda de 0,30 m de raio, 1,5 m/s, 4
          sub-passos. As três primeiras colunas são o mesmo veículo de um corpo
          só, trocando só o testador; as duas últimas têm roda como corpo. Em
          cada célula: se a roda traseira passou da face · penetração · pulo.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Degrau</th>
                <th>raio</th>
                <th>esfera</th>
                <th>cilindro</th>
                <th>rocker · roda corpo</th>
                <th>bogie · roda corpo</th>
              </tr>
            </thead>
            <tbody>
              {LINHAS.map(([h, ...cs]) => (
                <tr key={h}>
                  <td className="mono">{h} m</td>
                  {cs.map((c, i) => (
                    <Celula key={i} c={c} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Video id={VIDEOS.geral40} title="Raio contra cilindro, degrau de 0,40 m">
          Raio contra cilindro, degrau de 0,40 m — o raio "sobe", o cilindro
          para na face, como o rocker
        </Video>

        <p style={{marginTop: 22}}>Quatro leituras:</p>
        <ul>
          <li>
            <b>O raio faz o que o professor descreveu.</b> A penetração é a
            altura do degrau inteira (até o limite de 0,306 m, quando a roda
            some dentro dele) e o pulo cresce com o degrau, de 6 a 33 m/s. Por
            isso ele "sobe" qualquer degrau.
          </li>
          <li>
            <b>O cilindro resolve quase tudo.</b> A roda entra uns 2 cm, contra
            1 cm da roda de verdade, e o pulo cai para 1,4–4,4 m/s. O limite
            passa a ser o mesmo do rocker de quatro rodas: sobe 0,30 m, que é o
            raio da roda, e não sobe 0,40 m.
          </li>
          <li>
            <b>A esfera não serve.</b> Ela tem 0,10 m de raio, um terço da roda,
            e ainda deixa a roda entrar 16–21 cm. O resultado também depende do
            passo: em 0,30 m ela sobe com 4 sub-passos e não sobe com 8.
          </li>
          <li>
            <b>A roda de verdade continua sendo a melhor.</b> Rocker e bogie
            ficam em ~1 cm de penetração e ~1,2 m/s de pulo, e o chassi deles
            inclina menos de 2°. O cilindro inclina 6–9° porque o veículo
            continua sendo um corpo só, sem articulação.
          </li>
        </ul>

        <Video id={VIDEOS.raio20} title="O raio de perto, degrau de 0,20 m">
          O raio de perto, degrau de 0,20 m — a roda entra no degrau e salta
          para cima; no fim, o mesmo trecho em câmera lenta 4×
        </Video>
        <Video id={VIDEOS.cilindro20} title="O cilindro de perto, degrau de 0,20 m">
          O cilindro de perto, degrau de 0,20 m — a roda encosta na quina e
          sobe por ela; no fim, em câmera lenta 4×
        </Video>
        <Video id={VIDEOS.cilindro40} title="O cilindro de perto, degrau de 0,40 m">
          O cilindro de perto, degrau de 0,40 m — a roda para na face, maior
          que o raio dela; no fim, em câmera lenta 4×
        </Video>

        <p style={{marginTop: 22}}>
          <b>Não é efeito do solver.</b> Com 8 sub-passos as conclusões são as
          mesmas para o raio, o cilindro e as rodas de verdade. A única coluna
          que muda de "sobe" para "não" é a da esfera em 0,30 m.
        </p>
      </section>

      {/* 04 · ressalvas */}
      <section>
        <div className="sec-head">
          <span className="sec-num">04</span>
          <h2>O que ainda não está provado</h2>
        </div>
        <div className="callout amber">
          <b>O limite do cilindro em 0,40 m</b> pode vir do curso da suspensão
          (0,30 a 0,50 m) e não da face do degrau. O número bate com o do
          rocker, mas a causa ainda não foi separada.
        </div>
        <div className="callout coral" style={{marginTop: 16}}>
          <b>Travado na face, o cilindro fica ruidoso.</b> Em 0,50 m com 8
          sub-passos a roda chega a 9,6 m/s de pulo e o chassi a 13,6°: ela
          fica batendo na parede. O cilindro conserta a subida, mas a briga com
          uma face alta demais ainda não é bem comportada.
        </div>
        <p style={{marginTop: 22}}>
          Os vídeos rodam no Godot com 1 sub-passo e os números do banco com 4.
          O placar do vídeo concorda com o banco em quem sobe e quem para; os
          tempos de travessia diferem em alguns décimos de segundo.
        </p>
      </section>

      {/* 05 · o próximo passo */}
      <section>
        <div className="sec-head">
          <span className="sec-num">05</span>
          <h2>O próximo passo</h2>
        </div>
        <div className="tl">
          <div className="tl-stop">
            <h4>Roda de verdade com mola</h4>
            <p>
              O cilindro é a correção barata, de uma linha. A abordagem que o
              professor prefere — a roda como corpo com colisor — já existe no
              rocker e no bogie e foi a que deu o menor erro. O que falta nela é{' '}
              <b>mola</b>: um carro de quatro rodas com suspensão por junta,
              como o exemplo <code>VehicleSixDOFTest</code> do Jolt.
            </p>
          </div>
          <div className="tl-stop">
            <h4>Um veículo off-road de verdade</h4>
            <p>
              Depois da suspensão, trocar a caixa por um modelo 3D de um
              veículo off-road (Baja, jipe ou buggy).
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
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Vehicle/VehicleCollisionTester.h"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">
              VehicleCollisionTester.h — o raio, a esfera e o cilindro
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Samples/Tests/Vehicle/VehicleSixDOFTest.cpp"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">
              VehicleSixDOFTest.cpp — roda como corpo, suspensão por junta
            </span>
            <span className="rk">↗ github</span>
          </a>
        </div>

        <div className="rgrp">
          <h4>Os vídeos</h4>
          <a href={`https://youtu.be/${VIDEOS.geral40}`} target="_blank" rel="noopener noreferrer">
            <span className="rd">Raio contra cilindro, degrau de 0,40 m</span>
            <span className="rk">↗ youtube</span>
          </a>
          <a href={`https://youtu.be/${VIDEOS.raio20}`} target="_blank" rel="noopener noreferrer">
            <span className="rd">O raio de perto, degrau de 0,20 m</span>
            <span className="rk">↗ youtube</span>
          </a>
          <a href={`https://youtu.be/${VIDEOS.cilindro20}`} target="_blank" rel="noopener noreferrer">
            <span className="rd">O cilindro de perto, degrau de 0,20 m</span>
            <span className="rk">↗ youtube</span>
          </a>
          <a href={`https://youtu.be/${VIDEOS.cilindro40}`} target="_blank" rel="noopener noreferrer">
            <span className="rd">O cilindro de perto, degrau de 0,40 m</span>
            <span className="rk">↗ youtube</span>
          </a>
        </div>

        <div className="rgrp">
          <h4>As entradas relacionadas</h4>
          <a href={bogieHref}>
            <span className="rd">
              Seis rodas, uma vez e meia o raio — os vídeos que levantaram a
              questão
            </span>
            <span className="rk">→ nesta frente</span>
          </a>
          <a href={porDentroHref}>
            <span className="rd">
              Um corpo só, quatro bengalas — a VehicleConstraint por dentro
            </span>
            <span className="rk">→ nesta frente</span>
          </a>
        </div>
      </section>
    </div>
  );
}
