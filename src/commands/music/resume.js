/**
 * ============================================
 * Command: /resume
 * បន្តការចាក់តន្ត្រី
 * ============================================
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('បន្តការចាក់តន្ត្រីដែលបានផ្អាក់'),
    
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
        
        const resumed = queue.node.resume();
        
        if (resumed) {
            const embed = new EmbedBuilder()
                .setColor(config.embed.color.success)
                .setTitle('▶️ បន្តចាក់')
                .setDescription('តន្ត្រីត្រូវបានបន្តចាក់')
                .setTimestamp();
                
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({
                content: '❌ មិនអាចបន្តចាក់បានទេ (ប្រហែលជាកំពុងចាក់ហើយ)!',
                ephemeral: true
            });
        }
    }
};