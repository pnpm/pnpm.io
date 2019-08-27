/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const translate = require("../../server/translate.js").translate;

class Footer extends React.Component {
  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? language + '/' : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5><translate>Docs</translate></h5>
            <a href={this.pageUrl('installation.html', this.props.language)}>
              <translate>Getting Started</translate>
            </a>
          </div>
          <div>
            <h5><translate>Community</translate></h5>
            <a href={this.pageUrl('users.html', this.props.language)}>
              <translate>User Showcase</translate>
            </a>
            <a
              href="http://stackoverflow.com/questions/tagged/pnpm"
              target="_blank">
              Stack Overflow
            </a>
            <a href="https://gitter.im/pnpm/pnpm"><translate>Project Chat</translate></a>
            <a href="https://twitter.com/pnpmjs" target="_blank">
              Twitter
            </a>
          </div>
          <div>
            <h5><translate>More</translate></h5>
            <a href="https://medium.com/pnpm">Blog</a>
            <a href="https://github.com/pnpm/pnpm">GitHub</a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count={true}
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a>
          </div>
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
