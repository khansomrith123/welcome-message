/**
 * ============================================
 * Command: /volume
 * កំណត់កំរិតសម្លេង
 * ============================================
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('កំណត់កំរិតសម្លេង (0-100)')
        .addIntegerOption(option => 
            option.setName('level')
                .setDescription('កំរិតសម្លេងពី 0 ដល់ 100')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(100)
        ),
    
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                content: '❌ មិនមានតន្ត្រីកំពុងចាក់នៅពេលនេះទេ!',
                ephemeral: true
            });
        }
        
        if (interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
            return interaction.reply({
                content: '❌ អ្នកត្រូវតែនៅក្នុង channel ដូចគ្នាជាមួយបូត!',
                ephemeral: true
            });
        }
        
        const volume = interaction.options.getInteger('level');
        
        queue.node.setVolume(volume);
        
        // បង្កើត progress bar សម្រាប់សម្លេង
        const filled = Math.round(volume / 10);
        const empty = 10 - filled;
        const bar = '🔊'.repeat(filled) + '🔇'.repeat(empty);
        
        const embed = new EmbedBuilder()
            .setColor(config.embed.color.info)
            .setTitle('🔊 កំរិតសម្លេង')
            .setDescription(`${bar}\n**${volume}%**`)
            .setTimestamp();
            
        await interaction.reply({ embeds: [embed] });
    }
};