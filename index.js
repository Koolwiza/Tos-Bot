const Discord = require('discord.js')
const db = require('quick.db')
const client = new Discord.Client()
const prefix = ''

client.on('ready', () => {
    console.log('bot online!') // Insert your ready event this is a bad one :p
})

client.on('message', async message => {
    if (!message.content.startsWith(prefix)) return;
    if(message.author.bot) return

    let checkingToS = db.fetch(`agree_${message.author.id}`)
    if(checkingToS === null){
        let notAgreed = new Discord.MessageEmbed()
            .setTitle(`${message.client.user.username}'s ToS`)
            .setColor(colors.sky)
            .setDescription(`By using Astra bots features and adding this bot, you are agreeing to be bound by this bot's terms and conditions of use and agree that you are responsible for the agreement with any rules. If you disagree with any of these terms, you are prohibited from accessing this bot.`)
            .addField('Links', `${message.client.user.username} has not reviewed all of the displayed content. The prescence of any link does not imply endorsement by AstraBot. The use of any linked website is at the user's own risk.`)
            .addField('Discord ToS', `By using ${message.client.user.username}, you agree that you will not use our bot to distribute products / services that are against [Discord ToS](https://www.discord.com/terms)`)
            .setFooter('You have 10 seconds to react, if not this proccess will be cancelled')
        return message.channel.send(notAgreed).then(async m => {
            await m.react('👍')

            const filter = (reaction, user) => {
                return ['👍'].includes(reaction.emoji.name) && user.id === message.author.id
            }
            m.awaitReactions(filter, {
                max: 1,
                time: 60000,
                errors: ['time']
            }).then(async collected => {
                const reaction = collected.first()
                if (reaction.emoji.name === '👍') {
                    db.set(`agree_${message.author.id}`, true)
                    m.delete()
                    message.channel.send({
                        embed: {
                            title: 'Success!',
                            description: 'You have complied with our rules!',
                            color: colors.green,
                            footer: {
                                text: message.client.user.username,
                                icon_url: message.client.user.displayAvatarURL()
                            }
                        }
                    })
                }
            })
        })
    }

    // Continue with your commands and stuff
})

client.login('your token')