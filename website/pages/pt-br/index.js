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

function docUrl(doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
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
    <small><translate>Fast, disk space efficient package manager</translate></small>
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
            <Button href={docUrl('installation.html', language)}>Getting Started</Button>
            <iframe
              src={"https://ghbtns.com/github-btn.html?user=pnpm&repo=pnpm&type=star&count=true&size=large"}
              frameBorder="0"
              scrolling="0"
              width="160px"
              height="30px"
              style={{marginTop: '8px'}}
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
        content: 'pnpm is as fast and sometimes even faster than npm and Yarn (see [benchmarks](https://github.com/pnpm/node-package-manager-benchmark))',
        image: imgUrl('features/fast.svg'),
        imageAlign: 'top',
        title: 'Fast',
      },
      {
        content: 'One version of a package is saved only ever once on a disk. So you save dozens of gigabytes of disk space!',
        image: imgUrl('features/efficient.svg'),
        imageAlign: 'top',
        title: 'Efficient',
      },
      {
        content: "pnpm creates a non-flat `node_modules`, so code has no access to arbitrary packages",
        image: imgUrl('features/strict.svg'),
        imageAlign: 'top',
        title: 'Strict',
      },
    ]}
  </Block>
);

const LearnHow = props => (
  <Block background="light">
    {[
      {
        content: 'Talk about learning how to use this',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'right',
        title: 'Learn How',
      },
    ]}
  </Block>
);

const TryOut = props => (
  <Block id="try">
    {[
      {
        content: 'Talk about trying this out',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'left',
        title: 'Try it Out',
      },
    ]}
  </Block>
);

const Description = props => (
  <Block background="dark">
    {[
      {
        content: 'This is another description of how this project is useful',
        image: imgUrl('docusaurus.svg'),
        imageAlign: 'right',
        title: 'Description',
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
          <img src={user.image} title={user.caption} style={{width: user.width ? `${user.width}px` : null}} />
        </a>
      );
    });

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>{"Who's Using This?"}</h2>
      <p>This project is used by all these people</p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl('users.html', props.language)}>
          More {siteConfig.title} Users
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
          <Container background="light" padding={["bottom", "top"]}>
            <h2>Background</h2>
            <p>
              <MarkdownBlock>
              pnpm uses hard links and symlinks to save one version of a module only ever once on a disk.
              When using npm or Yarn for example, if you have 100 projects using the same version
              of lodash, you will have 100 copies of lodash on disk. With pnpm, lodash will be saved in a
              single place on the disk and a hard link will put it into the `node_modules` where it should
              be installed.
              </MarkdownBlock>
            <p>
            </p>
              <MarkdownBlock>
              As a result, you save gigabytes of space on your disk and you have a lot faster installations!
              If you'd like more details about the unique `node_modules` structure that pnpm creates and
              why it works fine with the Node.js ecosystem, read this small article: [Flat node_modules is not the only way](https://medium.com/pnpm/flat-node-modules-is-not-the-only-way-d2e40f7296a3).
              </MarkdownBlock>
            </p>
          </Container>
          <Showcase language={language} />
          <Container background="light" padding={["bottom", "top"]}>
            <h2>What developers are saying</h2>
            <div className="gridBlock">
              <div className="blockElement alignCenter threeByGridBlock imageAlignTop">
                <blockquote className="twitter-tweet" data-partner="tweetdeck"><p lang="en" dir="ltr">Shoutout to the people behind pnpm; it makes looking at node module source code so much easier because I don&#39;t have to sift through the hundreds of modules everything pulls in to find the one I want &lt;3</p>&mdash; 🏳️‍🌈👩‍💻 Opal Symes (she/her) (@software_opal) <a href="https://twitter.com/software_opal/status/1033834325039505408?ref_src=twsrc%5Etfw">August 26, 2018</a></blockquote>
              </div>
              <div className="blockElement alignCenter threeByGridBlock imageAlignTop">
                <blockquote className="twitter-tweet" data-cards="hidden" data-partner="tweetdeck"><p lang="en" dir="ltr">PNPM is good, even on small apps. My node_modules for a little SPA using Gulp went from 86.7Mb to 44.1Mb. And it&#39;s way faster than NPM. <a href="https://t.co/aiZTCvMU3z">https://t.co/aiZTCvMU3z</a><a href="https://twitter.com/hashtag/nodejs?src=hash&amp;ref_src=twsrc%5Etfw">#nodejs</a> via <a href="https://twitter.com/pnpmjs?ref_src=twsrc%5Etfw">@pnpmjs</a></p>&mdash; | :::::::: | (@Paralellos) <a href="https://twitter.com/Paralellos/status/1031695443489566721?ref_src=twsrc%5Etfw">August 21, 2018</a></blockquote>
              </div>
              <div className="blockElement alignCenter threeByGridBlock imageAlignTop">
                <blockquote className="twitter-tweet" data-partner="tweetdeck"><p lang="en" dir="ltr">pnpm is gr8 tbh and 💚 the devs. Have you given it a whirl yet? <a href="https://t.co/WB9IkkElAB">https://t.co/WB9IkkElAB</a></p>&mdash; actually a kat girl (@maybekatz) <a href="https://twitter.com/maybekatz/status/1031821440411086848?ref_src=twsrc%5Etfw">August 21, 2018</a></blockquote>
              </div>
              <div className="blockElement alignCenter threeByGridBlock imageAlignTop">
                <blockquote className="twitter-tweet" data-cards="hidden" data-lang="en"><p lang="en" dir="ltr">
                Simple and genius idea, so that you always will wonder why you didn&#39;t think of it yourself <a href="https://t.co/jIMa2U4yym">https://t.co/jIMa2U4yym</a> <a href="https://twitter.com/pnpmjs">@pnpmjs</a> (but, pruning?)</p>&mdash; Michel Weststrate (@mweststrate) <a href="https://twitter.com/mweststrate/status/861533946668089346">May 8, 2017</a></blockquote>
              </div>
              <div className="blockElement alignCenter threeByGridBlock imageAlignTop">
                <blockquote className="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I&#39;ve been long advocating for <a href="https://twitter.com/pnpmjs">@pnpmjs</a> — it&#39;s like a hidden gem in Node ecosystem. Try it, it is mature and performant. <a href="https://t.co/ie91RMYlSP">https://t.co/ie91RMYlSP</a></p>&mdash; Andrey Popp (@andreypopp) <a href="https://twitter.com/andreypopp/status/861550953526206464">May 8, 2017</a></blockquote>
              </div>
              <div className="blockElement alignCenter threeByGridBlock imageAlignTop">
                <blockquote className="twitter-tweet" data-conversation="none" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/wmhilton">@wmhilton</a> <a href="https://twitter.com/yarnpkg">@yarnpkg</a> <a href="https://twitter.com/pnpmjs">@pnpmjs</a> just installed it and it worked like a charm. I&#39;m impressed!</p>&mdash; Stephan Hoyer (@cmx66) <a href="https://twitter.com/cmx66/status/854596611690942465">April 19, 2017</a></blockquote>
              </div>
            </div>
            <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"/>
          </Container>
        </div>
      </div>
    );
  }
}

module.exports = Index;
