/**
 * ============================================
 * Command: /skip
 * រំលងបទចម្រៀងបច្ចុប្បន្ន
 * ============================================
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('រំលងបទចម្រៀងបច្ចុប្បន្ន'),
    
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
        
        const currentTrack = queue.currentTrack;
        
        // រំលង
        const success = queue.node.skip();
        
        if (success) {
            const embed = new EmbedBuilder()
                .setColor(config.embed.color.info)
                .setTitle('⏭️ បានរំលង')
                .setDescription(`**${currentTrack.title}**`)
                .setTimestamp();
                
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({
                content: '❌ មិនអាចរំលងបទនេះបានទេ!',
                ephemeral: true
            });
        }
    }
};