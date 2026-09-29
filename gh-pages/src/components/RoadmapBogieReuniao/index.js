import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Roadmap da semana 28/set–5/out/2026 · De volta à mesa.
 *
 * Serve de pauta para a reunião de 29/set, a primeira desde que a de 8/set foi
 * cancelada. Nasce de uma semana parada (21–28/set, sem produção) e de um dia de
 * trabalho em 28/set que fechou o bogie, o entregável-âncora que estava pendente
 * desde o roadmap de 14–21/set.
 *
 * Reutiliza src/css/roadmap.css (escopo `.roadmap`).
 */
export default function RoadmapBogieReuniao() {
  const ponteHref = useBaseUrl('/docs/multicorpo/ponte-gdextension');
  const gdchronoHref = useBaseUrl('/docs/multicorpo/gdchrono-comparado');
  const rockerHref = useBaseUrl('/docs/multicorpo/rocker-articulado');
  const bogieHref = useBaseUrl('/docs/multicorpo/rocker-bogie');
  const anteriorHref = useBaseUrl('/docs/roadmaps/semana-2026-09-14');
  const rodaSoloHref = useBaseUrl('/docs/roda-solo/visao-geral');

  return (
    <div className="roadmap">
      {/* hero */}
      <header className="rm-hero">
        <div className="countdown">
          <span className="big">0,45 m</span>
          <span className="sep mono">·······</span>
          <span className="goal">O DEGRAU QUE O BOGIE SOBE</span>
        </div>
        <span className="eyebrow">Semana · 28 set → 5 out</span>
        <h1>
          De volta <span className="accent">à mesa</span>
        </h1>
        <p className="lede">
          A reunião de 8/set foi cancelada, e a de <b>29/set</b> é a primeira
          desde a ponte GDExtension. Nesse intervalo saíram{' '}
          <b>três entradas</b> que o professor ainda não viu: a ponte rodando, a
          leitura do GDChrono e a plataforma articulada medida. Este roadmap é a
          pauta dessa conversa e o plano da semana que vem depois dela.
        </p>

        <div className="callout amber" style={{marginTop: 22}}>
          <span className="lbl">◈ o registro honesto</span>
          A semana de <b>21 a 28/set ficou parada</b>: nenhum commit, nenhum
          roadmap. O bogie, que era o entregável-âncora do{' '}
          <a href={anteriorHref}>roadmap de 14–21/set</a>, ficou pendente até{' '}
          <b>28/set</b>, quando saiu num dia só junto com a varredura, os vídeos
          e a entrada publicada. Fica anotado para eu não repetir: quando a
          reunião some, o ritmo some junto, e o roadmap semanal é o que segura o
          ritmo.
        </div>
      </header>

      {/* 01 · o que levo */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">★</span>
          <h2>O que levo para a reunião</h2>
        </div>
        <p className="sec-sub">
          Em ordem cronológica, que é também a ordem em que uma coisa torna a
          outra possível.
        </p>

        <div className="deliv">
          <div className="drow">
            <span className="dn mono">1 · a ponte</span>
            <span className="dt">
              Uma GDExtension em C++ com um <code>PhysicsSystem</code> do Jolt
              próprio dentro do Godot. O Godot desenha, o Jolt simula. Tem vídeo.{' '}
              <a href={ponteHref}>Dois mundos, uma cena</a>.
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">2 · o GDChrono</span>
            <span className="dt">
              Li o código dele e cheguei ao mesmo desenho de arquitetura sem
              combinarmos. Mostro as três diferenças em que ele está à frente.{' '}
              <a href={gdchronoHref}>Duas pontes, um desenho</a>.
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">3 · o articulado</span>
            <span className="dt">
              7 corpos e 6 juntas. No mesmo degrau, o chassi fica a <b>0,00°</b>{' '}
              contra <b>4,34°</b> do modelo de um corpo só. E o modelo de um
              corpo só <b>trapaceia</b>: sobe degrau maior que a roda porque não
              enxerga a face.{' '}
              <a href={rockerHref}>Sete corpos, seis juntas</a>.
            </span>
          </div>
          <div className="drow">
            <span className="dn mono">4 · o bogie</span>
            <span className="dt">
              11 corpos e 10 juntas. Com roda de 0,30 m, sobe até <b>0,45 m</b>,
              e o rocker de quatro rodas não passa de <b>0,30 m</b>. Vídeo das
              três montagens lado a lado.{' '}
              <a href={bogieHref}>Seis rodas, uma vez e meia o raio</a>.
            </span>
          </div>
        </div>

        <div className="callout" style={{marginTop: 22}}>
          <span className="lbl">◈ o que abrir na tela</span>
          Primeiro o{' '}
          <a href="https://youtu.be/asxpnhdJ-Lk" target="_blank" rel="noopener noreferrer">
            vídeo comparativo com degrau de 0,40 m
          </a>
          : as três
          montagens juntas, com o placar ao vivo. Ele mostra em 13 s os três
          resultados de uma vez. O modelo de um corpo só passa pela face, o
          rocker de quatro empaca e o bogie sobe. Se ele perguntar pelos
          detalhes, tenho de perto o{' '}
          <a href="https://youtu.be/aOc7P4dhIiA" target="_blank" rel="noopener noreferrer">
            bogie articulando
          </a>{' '}
          e o{' '}
          <a href="https://youtu.be/LW7gbjetI8E" target="_blank" rel="noopener noreferrer">
            lumped atravessando a face
          </a>
          . Depois abro as entradas para os números.
        </div>
      </section>

      {/* 02 · o que preciso contar */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⚠</span>
          <h2>Duas coisas que preciso contar antes que ele pergunte</h2>
        </div>

        <div className="cards">
          <div className="card amber">
            <div className="kind">uma correção</div>
            <h3>O rocker não parava em 0,30 m</h3>
            <p>
              Eu tinha publicado que o rocker de quatro rodas <b>para</b> no
              degrau do tamanho do raio. Ele fica uns 2 s travado na face e{' '}
              <b>depois sobe</b>. O ensaio de 7 s acabava antes. O limite
              continua no raio (sobe 0,30, não sobe 0,35), mas o número estava
              mal lido. Corrigido e marcado nas duas entradas.
            </p>
          </div>
          <div className="card amber">
            <div className="kind">uma ressalva</div>
            <h3>O "0,00°" é equilíbrio neutro</h3>
            <p>
              Os pivôs do chassi são coaxiais e passam pelo centro de massa, então
              a gravidade não endireita o chassi. O 0,00° quer dizer que{' '}
              <b>nada o tirou do nível</b>, não que algo o segura nivelado. Rover
              de verdade tem <b>diferencial</b> entre os rockers, e o meu ainda
              não tem.
            </p>
          </div>
        </div>
      </section>

      {/* 03 · perguntas */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">?</span>
          <h2>Perguntas para o professor</h2>
        </div>
        <p className="sec-sub">
          As de 8/set continuam valendo, porque aquela reunião não aconteceu.
          Entraram duas novas, que saíram do bogie.
        </p>

        <div className="qbox">
          <h3>Sobre o rumo · as que decidem a próxima sprint</h3>
          <ul>
            <li>
              O alvo é <b>uma</b> ponte ou <b>duas</b>? Faz sentido ter Jolt e
              Chrono lado a lado, um para tempo real e outro para fidelidade, ou
              é para convergir numa só?
            </li>
            <li>
              O rover de referência é o <b>Viper</b> do GDChrono, ou um rover da
              ExoTerra com geometria própria? Até agora a montagem é genérica de
              propósito.
            </li>
            <li>
              O que conta como <b>validação</b> para o PIBIC: comparar contra o
              Chrono na mesma manobra, ou contra dado experimental?
            </li>
            <li>
              O rover precisa rodar em <b>tempo real</b>? Hoje o bogie cabe com
              folga num quadro de 60 Hz, mas a resposta muda o quanto eu posso
              gastar com sub-passos e terreno.
            </li>
          </ul>
        </div>

        <div className="qbox">
          <h3>Novas · saídas do bogie</h3>
          <ul>
            <li>
              O <b>diferencial</b> é o próximo passo certo, ou prefiro ir para o
              terreno primeiro e aceitar o chassi em equilíbrio neutro por
              enquanto?
            </li>
            <li>
              Para comparar com o Chrono, o <b>degrau de face vertical</b> é um
              bom obstáculo padrão, ou existe uma manobra de referência que o
              grupo já usa?
            </li>
          </ul>
        </div>

        <div className="qbox">
          <h3>Sobre o código dele</h3>
          <ul>
            <li>
              O <b>passo de 0,5 ms</b> do GDChrono foi escolhido por convergência
              do SCM, por estabilidade das juntas do Viper, ou empiricamente?
            </li>
            <li>
              Em <code>ChWorld.cpp</code>, o{' '}
              <code>SCMTerrain terrain(&amp;sys)</code> é variável local dentro
              do <code>Init()</code>. O terreno continua vivo depois que a função
              retorna?
            </li>
          </ul>
        </div>
      </section>

      {/* 04 · a semana */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">⇉</span>
          <h2>A semana depois da reunião</h2>
        </div>
        <p className="sec-sub">
          O plano abaixo é o que eu faço <b>se as respostas não mudarem o
          rumo</b>. Se o professor apontar para o Viper ou para o Chrono, esta
          seção é reescrita na quarta.
        </p>

        <div className="spine">
          <div className="stop seam">
            <div className="code">TER–QUA · 30 SET–1 OUT</div>
            <h3>O diferencial</h3>
            <ol className="steps">
              <li>
                Montar a barra do diferencial como um corpo a mais em{' '}
                <code>src/rocker_rig.h</code>, ligado ao chassi e aos dois
                rockers, para o chassi ficar no <b>ângulo médio</b> entre eles.
              </li>
              <li>
                Antes de medir, provar que ele funciona: com uma roda de um lado
                sobre o degrau, o chassi tem que inclinar <b>metade</b> do que o
                rocker daquele lado inclina.
              </li>
              <li>
                Refazer a varredura de degrau e a inclinação no 0,45 m, que é
                onde o equilíbrio neutro mais aparece (15°).
              </li>
            </ol>
            <span className="doit">↳ chassi nivelado por mecanismo, não por falta de perturbação</span>
          </div>
          <div className="stop">
            <div className="code">QUI · 2 OUT</div>
            <h3>Quantos cabem num quadro</h3>
            <ol className="steps">
              <li>
                <code>--count=N</code> no <code>vehicle_probe</code>: N bogies no
                mesmo <code>PhysicsSystem</code>, afastados para não colidirem.
              </li>
              <li>
                A curva de µs por quadro contra N, até cruzar os 16,7 ms. É o
                que sobra da faixa A.
              </li>
            </ol>
            <span className="doit">↳ "cabem N rovers a 60 Hz nesta máquina"</span>
          </div>
          <div className="stop final">
            <div className="code">SEX · 3 OUT</div>
            <h3>O terreno, primeiro passo</h3>
            <ol className="steps">
              <li>
                Trocar o chão de caixa por <code>HeightFieldShape</code> na cena
                comparativa e conferir que as três montagens respondem ao relevo.
              </li>
              <li>
                Anotar o que o <code>SCMTerrain</code> calcula e o Jolt não
                calcula, como nota de decisão para a frente{' '}
                <a href={rodaSoloHref}>roda–solo</a>.
              </li>
            </ol>
            <span className="doit">↳ relevo rodando, nota de decisão escrita</span>
          </div>
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
            <b>Primeiro a resposta do professor, depois o rumo.</b> Nada que só
            faça sentido num dos caminhos antes de saber qual é.
          </p>
          <ul>
            <li>Modelar o Viper ou um rover da ExoTerra antes de saber qual é o alvo</li>
            <li>Escrever terramecânica do zero</li>
            <li>Refatorar a cena para nascer da física</li>
            <li>Migrar o build para CMake</li>
          </ul>
        </div>
        <div className="callout">
          <span className="lbl">◈ regra que volta a valer</span>
          <b>Roadmap toda segunda, com ou sem reunião.</b> A semana de 21–28 não
          teve roadmap e não teve produção, e não foi coincidência.
        </div>
      </section>

      {/* 06 · entregáveis */}
      <section className="rm-sec">
        <div className="sec-head">
          <span className="num">✔</span>
          <h2>O que sai desta sprint</h2>
        </div>
        <div className="deliver">
          <h3>Já entregue · 28 set</h3>
          <ul>
            <li>
              <b>O rocker-bogie de seis rodas</b>, 11 corpos e 10 juntas, no
              terminal e no Godot.
            </li>
            <li>
              <b>A varredura das três montagens</b>, de 0,10 a 0,50 m, conferida
              com 4 e 8 sub-passos.
            </li>
            <li>
              <b>A cena comparativa</b> (<code>gdjolt/demo/comparativo.tscn</code>)
              e os vídeos gravados a partir dela.
            </li>
            <li>
              <b>A entrada publicada</b>:{' '}
              <a href={bogieHref}>Seis rodas, uma vez e meia o raio</a>.
            </li>
          </ul>
        </div>
        <div className="deliver" style={{marginTop: 18}}>
          <h3>Até sexta, 3 de outubro</h3>
          <ul>
            <li>
              <b>O diferencial</b> e a varredura refeita com ele.
            </li>
            <li>
              <b>A curva de N veículos</b> por quadro.
            </li>
            <li>
              <b>O relevo</b> na cena comparativa e a nota de decisão sobre o
              solo.
            </li>
            <li>
              <b>As respostas da reunião</b> registradas aqui, e este roadmap
              reescrito se o rumo mudar.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
