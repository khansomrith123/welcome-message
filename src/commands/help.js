const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('បង្ហាញព័ត៌មានអំពីការប្រើប្រាស់បូត'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle('📚 ជំនួយប្រើប្រាស់បូត')
            .setDescription('បូតស្វាគមន៍ភាសាខ្មែរ - ជំនួយគ្នាដោយស្វ័យប្រវត្តិ')
            .addFields(
                {
                    name: '🔧 Commands មូលដ្ឋាន',
                    value: [
                        '`/setup` - កំណត់ប្រព័ន្ធស្វាគមន៍ និងចាកចេញ',
                        '`/info` - បង្ហាញការកំណត់បច្ចុប្បន្ន',
                        '`/try` - សាកល្បងសារស្វាគមន៍',
                        '`/ping` - ពិនិត្យល្បឿនបូត',
                        '`/help` - បង្ហាញទំព័រនេះ'
                    ].join('\n')
                },
                {
                    name: '📝 Placeholders ដែលប្រើបាន',
                    value: [
                        '`{user}` - លើកឡើងអ្នកប្រើប្រាស់ (@username)',
                        '`{user.name}` - ឈ្មោះអ្នកប្រើប្រាស់',
                        '`{user.avatar}` - រូបតំណាងអ្នកប្រើប្រាស់',
                        '`{server.name}` - ឈ្មោះម៉ាស៊ីនបម្រើ',
                        '`{membercount}` - ចំនួនសមាជិក',
                        '`{#channel}` - លើកឡើងឆានែល (ឧ. {#general})',
                        '`{:emoji}` - បង្ហាញអារម្មណ៍ (ឧ. {:wave})'
                    ].join('\n')
                },
                {
                    name: '⚙️ របៀបប្រើ /setup',
                    value: [
                        '**ស្វាគមន៍:** `/setup welcome #channel ស្វាគមន៍ {user} មកកាន់ {server.name}! @Role`',
                        '**ចាកចេញ:** `/setup leave #channel លាហើយ {user}!`',
                        '**បិទ:** `/setup disable type:ទាំងអស់`'
                    ].join('\n')
                }
            )
            .setFooter({ text: 'បង្កើតដោយ Discord.js v14' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};