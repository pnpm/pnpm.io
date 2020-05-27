/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const translate = require("../../server/translate.js").translate;
const CompLibrary = require('../../core/CompLibrary.js');
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function imgUrl(img) {
  return siteConfig.baseUrl + 'img/' + img;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + '/' : '') + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const ProjectTitle = props => (
  <h2 className="projectTitle">
    <img src={imgUrl('pnpm-big-logo.png')} alt="pnpm" />
    <small><translate>Fast, disk space efficient package manager </translate></small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || '';
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href="https://github.com/pnpm/pnpm">GitHub</Button>
            <Button href={pageUrl('installation', language)}><translate>Getting Started</translate></Button>
            <iframe
              src={"https://ghbtns.com/github-btn.html?user=pnpm&repo=pnpm&type=star&count=true&size=large"}
              frameBorder="0"
              scrolling="0"
              width="160px"
              height="30px"
              style={{ marginTop: '8px' }}
            />
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}>
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = props => (
  <Block layout="fourColumn">
    {[
      {
        content: <translate>pnpm is up to **2x faster** than the alternatives (see [benchmarks](https://github.com/pnpm/node-package-manager-benchmark))</translate>,
        image: imgUrl('features/fast.svg'),
        imageAlign: 'top',
        title: <translate>Fast</translate>,
      },
      {
        content: <translate>Files inside **node_modules** are linked from a single **content-addressable storage**</translate>,
        image: imgUrl('features/efficient.svg'),
        imageAlign: 'top',
        title: <translate>Efficient</translate>,
      },
      {
        content: <translate>pnpm has built-in support for multiple packages in a repository</translate>,
        image: imgUrl('features/monorepo.svg'),
        imageAlign: 'top',
        title: <translate>Supports monorepos</translate>,
      },
      {
        content: <translate>pnpm creates a non-flat **node_modules**, so code has no access to arbitrary packages</translate>,
        image: imgUrl('features/strict.svg'),
        imageAlign: 'top',
        title: <translate>Strict</translate>,
      },
    ]}
  </Block>
);

const LearnHow = props => (
  <Block background="light">
    {[
      {
        content: <translate>Talk about learning how to use this</translate>,
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'right',
        title: <translate>Learn How</translate>,
      },
    ]}
  </Block>
);

const TryOut = props => (
  <Block id="try">
    {[
      {
        content: <translate>Talk about trying this out</translate>,
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'left',
        title: <translate>Try it Out</translate>,
      },
    ]}
  </Block>
);

const Description = props => (
  <Block background="dark">
    {[
      {
        content: <translate>This is another description of how this project is useful</translate>,
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'right',
        title: <translate>Description</translate>,
      },
    ]}
  </Block>
);

const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null;
  }
  const showcase = siteConfig.users
    .filter(user => {
      return user.pinned;
    })
    .map((user, i) => {
      return (
        <a href={user.infoLink} target="_blank" key={i} rel="noopener">
          <img src={user.image} title={user.caption} style={{ width: user.width ? `${user.width}px` : null }} />
        </a>
      );
    });

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>{<translate>Who's Using This?</translate>}</h2>
      <p><translate>This project is used by all these people</translate></p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl('users.html', props.language)}>
          <translate>More Users </translate> {siteConfig.title}
        </a>
      </div>
    </div>
  );
};

class Index extends React.Component {
  render() {
    let language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          <Showcase language={language} />
          <div style={{textAlign: 'right'}}>The octopus icon made by <a href="https://www.flaticon.com/authors/flat-icons">Flat Icons</a> from <a href="https://www.flaticon.com">flaticon.com</a></div>
        </div>
      </div>
    );
  }
}

module.exports = Index;
