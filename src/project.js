function isURL(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function link(label, urlFragment, base = '') {
  let url = isURL(urlFragment) ? urlFragment : base + urlFragment;
  const html = [];
  html.push(`<div><code>${label}:</code>`);
  if (isURL(url)) {
    html.push(`<a href="${url}" target="_blank">${urlFragment}</a>`);
  } else {
    html.push(label);
  }
  html.push(`</div>`);
  return html.join('');
}

window.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {from: 'popup', subject: 'ProjectInfo'}, (info) => {
      const projectName = info['project-src-name'] ?? chrome.i18n.getMessage("ViewProjectDefaultTitle");
      const base = info['project-src-base'] ?? '';
      const html = [];
      html.push(`<h1>${projectName}</h1>`);
      html.push(link('SRC', info['project-src']));
      if (info['project-src-component']) {
        let components = info['project-src-component'];
        if (!(components instanceof Array)) {
          components = [components];
        }
        html.push(`<div id="components">`);
        components.forEach((component) => {
          const componentType = Object.keys(component)[0];
          const componentLabel = component[componentType];
          html.push(link(componentType, componentLabel, base));
        });
        html.push(`</div>`);
      }
      document.getElementById("popup").innerHTML = html.join('');
    });
  });
});
