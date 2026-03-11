module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`✅ បូត ${client.user.tag} បានត្រៀមខ្លួនរួចរាល់!`);
        console.log(`📊 ភ្ជាប់ទៅ ${client.guilds.cache.size} ម៉ាស៊ីនបម្រើ`);
        
        // Set activity
        client.user.setActivity('/help សម្រាប់ជំនួយ', { type: 'PLAYING' });
    }
};