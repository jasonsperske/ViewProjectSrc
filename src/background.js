chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  if (request.setIcon) {
    chrome.browserAction.setIcon(request.setIcon);
  } else {
    chrome.pageAction.show(sender.tab.id);
  }
  sendResponse();
});
