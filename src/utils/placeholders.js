const { EmbedBuilder } = require('discord.js');

/**
 * ជំនួស placeholders នៅក្នុងអត្ថបទ
 * @param {string} text - អត្ថបទដើម
 * @param {GuildMember} member - សមាជិក
 * @param {Guild} guild - ម៉ាស៊ីនបម្រើ
 */
function parsePlaceholders(text, member, guild) {
    return text
        .replace(/{user}/g, `<@${member.id}>`)
        .replace(/{user.name}/g, member.user.username)
        .replace(/{user.tag}/g, member.user.tag)
        .replace(/{user.id}/g, member.id)
        .replace(/{user.avatar}/g, member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .replace(/{server.name}/g, guild.name)
        .replace(/{server.id}/g, guild.id)
        .replace(/{membercount}/g, guild.memberCount.toString())
        .replace(/{channel:(\d+)}/g, (match, id) => `<#${id}>`)
        .replace(/{#([^}]+)}/g, (match, name) => {
            const channel = guild.channels.cache.find(c => c.name === name || c.id === name);
            return channel ? `<#${channel.id}>` : match;
        })
        .replace(/{:([^}]+)}/g, (match, name) => {
            const emoji = guild.emojis.cache.find(e => e.name === name || e.id === name);
            return emoji ? `<:${emoji.name}:${emoji.id}>` : match;
        });
}

/**
 * បង្កើត embed ស្វាគមន៍
 */
function createWelcomeEmbed(member, guild, customMessage) {
    const parsedMessage = parsePlaceholders(customMessage, member, guild);
    
    return new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('👋 ស្វាគមន៍!')
        .setDescription(parsedMessage)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
            { name: '👤 ឈ្មោះ', value: member.user.tag, inline: true },
            { name: '🆔 ID', value: member.id, inline: true },
            { name: '👥 សមាជិកទី', value: `${guild.memberCount}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `បានចូលរួម ${guild.name}` });
}

/**
 * បង្កើត embed ចាកចេញ
 */
function createLeaveEmbed(member, guild, customMessage) {
    const parsedMessage = parsePlaceholders(customMessage, member, guild);
    
    return new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('😢 លាហើយ!')
        .setDescription(parsedMessage)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
            { name: '👤 ឈ្មោះ', value: member.user.tag, inline: true },
            { name: '🆔 ID', value: member.id, inline: true },
            { name: '👥 សមាជិកនៅសល់', value: `${guild.memberCount}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `បានចាកចេញពី ${guild.name}` });
}

module.exports = {
    parsePlaceholders,
    createWelcomeEmbed,
    createLeaveEmbed
};