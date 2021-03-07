import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate, {translate} from '@docusaurus/Translate'
import styles from './styles.module.css';

const features = [
  {
    title: 'Fast',
    imageUrl: 'img/features/fast.svg',
    description: (
      <Translate>
        pnpm is up to <b>2x faster</b> than the alternatives (see <a href="https://github.com/pnpm/node-package-manager-benchmark">benchmarks</a>)
      </Translate>
    ),
  },
  {
    title: 'Efficient',
    imageUrl: 'img/features/efficient.svg',
    description: (
      <Translate>
        Files inside <strong>node_modules</strong> are linked from a single <strong>content-addressable storage</strong>
      </Translate>
    ),
  },
  {
    title: 'Supports monorepos',
    imageUrl: 'img/features/monorepo.svg',
    description: (
      <Translate>
        pnpm has built-in support for multiple packages in a repository
      </Translate>
    ),
  },
  {
    title: 'Strict',
    imageUrl: 'img/features/strict.svg',
    description: (
      <Translate>
        pnpm creates a non-flat <strong>node_modules</strong>, so code has no access to arbitrary packages
      </Translate>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--3', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} style={{ width: '115px'}} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

const Showcase = props => {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;

  const showcase = siteConfig.customFields.users.map((user, i) => {
    return (
      <a href={user.infoLink} target="_blank" key={i} rel="noopener">
        <img src={user.image} title={user.caption} style={{
          width: user.width ? `${user.width}px` : '128px',
          padding: '20px'
        }} />
      </a>
    );
  });

  return (
      <div className="mainContainer">
        <div style={{margin: '0 auto', maxWidth: '1100px', padding: '0 20px'}}>
          <div className="showcaseSection">
            <div className="prose">
              <h1><Translate>Who's Using This?</Translate></h1>
              <p><Translate>This project is used by many folks</Translate></p>
            </div>
            <div className="logos" style={{
              alignItems: 'center',
              display: 'flex',
              flexFlow: 'row wrap',
              justifyContent: 'center',
            }}>{showcase}</div>
            <p><Translate>Are you using this project?</Translate></p>
            <a
              href="https://github.com/pnpm/pnpm.github.io/edit/source/website/siteConfig.js"
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              className="button">
            <Link
              style={{margin: '0 20px'}}
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('users')}><Translate>More pnpm users</Translate></Link>
            </a>
          </div>
        </div>
      </div>
  );
};

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link 
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to="https://github.com/pnpm/pnpm">GitHub</Link>
            <Link
              style={{margin: '0 20px'}}
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('installation')}>Getting Started</Link>
            <iframe
              src={"https://ghbtns.com/github-btn.html?user=pnpm&repo=pnpm&type=star&count=true&size=large"}
              frameBorder="0"
              scrolling="0"
              width="160px"
              height="30px"
              style={{ marginTop: '8px' }}
            />
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
        <Showcase></Showcase>
        <div style={{textAlign: 'right'}}>The octopus icon made by <a href="https://www.flaticon.com/authors/flat-icons">Flat Icons</a> from <a href="https://www.flaticon.com">flaticon.com</a></div>
      </main>
    </Layout>
  );
}

export default Home;
