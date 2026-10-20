import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Roadmap da semana 19–26/out/2026 · Roda de verdade, com mola.
 *
 * Nasce da resposta do professor, por áudio, aos vídeos do bogie: a colisão da
 * roda com o chão está errada no modelo de um corpo só, e o caminho que ele
 * prefere é a roda como corpo, presa por junta com mola. O teste do shapecast
 * (14/out) confirmou o diagnóstico em números; esta semana constrói o carro.
 *
 * Reutiliza src/css/roadmap.css (escopo `.roadmap`).
 */
export default function RoadmapRodaComMola() {
  const raioHref = useBaseUrl('/docs/multicorpo/raio-contra-cilindro');
  const bogieHref = useBaseUrl('/docs/multicorpo/rocker-bogie');
  const anteriorHref = useBaseUrl('/docs/roadmaps/semana-2026-09-28');
  const rodaSoloHref = useBaseUrl('/docs/roda-solo/visao-geral');

  return (
    <div className="roadmap">
      {/* hero */}
      <header className="rm-hero">
        <div className="countdown">
          <span className="big">~1 cm</span>
          <span className="sep mono">·······</span>
          <span className="goal">QUANTO A RODA DE VERDADE ENTRA NO DEGRAU</span>
        </div>
        <span className="eyebrow">Semana · 19 out → 26 out</span>
        <h1>
          Roda de verdade, <span className="accent">com mola</span>
        </h1>
        <p className="lede">
          A reunião de 29/set não aconteceu. Mandei o andamento por mensagem, e
          o professor respondeu por áudio. A resposta mudou o rumo: antes de
          diferencial, de vários veículos ou de terreno, a{' '}
          <b>colisão da roda com o chão</b> tem que estar certa. O teste da
          semana passada confirmou o diagnóstico dele em números, e esta semana
          eu construo o que ele propôs: um carro com <b>rodas que são corpos</b>,
          presas ao chassi por <b>junta com mola</b>.
        </p>

        <div className="callout amber" style={{marginTop: 22}}>
          <span className="lbl">◈ o registro honesto</span>
          O plano do <a href={anteriorHref}>roadmap de 28/set</a> (diferencial,
          N veículos por quadro, primeiro passo do terreno) <b>não foi
          feito</b>. Parte disso foi o áudio do professor apontando outra
          prioridade, e parte foi semana sem roadmap de novo. O teste do
          shapecast só saiu em 14/out. A regra de roadmap toda segunda continua
          valendo, e este aqui é o da semana que já começou.
        </div>
      </header>

      {/* 01 · o que o professor disse */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">★</span>
          <h2>O que o professor respondeu</h2>
        </div>
        <p className="sec-sub">
          Do áudio, na ordem em que ele colocou as prioridades.
        </p>

        <div className="deliv">
          <div className="drow">
            <span className="dn mono">1 · agora</span>
            <span className="dt">
              A roda do modelo de um corpo só procura o chão com um <b>raio</b>,
              que enxerga um ponto só. Num degrau, ela entra na face e depois
              salta. Dois caminhos: um <b>shapecast</b>, ou a roda como corpo
              com colisor cilíndrico, presa por junta e mola. Ele prefere o
              segundo, por ser o mais correto fisicamente. Continuar com o{' '}
              <b>Jolt</b> e com a <b>GDExtension</b>.
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">2 · depois</span>
            <span className="dt">
              Um modelo 3D de verdade de um <b>veículo off-road</b> (Baja, jipe
              ou buggy). Rover ainda não.
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">3 · mais adiante</span>
            <span className="dt">
              Integrar o <b>modelo de solo</b> do grupo (Roberto e Maurício),
              vídeos de demonstração (Godot e render no Blender), uma página do
              grupo e posts no YouTube e no LinkedIn.
            </span>
          </div>
        </div>
      </section>

      {/* 02 · já feito */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">✔</span>
          <h2>O item 1, primeira metade · já feito</h2>
        </div>

        <div className="cards">
          <div className="card">
            <div className="kind">14 out</div>
            <h3>O shapecast, medido</h3>
            <p>
              No degrau de 0,20 m, o raio deixa a roda entrar <b>20 cm</b> e
              pular a <b>12,8 m/s</b>. O cilindro reduz para <b>2,4 cm</b> e{' '}
              <b>2,4 m/s</b>. A roda de verdade do rocker fica em <b>1,3 cm</b>{' '}
              e <b>1,2 m/s</b>. Quatro vídeos raio × cilindro.{' '}
              <a href={raioHref}>O raio não vê a parede</a>.
            </p>
          </div>
          <div className="card">
            <div className="kind">20 out</div>
            <h3>O limite do cilindro, explicado</h3>
            <p>
              Ficou a dúvida se o cilindro parava em 0,40 m por causa da
              suspensão. Não é: mudar o curso e o ponto de partida da varredura
              não muda nada, e a roda fica parada encostada na face. É o mesmo
              limite físico do rocker, logo acima do raio da roda.
            </p>
          </div>
        </div>

        <div className="callout" style={{marginTop: 22}}>
          <span className="lbl">◈ o que isso decide</span>
          O cilindro é a correção barata, de uma linha, e fica disponível no nó
          do Godot (<code>collision_tester</code>). Mas a roda de verdade deu o
          menor erro, e é a que o professor prefere. No rocker e no bogie ela
          já existe, <b>só falta a mola</b>.
        </div>
      </section>

      {/* 03 · a semana */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⇉</span>
          <h2>A semana</h2>
        </div>
        <p className="sec-sub">
          Um carro de quatro rodas, comparável com tudo o que já foi medido:
          mesma massa, mesma pegada, mesma roda e o mesmo degrau.
        </p>

        <div className="spine">
          <div className="stop seam">
            <div className="code">TER–QUA · 20–21 OUT</div>
            <h3>O carro com suspensão por junta</h3>
            <ol className="steps">
              <li>
                Ler o <code>VehicleSixDOFTest</code> do Jolt: cada roda é um
                corpo cilíndrico, e uma <code>SixDOFConstraint</code> libera o
                curso vertical (com limite), o giro do eixo e, nas da frente, o
                esterço. A mola é o motor de posição da translação vertical.
              </li>
              <li>
                Montar um header compartilhado, como o{' '}
                <code>src/rocker_rig.h</code>, para o banco de ensaio e o nó do
                Godot usarem o mesmo código: 5 corpos, 4 juntas, motor no eixo.
              </li>
              <li>
                Antes de medir, passar o <code>revisor-fisico</code>: massa
                total de 1500 kg, frequência e amortecimento da mola iguais aos do
                lumped (1,5 Hz e 0,5), curso coerente, filtro de colisão
                cobrindo os 5 corpos.
              </li>
              <li>
                Conferir a mola parada: o quanto o carro afunda no chão tem que
                bater com a conta da frequência escolhida.
              </li>
            </ol>
            <span className="doit">↳ --rig=carro no vehicle_probe</span>
          </div>
          <div className="stop">
            <div className="code">QUI · 22 OUT</div>
            <h3>Medir e gravar</h3>
            <ol className="steps">
              <li>
                Entrar no <code>--testers</code> e na varredura, ao lado do
                lumped com raio, do lumped com cilindro, do rocker e do bogie.
                Penetração, pulo, até onde sobe e inclinação, com 4 e 8
                sub-passos.
              </li>
              <li>
                Nó do Godot e uma pista na cena dos testadores. Vídeo: raio,
                cilindro e roda com mola no mesmo degrau.
              </li>
            </ol>
            <span className="doit">↳ a tabela com a quinta coluna e o vídeo</span>
          </div>
          <div className="stop final">
            <div className="code">SEX · 23 OUT</div>
            <h3>Publicar e escolher o modelo 3D</h3>
            <ol className="steps">
              <li>
                Publicar a entrada do carro com mola, com os vídeos embutidos.
              </li>
              <li>
                Levantar candidatos de modelo 3D off-road (Baja, jipe, buggy):
                licença de uso, escala real, rodas como peças separadas e número
                de polígonos que o Godot aguenta. Escrever a nota de decisão.
              </li>
            </ol>
            <span className="doit">↳ entrada publicada, modelo escolhido</span>
          </div>
        </div>
      </section>

      {/* 04 · perguntas */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">?</span>
          <h2>Perguntas para o professor</h2>
        </div>
        <div className="qbox">
          <h3>Para o próximo passo</h3>
          <ul>
            <li>
              O veículo off-road tem que ser algum <b>específico</b>, como um
              Baja SAE de equipe com dados reais de massa e suspensão, ou
              qualquer modelo 3D com proporções plausíveis serve?
            </li>
            <li>
              Para o modelo de solo do Roberto e do Maurício: em que formato ele
              está (código, artigo, equações), e com quem eu converso para
              começar a integração?
            </li>
            <li>
              O render no Blender é para os vídeos de divulgação, ou também
              precisa sair da simulação, como exportar a trajetória do Godot?
            </li>
          </ul>
        </div>
      </section>

      {/* 05 · trava de escopo */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">✕</span>
          <h2>Esta semana eu NÃO vou</h2>
        </div>
        <div className="rm-guard">
          <span className="lbl">✕ trava de escopo</span>
          <p className="sub">
            <b>Primeiro a roda certa, depois o resto.</b> Tudo abaixo depende de
            o contato roda–chão estar resolvido.
          </p>
          <ul>
            <li>O diferencial do rocker-bogie (rover ficou para depois)</li>
            <li>
              O modelo de solo e a frente <a href={rodaSoloHref}>roda–solo</a>
            </li>
            <li>Render no Blender, página do grupo e posts</li>
            <li>Importar e montar o modelo 3D (esta semana é só escolher)</li>
          </ul>
        </div>
      </section>

      {/* 06 · entregáveis */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">✔</span>
          <h2>O que sai desta sprint</h2>
        </div>
        <div className="deliver">
          <h3>Já entregue</h3>
          <ul>
            <li>
              <b>O teste do shapecast</b>: <code>--testers</code> no banco,{' '}
              <code>collision_tester</code> no Godot e a cena{' '}
              <code>testadores.tscn</code>.
            </li>
            <li>
              <b>A entrada publicada</b>, com quatro vídeos:{' '}
              <a href={raioHref}>O raio não vê a parede</a>.
            </li>
            <li>
              <b>O limite do cilindro explicado</b>: é a face, não a suspensão.
            </li>
          </ul>
        </div>
        <div className="deliver" style={{marginTop: 18}}>
          <h3>Até sexta, 23 de outubro</h3>
          <ul>
            <li>
              <b>O carro com rodas de verdade e mola</b>, no banco e no Godot.
            </li>
            <li>
              <b>A comparação</b> com raio, cilindro, rocker e bogie, e o vídeo.
            </li>
            <li>
              <b>A entrada publicada</b> e a <b>nota de escolha</b> do modelo 3D
              off-road.
            </li>
          </ul>
        </div>
        <p style={{marginTop: 18}}>
          Os vídeos que levaram ao áudio do professor estão em{' '}
          <a href={bogieHref}>Seis rodas, uma vez e meia o raio</a>.
        </p>
      </section>
    </div>
  );
}
