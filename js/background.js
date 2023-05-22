console.log('background.js loaded');
// background.js 可以调用全部的chrome插件api

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF'
  })
})

let scriptLoaded = false

// 监听插件图标点击事件
chrome.action.onClicked.addListener(async tab => {
  // 获取当前插件的一个状态
  const preState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = preState === 'OFF' ? 'ON' : 'OFF'
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState
  })

  if (nextState === 'ON' && !scriptLoaded) {
    chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      files: ['js/async.js']
    })
    scriptLoaded = true;
  }

  chrome.tabs.sendMessage(tab.id, {
    state: nextState
  }, (response) => {
    console.log('response', response);
  })
})


// 利用chrome api通信
chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.key === 'getState') {
    const state = await chrome.action.getBadgeText({ tabId: sender.tab.id });
    chrome.tabs.sendMessage(sender.tab.id, { state })
  } else if (message.key === 'getCookie') {
    chrome.cookies.get({
      url: 'https://channels.weixin.qq.com/*',
      name: 'sessionid'
    }, e => {
      chrome.tabs.sendMessage(sender.tab.id, { cookie: e })
    })
  }
})