import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Carica il file .env
config();

// Per ottenere __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crea un nuovo client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Prefix comandi
client.commands = new Collection();
const prefix = '!';

// Carica i comandi dalla cartella /commands
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = await import(pathToFileURL(filePath).href);
  client.commands.set(command.name, command);
}

// Annuncia il bot online
client.once('ready', () => {
  console.log(`Bot online come ${client.user.tag}`);
  console.log(`Questo bot è stato creato da ArduinoDenis.it`);
});

// Gestione dei messaggi
client.on('messageCreate', message => {
  // Ignora bot e messaggi che non iniziano col prefisso
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('❌ Si è verificato un errore durante l\'esecuzione del comando.');
  }
});

// Login al bot
client.login(process.env.DISCORD_TOKEN);