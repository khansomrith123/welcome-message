/**
 * ============================================
 * Command: /nowplaying
 * មើលព័ត៌មានបទចម្រៀងកំពុងចាក់
 * ============================================
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('មើលព័ត៌មានបទចម្រៀងកំពុងចាក់'),
    
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                content: '❌ មិនមានតន្ត្រីកំពុងចាក់នៅពេលនេះទេ!',
                ephemeral: true
            });
        }
        
        const track = queue.currentTrack;
        const progress = queue.node.createProgressBar();
        
        const embed = new EmbedBuilder()
            .setColor(config.embed.color.primary)
            .setTitle('🎵 កំពុងចាក់')
            .setDescription(`**[${track.title}](${track.url})**`)
            .addFields(
                { name: '👤 អ្នកច្រៀង', value: track.author, inline: true },
                { name: '⏱️ រយៈពេល', value: track.duration, inline: true },
                { name: '🎧 ស្នើសុំដោយ', value: `<@${track.requestedBy.id}>`, inline: true },
                { name: '⏳ ពេលវេលា', value: progress || 'មិនស្គាល់', inline: false }
            )
            .setThumbnail(track.thumbnail)
            .setFooter({ text: `បញ្ជីចាក់: ${queue.tracks.length} បទរង់ចាំ` })
            .setTimestamp();
            
        await interaction.reply({ embeds: [embed] });
    }
};