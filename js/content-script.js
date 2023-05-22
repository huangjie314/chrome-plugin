console.log('conten-script.js loaded');

// 注入sdk.js
injectSdk();

// 通信监听
onmessage();

// register Events
registerEvents();

function injectSdk() {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('js/sdk.js');
  document.body.appendChild(script);
}

function onmessage() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // expose
    window.postMessage({
      from: 'chrome://extensions',
      value: message ? message.state : null
    })
    sendResponse('content-script.js 已经收到')
  })
}

function registerEvents() {
  window.addEventListener('message', evt => {
    const { data } = evt;
    if (data.opt === 'getState') {
      chrome.runtime.sendMessage('', { key: 'getState' })
    }
  }, false)
}