const db = require('../utils/database');
const { createWelcomeEmbed } = require('../utils/placeholders');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        try {
            const settings = await db.getWelcome(member.guild.id);
            
            if (!settings || !settings.enabled) return;

            const channel = member.guild.channels.cache.get(settings.channelId);
            if (!channel) return;

            // ផ្តល់តួនាទីស្វ័យប្រវត្តិ
            if (settings.roleId) {
                try {
                    await member.roles.add(settings.roleId);
                } catch (error) {
                    console.error('មិនអាចផ្តល់តួនាទីបាន:', error);
                }
            }

            // ផ្ញើសារស្វាគមន៍
            const embed = createWelcomeEmbed(member, member.guild, settings.message);
            await channel.send({ 
                content: `${member}`, // Mention user
                embeds: [embed] 
            });

        } catch (error) {
            console.error('មានបញ្ហាក្នុងការស្វាគមន៍សមាជិកថ្មី:', error);
        }
    }
};