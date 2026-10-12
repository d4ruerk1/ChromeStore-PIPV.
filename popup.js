import { DEF, togglePip } from './defaults.js';
const t = (k) => chrome.i18n.getMessage(k) || k;
const $ = (id) => document.getElementById(id);
document.documentElement.lang = chrome.i18n.getUILanguage();
document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });

const BOOLS = ['enabled', 'autoExit', 'onBlur', 'skipMuted', 'forceAllow', 'pipControls'];
const [cfg, [tab]] = await Promise.all([chrome.storage.sync.get(DEF), chrome.tabs.query({ active: true, currentWindow: true })]);
let host = '';
try { const u = new URL(tab.url); if (/^https?:$/.test(u.protocol)) host = u.hostname; } catch {}

const save = (patch) => { Object.assign(cfg, patch); chrome.storage.sync.set(patch); paint(); };
const paint = () => {
  const siteOn = !!host && !cfg.excluded.includes(host);
  const on = cfg.enabled && siteOn;
  $('st').classList.toggle('on', on);
  $('stTxt').textContent = t(on ? 'statusOn' : 'statusOff');
  $('site').checked = siteOn;
  $('site').disabled = !host || !cfg.enabled;
};

BOOLS.forEach((k) => { $(k).checked = !!cfg[k]; $(k).onchange = (e) => save({ [k]: e.target.checked }); });
$('minDuration').value = String(cfg.minDuration);
$('minDuration').onchange = (e) => save({ minDuration: +e.target.value });
$('host').textContent = host || t('siteUnavailable');
$('site').onchange = (e) => {
  const ex = cfg.excluded.filter((h) => h !== host);
  if (!e.target.checked) ex.push(host);
  save({ excluded: ex });
};
paint();

$('pip').onclick = async () => {
  if (!tab || tab.id < 0) return;
  const r = await togglePip(tab.id);
  $('msg').textContent = r === 'none' ? t('noVideo') : r === 'error' ? t('errGeneric') : '';
  if (r === 'enter' || r === 'exit') setTimeout(() => window.close(), 250);
};
$('perm').onclick = () => chrome.tabs.create({ url: 'welcome.html' });

chrome.commands.getAll().then((c) => {
  const s = c.find((x) => x.name === 'toggle-pip');
  $('kbd').textContent = (s && s.shortcut) || '—';
});
