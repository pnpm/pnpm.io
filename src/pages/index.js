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
        pnpm creates a non-flat node_modules, so code has no access to arbitrary packages
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
      <h3 class="text--center">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

const Showcase = props => {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;

  const showcase = siteConfig.customFields.users.filter(({ pinned }) => pinned).map((user, i) => {
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
      <div className="mainContainer" style={{backgroundColor: 'var(--ifm-color-emphasis-100)', padding: '2rem 0'}}>
        <div style={{margin: '0 auto', maxWidth: '1100px', padding: '0 20px'}}>
          <div className="showcaseSection text--center">
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
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
        <Showcase></Showcase>
        <div style={{textAlign: 'right', backgroundColor: 'var(--ifm-color-emphasis-100)'}}>The octopus icon made by <a href="https://www.flaticon.com/authors/flat-icons">Flat Icons</a> from <a href="https://www.flaticon.com">flaticon.com</a></div>
      </main>
    </Layout>
  );
}

export default Home;
