document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-correction-form]');
  if (!form) {
    return;
  }

  const statusNode = document.querySelector('[data-correction-status]');
  const copyButton = document.querySelector('[data-copy-correction]');
  const sourceInput = document.querySelector('#correction-source');
  const summaryInput = document.querySelector('#correction-summary');
  const detailsInput = document.querySelector('#correction-details');
  const evidenceInput = document.querySelector('#correction-evidence');
  const notesInput = document.querySelector('#correction-notes');
  const emailInput = document.querySelector('#correction-email');
  const nameInput = document.querySelector('#correction-name');
  const categoryInput = document.querySelector('#correction-category');

  const sourceMap = {
    'contact': 'Contact page',
    'downloads': 'Downloads page',
    'reference-cidr': 'CIDR reference catalog',
    'reference-ports': 'Ports reference catalog',
    'reference-root-zone': 'Root zone reference catalog'
  };

  const params = new URLSearchParams(window.location.search);
  const sourceParam = params.get('source');
  if (sourceInput && sourceParam) {
    sourceInput.value = sourceMap[sourceParam] || sourceParam;
  }

  function buildEmailPayload() {
    const summary = (summaryInput?.value || '').trim();
    const details = (detailsInput?.value || '').trim();

    if (!summary || !details) {
      if (statusNode) {
        statusNode.textContent = 'Please complete both the short summary and the correction needed fields.';
      }
      return null;
    }

    const payload = {
      to: 'geoiplocations@gmail.com',
      subject: `GeoIP Locations data correction - ${summary}`,
      body: [
        'GeoIP Locations data correction request',
        '',
        `Affected page or dataset: ${(sourceInput?.value || '').trim() || 'Not specified'}`,
        `Correction category: ${(categoryInput?.value || '').trim() || 'Not specified'}`,
        `Your name: ${(nameInput?.value || '').trim() || 'Not specified'}`,
        `Your email: ${(emailInput?.value || '').trim() || 'Not specified'}`,
        '',
        'Short summary:',
        summary,
        '',
        'Correction needed:',
        details,
        '',
        'Supporting evidence or source:',
        (evidenceInput?.value || '').trim() || 'None provided',
        '',
        'Additional notes:',
        (notesInput?.value || '').trim() || 'None provided'
      ].join('\n')
    };

    return payload;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const payload = buildEmailPayload();
    if (!payload) {
      return;
    }

    const mailtoUrl = `mailto:${encodeURIComponent(payload.to)}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(payload.body)}`;
    if (statusNode) {
      statusNode.textContent = 'Opening your default email application with a prefilled correction request.';
    }
    window.location.href = mailtoUrl;
  });

  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const payload = buildEmailPayload();
      if (!payload) {
        return;
      }

      const text = `To: ${payload.to}\nSubject: ${payload.subject}\n\n${payload.body}`;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const helper = document.createElement('textarea');
          helper.value = text;
          document.body.appendChild(helper);
          helper.select();
          document.execCommand('copy');
          document.body.removeChild(helper);
        }

        if (statusNode) {
          statusNode.textContent = 'The correction email template has been copied to your clipboard.';
        }
      } catch (err) {
        if (statusNode) {
          statusNode.textContent = 'Clipboard copy was not available in this browser. Please use the send button instead.';
        }
      }
    });
  }
});
