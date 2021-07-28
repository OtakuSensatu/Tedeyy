const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `prefix`,
  aliases: [`prefix`],
  category: `⚙️ Configurações`,
  description: `Vamos alterar o Prefixo do BOT`,
  usage: `prefix <NOVO PREFIXO>`,
  memberpermissions: [`ADMINISTRATOR`],
  run: async (client, message, args) => {
    try {
      //get the current prefix from the database
      let prefix = client.settings.get(message.guild.id, `prefix`);
      //if not in the database for some reason use the default prefix
      if (prefix === null) prefix = config.prefix;
      //if no args return error
      if (!args[0])
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${emoji.msg.ERROR} Error | Por favor, forneça um novo prefixo!`)
          .setDescription(`Prefixo atual: \`${prefix}\``)
        );
      //if there are multiple arguments
      if (args[1])
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${emoji.msg.ERROR} Error | O prefixo não pode ter dois espaços`)
        );
      //if the prefix is too long
      if (args[0].length > 5)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${emoji.msg.ERROR} Error | O prefixo não pode ser mais longo, que \`5\``)
        );
      //set the new prefix
      client.settings.set(message.guild.id, args[0], `prefix`);
      //return success embed
      return message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`${emoji.msg.SUCCESS} Success | Definir novo prefixo para **\`${args[0]}\`**`)
      );
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.channel.send(new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`${emoji.msg.ERROR} ERROR | An erro ocorreu`)
        .setDescription(`\`\`\`${e.message}\`\`\``)
      );
    }
  }
};
