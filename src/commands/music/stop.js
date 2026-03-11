/**
 * ============================================
 * Command: /stop
 * ឈប់ចាក់តន្ត្រី និងចាកចេញពី channel
 * ============================================
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('ឈប់ចាក់តន្ត្រី និងចាកចេញពី voice channel'),
    
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        
        // ពិនិត្យថាមាន queue ឬអត់
        if (!queue || !queue.isPlaying()) {
            return interaction.reply({
                content: '❌ មិនមានតន្ត្រីកំពុងចាក់នៅពេលនេះទេ!',
                ephemeral: true
            });
        }
        
        // ពិនិត្យថាអ្នកនៅក្នុង channel ដូចគ្នាឬអត់
        if (interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
            return interaction.reply({
                content: '❌ អ្នកត្រូវតែនៅក្នុង channel ដូចគ្នាជាមួយបូត!',
                ephemeral: true
            });
        }
        
        // ឈប់ចាក់ និងលុប queue
        queue.delete();
        
        const embed = new EmbedBuilder()
            .setColor(config.embed.color.warning)
            .setTitle('⏹️ បានឈប់')
            .setDescription('បញ្ចីចាក់ត្រូវបានលុប ហើយខ្ញុំបានចាកចេញពី channel')
            .setTimestamp();
            
        await interaction.reply({ embeds: [embed] });
    }
};