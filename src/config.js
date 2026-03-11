/**
 * ============================================
 * ការកំណត់ទូទៅ (Global Configuration)
 * ============================================
 */

require('dotenv').config();

module.exports = {
    // ការកំណត់ Discord
    discord: {
        token: process.env.DISCORD_TOKEN,
        clientId: process.env.CLIENT_ID,
        guildId: process.env.GUILD_ID,
        prefix: process.env.PREFIX || '!',
    },
    
    // ការកំណត់តន្ត្រី
    music: {
        defaultVolume: parseInt(process.env.DEFAULT_VOLUME) || 50,
        maxVolume: 100,
        leaveOnEnd: true,
        leaveOnStop: true,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 300000, // 5 នាទី
        autoSelfDeaf: true,
        quality: 'highestaudio',
    },
    
    // ការកំណត់ embed
    embed: {
        color: {
            primary: 0x5865F2,    // ពណ៌ Discord Blurple
            success: 0x57F287,    // បៃតង
            error: 0xED4245,      // ក្រហម
            warning: 0xFEE75C,    // លឿង
            info: 0x5865F2,       // ខៀវ
        },
        footer: {
            text: '🎵 Khmer Music Bot',
            iconURL: null,
        }
    },
    
    // ព័ត៌មានបូត
    bot: {
        name: 'Khmer Music Bot',
        version: '1.0.0',
        supportServer: 'https://discord.gg/yourserver',
    }
};