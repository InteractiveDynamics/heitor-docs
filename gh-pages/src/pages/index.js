import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {usePluginData} from '@docusaurus/useGlobalData';
import Layout from '@theme/Layout';
import styles from './index.module.css';

/**
 * Índice das frentes de trabalho. Adicionar/atualizar uma frente é só editar
 * este array — a home acompanha. `status: 'ativa'` vira card clicável; qualquer
 * outro valor vira card "planejado".
 */
const FRENTES = [
  {
    titulo: 'Estudos & notas',
    desc: 'Explorações e notas de aprendizado avulsas — como o dossiê do sandbox no Godot.',
    status: 'ativa',
    to: '/docs/notas/dossie-godot',
  },
  {
    titulo: 'Dinâmica multicorpo (C++)',
    desc: 'Corpos rígidos, juntas e constraints — do paradigma (e dos limites do Jolt no Godot) ao modelo rigoroso.',
    status: 'ativa',
    to: '/docs/multicorpo/visao-geral',
  },
  {
    titulo: 'Powertrain e tração',
    desc: 'Motor → transmissão → roda → força de tração via torque.',
    status: 'ativa',
    to: '/docs/powertrain/visao-geral',
  },
  {
    titulo: 'Suspensão',
    desc: 'Modelo mola-amortecedor e configuração rocker-bogie pra rovers.',
    status: 'ativa',
    to: '/docs/suspensao/visao-geral',
  },
  {
    titulo: 'Contrato de API',
    desc: 'Interface entre o modelo veicular e a camada ExoPhysics/plataforma.',
    status: 'planejada',
    to: '/docs/api-contrato/visao-geral',
  },
  {
    titulo: 'Integração roda–solo',
    desc: 'Contato roda–solo por raycast (força-baseado), isolado numa fronteira de API pronta pra ExoPhysics.',
    status: 'ativa',
    to: '/docs/roda-solo/visao-geral',
  },
  {
    titulo: 'Validação comparativa',
    desc: 'Comparação com Chrono e SCM, com métricas quantitativas.',
    status: 'planejada',
    to: '/docs/validacao/visao-geral',
  },
];

/**
 * O desenho do hero: um rocker-bogie de perfil subindo um degrau, em traço
 * dourado. É decorativo (aria-hidden) — a única peça ousada da página, e vem do
 * assunto do projeto. Sem texto dentro, para não criar informação nova.
 */
function RoverDrawing() {
  const r = 22;
  const rear = [118, 218];
  const middle = [226, 218];
  const front = [292, 178];
  const bogiePivot = [262, 176];
  const rockerPivot = [214, 150];
  return (
    <svg
      className={styles.drawing}
      viewBox="0 0 440 300"
      aria-hidden="true"
      focusable="false">
      <defs>
        <pattern id="hachura" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" className={styles.hatch} />
        </pattern>
      </defs>
      {/* terreno com o degrau, e a hachura de solo de desenho técnico */}
      <path className={styles.groundFill} d="M0 240 H250 V200 H440 V300 H0 Z" fill="url(#hachura)" />
      <path className={styles.ground} d="M0 240 H250 V200 H440" />
      {/* cota do degrau */}
      <path className={styles.dim} d="M262 240 H300 M262 200 H300 M292 204 V236" />
      {/* chassi */}
      <rect className={styles.body} x="146" y="112" width="156" height="24" rx="3" />
      <line className={styles.link} x1={rockerPivot[0]} y1="136" x2={rockerPivot[0]} y2={rockerPivot[1]} />
      {/* rocker: roda traseira ↔ pivô do bogie, articulado no chassi */}
      <polyline className={styles.link} points={`${rear} ${rockerPivot} ${bogiePivot}`} />
      {/* bogie: as duas rodas da frente */}
      <polyline className={styles.link} points={`${middle} ${bogiePivot} ${front}`} />
      {[rear, middle, front].map(([x, y]) => (
        <g key={x}>
          <circle className={styles.wheel} cx={x} cy={y} r={r} />
          <circle className={styles.hub} cx={x} cy={y} r="3.5" />
        </g>
      ))}
      {[rockerPivot, bogiePivot].map(([x, y]) => (
        <circle key={x} className={styles.pivot} cx={x} cy={y} r="5" />
      ))}
    </svg>
  );
}

function Telemetry() {
  return (
    <div className={styles.telemetry}>
      <div className={styles.inner}>
        <span>
          <span className={styles.dot} />
          documentação · viva
        </span>
        <span>
          frentes · <b>7 mapeadas</b>
        </span>
        <span>
          publicadas · <b>5</b>
        </span>
        <span>
          foco · <b>dinâmica veicular</b>
        </span>
      </div>
    </div>
  );
}

function Card({frente, num}) {
  const ativa = frente.status === 'ativa';
  const inner = (
    <>
      <div className={styles.cardTop}>
        <span className={styles.cardNum}>
          {String(num).padStart(2, '0')}
        </span>
        <span
          className={clsx(
            styles.badge,
            ativa ? styles.badgeActive : styles.badgePlanned,
          )}>
          <span className={styles.pulse} />
          {ativa ? 'ativa' : 'planejada'}
        </span>
      </div>
      <h3 className={styles.cardTitle}>{frente.titulo}</h3>
      <p className={styles.cardDesc}>{frente.desc}</p>
      <span className={styles.cardLink}>
        {ativa ? 'abrir →' : 'ver escopo →'}
      </span>
    </>
  );

  return (
    <Link
      to={frente.to}
      className={clsx(
        styles.card,
        ativa ? styles.cardActive : styles.cardPlanned,
      )}>
      {inner}
    </Link>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  // Calculada no build por plugins/ultima-doc.js: sempre a doc mais recente.
  const ultima = usePluginData('ultima-doc');
  return (
    <Layout
      title={siteConfig.title}
      description="Documentação das frentes de trabalho do meu PIBIC em dinâmica veicular.">
      <header className={styles.hero}>
        <div className={clsx(styles.wrap, styles.heroGrid)}>
          <div className={styles.heroText}>
          <div className={styles.eyebrow}>
            Iniciação Científica · Dinâmica veicular
          </div>
          <h1 className={styles.title}>
            A documentação viva das minhas{' '}
            <span className={styles.accent}>frentes de trabalho</span>.
          </h1>
          <p className={styles.lede}>
            Este é o ponto de partida. Começou com um sandbox de carro no Godot
            pra ganhar intuição e já cresceu pros <strong>fundamentos</strong> —
            powertrain, torque e suspensão. À medida que cada frente avança, do
            modelo multicorpo em C++ à validação contra o Chrono, a documentação
            correspondente aparece aqui.
          </p>
          <div className={styles.actions}>
            <Link className={styles.btnPrimary} to={ultima.permalink}>
              Última publicação · {ultima.titulo} →
            </Link>
            <Link className={styles.btnGhost} to="/docs/notas/dossie-godot">
              Primeiro dossiê
            </Link>
            <Link className={styles.btnGhost} to="/docs/roadmaps">
              Sprints semanais
            </Link>
            <Link className={styles.btnGhost} to="/docs/intro">
              Ver índice de frentes
            </Link>
          </div>
          <Telemetry />
          </div>
          <RoverDrawing />
        </div>
      </header>

      <main className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.secHead}>
            <span className={styles.secNum}>7</span>
            <h2 className={styles.secTitle}>Frentes mapeadas</h2>
          </div>
          <p className={styles.secIntro}>
            Cada frente vira uma seção que cresce com o tempo — das explorações
            iniciais pra pegar intuição até a documentação técnica densa do
            modelo de verdade. As marcadas como <b>planejadas</b> já têm a
            estrutura pronta, esperando conteúdo.
          </p>
          {/* Agrupadas por status; cada ficha mantém o número da ordem original. */}
          {['ativa', 'planejada'].map((grupo) => {
            const itens = FRENTES.map((f, i) => ({f, num: i + 1})).filter(
              ({f}) => (grupo === 'ativa') === (f.status === 'ativa'),
            );
            return (
              <section key={grupo} className={styles.group}>
                <h3 className={styles.groupTitle}>{grupo}</h3>
                <div className={styles.list}>
                  {itens.map(({f, num}) => (
                    <Card key={f.titulo} frente={f} num={num} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}
