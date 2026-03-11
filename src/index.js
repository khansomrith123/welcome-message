/**
 * ============================================
 * បូតតន្ត្រី Discord - ចំណុចចាប់ផ្តើម
 * Discord Music Bot - Entry Point
 * ============================================
 */

require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const path = require('path');
const fs = require('fs');

// បង្កើត Client ថ្មី (Create new client)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
    ]
});

// ទុក commands ទាំងអស់ (Store all commands)
client.commands = new Collection();
client.cooldowns = new Collection();

// ទុក player តន្ត្រី (Music player instance)
client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
});

// ផ្ទុក handlers (Load handlers)
const loadHandlers = async () => {
    try {
        const commandHandler = require('./handlers/commandHandler');
        const eventHandler = require('./handlers/eventHandler');
        
        await commandHandler(client);
        await eventHandler(client);
        
        console.log('✅ Handlers ទាំងអស់ត្រូវបានផ្ទុកជោគជ័យ');
    } catch (error) {
        console.error('❌ មានបញ្ហាក្នុងការផ្ទុក handlers:', error);
        throw error;
    }
};

// ចាប់ផ្តើមបូត (Start the bot)
const startBot = async () => {
    try {
        console.log('🚀 កំពុងបើកដំណើរការបូត... (Starting bot...)');
        
        // ផ្ទុក handlers
        await loadHandlers();
        
        // ភ្ជាប់ទៅ Discord (Login to Discord)
        await client.login(process.env.DISCORD_TOKEN);
        
        console.log('✅ បូតត្រៀមរួចហើយ!');
        
    } catch (error) {
        console.error('❌ មានបញ្ហាក្នុងការចាប់ផ្តើម:', error);
        process.exit(1);
    }
};

// គ្រប់គ្រងកំហុសដែលមិនរំពឹងទុក (Handle unhandled errors)
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// ពេល shutdown (Ctrl+C)
process.on('SIGINT', () => {
    console.log('\n👋 កំពុងបិទបូត...');
    
    // សំអាត queues
    const queueManager = require('./utils/queueManager');
    queueManager.cleanup();
    
    client.destroy();
    process.exit(0);
});

// ចាប់ផ្តើម (Start)
startBot();