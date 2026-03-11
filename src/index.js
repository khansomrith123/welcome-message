const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// បង្កើត client ជាមួយ intents ចាំបាច់
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Collection សម្រាប់រក្សាទុក commands
client.commands = new Collection();

// ផ្ទុក commands ទាំងអស់
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        console.log(`✅ ផ្ទុក command: ${command.data.name}`);
    } else {
        console.log(`⚠️ Command នៅ ${filePath} ខ្វះ property "data" ឬ "execute"`);
    }
}

// ផ្ទុក events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`✅ ផ្ទុក event: ${event.name}`);
}

// ចុះឈ្មោះ slash commands
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🔄 កំពុងចុះឈ្មោះ slash commands...');
        
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        
        console.log('✅ ចុះឈ្មោះ slash commands ជោគជ័យ!');
    } catch (error) {
        console.error('❌ មានបញ្ហាក្នុងការចុះឈ្មោះ commands:', error);
    }
})();

// ភ្ជាប់ bot
client.login(process.env.TOKEN);