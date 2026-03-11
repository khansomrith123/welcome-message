const db = require('../utils/database');
const { createLeaveEmbed } = require('../utils/placeholders');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        try {
            const settings = await db.getLeave(member.guild.id);
            
            if (!settings || !settings.enabled) return;

            const channel = member.guild.channels.cache.get(settings.channelId);
            if (!channel) return;

            // ផ្ញើសារចាកចេញ
            const embed = createLeaveEmbed(member, member.guild, settings.message);
            await channel.send({ embeds: [embed] });

        } catch (error) {
            console.error('មានបញ្ហាក្នុងការផ្ញើសារចាកចេញ:', error);
        }
    }
};