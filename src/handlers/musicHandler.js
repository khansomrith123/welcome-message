/**
 * ============================================
 * គ្រប់គ្រងតន្ត្រី (Music Handler)
 * ប្រើ discord-player library
 * ============================================
 */

const { useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const config = require('../config');

class MusicHandler {
    constructor(client) {
        this.client = client;
        this.player = useMainPlayer();
        this.setupEvents();
    }
    
    setupEvents() {
        // ពេលចាប់ផ្តើមចាក់តន្ត្រី
        this.player.events.on('playerStart', (queue, track) => {
            const embed = new EmbedBuilder()
                .setColor(config.embed.color.success)
                .setTitle('▶️ កំពុងចាក់')
                .setDescription(`**${track.title}**`)
                .addFields(
                    { name: '👤 អ្នកច្រៀង', value: track.author || 'មិនស្គាល់', inline: true },
                    { name: '⏱️ រយៈពេល', value: track.duration || 'មិនស្គាល់', inline: true },
                    { name: '🎧 ដោយ', value: `<@${track.requestedBy.id}>`, inline: true }
                )
                .setThumbnail(track.thumbnail)
                .setTimestamp();
                
            queue.metadata.channel.send({ embeds: [embed] });
        });
        
        // ពេលបញ្ចូលតន្ត្រីទៅ queue
        this.player.events.on('audioTrackAdd', (queue, track) => {
            if (queue.currentTrack !== track) {
                const embed = new EmbedBuilder()
                    .setColor(config.embed.color.info)
                    .setTitle('➕ បានបន្ថែម')
                    .setDescription(`**${track.title}** ត្រូវបានបន្ថែមទៀបញ្ជី`)
                    .setFooter({ text: `បញ្ជីចាក់: ${queue.tracks.length} បទ` })
                    .setTimestamp();
                    
                queue.metadata.channel.send({ embeds: [embed] });
            }
        });
        
        // ពេល queue ចប់
        this.player.events.on('emptyQueue', (queue) => {
            const embed = new EmbedBuilder()
                .setColor(config.embed.color.warning)
                .setTitle('🏁 បញ្ចីចាក់ចប់')
                .setDescription('បញ្ជីចាក់បានចប់ហើយ ខ្ញុំនឹងចាកចេញក្នុង 5 នាទីទៀត')
                .setTimestamp();
                
            queue.metadata.channel.send({ embeds: [embed] });
        });
        
        // ពេលមានកំហុស
        this.player.events.on('error', (queue, error) => {
            console.error('Player Error:', error);
            queue.metadata.channel.send('❌ មានបញ្ហាក្នុងការចាក់តន្ត្រី!');
        });
    }
    
    // រកឃើញ queue សម្រាប់ guild
    getQueue(guildId) {
        return useQueue(guildId);
    }
    
    // បង្កើត queue ថ្មី
    createQueue(interaction) {
        return this.player.nodes.create(interaction.guild, {
            metadata: {
                channel: interaction.channel,
                client: interaction.guild.members.me,
                requestedBy: interaction.user
            },
            leaveOnEnd: config.music.leaveOnEnd,
            leaveOnStop: config.music.leaveOnStop,
            leaveOnEmpty: config.music.leaveOnEmpty,
            leaveOnEmptyCooldown: config.music.leaveOnEmptyCooldown,
            autoSelfDeaf: config.music.autoSelfDeaf,
            volume: config.music.defaultVolume
        });
    }
}

module.exports = MusicHandler;