import React from 'react';
import MDXContent from '@theme-original/MDXContent';

export default function MDXContentWrapper(props) {
  return (
    <>
      <div id="bsa-custom-01" class="bsa-standard"></div>
      <MDXContent {...props} />
    <script src="//m.servedby-buysellads.com/monetization.custom.js"></script>
    <script dangerouslySetInnerHTML={{__html: `
setTimeout(function() {
  if (typeof _bsa !== 'undefined' && _bsa) {
    _bsa.init('custom', 'CEAIPK3U', 'placement:pnpmio', {
      target: '#bsa-custom-01',
      template: \`
<a href="##link##" class="native-banner" style="background: ##backgroundColor##" rel="sponsored noopener" target="_blank" title="##company## — ##tagline##">
  <img class="native-img" width="125" src="##logo##" />
  <div class="native-main">
    <div class="native-details" style="
        color: ##textColor##;
        border-left: solid 1px ##textColor##;
      ">
      <span class="native-desc">##description##</span>
    </div>
    <span class="native-cta" style="
        color: ##ctaTextColor##;
        background-color: ##ctaBackgroundColor##;
      ">##callToAction##</span>
  </div>
</a>
\`,
    });
  }
}, 1);`}} >
    </script>
    </>
  );
}
