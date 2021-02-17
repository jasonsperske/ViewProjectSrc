let projectMetaData;

window.onload = () => {
  const STRUCTURED_DATA_REGEX = /^{\s*['"]?([\w_]*)['"]?\s*:\s*['"](.*)['"]\s*}$/;

  projectMetaData = [...document.head.querySelectorAll('meta[name^=project-src]')].reduce((acc, meta) => {
    const name = meta.name;
    let content = meta.content;
    if (STRUCTURED_DATA_REGEX.test(content)) {
      const m = STRUCTURED_DATA_REGEX.exec(content);
      content = {[m[1]]: m[2]};
    }
    if (acc[name]) {
      if (acc[name] instanceof Array) {
        acc[name].push(content);
      } else {
        acc[name] = [acc[name], content];
      }
    } else {
      acc[name] = content;
    }
    return acc;
  }, {});
};

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if ((msg.from === 'popup') && (msg.subject === 'ProjectInfo')) {
    response(projectMetaData);
  }
});
