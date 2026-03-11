/**
 * ============================================
 * Command: /play
 * ប្រើសម្រាប់ចាក់តន្ត្រីពី YouTube
 * ============================================
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, QueryType } = require('discord-player');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('ចាក់តន្ត្រីពី YouTube ឬ Spotify')
        .addStringOption(option => 
            option.setName('song')
                .setDescription('ឈ្មោះបទចម្រៀង ឬ Link')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        // ពិនិត្យថាអ្នកនៅក្នុង channel សម្លេងឬអត់
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({
                content: '❌ អ្នកត្រូវតែនៅក្នុង voice channel ជាមុនសិន!',
                ephemeral: true
            });
        }
        
        // ពិនិត្យថាបូតមានសិទ្ធិគ្រប់គ្រងឬអត់
        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has('Connect') || !permissions.has('Speak')) {
            return interaction.reply({
                content: '❌ ខ្ញុំមិនមានសិទ្ធិ Connect ឬ Speak នៅ channel នេះទេ!',
                ephemeral: true
            });
        }
        
        await interaction.deferReply();
        
        const player = useMainPlayer();
        const query = interaction.options.getString('song');
        
        try {
            // ស្វែងរកតន្ត្រី
            const searchResult = await player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });
            
            if (!searchResult || !searchResult.tracks.length) {
                return interaction.editReply({
                    content: '❌ រកមិនឃើញតន្ត្រីដែលអ្នកស្វែងរកទេ!'
                });
            }
            
            // បង្កើតឬយក queue ដែលមានស្រាប់
            const queue = player.nodes.create(interaction.guild, {
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
            
            // ភ្ជាប់ទៅ voice channel
            try {
                if (!queue.connection) {
                    await queue.connect(voiceChannel);
                }
            } catch (error) {
                player.nodes.delete(interaction.guild.id);
                return interaction.editReply({
                    content: '❘ មិនអាចចូលទៅ voice channel បានទេ!'
                });
            }
            
            // បញ្ចូលតន្ត្រីទៅ queue
            queue.addTrack(searchResult.tracks[0]);
            
            // ចាប់ផ្តើមចាក់ប្រសិនបើមិនទាន់ចាក់
            if (!queue.isPlaying()) {
                await queue.node.play();
            }
            
            // បង្ហាញសារជោគជ័យ
            const embed = new EmbedBuilder()
                .setColor(config.embed.color.success)
                .setTitle('🎵 បានបន្ថែម')
                .setDescription(`**${searchResult.tracks[0].title}**`)
                .addFields(
                    { name: '👤 អ្នកច្រៀង', value: searchResult.tracks[0].author, inline: true },
                    { name: '⏱️ រយៈពេល', value: searchResult.tracks[0].duration, inline: true },
                    { name: '🔗 ប្រភព', value: '[YouTube](' + searchResult.tracks[0].url + ')', inline: true }
                )
                .setThumbnail(searchResult.tracks[0].thumbnail)
                .setFooter({ text: `ដោយ: ${interaction.user.username}` })
                .setTimestamp();
                
            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Play Error:', error);
            await interaction.editReply({
                content: '❌ មានបញ្ហាក្នុងការចាក់តន្ត្រី: ' + error.message
            });
        }
    }
};