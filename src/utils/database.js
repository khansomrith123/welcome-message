const { QuickDB } = require('quick.db');
const path = require('path');
const fs = require('fs');

// ធានាថា folder data/ មានជានិច្ច
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📁 បានបង្កើត folder data/');
}

const db = new QuickDB({ 
    filePath: path.join(dataDir, 'database.sqlite')
});

module.exports = {
    // រក្សាទុកការកំណត់ស្វាគមន៍
    async setWelcome(guildId, channelId, message, roleId = null) {
        await db.set(`welcome_${guildId}`, {
            channelId,
            message,
            roleId,
            enabled: true
        });
    },

    // រក្សាទុកការកំណត់ចាកចេញ
    async setLeave(guildId, channelId, message) {
        await db.set(`leave_${guildId}`, {
            channelId,
            message,
            enabled: true
        });
    },

    // ទាញយកការកំណត់ស្វាគមន៍
    async getWelcome(guildId) {
        return await db.get(`welcome_${guildId}`);
    },

    // ទាញយកការកំណត់ចាកចេញ
    async getLeave(guildId) {
        return await db.get(`leave_${guildId}`);
    },

    // លុបការកំណត់ស្វាគមន៍
    async deleteWelcome(guildId) {
        await db.delete(`welcome_${guildId}`);
    },

    // លុបការកំណត់ចាកចេញ
    async deleteLeave(guildId) {
        await db.delete(`leave_${guildId}`);
    }
};
