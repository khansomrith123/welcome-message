/**
 * ============================================
 * Command: /pause
 * ផ្អាក់ការចាក់តន្ត្រី
 * ============================================
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('ផ្អាក់ការចាក់តន្ត្រីបច្ចុប្បន្ន'),
    
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
        
        const paused = queue.node.pause();
        
        if (paused) {
            const embed = new EmbedBuilder()
                .setColor(config.embed.color.warning)
                .setTitle('⏸️ បានផ្អាក់')
                .setDescription('តន្ត្រីត្រូវបានផ្អាក់')
                .setTimestamp();
                
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({
                content: '❌ មិនអាចផ្អាក់បានទេ (ប្រហែលជាបានផ្អាក់រួចហើយ)!',
                ephemeral: true
            });
        }
    }
};