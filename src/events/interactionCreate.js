/**
 * ============================================
 * Event: interactionCreate
 * ពេលមានអ្នកប្រើ slash command ឬ button
 * ============================================
 */

const { Collection } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    
    async execute(interaction, client) {
        // ពិនិត្យថាជា Chat Input Command (Slash Command) ឬអត់
        if (!interaction.isChatInputCommand()) return;
        
        const command = client.commands.get(interaction.commandName);
        
        // ពិនិត្យថាមាន command ឬអត់
        if (!command) {
            console.error(`Command ${interaction.commandName} រកមិនឃើញ`);
            return;
        }
        
        // ពិនិត្យ cooldown
        const { cooldowns } = client;
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }
        
        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name);
        const defaultCooldownDuration = 3; // 3 វិនាទី
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
        
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            
            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1000);
                return interaction.reply({
                    content: `⏳ សូមរង់ចាំ <t:${expiredTimestamp}:R> វិនាទីទៀតមុនពេលប្រើ command នេះឡើងវិញ`,
                    ephemeral: true
                });
            }
        }
        
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        
        // ព្យាយាមប្រើ command
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            
            const errorMessage = {
                content: '❌ មានបញ្ហាក្នុងការប្រើ command នេះ!',
                ephemeral: true
            };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};