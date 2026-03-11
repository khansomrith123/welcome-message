/**
 * ============================================
 * Event: ready
 * ពេល Bot បានភ្ជាប់ទៅ Discord ដោយជោគជ័យ
 * ============================================
 */

const { ActivityType } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'ready',
    once: true, // ចាត់ទុកតែម្តងគត់
    
    execute(client) {
        console.log('✅ បូតត្រៀមរួចហើយ! (Bot is ready!)');
        console.log(`🤖 ឈ្មោះ: ${client.user.tag}`);
        console.log(`📊 មានគណនី: ${client.guilds.cache.size} servers`);
        console.log(`👥 សរុបសមាជិក: ${client.users.cache.size} users`);
        
        // កំណត់ស្ថានភាព (Set activity)
        client.user.setActivity({
            name: '🎵 /play សម្រាប់ចាក់តន្ត្រី',
            type: ActivityType.Listening
        });
        
        // ប្តូរស្ថានភាពរៀងរាល់ 30 វិនាទី
        const activities = [
            { name: '🎵 /play សម្រាប់ចាក់តន្ត្រី', type: ActivityType.Listening },
            { name: `📊 នៅ ${client.guilds.cache.size} servers`, type: ActivityType.Watching },
            { name: '🎧 Khmer Music Bot', type: ActivityType.Playing },
            { name: '🔥 /help សម្រាប់ជំនួយ', type: ActivityType.Listening }
        ];
        
        let i = 0;
        setInterval(() => {
            client.user.setActivity(activities[i]);
            i = (i + 1) % activities.length;
        }, 30000);
    }
};