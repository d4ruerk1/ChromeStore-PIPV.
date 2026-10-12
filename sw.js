import { DEF, togglePip } from './defaults.js';

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  const cur = await chrome.storage.sync.get(DEF);
  await chrome.storage.sync.set(cur);
  if (reason === 'install') chrome.tabs.create({ url: 'welcome.html' });
});

chrome.commands.onCommand.addListener((cmd, tab) => {
  if (cmd === 'toggle-pip' && tab && tab.id >= 0) togglePip(tab.id);
});
