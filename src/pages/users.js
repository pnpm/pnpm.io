import React from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Translate, {translate} from '@docusaurus/Translate'
import Link from '@docusaurus/Link';

export default function Users() {
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
    <Layout>
      <div className="mainContainer">
        <div style={{margin: '0 auto', maxWidth: '1100px', padding: '0 20px'}}>
          <div className="showcaseSection">
            <div className="prose">
              <h1><Translate>Who's Using This?</Translate></h1>
              <p><Translate>This project is used by many folks</Translate></p>
              <p><Translate>Are you using this project?</Translate></p>
              <Link
                className={clsx(
                  'button button--outline button--secondary button--lg',
                  styles.getStarted,
                )}
                href="https://github.com/pnpm/pnpm.github.io/edit/source/users.json">
                <Translate>Add your company</Translate>
              </Link>
            </div>
            <div className="logos" style={{
              alignItems: 'center',
              display: 'flex',
              flexFlow: 'row wrap',
              justifyContent: 'center',
            }}>{showcase}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
