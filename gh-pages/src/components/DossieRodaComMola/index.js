import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Doc técnica · Dinâmica multicorpo · Sessão de 3/nov/2026.
 * Nona entrada da frente: o carro com rodas de verdade, presas por junta com
 * mola, que o professor preferiu ao shapecast. Comparado com o raio, o
 * cilindro, o rocker e o bogie no mesmo degrau.
 *
 * Fonte: gdjolt/src/car_rig.h (a montagem), gdjolt/tools/vehicle_probe.cpp
 * (--rig=carro, --testers, --sweep, --friction) e a pista "Mola" de
 * gdjolt/demo/testadores.tscn. Todas as tabelas vieram de rodar, não de
 * estimar, e passaram pelo revisor-fisico antes.
 *
 * Renderiza sob `.dossie .tecnica .mcorpo`, sem CSS próprio.
 */

// Ids do YouTube (ordem conferida pelo título, via oEmbed). Vazio = ainda não
// subiu; o vídeo some da página até ter id.
const VIDEOS = {
  geral20: 'W0J2jrqCYvo',
  lateral20: 'lyUbaKm1_nM',
  geral40: 'gbM_1BCW3RM',
  lateral40: 'dl6Jl4qTKaA',
};

/** Um vídeo do YouTube embutido, com a legenda e o link direto logo abaixo. */
function Video({id, title, children}) {
  if (!id) {
    return null;
  }
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

// Saída de `vehicle_probe --testers --substeps=8` (o pulo só converge com 8):
// [degrau, raio, cilindro, rocker, bogie, carro]; cada célula é
// [subiu, penetração m, pulo m/s].
const LINHAS = [
  ['0,10', [1, '0,100', '6,1'], [1, '0,022', '1,4'], [1, '0,009', '1,0'], [1, '0,010', '0,9'], [1, '0,010', '1,1']],
  ['0,20', [1, '0,200', '12,2'], [1, '0,021', '2,0'], [1, '0,011', '1,3'], [1, '0,010', '1,1'], [1, '0,016', '1,2']],
  ['0,30', [1, '0,299', '18,3'], [1, '0,020', '4,3'], [1, '0,012', '1,5'], [1, '0,011', '1,3'], [1, '0,022', '1,1']],
  ['0,40', [1, '0,299', '24,4'], [0, '0,021', '4,6'], [0, '0,001', '1,6'], [1, '0,019', '1,4'], [1, '0,022', '1,2']],
  ['0,50', [1, '0,299', '30,5'], [0, '0,021', '7,2'], [0, '0,000', '0,2'], [0, '0,000', '0,2'], [1, '0,022', '1,3']],
];

// Saída de `vehicle_probe --sweep --friction=X` com 4 e 8 sub-passos.
// [degrau, rocker μ1, rocker μ0,7, carro μ1, carro μ0,7]; "s4/s8" quando os
// dois discordam.
const ATRITO = [
  ['0,25', 'sobe', 'sobe', 'sobe', 'sobe'],
  ['0,30', 'sobe', 'sobe', 'sobe', 'sobe'],
  ['0,35', 'não', 'não', 'sobe', 'não'],
  ['0,40', 'não', 'não', 'sobe', 'não'],
  ['0,45', 'não', 'não', 'sobe', 'não'],
  ['0,50', 'não', 'não', 'sobe', 'não'],
];

function Celula({c}) {
  const [subiu, pen, pulo] = c;
  return (
    <td className="mono">
      {subiu ? <b className="yes">sobe</b> : <b className="no">não</b>} · {pen} m · {pulo} m/s
    </td>
  );
}

function Sobe({v}) {
  return <td>{v === 'sobe' ? <b className="yes">sobe</b> : <b className="no">não</b>}</td>;
}

export default function DossieRodaComMola() {
  const raioHref = useBaseUrl('/docs/multicorpo/raio-contra-cilindro');
  const bogieHref = useBaseUrl('/docs/multicorpo/rocker-bogie');
  const rockerHref = useBaseUrl('/docs/multicorpo/rocker-articulado');

  return (
    <div className="dossie tecnica mcorpo">
      {/* faixa de telemetria */}
      <div className="telemetry-strip">
        <span>
          <span className="dot" />
          sessão · 3 nov
        </span>
        <span>
          modo · <b>medição</b>
        </span>
        <span>
          montagem · <b>5 corpos · 4 juntas com mola</b>
        </span>
        <span>
          código · <b>gdjolt/src/car_rig.h</b>
        </span>
        <span>
          estado · <b>roda certa, limite no atrito</b>
        </span>
      </div>

      {/* hero */}
      <header className="hero-block">
        <div className="eyebrow">Multicorpo de verdade · a colisão da roda</div>
        <h1>
          A roda de verdade, <span className="accent">com mola</span>.
        </h1>
        <p className="lede">
          Na <a href={raioHref}>entrada anterior</a> o cilindro consertou quase
          tudo, mas a roda que deu o menor erro foi a que é <b>corpo</b>, no
          rocker e no bogie. É o caminho que o professor prefere. Faltava uma
          coisa nela: <b>mola</b>. Aqui eu monto um carro de quatro rodas com
          suspensão por junta, igual ao lumped em tudo o que dá para igualar, e
          meço no mesmo degrau.
        </p>

        <div className="callout" style={{marginTop: 22}}>
          <b>O resultado em uma linha:</b> no degrau de 0,20 m, a roda do carro
          entra <b>1,6 cm</b> no degrau e pula a <b>1,2 m/s</b>, contra 20 cm e
          12,2 m/s do raio e 2,1 cm e 2,0 m/s do cilindro. É o comportamento da
          roda do rocker, agora com suspensão. Acima do raio da roda, quem
          decide se o carro sobe é o <b>atrito</b>: com μ = 1 ele sobe até
          0,50 m, e com μ = 0,7 para em 0,30 m, que é o raio.
        </div>

        <div className="hero-meta">
          <span>
            a entrada anterior · <a href={raioHref}>O raio não vê a parede</a>
          </span>
        </div>
      </header>

      {/* 01 · a montagem */}
      <section>
        <div className="sec-head">
          <span className="sec-num">01</span>
          <h2>O lumped com as rodas promovidas a corpo</h2>
        </div>
        <p className="sec-intro">
          Copiei a ideia do <code>VehicleSixDOFTest</code> do Jolt. Cada roda é
          um corpo cilíndrico, preso ao chassi por uma{' '}
          <code>SixDOFConstraint</code>. No banco, a junta trava tudo menos dois
          eixos: a translação vertical, que é o curso da suspensão, e o giro do
          eixo, que tem motor. No Godot as dianteiras também podem esterçar. A mola é o <b>motor de posição</b> da translação
          vertical, com rigidez e amortecimento em unidades físicas.
        </p>

        <div className="code-block" style={{marginTop: 22}}>
          <div className="fname">5 corpos, 4 juntas · gdjolt/src/car_rig.h</div>
          <pre>
            <code>{`chassi
 ├─ SixDOF ──→ roda diant. esq   curso 0–0,2 m com mola · giro com motor
 ├─ SixDOF ──→ roda tras. esq
 ├─ SixDOF ──→ roda diant. dir
 └─ SixDOF ──→ roda tras. dir`}</code>
          </pre>
        </div>

        <p style={{marginTop: 22}}>
          Para a comparação medir o contato roda–chão e não a geometria, o carro
          copia o lumped em tudo o que dá:
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Item</th>
                <th>lumped · VehicleConstraint</th>
                <th>carro · roda corpo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Massa total</td>
                <td className="mono">1500 kg</td>
                <td className="mono">1300 kg chassi + 4 × 50 kg roda</td>
              </tr>
              <tr>
                <td>Chassi</td>
                <td colSpan={2}>
                  a mesma caixa, com o centro de massa baixado até a face de
                  baixo
                </td>
              </tr>
              <tr>
                <td>Pegada, fixação, curso</td>
                <td colSpan={2} className="mono">
                  x = ±0,9 · z = ±1,4 · fixação a −0,18 m · curso de 0,3 a 0,5 m
                </td>
              </tr>
              <tr>
                <td>Mola</td>
                <td>1,5 Hz e 0,5 contra a massa efetiva no contato</td>
                <td className="mono">
                  1,5 Hz e 0,5 por quarto de carro (325 kg): k = 28 869 N/m, c =
                  3063 N·s/m
                </td>
              </tr>
              <tr>
                <td>Afundamento parado</td>
                <td className="mono">13,7 cm</td>
                <td className="mono">
                  <b className="yes">11,0 cm</b> (conta: g/ω² = 11,0 cm)
                </td>
              </tr>
              <tr>
                <td>Tração</td>
                <td>motor e diferenciais nas quatro</td>
                <td>motor de velocidade no eixo das quatro, como o rocker</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="callout" style={{marginTop: 22}}>
          <b>Por que o lumped afunda mais.</b> A rigidez efetiva dele sai em ~26,9
          kN/m, só 7% abaixo da do carro. A maior parte da diferença é{' '}
          <b>carga</b>: a mola do lumped segura 375 kg por roda, porque ali a
          roda não tem massa própria, e a do carro segura 325 kg, porque os 50
          kg da roda ficam embaixo da mola. Na prática, o chassi do carro fica
          2,7 cm mais alto (0,870 contra 0,843 m), e pela conta o lumped
          oscilaria a ~1,35 Hz em vez de 1,5 (não medi a oscilação).
        </div>
      </section>

      {/* 02 · a medição */}
      <section>
        <div className="sec-head">
          <span className="sec-num">02</span>
          <h2>A medição</h2>
        </div>
        <p className="sec-intro">
          As mesmas duas medidas da entrada anterior, na roda dianteira:{' '}
          <b>penetração</b> (quanto o círculo da roda invade o degrau, de
          perfil) e <b>pulo</b> (a maior velocidade vertical dela). Degrau de
          0,10 a 0,50 m, 1,5 m/s, atrito 1, <b>8 sub-passos</b>: com 4, o pulo
          do carro sai até 28% alto. Em cada célula: se a roda traseira passou
          da face · penetração · pulo.
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Degrau</th>
                <th>lumped · raio</th>
                <th>lumped · cilindro</th>
                <th>rocker</th>
                <th>bogie</th>
                <th>carro · com mola</th>
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

        <Video id={VIDEOS.geral20} title="Raio, cilindro e roda com mola, degrau de 0,20 m">
          Raio, cilindro e roda com mola no degrau de 0,20 m
        </Video>
        <Video id={VIDEOS.lateral20} title="A roda com mola de perto, degrau de 0,20 m">
          A roda com mola de perto, degrau de 0,20 m: ela encosta na quina, a
          mola comprime e a roda sobe por cima
        </Video>

        <p style={{marginTop: 22}}>Três leituras:</p>
        <ul>
          <li>
            <b>A roda do carro colide como roda.</b> Ela entra 1–2 cm no degrau
            em qualquer altura, sem crescer com o degrau, e o pulo fica em
            1,1–1,3 m/s, a faixa do rocker e do bogie. O raio vai de 6 a 30 m/s,
            e o cilindro de 1,4 a 7,2 m/s.
          </li>
          <li>
            <b>A diferença de 1 cm para o rocker não é um resultado.</b> O carro
            fica em ~2 cm e o rocker em ~1 cm, e 2 cm é a ordem da folga que o
            Jolt aceita entre corpos (<code>mPenetrationSlop</code> e{' '}
            <code>mSpeculativeContactDistance</code>, os dois 0,02 m). Suspeito
            que venha daí, mas não testei: o banco não expõe essas folgas.
          </li>
          <li>
            <b>O chassi inclina o que o degrau manda.</b> Inclinação máxima de
            2,96° a 12,20° do degrau menor ao maior. Isso fica acima da conta
            geométrica (altura ÷ entre-eixos): 0,9° a mais em 0,10 m e 1,7–2,1°
            nos outros, por causa da arfagem e da mola comprimindo. Sem articulação, o carro não tem como segurar o
            chassi nivelado, como o rocker faz (0,0–1,7°).
          </li>
        </ul>
      </section>

      {/* 03 · o atrito */}
      <section>
        <div className="sec-head">
          <span className="sec-num">03</span>
          <h2>Acima do raio, quem decide é o atrito</h2>
        </div>
        <p className="sec-intro">
          O carro subir 0,50 m com roda de 0,30 m me pareceu armadilha. A
          telemetria mostra outra coisa: a roda não atravessa a face (2,2 cm de
          penetração) e não salta. Ela <b>escala a parede</b>. As traseiras
          empurram a dianteira contra a face, o atrito da face levanta a roda, e
          o curso da suspensão deixa ela subir sem levar o chassi junto. Para
          isso o atrito da face precisa segurar o peso da frente, e a força
          contra a face vem do atrito das traseiras no chão, então a conta de
          cabeça pede um μ perto de 1. Para testar, refiz a varredura com
          atrito 0,7 (novo <code>--friction=</code>):
        </p>

        <div className="tbl-wrap">
          <table className="ctab">
            <thead>
              <tr>
                <th>Degrau</th>
                <th>rocker · μ 1</th>
                <th>rocker · μ 0,7</th>
                <th>carro · μ 1</th>
                <th>carro · μ 0,7</th>
              </tr>
            </thead>
            <tbody>
              {ATRITO.map(([h, ...vs]) => (
                <tr key={h}>
                  <td className="mono">{h} m</td>
                  {vs.map((v, i) => (
                    <Sobe key={i} v={v} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Video id={VIDEOS.geral40} title="Raio, cilindro e roda com mola, degrau de 0,40 m">
          Raio, cilindro e roda com mola no degrau de 0,40 m: o raio atravessa,
          o cilindro para na face, a roda com mola escala
        </Video>
        <Video id={VIDEOS.lateral40} title="A roda com mola de perto, degrau de 0,40 m">
          A roda com mola de perto, degrau de 0,40 m: a roda escala a face pelo
          atrito
        </Video>

        <p style={{marginTop: 22}}>
          Com 4 e com 8 sub-passos, o resultado do carro é o mesmo. Com μ = 0,7
          ele sobe 0,30 m e não sobe 0,35 m, o mesmo limite do rocker, logo
          acima do raio da roda. Com μ = 0,5 ele não sobe nem 0,30 m. Só medi
          0,5, 0,7 e 1,0: o limiar fica entre 0,7 e 1, e não varri esse
          intervalo. O <b>rocker não muda com o atrito</b>: ele para pela
          geometria do braço rígido, e o carro para pelo atrito. O torque no
          eixo (3 × 10⁴ N·m, o mesmo do rocker) não parece ser o limite: numa
          cópia instrumentada do banco, o revisor baixou o torque e o carro
          ainda subiu 0,50 m com 2000 N·m (com 1000, não).
        </p>

        <div className="callout coral" style={{marginTop: 22}}>
          <b>O que eu não posso dizer:</b> "o carro sobe 0,50 m". Isso só vale,
          e só foi testado até 0,50 m,
          com μ = 1 entre roda e parede, que é atrito de pneu de trilha em rocha
          seca. E a partir de 0,40 m a suspensão chega no batente (0,200 m de
          0,20 m de curso; em 0,30 m ela vai até 0,18 m), então a inclinação e o
          pulo dos degraus mais altos incluem esse impacto.
        </div>
      </section>

      {/* 04 · ressalvas */}
      <section>
        <div className="sec-head">
          <span className="sec-num">04</span>
          <h2>O que o revisor achou antes de eu medir</h2>
        </div>
        <p className="sec-intro">
          Passei a montagem pelo revisor-fisico antes de tirar qualquer número.
          Ele bloqueou a medição por três motivos, e corrigi os três.
        </p>
        <div className="bug">
          <div className="symptom">
            <h4>O lumped andava mais rápido</h4>
            <p>
              O freio do acelerador proporcional só entrava acima de 2,0 m/s, e
              com o pé fora do acelerador a marcha lenta engatada ainda
              empurrava o carro. O lumped andava a <b>1,6–1,9 m/s</b> e
              atravessava o degrau em 4,2 s, menos que os 5,1 s de andar livre a
              1,5 m/s.
            </p>
          </div>
          <div className="cause">
            <h4>Correção</h4>
            <p>
              Freio com ganho alto assim que passa do alvo. Agora ele anda a
              ~1,55 m/s e atravessa em 5,1 s. As entradas anteriores ganharam
              nota de correção datada, com as tabelas mantidas como foram
              medidas; as conclusões delas não mudam.
            </p>
          </div>
        </div>
        <div className="bug">
          <div className="symptom">
            <h4>O esterço deixava o carro torto</h4>
            <p>
              O esterço das dianteiras é uma junta complacente (motor de posição
              a 10 Hz). Numa cópia instrumentada do banco, o revisor mediu com
              1 sub-passo a roda 2,5° torta e o carro derivando 0,7 m de lado
              em chão plano.
            </p>
          </div>
          <div className="cause">
            <h4>Correção</h4>
            <p>
              A manobra nunca esterça, então o banco mede com o esterço travado
              (<code>max_steer_deg = 0</code>), e a pista do vídeo também. O nó
              do Godot continua podendo esterçar.
            </p>
          </div>
        </div>
        <div className="bug">
          <div className="symptom">
            <h4>O pulo não convergia</h4>
            <p>
              Com 4 sub-passos o pulo do carro em 0,30 m dá 1,34 m/s; com 8,
              1,05; com 16, 1,05. A inclinação e a penetração já batiam com 4.
            </p>
          </div>
          <div className="cause">
            <h4>Correção</h4>
            <p>A tabela da seção 02 é toda com 8 sub-passos.</p>
          </div>
        </div>

        <p style={{marginTop: 22}}>
          Duas ressalvas ficam declaradas, sem correção. A primeira:{' '}
          <b>as quatro rodas podem brigar entre si</b>. São motores de
          velocidade rígidos, sem diferencial, e na cópia instrumentada o
          revisor viu, em regime, uma roda empurrando enquanto a da diagonal
          freava. O rocker tem os mesmos motores. Ainda não testei o efeito
          disso, e a coluna de torque do banco (impulso acumulado, não N·m) não
          serve para ler esforço. A segunda: <b>na partida o carro arfa
          1,7°</b> em chão plano, o que entra na inclinação máxima dos degraus
          pequenos.
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
            <h4>Um veículo off-road de verdade</h4>
            <p>
              A roda colide certo e a suspensão funciona. O próximo item da
              lista do professor é trocar a caixa por um modelo 3D de um veículo
              off-road (Baja, jipe ou buggy), com as rodas como peças separadas
              para cada uma virar um corpo desta montagem.
            </p>
          </div>
          <div className="tl-stop">
            <h4>Um atrito com lastro</h4>
            <p>
              O limite de subida depende do μ, então ele precisa vir de algum
              lugar, não de 1,0 por padrão. É uma ponte natural para o modelo de
              solo do grupo.
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
              VehicleSixDOFTest.cpp — roda como corpo, suspensão por junta
            </span>
            <span className="rk">↗ github</span>
          </a>
          <a
            href="https://github.com/jrouwe/JoltPhysics/blob/master/Jolt/Physics/Constraints/SixDOFConstraint.h"
            target="_blank"
            rel="noopener noreferrer">
            <span className="rd">SixDOFConstraint.h — eixos, limites e motores</span>
            <span className="rk">↗ github</span>
          </a>
        </div>

        {Object.values(VIDEOS).some(Boolean) && (
          <div className="rgrp">
            <h4>Os vídeos</h4>
            {[
              [VIDEOS.geral20, 'Raio, cilindro e roda com mola, degrau de 0,20 m'],
              [VIDEOS.lateral20, 'A roda com mola de perto, degrau de 0,20 m'],
              [VIDEOS.geral40, 'Raio, cilindro e roda com mola, degrau de 0,40 m'],
              [VIDEOS.lateral40, 'A roda com mola de perto, degrau de 0,40 m'],
            ]
              .filter(([id]) => id)
              .map(([id, t]) => (
                <a key={id} href={`https://youtu.be/${id}`} target="_blank" rel="noopener noreferrer">
                  <span className="rd">{t}</span>
                  <span className="rk">↗ youtube</span>
                </a>
              ))}
          </div>
        )}

        <div className="rgrp">
          <h4>As entradas relacionadas</h4>
          <a href={raioHref}>
            <span className="rd">O raio não vê a parede — o teste do shapecast</span>
            <span className="rk">→ nesta frente</span>
          </a>
          <a href={bogieHref}>
            <span className="rd">Seis rodas, uma vez e meia o raio — o bogie</span>
            <span className="rk">→ nesta frente</span>
          </a>
          <a href={rockerHref}>
            <span className="rd">Sete corpos, seis juntas — o rocker articulado</span>
            <span className="rk">→ nesta frente</span>
          </a>
        </div>
      </section>
    </div>
  );
}
