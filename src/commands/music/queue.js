/**
 * ============================================
 * Command: /queue
 * មើលបញ្ជីតន្ត្រីដែលរង់ចាំ
 * ============================================
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('មើលបញ្ជីតន្ត្រីដែលកំពុងរង់ចាំ'),
    
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                content: '❌ មិនមានតន្ត្រីកំពុងចាក់នៅពេលនេះទេ!',
                ephemeral: true
            });
        }
        
        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;
        
        // បង្កើត embed
        const embed = new EmbedBuilder()
            .setColor(config.embed.color.info)
            .setTitle('📋 បញ្ជីចាក់')
            .setDescription(`**កំពុងចាក់:**\n[${currentTrack.title}](${currentTrack.url}) | \`${currentTrack.duration}\` ដោយ <@${currentTrack.requestedBy.id}>`);
        
        // បង្ហាញបទបន្ទាប់ៗ (អត់លើស 10 បទ)
        if (tracks.length === 0) {
            embed.addFields({ name: '⏳ បទបន្ទាប់', value: 'មិនមានបទរង់ចាំ' });
        } else {
            const trackList = tracks.slice(0, 10).map((track, index) => {
                return `${index + 1}. [${track.title}](${track.url}) | \`${track.duration}\``;
            }).join('\n');
            
            embed.addFields({ 
                name: `⏳ បទបន្ទាប់ (${tracks.length} បទ)`, 
                value: trackList 
            });
        }
        
        // ព័ត៌មានបន្ថែម
        const progress = queue.node.createProgressBar();
        embed.addFields(
            { name: '⏱️ ពេលវេលា', value: progress || 'មិនស្គាល់', inline: true },
            { name: '🔊 សម្លេង', value: `${queue.node.volume}%`, inline: true },
            { name: '🔁 ឡើងវិញ', value: queue.repeatMode === 0 ? 'បិទ' : (queue.repeatMode === 1 ? 'បទតែមួយ' : 'បញ្ជីទាំងមូល'), inline: true }
        );
        
        embed.setFooter({ text: `សរុប: ${tracks.length + 1} បទ` });
        embed.setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};