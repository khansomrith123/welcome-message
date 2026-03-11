const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ពិនិត្យល្បឿនបូត'),

    async execute(interaction) {
        const sent = await interaction.reply({ 
            content: '🏓 កំពុងវាស់ល្បឿន...', 
            fetchReply: true 
        });
        
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        await interaction.editReply({
            content: '',
            embeds: [{
                color: 0x00FFFF,
                title: '🏓 ល្បឿនបូត',
                fields: [
                    { name: '⏱️ ពន្យាពេល', value: `${latency}ms`, inline: true },
                    { name: '💓 API', value: `${apiLatency}ms`, inline: true },
                    { name: '📊 ស្ថានភាព', value: latency < 100 ? '🟢 ល្អ' : latency < 200 ? '🟡 មធ្យម' : '🔴 យឺត', inline: true }
                ],
                timestamp: new Date()
            }]
        });
    }
};