const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `adddj`,
  aliases: [`adddjrole`],
  category: `⚙️ Configuração`,
  description: `Vamos definir um PAPEL de DJ (como uma matriz, também conhecida como você pode ter múltiplos)`,
  usage: `adddj @cargo`,
  memberpermissions: [`ADMINISTRATOR`],
  run: async (client, message, args) => {
    try {
      //get the role of the mention
      let role = message.mentions.roles.first();
      //if no pinged role return error
      if (!role)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${emoji.msg.ERROR} Error | Por favor, adicione um papel via ping, @cargo!`)
        );
      //try to find the role in the guild just incase he pings a role of a different server
      try {
        message.guild.roles.cache.get(role.id);
      } catch {
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${emoji.msg.ERROR} Error | Parece que o cargo não existe neste Servidor!`)
        );
      }
      //if ther role is already in the Database, return error
      if (client.settings.get(message.guild.id, `djroles`).includes(role.id))
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${emoji.msg.ERROR} Error | Este cargo é já na Lista!`)
        );
      //push it into the database
      client.settings.push(message.guild.id, role.id, `djroles`);
      //these lines creates a string with all djroles
      let leftb = ``;
      if (client.settings.get(message.guild.id, `djroles`).join(``) === ``) leftb = `sem cargos de Dj, também conhecido como Todos os Usuários são DJs`
      else
        for (let i = 0; i < client.settings.get(message.guild.id, `djroles`).length; i++) {
          leftb += `<@&` + client.settings.get(message.guild.id, `djroles`)[i] + `> | `
        }

      return message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`${emoji.msg.SUCCESS} êxito | Adicionado o Cargo DE DJ \`${role.name}\``)
        .setDescription(`Todos os cargos de Djs:\n> ${leftb.substr(0, leftb.length - 3)}`)
      );
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.channel.send(new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`${emoji.msg.ERROR} ERROR | Ocorreu um erro`)
        .setDescription(`\`\`\`${e.message}\`\`\``)
      );
    }
  }
};
