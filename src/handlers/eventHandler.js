/**
 * ============================================
 * គ្រប់គ្រង Events (Event Handler)
 * ============================================
 */

const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
    const eventsPath = path.join(__dirname, '..', 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    console.log('📡 កំពុងផ្ទុក events... (Loading events...)');
    
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
        
        console.log(`   ✅ ផ្ទុក event: ${event.name}`);
    }
};