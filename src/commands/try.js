const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../utils/database');
const { createWelcomeEmbed, createLeaveEmbed } = require('../utils/placeholders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('try')
        .setDescription('សាកល្បងសារស្វាគមន៍ ឬចាកចេញ')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('type')
                .setDescription('ប្រភេទសារដែលត្រូវសាកល្បង')
                .setRequired(true)
                .addChoices(
                    { name: 'ស្វាគមន៍', value: 'welcome' },
                    { name: 'ចាកចេញ', value: 'leave' }
                )),

    async execute(interaction) {
        const type = interaction.options.getString('type');
        
        if (type === 'welcome') {
            const settings = await db.getWelcome(interaction.guild.id);
            
            if (!settings) {
                return interaction.reply({
                    content: '⚠️ មិនទាន់មានការកំណត់ស្វាគមន៍ទេ! សូមប្រើ `/setup welcome` ជាមុន',
                    ephemeral: true
                });
            }

            const embed = createWelcomeEmbed(interaction.member, interaction.guild, settings.message);
            
            await interaction.reply({
                content: '👇 នេះជាឧទាហរណ៍សារស្វាគមន៍ដែលនឹងបង្ហាញ:',
                embeds: [embed],
                ephemeral: true
            });

        } else {
            const settings = await db.getLeave(interaction.guild.id);
            
            if (!settings) {
                return interaction.reply({
                    content: '⚠️ មិនទាន់មានការកំណត់ចាកចេញទេ! សូមប្រើ `/setup leave` ជាមុន',
                    ephemeral: true
                });
            }

            const embed = createLeaveEmbed(interaction.member, interaction.guild, settings.message);
            
            await interaction.reply({
                content: '👇 នេះជាឧទាហរណ៍សារចាកចេញដែលនឹងបង្ហាញ:',
                embeds: [embed],
                ephemeral: true
            });
        }
    }
};