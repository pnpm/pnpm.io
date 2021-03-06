import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

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
              <h1><translate>Who's Using This?</translate></h1>
              <p><translate>This project is used by many folks</translate></p>
            </div>
            <div className="logos" style={{
              alignItems: 'center',
              display: 'flex',
              flexFlow: 'row wrap',
              justifyContent: 'center',
            }}>{showcase}</div>
            <p><translate>Are you using this project?</translate></p>
            <a
              href="https://github.com/pnpm/pnpm.github.io/edit/source/website/siteConfig.js"
              className="button">
              <translate>Add your company</translate>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
