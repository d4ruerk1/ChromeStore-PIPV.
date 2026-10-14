export const DEF = { enabled: true, autoExit: true, onBlur: true, skipMuted: false, forceAllow: false, pipControls: true, minDuration: 0, excluded: [] };

/* Runs inside the page (extension isolated world). Must be self-contained. */
function inject() {
  if (window.__pipv) return window.__pipv.toggle();
  if (document.pictureInPictureElement) { document.exitPictureInPicture().catch(() => {}); return 'exit'; }
  let best = null, s = 0;
  for (const v of document.getElementsByTagName('video')) {
    if (v.readyState < 2 || !v.videoWidth) continue;
    const r = v.getBoundingClientRect(), k = (r.width * r.height + 1) * (v.paused ? 1 : 1000);
    if (k > s) { s = k; best = v; }
  }
  if (!best) return 'none';
  best.disablePictureInPicture = false;
  best.requestPictureInPicture().catch(() => {});
  return 'enter';
}

export async function togglePip(tabId) {
  try {
    const [main] = await chrome.scripting.executeScript({ target: { tabId }, func: inject });
    if (main && main.result && main.result !== 'none') return main.result;
    const all = await chrome.scripting.executeScript({ target: { tabId, allFrames: true }, func: inject });
    const hit = all.find(r => r.result && r.result !== 'none');
    return hit ? hit.result : 'none';
  } catch { return 'error'; }
}
