window.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {from: 'popup', subject: 'ProjectInfo'}, (info) => {
      const projectName = info['project-src-name'] ?? chrome.i18n.getMessage("ViewProjectDefaultTitle");
      const base = info['project-src-base'] ?? '';
      let html = [];
      html.push(`<h1>${projectName}</h1>`);
      html.push(`<div><code>SRC:</code><a href="${info['project-src']}" target="_blank">${info['project-src']}</a></div>`)
      if (info['project-src-component']) {
        let components = info['project-src-component'];
        if (!(components instanceof Array)) {
          components = [components];
        }
        html.push(`<div id="components">`);
        components.forEach((component) => {
          const componentType = Object.keys(component)[0];
          const componentLabel = component[componentType];
          html.push(`<div><code>${componentType}:</code> <a href="${base}${componentLabel}" target="_blank">${componentLabel}</a></div>`);
        });
        html.push(`</div>`);
      }
      document.getElementById("popup").innerHTML = html.join('');
    });
  });
});
