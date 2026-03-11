const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('បង្ហាញព័ត៌មានការកំណត់បច្ចុប្បន្ន'),

    async execute(interaction) {
        const welcomeSettings = await db.getWelcome(interaction.guild.id);
        const leaveSettings = await db.getLeave(interaction.guild.id);

        const embed = new EmbedBuilder()
            .setColor('#9932CC')
            .setTitle(`📊 ការកំណត់ ${interaction.guild.name}`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .addFields(
                {
                    name: '👋 ប្រព័ន្ធស្វាគមន៍',
                    value: welcomeSettings 
                        ? [
                            `**ស្ថានភាព:** ${welcomeSettings.enabled ? '🟢 បើក' : '🔴 បិទ'}`,
                            `**ឆានែល:** <#${welcomeSettings.channelId}>`,
                            `**សារ:** ${welcomeSettings.message.substring(0, 50)}...`,
                            welcomeSettings.roleId ? `**តួនាទី:** <@&${welcomeSettings.roleId}>` : '**តួនាទី:** គ្មាន'
                        ].join('\n')
                        : 'មិនបានកំណត់'
                },
                {
                    name: '😢 ប្រព័ន្ធចាកចេញ',
                    value: leaveSettings
                        ? [
                            `**ស្ថានភាព:** ${leaveSettings.enabled ? '🟢 បើក' : '🔴 បិទ'}`,
                            `**ឆានែល:** <#${leaveSettings.channelId}>`,
                            `**សារ:** ${leaveSettings.message.substring(0, 50)}...`
                        ].join('\n')
                        : 'មិនបានកំណត់'
                },
                {
                    name: '📈 ស្ថិតិម៉ាស៊ីនបម្រើ',
                    value: [
                        `**សមាជិកសរុប:** ${interaction.guild.memberCount}`,
                        `**ឆានែលសរុប:** ${interaction.guild.channels.cache.size}`,
                        `**តួនាទីសរុប:** ${interaction.guild.roles.cache.size}`
                    ].join('\n')
                }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};