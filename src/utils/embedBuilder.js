/**
 * ============================================
 * Embed Builder Utility
 * សម្រាប់បង្កើត embed ស្អាតៗ
 * ============================================
 */

const { EmbedBuilder } = require('discord.js');
const config = require('../config');

class EmbedBuilderUtil {
    static success(title, description) {
        return new EmbedBuilder()
            .setColor(config.embed.color.success)
            .setTitle(`✅ ${title}`)
            .setDescription(description)
            .setTimestamp();
    }
    
    static error(title, description) {
        return new EmbedBuilder()
            .setColor(config.embed.color.error)
            .setTitle(`❌ ${title}`)
            .setDescription(description)
            .setTimestamp();
    }
    
    static warning(title, description) {
        return new EmbedBuilder()
            .setColor(config.embed.color.warning)
            .setTitle(`⚠️ ${title}`)
            .setDescription(description)
            .setTimestamp();
    }
    
    static info(title, description) {
        return new EmbedBuilder()
            .setColor(config.embed.color.info)
            .setTitle(`ℹ️ ${title}`)
            .setDescription(description)
            .setTimestamp();
    }
    
    static music(track, type = 'playing') {
        const embed = new EmbedBuilder()
            .setColor(config.embed.color.primary)
            .setThumbnail(track.thumbnail);
            
        if (type === 'playing') {
            embed.setTitle('▶️ កំពុងចាក់');
        } else if (type === 'added') {
            embed.setTitle('➕ បានបន្ថែម');
        }
        
        embed.setDescription(`**${track.title}**`)
            .addFields(
                { name: '👤 អ្នកច្រៀង', value: track.author, inline: true },
                { name: '⏱️ រយៈពេល', value: track.duration, inline: true },
                { name: '🎧 ដោយ', value: `<@${track.requestedBy.id}>`, inline: true }
            )
            .setTimestamp();
            
        return embed;
    }
}

module.exports = EmbedBuilderUtil;