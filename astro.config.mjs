import { defineConfig } from 'astro/config';

// The canonical production site. Used for canonical URLs and the generated sitemap.
// QA/staging serves the same build at a different host; canonical still points here,
// and the hostname-keyed noindex (in site.js) keeps non-production hosts out of search.
export default defineConfig({
  site: 'https://geoiplocations.com',
  // output: 'static' is the default — every page is pre-rendered to HTML at build time.
  build: {
    // Emit /page/index.html style URLs so existing paths keep working.
    format: 'directory'
  }
});
