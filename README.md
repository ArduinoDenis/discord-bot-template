# Discord Bot Template

Questo template fornisce una base solida per creare un bot Discord usando Discord.js con comandi basati su prefisso (`!comando`).

## Requisiti

- Node.js versione 22 o superiore
- Un bot Discord e il relativo token

## Installazione

1. Clona il repository:
   ```bash
   git clone https://github.com/ArduinoDenis/discord-bot-template.git
   ```
2. Accedi alla cartella del progetto:
   ```bash
   cd discord-bot-template
   ```
3. Installa le dipendenze:
   ```bash
   npm install
   ```
4. Nel file `.env` nella radice con il seguente contenuto:
   ```env
   DISCORD_TOKEN=il_tuo_token
   ```

## Avvio del Bot

Per avviare il bot, esegui:
```bash
npm start
```

Il bot si connetterà e sarà pronto a rispondere ai comandi nel server Discord.

## Aggiungere Nuovi Comandi

- Crea un nuovo file nella cartella `commands` seguendo l'esempio in `ping.js`.
- Ogni comando deve esportare:
  - Una proprietà `name` (in minuscolo).
  - Una funzione `execute(message, args)` che definisce la logica del comando.
```

Con questo template avrai una base solida per sviluppare il tuo bot Discord usando i comandi con prefisso. Puoi facilmente estendere la struttura aggiungendo nuovi comandi, eventi e moduli secondo le tue necessità. Se hai altre domande o richieste di personalizzazione, fammelo sapere!