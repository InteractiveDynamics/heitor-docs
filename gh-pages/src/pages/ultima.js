import React, {useEffect} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * /ultima — atalho fixo para a documentação publicada por último.
 *
 * Quem decide qual é a última é o plugin plugins/ultima-doc.js, no build. A
 * página em si só redireciona; o link visível fica para quem estiver sem
 * JavaScript, já que o GitHub Pages não faz redirecionamento no servidor.
 */
export default function Ultima() {
  const {permalink, titulo} = usePluginData('ultima-doc');
  const destino = useBaseUrl(permalink);
  const history = useHistory();

  useEffect(() => {
    history.replace(destino);
  }, [history, destino]);

  return (
    <Layout title="Última publicação" noFooter>
      <main className="container margin-vert--xl">
        <p>
          Abrindo a última publicação:{' '}
          <Link to={permalink}>{titulo} →</Link>
        </p>
      </main>
    </Layout>
  );
}
