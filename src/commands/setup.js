const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const db = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('ដំណើរការកំណត់ប្រព័ន្ធស្វាគមន៍ ចាកចេញ និងតួនាទីស្វ័យប្រវត្តិ')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcome')
                .setDescription('កំណត់ប្រព័ន្ធស្វាគមន៍')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('ឆានែលសម្រាប់ផ្ញើសារស្វាគមន៍')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText))
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('សារស្វាគមន៍ (ប្រើ placeholders)')
                        .setRequired(true))
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('តួនាទីស្វ័យប្រវត្តិដែលត្រូវផ្តល់ជូន')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('leave')
                .setDescription('កំណត់ប្រព័ន្ធចាកចេញ')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('ឆានែលសម្រាប់ផ្ញើសារចាកចេញ')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText))
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('សារចាកចេញ (ប្រើ placeholders)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('disable')
                .setDescription('បិទប្រព័ន្ធស្វាគមន៍ ឬចាកចេញ')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('ប្រភេទដែលត្រូវបិទ')
                        .setRequired(true)
                        .addChoices(
                            { name: 'ស្វាគមន៍', value: 'welcome' },
                            { name: 'ចាកចេញ', value: 'leave' },
                            { name: 'ទាំងអស់', value: 'both' }
                        ))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'welcome') {
            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message');
            const role = interaction.options.getRole('role');

            await db.setWelcome(interaction.guild.id, channel.id, message, role?.id);

            const embed = {
                color: 0x00FF00,
                title: '✅ ការកំណត់ស្វាគមន៍ជោគជ័យ',
                description: `ប្រព័ន្ធស្វាគមន៍ត្រូវបានកំណត់ដោយជោគជ័យ!`,
                fields: [
                    { name: '📺 ឆានែល', value: `<#${channel.id}>`, inline: true },
                    { name: '📝 សារ', value: `\`\`\`${message}\`\`\``, inline: false }
                ],
                timestamp: new Date()
            };

            if (role) {
                embed.fields.push({ name: '🎭 តួនាទីស្វ័យប្រវត្តិ', value: `<@&${role.id}>`, inline: true });
            }

            // បង្ហាញឧទាហរណ៍
            embed.fields.push({
                name: '📋 ឧទាហរណ៍សារ',
                value: message
                    .replace(/{user}/g, `<@${interaction.user.id}>`)
                    .replace(/{server.name}/g, interaction.guild.name)
                    .replace(/{membercount}/g, interaction.guild.memberCount.toString()),
                inline: false
            });

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } else if (subcommand === 'leave') {
            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message');

            await db.setLeave(interaction.guild.id, channel.id, message);

            const embed = {
                color: 0xFF0000,
                title: '✅ ការកំណត់ចាកចេញជោគជ័យ',
                description: `ប្រព័ន្ធចាកចេញត្រូវបានកំណត់ដោយជោគជ័យ!`,
                fields: [
                    { name: '📺 ឆានែល', value: `<#${channel.id}>`, inline: true },
                    { name: '📝 សារ', value: `\`\`\`${message}\`\`\``, inline: false },
                    {
                        name: '📋 ឧទាហរណ៍សារ',
                        value: message
                            .replace(/{user}/g, `<@${interaction.user.id}>`)
                            .replace(/{server.name}/g, interaction.guild.name)
                            .replace(/{membercount}/g, interaction.guild.memberCount.toString()),
                        inline: false
                    }
                ],
                timestamp: new Date()
            };

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } else if (subcommand === 'disable') {
            const type = interaction.options.getString('type');
            
            if (type === 'welcome' || type === 'both') {
                await db.deleteWelcome(interaction.guild.id);
            }
            if (type === 'leave' || type === 'both') {
                await db.deleteLeave(interaction.guild.id);
            }

            const typeText = {
                'welcome': 'ស្វាគមន៍',
                'leave': 'ចាកចេញ',
                'both': 'ស្វាគមន៍ និងចាកចេញ'
            };

            await interaction.reply({
                content: `✅ ប្រព័ន្ធ${typeText[type]}ត្រូវបានបិទដោយជោគជ័យ!`,
                ephemeral: true
            });
        }
    }
};