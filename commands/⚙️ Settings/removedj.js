const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `removedj`,
  aliases: [`deletedj`],
  category: `⚙️ Configurações`,
  description: `Vamos apagar um cargo de DJ`,
  usage: `removedj @Cargo`,
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
          .setTitle(`${emoji.msg.ERROR} Error | Por favor, adicione um Papel via ping, @CARGO !`)
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
      //if its not in the database return error
      if (!client.settings.get(message.guild.id, `djroles`).includes(role.id))
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${emoji.msg.ERROR} Error | Este cargo já é um DJ-cargo!`)
        );
      //remove it from the Database
      client.settings.remove(message.guild.id, role.id, `djroles`);
      //These lines create the String for all left Roles
      let leftb = ``;
      if (client.settings.get(message.guild.id, `djroles`).join(``) === ``) leftb = `sem cargos de Dj, também conhecido como Todos os Usuários são DJs`
      else
        for (let i = 0; i < client.settings.get(message.guild.id, `djroles`).length; i++) {
          leftb += `<@&` + client.settings.get(message.guild.id, `djroles`)[i] + `> | `
        }
      //send the success message
      return message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`${emoji.msg.SUCCESS} Êxito | Removeu o CARGO DE DJ \`${role.name}\``)
        .setDescription(`Todos deixaram papéis de Dj:\n> ${leftb.substr(0, leftb.length - 3)}`)
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
