import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate'
import styles from './styles.module.css';

export default function Users() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;

  const showcase = siteConfig.customFields.users.map((user, i) => {
    const url = new URL(user.infoLink);
    url.searchParams.append("utm_source", "pnpm");
    url.searchParams.append("utm_medium", "users_page");

    return (
      <img src={user.image} title={user.caption} style={{
        width: user.width ? `${user.width}px` : '128px',
        padding: '20px'
      }} />
    );
  });

  return (
    <Layout>
      <div className="mainContainer">
        <div style={{margin: '0 auto', maxWidth: '1100px', padding: '2rem 0'}}>
          <div className="showcaseSection">
            <div className="prose text--center">
              <h1><Translate>Who's Using This?</Translate></h1>
              <p><Translate>This project is used by many folks</Translate></p>
              <p><Translate>Are you using this project?</Translate></p>
              <Link
                className={clsx(
                  'button button--outline button--secondary button--lg',
                  styles.getStarted,
                )}
                href="https://github.com/pnpm/pnpm.io/edit/main/users.json">
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
