const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);

module.exports = {
  name: `reset`,
  aliases: [`hardreset`],
  category: `⚙️ Configurações`,
  description: `Redefine / Exclui todas as configurações, bem como o prefixo!`,
  usage: `reset`,
  memberpermissions: [`ADMINISTRATOR`],
  run: async (client, message, args) => {
    try {
      //if not enough permissions aka not the guild owner, return error
      if (message.member.guild.owner.id !== message.author.id)
        return message.channel.send(new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${emoji.msg.ERROR} Error | Você não\'pode ter permissão para este Comando!\` *Apenas o servidor-proprietário*`)
        );
      //ask for second yes
      let themsg = message.channel.send(new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`Você realmente deseja redefinir todas as configurações?`)
        .setDescription(`*Resposta com:* **__\`sim\`__**`)
      ).then((msg) => {
        //wait for answer of the right user
        msg.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 30 * 1000,
            errors: ['time']
          })
          //after right user answered
          .then(async collected => {
            //and if its yes
            if (collected.first().content.toLowerCase() === `sim`) {
              //reset the database of the setup
              client.setups.set(message.guild.id, {
                textchannel: `0`,
                voicechannel: `0`,
                category: `0`,
                message_cmd_info: `0`,
                message_queue_info: `0`,
                message_track_info: `0`
              });
              //reset the settings like prefix djroles and botchannels
              client.settings.set(message.guild.id, {
                prefix: config.prefix,
                djroles: [],
                botchannel: [],
              });
              //send the success message
              return message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`${emoji.msg.SUCCESS} êxito | Reiniciado tudo!`)
                .setDescription(`Prefixo é agora novamente: \`${config.prefix}\`\n Sem mais papéis de DJ, sem configuração, sem mais canais de bot`)
              );
            }
            //if an error happens, reply
          }).catch(e => {
            console.log(String(e.stack).yellow)
            return message.channel.send(new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`${emoji.msg.ERROR} Error | CAUSA CANCELADA NÃO É A PALAVRA CERTA / O TEMPO ACABOU!`)
            );
          })
      });
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
