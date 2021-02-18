let projectMetaData;

function icons(prefix = '') {
  return {setIcon: {
    path: {
      "16": `icons/${prefix}icon16.png`,
      "19": `icons/${prefix}icon19.png`,
      "48": `icons/${prefix}icon48.png`,
      "128": `icons/${prefix}icon128.png`
    }
  }}
}

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

  if (Object.keys(projectMetaData).length > 0) {
    chrome.runtime.sendMessage(icons());
  } else {
    chrome.runtime.sendMessage(icons('disabled/'));
  }
};

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if ((msg.from === 'popup') && (msg.subject === 'ProjectInfo')) {
    response(projectMetaData);
  }
});
