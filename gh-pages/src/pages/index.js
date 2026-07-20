import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
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
    desc: 'Corpos rígidos, articulações e o salto do arcade car pro modelo rigoroso.',
    status: 'planejada',
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
    desc: 'Contato roda–solo e simulação acoplada veículo–solo deformável.',
    status: 'planejada',
    to: '/docs/roda-solo/visao-geral',
  },
  {
    titulo: 'Validação comparativa',
    desc: 'Comparação com Chrono e SCM, com métricas quantitativas.',
    status: 'planejada',
    to: '/docs/validacao/visao-geral',
  },
];

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
          publicadas · <b>3</b>
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
  return (
    <Layout
      title={siteConfig.title}
      description="Documentação das frentes de trabalho do meu PIBIC em dinâmica veicular.">
      <Telemetry />

      <header className={styles.hero}>
        <div className={styles.wrap}>
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
            <Link
              className={styles.btnPrimary}
              to="/docs/notas/dossie-godot">
              Ler o primeiro dossiê →
            </Link>
            <Link className={styles.btnGhost} to="/docs/roadmaps">
              Sprints semanais
            </Link>
            <Link className={styles.btnGhost} to="/docs/intro">
              Ver índice de frentes
            </Link>
          </div>
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
          <div className={styles.grid}>
            {FRENTES.map((f, i) => (
              <Card key={f.titulo} frente={f} num={i + 1} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
