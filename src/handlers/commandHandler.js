/**
 * ============================================
 * គ្រប់គ្រង Commands (Command Handler)
 * ============================================
 */

const { REST, Routes, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config');

module.exports = async (client) => {
    const commands = [];
    const commandsPath = path.join(__dirname, '..', 'commands');
    
    // រកឃើញថតទាំងអស់នៅក្នុង commands/
    const commandFolders = fs.readdirSync(commandsPath);
    
    console.log('📂 កំពុងផ្ទុក commands... (Loading commands...)');
    
    for (const folder of commandFolders) {
        const folderPath = path.join(commandsPath, folder);
        
        // ពិនិត្យថាជាថតឬអត់
        if (!fs.statSync(folderPath).isDirectory()) continue;
        
        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);
            
            // ពិនិត្យ command ត្រឹមត្រូវ
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
                console.log(`   ✅ ផ្ទុក: ${command.data.name}`);
            } else {
                console.log(`   ⚠️ រំលង: ${file} (ខ្វះ data ឬ execute)`);
            }
        }
    }
    
    // Deploy commands ទៅ Discord
    const rest = new REST({ version: '10' }).setToken(config.discord.token);
    
    try {
        console.log('🔄 កំពុង deploy commands ទៅ Discord...');
        
        if (config.discord.guildId) {
            // Deploy សម្រាប់ server ជាក់លាក់ (លឿន)
            await rest.put(
                Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId),
                { body: commands }
            );
            console.log(`✅ Commands ត្រូវបាន deploy សម្រាប់ guild: ${config.discord.guildId}`);
        } else {
            // Deploy សម្រាប់ទាំងអស់ (យឺត 1 ម៉ោង)
            await rest.put(
                Routes.applicationCommands(config.discord.clientId),
                { body: commands }
            );
            console.log('✅ Commands ត្រូវបាន deploy សម្រាប់ទាំងអស់');
        }
    } catch (error) {
        console.error('❌ មានបញ្ហាក្នុងការ deploy commands:', error);
    }
};