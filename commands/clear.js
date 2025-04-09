// !clear 50         // Cancella 50 messaggi recenti
// !clear all        // Cancella fino a 1000 messaggi
// !clear me 30      // Cancella solo i tuoi ultimi 30 messaggi
// !clear me all     // Cancella fino a 1000 tuoi messaggi

import { EmbedBuilder, PermissionsBitField } from 'discord.js';
export const name = 'clear';

export async function execute(message, args) {
  // Controlli di permessi
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    return message.reply('🚫 Non hai il permesso per usare questo comando.');
  }

  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    return message.reply('❌ Non ho i permessi per cancellare i messaggi.');
  }

  await message.delete().catch(() => {});

  // Controlla se "me" è l'argomento
  const onlyMe = args[0] === 'me';
  const amountArg = onlyMe ? args[1] : args[0];
  const amount = amountArg === 'all' ? 1000 : parseInt(amountArg) || 100;

  if (isNaN(amount) || amount < 1 || amount > 1000) {
    return message.channel.send('❌ Inserisci un numero tra 1 e 1000 o "all".').then(msg => {
      setTimeout(() => msg.delete().catch(() => {}), 3000);
    });
  }

  try {
    let deleted = 0;
    let lastId = null;

    while (deleted < amount) {
      const toFetch = Math.min(100, amount - deleted);
      const options = { limit: toFetch };
      if (lastId) options.before = lastId;

      const messages = await message.channel.messages.fetch(options);
      if (messages.size === 0) break;

      let filtered = messages;
      if (onlyMe) {
        filtered = messages.filter(m => m.author.id === message.author.id);
      }

      const deletable = filtered.filter(msg =>
        Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000
      );

      if (deletable.size === 0) break;

      await message.channel.bulkDelete(deletable, true);
      deleted += deletable.size;
      lastId = messages.last().id;
    }

    // Embed di conferma
    const embed = new EmbedBuilder()
      .setColor(0x2ECC71)
      .setDescription(`🧹 Cancellati **${deleted}** messaggi ${onlyMe ? 'tuoi' : 'nel canale'}.`)
      .setFooter({ text: `Comando eseguito da ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    const confirmation = await message.channel.send({ embeds: [embed] });
    setTimeout(() => confirmation.delete().catch(() => {}), 5000);

    // Log nel canale #logs se esiste
    const logChannel = message.guild.channels.cache.find(c => c.name === 'logs' && c.isTextBased());
    if (logChannel) {
      const logEmbed = EmbedBuilder.from(embed).setTitle('🧾 Registro Pulizia Messaggi');
      logChannel.send({ embeds: [logEmbed] });
    }

  } catch (err) {
    console.error(err);
    message.channel.send('❌ Errore durante la cancellazione dei messaggi.');
  }
}
