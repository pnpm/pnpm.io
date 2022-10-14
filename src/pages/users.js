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
    const url = new URL(user.infoLink);
    url.searchParams.append("utm_source", "pnpm");
    url.searchParams.append("utm_medium", "users_page");

    return (
      <a href={url.toString()} target="_blank" key={i} rel="noopener nofollow">
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
        <div style={{margin: '0 auto', maxWidth: '1100px', padding: '2rem 0'}}>
          <div className="showcaseSection">
            <div className="prose text--center">
              <h1><Translate>Who's Using This?</Translate></h1>
              <p><Translate>We have lots of users! On this page we will only list well known companies. If you want to showcase your stack, use StackShare. If you want the logo of your company to be on our homepage, become a silver, gold, or platinum sponsor.</Translate></p>
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
