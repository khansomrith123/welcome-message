/**
 * ============================================
 * Command: /ping
 * ពិនិត្យស្ថានភាពបូត និង latency
 * ============================================
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ពិនិត្យស្ថានភាពបូត និងពេលវេលា response'),
    
    async execute(interaction) {
        // គណនា latency
        const sent = await interaction.reply({ 
            content: 'កំពុងពិនិត្យ...', 
            fetchReply: true 
        });
        
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);
        
        // បង្កើត embed
        const embed = new EmbedBuilder()
            .setColor(config.embed.color.info)
            .setTitle('🏓 Pong!')
            .addFields(
                { name: '📶 Bot Latency', value: `\`${latency}ms\``, inline: true },
                { name: '🌐 API Latency', value: `\`${apiLatency}ms\``, inline: true },
                { name: '⏱️ Uptime', value: `<t:${Math.floor(Date.now() / 1000 - process.uptime())}:R>`, inline: true }
            )
            .setFooter({ text: config.bot.name })
            .setTimestamp();
            
        await interaction.editReply({ content: null, embeds: [embed] });
    }
};