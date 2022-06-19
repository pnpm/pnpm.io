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
    title: <Translate>Fast</Translate>,
    imageUrl: 'img/features/fast.svg',
    description: (
      <Translate>
        pnpm is up to 2x faster than the alternatives
      </Translate>
    ),
  },
  {
    title: <Translate>Efficient</Translate>,
    imageUrl: 'img/features/efficient.svg',
    description: (
      <Translate>
        Files inside node_modules are linked from a single content-addressable storage
      </Translate>
    ),
  },
  {
    title: <Translate>Supports monorepos</Translate>,
    imageUrl: 'img/features/monorepo.svg',
    description: (
      <Translate>
        pnpm has built-in support for multiple packages in a repository
      </Translate>
    ),
  },
  {
    title: <Translate>Strict</Translate>,
    imageUrl: 'img/features/strict.svg',
    description: (
      <Translate>
        pnpm creates a non-flat node_modules by default, so code has no access to arbitrary packages
      </Translate>
    ),
  },
];

function addUTM(urlAddress) {
  const url = new URL(urlAddress);
  url.searchParams.append("utm_source", "pnpm");
  url.searchParams.append("utm_medium", "home_page");

  return url.toString();
}

function Feature({imageUrl, title, description}) {
  return (
    <div className={clsx('col col--3', styles.feature)}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

const Showcase = props => {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;

  const showcase = siteConfig.customFields.users.filter(({ pinned }) => pinned).map((user, i) => {
    return (
      <a href={addUTM(user.infoLink)} target="_blank" key={i} rel="noopener">
        <img src={user.image} alt={user.caption} style={{
          width: user.width ? `${user.width}px` : '128px',
          padding: '20px'
        }} />
      </a>
    );
  });

  return (
      <div className="mainContainer" style={{backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '2rem 0'}}>
        <div style={{margin: '0 auto', maxWidth: '1100px', padding: '0 20px'}}>
          <div className="showcaseSection text--center">
            <div className="prose" style={{marginBottom: '20px'}}>
              <h1><Translate>Sponsored By</Translate></h1>
              <div className="logos" style={{
                alignItems: 'center',
                display: 'flex',
                flexFlow: 'row wrap',
                justifyContent: 'center',
              }}>
                <a href={addUTM("https://bit.dev/")} target="_blank">
                  <img style={{padding: '20px'}} width="120" alt="bit" src="/img/users/bit.svg" />
                </a>
                <a href={addUTM("https://nhost.io/")} target="_blank">
                  <img style={{padding: '20px'}} width="240" alt="bit" src="/img/users/nhost.svg" />
                </a>
                <a href={addUTM("https://prisma.io/")} target="_blank">
                  <img style={{padding: '20px'}} width="240" alt="Prisma" src="/img/users/prisma.svg" />
                </a>
                <a href={addUTM("https://www.leniolabs.com/")} target="_blank">
                  <img style={{padding: '20px'}} width="120" alt="Leniolabs_" src="/img/users/leniolabs.jpg" />
                </a>
                <a href={addUTM("https://vercel.com/")} target="_blank">
                  <img style={{padding: '20px'}} width="240" alt="Vercel" src="/img/users/vercel.svg" />
                </a>
                <a href={addUTM("https://www.takeshape.io/")} target="_blank">
                  <img style={{padding: '20px'}} width="320" alt="TakeShape" src="/img/users/takeshape.svg" />
                </a>
              </div>
            </div>
            <div>
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
              <Link
                style={{margin: '0 20px'}}
                className={clsx(
                  'button button--outline button--secondary button--lg',
                  styles.getStarted,
                )}
                to={useBaseUrl('users')}><Translate>More pnpm users</Translate></Link>
            </div>
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
      title={siteConfig.tagline}
      description={siteConfig.tagline}>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle"><Translate>Fast, disk space efficient package manager</Translate></p>
          <div className={styles.buttons}>
            <Link
              style={{margin: '0 20px'}}
              className={clsx(
                'button button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('installation')}><Translate>Get Started</Translate></Link>
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
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/d1E31WPR70g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
        <Showcase></Showcase>
      </main>
    </Layout>
  );
}

export default Home;
