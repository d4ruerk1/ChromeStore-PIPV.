# PIPV. – Picture-in-Picture automatico

Estensione Manifest V3 per browser Chromium (Brave, Chrome, Edge, Vivaldi, Opera, ChromeOS) su Linux, Windows e macOS.
Quando cambi scheda o riduci a icona il browser, il video in riproduzione passa in una finestra Picture-in-Picture sempre in primo piano; passando il mouse sopra compaiono i controlli (play/pausa, ±10 s, torna alla scheda, chiudi).

> Progetto indipendente, non affiliato a Google, Brave, Microsoft, Vivaldi o Opera. "Chrome" nel nome del repository indica solo lo store di destinazione (Chrome Web Store).

## Installazione (modalità sviluppatore)
1. Estrai lo ZIP.
2. Apri `brave://extensions` (o `chrome://extensions`) e attiva **Modalità sviluppatore**.
3. **Carica estensione non pacchettizzata** → seleziona la cartella estratta (quella che contiene `manifest.json`).
4. Segui la pagina di benvenuto che si apre (consenti il "Picture-in-picture automatico").

## Come funziona
- **Automatico**: registra l'azione Media Session `enterpictureinpicture`; il browser la invoca da solo quando lasci la scheda o minimizzi la finestra (Chrome/Brave 120+ con il permesso "Picture-in-picture automatico").
- **Riserva**: se il PiP automatico nativo non è disponibile, PIPV. lo apre comunque quando nascondi la pagina o cambi applicazione subito dopo aver interagito con la pagina (regola di sicurezza dei browser: serve un gesto recente).
- **Manuale**: icona dell'estensione o `Alt+P`.
- Sceglie il video giusto (in riproduzione e più grande), chiude il PiP quando torni, esclusione per singolo sito, durata minima, video muti.
- **Siti che bloccano il PiP** (`disablePictureInPicture`): in modalità automatica la scelta del sito viene **rispettata di default**; puoi ignorarla attivando l'opzione apposita. Con il pulsante o `Alt+P` (azione esplicita tua) il PiP viene aperto comunque. Alcuni servizi di streaming vietano nei loro termini di aggirare i loro controlli del player: usa l'opzione sotto la tua responsabilità.
- Lingua automatica in base al browser: italiano, inglese, francese, tedesco, spagnolo, portoghese.

## Conformità
- **Chrome Web Store / ChromeOS**: Manifest V3, scopo unico, nessun codice remoto, nessun `eval`, CSP predefinita. Permessi limitati allo scopo: lo script di contenuto gira su tutti i siti (`<all_urls>`) perché il PiP automatico deve trovare il video su qualunque pagina; legge solo gli elementi video, nessun contenuto della pagina lascia il dispositivo. Questo permesso ampio comporta una revisione più approfondita sullo store.
- **UE e Italia**: nessun dato personale trattato dallo sviluppatore (GDPR, D.Lgs. 196/2003, ePrivacy), vedi `PRIVACY.md`.
- **Accessibilità**: navigazione da tastiera, ruoli ARIA, contrasto, `prefers-reduced-motion`, tema chiaro/scuro. Riferimento: WCAG 2.1 AA (la Legge Stanca e l'European Accessibility Act non si applicano direttamente a un'estensione gratuita di un privato: sono usati come buona pratica).

## Pubblicazione sul Chrome Web Store
- **Scheda Privacy**: nessun dato raccolto; spunta le tre certificazioni; URL dell'informativa = versione pubblica di `PRIVACY.md`.
- **Giustificazioni permessi**: accesso a tutti i siti (script di contenuto) = individuare il video in riproduzione e attivare il PiP automatico su qualsiasi sito; `activeTab` + `scripting` = aprire il PiP nella scheda corrente con il pulsante o la scorciatoia; `storage` = salvare interruttori e siti esclusi.
- **Digital Services Act (UE)**: se pubblichi gratis e senza attività commerciale dichiarati **non trader** (niente indirizzo e telefono pubblici). I dati del trader servono solo se vendi o monetizzi l'estensione come attività professionale.

## Limiti noti
- Una sola finestra PiP alla volta (limite del browser).
- Se chiudi la scheda o navighi verso un altro sito la pagina viene scaricata e il video si ferma: il PiP funziona quando cambi scheda/finestra o minimizzi.
- Il pulsante ±10 s nel PiP dipende dalla versione del browser.

## Novità 1.0.1
- Il PiP **automatico** ora rispetta di default `disablePictureInPicture` (opzione "Sblocca i siti che lo vietano" disattivata di default, `forceAllow: false`).
- Il PiP **manuale** (icona o `Alt+P`) continua ad aprirsi anche sui siti che lo disattivano, perché è un'azione esplicita dell'utente.
- Chi aveva già installato la 1.0.0 e aveva salvato le impostazioni conserva il valore precedente: controllalo nel popup.

## Licenza
MIT, vedi `LICENSE`. Il software è fornito "così com'è", senza garanzie.
