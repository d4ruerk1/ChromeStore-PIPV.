# PIPV. — Picture-in-Picture automatico

Estensione Manifest V3 per browser Chromium (Brave, Chrome, Edge, Vivaldi, Opera, ChromeOS) su Linux, Windows e macOS.
Quando cambi scheda o riduci a icona il browser, il video in riproduzione passa in una finestra Picture-in-Picture sempre in primo piano; passando il mouse sopra compaiono i controlli (play/pausa, ±10 s, torna alla scheda, chiudi).

## Installazione (modalità sviluppatore)
1. Estrai lo ZIP.
2. Apri `brave://extensions` (o `chrome://extensions`) e attiva **Modalità sviluppatore**.
3. **Carica estensione non pacchettizzata** → seleziona la cartella `pipv`.
4. Segui la pagina di benvenuto che si apre (consenti il "Picture-in-picture automatico").

## Come funziona
- **Automatico**: registra l'azione Media Session `enterpictureinpicture`; il browser la invoca da solo quando lasci la scheda o minimizzi la finestra (Chrome/Brave 120+ con il permesso "Picture-in-picture automatico").
- **Riserva**: se il PiP automatico nativo non è disponibile, PIPV. lo apre comunque quando nasconde la pagina o cambi applicazione subito dopo aver interagito con la pagina (regola di sicurezza dei browser: serve un gesto recente).
- **Manuale**: icona dell'estensione o `Alt+P`.
- Sceglie il video giusto (in riproduzione e più grande), chiude il PiP quando torni, esclusione per singolo sito, durata minima, video muti, siti che bloccano il PiP.
- Lingua automatica in base al browser: italiano, inglese, francese, tedesco, spagnolo, portoghese.

## Conformità
- Chrome Web Store / ChromeOS: Manifest V3, scopo unico, permessi minimi, nessun codice remoto, nessun `eval`, CSP predefinita.
- UE e Italia: nessun dato personale trattato (GDPR, D.Lgs. 196/2003, ePrivacy) — vedi `PRIVACY.md`. Interfaccia accessibile (navigazione da tastiera, ruoli ARIA, contrasto, `prefers-reduced-motion`, tema chiaro/scuro) secondo European Accessibility Act / Legge Stanca (WCAG 2.1 AA come riferimento).

## Limiti noti
- Una sola finestra PiP alla volta (limite del browser).
- Se chiudi la scheda o navighi verso un altro sito la pagina viene scaricata e il video si ferma: il PiP funziona quando cambi scheda/finestra o minimizzi.
- Il pulsante ±10 s nel PiP dipende dalla versione del browser.
