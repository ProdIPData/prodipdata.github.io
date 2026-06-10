import { defineConfig } from 'astro/config';

// site  = canonical production origin (used for canonical URLs + sitemap), always prod.
// base  = path the site is served under. Production root = '/'. QA serves under the
//         GitHub project sub-path, so the QA workflow sets SITE_BASE=/prodipdata.github.io.
// format='file' keeps existing ".html" URLs (e.g. /platform.html) so links don't break.
export default defineConfig({
  site: 'https://geoiplocations.com',
  base: process.env.SITE_BASE || '/',
  trailingSlash: 'ignore',
  build: {
    // 'preserve' keeps the source structure: platform.astro -> platform.html (flat .html URLs)
    // AND country/index.astro -> country/index.html (directory index URLs like /country/).
    format: 'preserve'
  }
});
