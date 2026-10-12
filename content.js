(() => {
  'use strict';
  if (window.__pipv) return;
  const DEF = { enabled: true, autoExit: true, onBlur: true, skipMuted: false, forceAllow: true, pipControls: true, minDuration: 0, excluded: [] };
  let cfg = { ...DEF }, auto = false, busy = false, ours = false, seekSet = false, blurT = 0;
  const ms = navigator.mediaSession || null;
  const isTop = window === window.top;
  const host = (() => {
    try { const a = location.ancestorOrigins; return a && a.length ? new URL(a[a.length - 1]).hostname : location.hostname; }
    catch { return location.hostname; }
  })();
  const active = () => cfg.enabled && !(cfg.excluded || []).includes(host);

  // Best candidate: playing > paused, then biggest on-screen area.
  const pick = (autoMode) => {
    let best = null, bestScore = 0;
    for (const v of document.getElementsByTagName('video')) {
      if (v.readyState < 2 || !v.videoWidth || v.ended) continue;
      const playing = !v.paused;
      if (autoMode) {
        if (!playing) continue;
        if (cfg.skipMuted && (v.muted || v.volume === 0)) continue;
        if (cfg.minDuration && Number.isFinite(v.duration) && v.duration < cfg.minDuration) continue;
      }
      const r = v.getBoundingClientRect();
      const score = (r.width * r.height + 1) * (playing ? 1000 : 1) * (v.muted ? 0.5 : 1);
      if (score > bestScore) { bestScore = score; best = v; }
    }
    return best;
  };

  const enter = (v, isAuto) => {
    if (cfg.forceAllow && v.disablePictureInPicture) v.disablePictureInPicture = false;
    busy = true;
    return v.requestPictureInPicture().then(() => { auto = isAuto; }).finally(() => { busy = false; });
  };

  const autoEnter = () => {
    if (!active() || busy || document.pictureInPictureElement) return;
    const v = pick(true);
    if (v) enter(v, true).catch(() => {});
  };

  const autoExit = () => {
    if (cfg.autoExit && auto && !document.hidden && document.pictureInPictureElement)
      document.exitPictureInPicture().catch(() => {});
  };

  const setH = (a, fn) => { try { ms.setActionHandler(a, fn); return true; } catch { return false; } };

  // Native browser auto-PiP (tab switch / minimise): the browser calls this handler with user activation.
  const register = () => {
    if (!ms) return;
    if (active()) ours = setH('enterpictureinpicture', autoEnter) || ours;
    else if (ours) { setH('enterpictureinpicture', null); ours = false; }
  };

  // Fallback when native auto-PiP is unavailable: works if the user interacted recently.
  const fallback = () => { if (navigator.userActivation && navigator.userActivation.isActive) autoEnter(); };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) setTimeout(fallback, 40); else autoExit();
  });

  window.addEventListener('blur', () => {
    if (!cfg.onBlur || !isTop) return;
    clearTimeout(blurT);
    blurT = setTimeout(() => {
      if (document.hasFocus() || document.hidden) return;
      const t = document.activeElement && document.activeElement.tagName;
      if (t === 'IFRAME' || t === 'FRAME') return; // focus moved into an embedded player
      fallback();
    }, 150);
  });
  window.addEventListener('focus', () => { clearTimeout(blurT); if (isTop) autoExit(); });

  // Extra controls (±10 s) inside the PiP window, shown on hover.
  document.addEventListener('enterpictureinpicture', (e) => {
    const v = e.target;
    if (!ms || !cfg.pipControls || !(v instanceof HTMLVideoElement)) return;
    setH('seekbackward', (d) => { v.currentTime = Math.max(0, v.currentTime - ((d && d.seekOffset) || 10)); });
    setH('seekforward', (d) => { v.currentTime = Math.min(v.duration || Infinity, v.currentTime + ((d && d.seekOffset) || 10)); });
    seekSet = true;
  }, true);
  document.addEventListener('leavepictureinpicture', () => {
    auto = false;
    if (seekSet) { setH('seekbackward', null); setH('seekforward', null); seekSet = false; }
  }, true);

  document.addEventListener('play', register, true);

  try {
    chrome.storage.sync.get(DEF).then((c) => { cfg = c; register(); }).catch(() => {});
    chrome.storage.onChanged.addListener((ch, area) => {
      if (area !== 'sync') return;
      for (const k in ch) cfg[k] = ch[k].newValue === undefined ? DEF[k] : ch[k].newValue;
      register();
    });
  } catch { /* extension reloaded */ }

  window.__pipv = {
    toggle() {
      if (!document.pictureInPictureEnabled) return 'none';
      if (document.pictureInPictureElement) { document.exitPictureInPicture().catch(() => {}); return 'exit'; }
      const v = pick(false);
      if (!v) return 'none';
      enter(v, false).catch(() => {});
      return 'enter';
    }
  };
})();
