// Wrap a legacy page's body onto BaseLayout WITHOUT losing client-side content.
// Keeps: <main>, any inline data payloads / render scripts after </main>, and the
// head JSON-LD schemas. Drops only the legacy header/footer and the legacy site.js
// include (BaseLayout re-adds the shell + site.js).
export function wrapLegacy(raw) {
  const pick = (re) => {
    const m = raw.match(re);
    return m ? m[1].trim() : '';
  };

  const title = pick(/<title>([\s\S]*?)<\/title>/i);
  const description = pick(/name=["']description["']\s+content=["']([\s\S]*?)["']/i);
  const ogTitle = title.replace(/\s*\|\s*(GeoIP Locations|ProdIPData).*$/i, '');

  // JSON-LD schemas from the head (everything before <body>).
  const headPart = raw.split(/<body/i)[0] || '';
  const headSchemas = (headPart.match(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || []).join('\n');

  // The <main> element.
  const mainMatch = raw.match(/<main[\s\S]*?<\/main>/i);
  const mainHtml = mainMatch ? mainMatch[0] : '';

  // Scripts that live after </main> (e.g. an inline reference data payload),
  // excluding the legacy site.js include and any JSON-LD.
  const afterMain = raw.split(/<\/main>/i)[1] || '';
  const bodyScripts = (afterMain.match(/<script\b[\s\S]*?<\/script>/gi) || [])
    .filter((s) => !/assets\/js\/site\.js/i.test(s) && !/application\/ld\+json/i.test(s))
    .join('\n');

  const slotHtml = mainHtml + (bodyScripts ? `\n${bodyScripts}` : '');
  return { title, description, ogTitle, headSchemas, slotHtml };
}
