/**
 * ============================================
 * Command: /help
 * បង្ហាញព័ត៌មានជំនួយអំពី commands
 * ============================================
 */

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('បង្ហាញព័ត៌មានជំនួយអំពី commands')
        .addStringOption(option => 
            option.setName('command')
                .setDescription('ជ្រើសរើស command ជាក់លាក់ដើម្បីមើលព័ត៌មានលម្អិត')
                .setRequired(false)
                .addChoices(
                    { name: '🎵 ចាក់តន្ត្រី (play)', value: 'play' },
                    { name: '⏹️ ឈប់ (stop)', value: 'stop' },
                    { name: '⏭️ រំលង (skip)', value: 'skip' },
                    { name: '📋 បញ្ជី (queue)', value: 'queue' },
                    { name: '⏸️ ផ្អាក់ (pause)', value: 'pause' },
                    { name: '▶️ បន្ត (resume)', value: 'resume' },
                    { name: '🔊 សម្លេង (volume)', value: 'volume' },
                    { name: '🎧 កំពុងចាក់ (nowplaying)', value: 'nowplaying' }
                )
        ),
    
    async execute(interaction) {
        const specificCommand = interaction.options.getString('command');
        
        if (specificCommand) {
            // បង្ហាញព័ត៌មានលម្អិតអំពី command ជាក់លាក់
            return this.showCommandDetail(interaction, specificCommand);
        }
        
        // បង្ហាញជំនួយទូទៅ
        const embed = new EmbedBuilder()
            .setColor(config.embed.color.primary)
            .setTitle(`🎵 ${config.bot.name} - ជំនួយ`)
            .setDescription('បូតតន្ត្រី Discord ភាសាខ្មែរ\nសូមប្រើ commands ខាងក្រោមដើម្បីគ្រប់គ្រងតន្ត្រី:')
            .addFields(
                {
                    name: '🎶 Commands តន្ត្រី',
                    value: '`/play` - ចាក់តន្ត្រី\n`/stop` - ឈប់ចាក់\n`/skip` - រំលងបទ\n`/queue` - មើលបញ្ជី\n`/pause` - ផ្អាក់\n`/resume` - បន្តចាក់\n`/volume` - កំណត់សម្លេង\n`/nowplaying` - មើលបទកំពុងចាក់'
                },
                {
                    name: '⚙️ Commands ទូទៅ',
                    value: '`/ping` - ពិនិត្យស្ថានភាព\n`/help` - ជំនួយនេះ'
                },
                {
                    name: '📝 ការណែនាំ',
                    value: '• ប្រើ `/play <song>` ដើម្បីចាក់តន្ត្រីពី YouTube\n• អ្នកត្រូវតែនៅក្នុង voice channel ជាមុន\n• បូតត្រូវការសិទ្ធិ Connect និង Speak'
                }
            )
            .setFooter({ text: `ជំនាន់ ${config.bot.version} • វាយ /help <command> សម្រាប់ព័ត៌មានលម្អិត` })
            .setTimestamp();
            
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('🌐 គេហទំព័រ')
                    .setStyle(ButtonStyle.Link)
                    .setURL(config.bot.supportServer || 'https://discord.com'),
                new ButtonBuilder()
                    .setLabel('💬 សួរសំនួរ')
                    .setStyle(ButtonStyle.Link)
                    .setURL(config.bot.supportServer || 'https://discord.com')
            );
            
        await interaction.reply({ embeds: [embed], components: [row] });
    },
    
    async showCommandDetail(interaction, commandName) {
        const details = {
            play: {
                title: '🎵 /play',
                description: 'ចាក់តន្ត្រីពី YouTube ឬ Spotify',
                usage: '`/play <song>`',
                examples: '`/play ស្រលាញ់អូនបង`\n`/play https://youtube.com/watch?v=...`',
                notes: '• អ្នកត្រូវតែនៅក្នុង voice channel\n• គាំទ្រឈ្មោះបទ, link, ឬ playlist'
            },
            stop: {
                title: '⏹️ /stop',
                description: 'ឈប់ចាក់តន្ត្រី និងចាកចេញពី channel',
                usage: '`/stop`',
                examples: '`/stop`',
                notes: '• លុបបញ្ជីចាក់ទាំងអស់\n• ចាកចេញពី voice channel'
            },
            skip: {
                title: '⏭️ /skip',
                description: 'រំលងបទចម្រៀងបច្ចុប្បន្ន',
                usage: '`/skip`',
                examples: '`/skip`',
                notes: '• បន្តទៅបទបន្ទាប់ក្នុងបញ្ជី\n• ប្រសិនបញ្ជីទទេ បូតនឹងចាកចេញ'
            },
            queue: {
                title: '📋 /queue',
                description: 'មើលបញ្ជីតន្ត្រីដែលកំពុងរង់ចាំ',
                usage: '`/queue`',
                examples: '`/queue`',
                notes: '• បង្ហាញបទកំពុងចាក់ និង 10 បទបន្ទាប់\n• បង្ហាញ progress bar'
            },
            pause: {
                title: '⏸️ /pause',
                description: 'ផ្អាក់ការចាក់តន្ត្រីបច្ចុប្បន្ន',
                usage: '`/pause`',
                examples: '`/pause`',
                notes: '• ផ្អាក់បទកំពុងចាក់\n• ប្រើ `/resume` ដើម្បីបន្ត'
            },
            resume: {
                title: '▶️ /resume',
                description: 'បន្តការចាក់តន្ត្រីដែលបានផ្អាក់',
                usage: '`/resume`',
                examples: '`/resume`',
                notes: '• បន្តចាក់ពីពេលដែលបានផ្អាក់\n• មិនមានផលប៉ះពាល់ប្រសិនបទកំពុងចាក់'
            },
            volume: {
                title: '🔊 /volume',
                description: 'កំណត់កំរិតសម្លេង (0-100)',
                usage: '`/volume <0-100>`',
                examples: '`/volume 50` (សម្លេងពាក់កណ្តាល)\n`/volume 100` (សម្លេងអតិបរមា)',
                notes: '• 0 = បិទសម្លេង\n• 100 = សម្លេងអតិបរមា\n• សម្លេងដើម: 50'
            },
            nowplaying: {
                title: '🎧 /nowplaying',
                description: 'មើលព័ត៌មានបទចម្រៀងកំពុងចាក់',
                usage: '`/nowplaying`',
                examples: '`/nowplaying`',
                notes: '• បង្ហាញឈ្មោះបទ, អ្នកច្រៀង, រយៈពេល\n• បង្ហាញ progress bar និង thumbnail'
            }
        };
        
        const detail = details[commandName];
        
        if (!detail) {
            return interaction.reply({
                content: '❌ រកមិនឃើញព័ត៌មានអំពី command នេះទេ!',
                ephemeral: true
            });
        }
        
        const embed = new EmbedBuilder()
            .setColor(config.embed.color.info)
            .setTitle(detail.title)
            .setDescription(detail.description)
            .addFields(
                { name: '📝 របៀបប្រើ', value: detail.usage },
                { name: '💡 ឧទាហរណ៍', value: detail.examples },
                { name: '⚠️ ចំណាំ', value: detail.notes }
            )
            .setFooter({ text: 'វាយ /help ដើម្បីត្រឡប់ទៅជំនួយទូទៅ' })
            .setTimestamp();
            
        await interaction.reply({ embeds: [embed] });
    }
};