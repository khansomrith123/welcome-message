/**
 * ============================================
 * Queue Manager Utility
 * គ្រប់គ្រងបញ្ជីតន្ត្រីសម្រាប់ server នីមួយៗ
 * ============================================
 */

const { useQueue, useMainPlayer } = require('discord-player');

class QueueManager {
    constructor() {
        this.queues = new Map(); // guildId -> queue data
        this.player = useMainPlayer();
    }
    
    /**
     * រកឃើញឬបង្កើត queue សម្រាប់ guild
     */
    getOrCreateQueue(guild, voiceChannel, textChannel, requestedBy) {
        const guildId = guild.id;
        
        // ពិនិត្យថាមាន queue រួចហើយឬអត់
        let queue = useQueue(guildId);
        
        if (!queue) {
            // បង្កើត queue ថ្មី
            queue = this.player.nodes.create(guild, {
                metadata: {
                    channel: textChannel,
                    client: guild.members.me,
                    requestedBy: requestedBy,
                    voiceChannel: voiceChannel
                },
                leaveOnEnd: true,
                leaveOnStop: true,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000, // 5 នាទី
                autoSelfDeaf: true,
                volume: 50
            });
            
            this.setupQueueEvents(queue, guildId);
        }
        
        return queue;
    }
    
    /**
     * កំណត់ events សម្រាប់ queue
     */
    setupQueueEvents(queue, guildId) {
        // ពេលចាប់ផ្តើមចាក់
        queue.events.on('playerStart', (queue, track) => {
            console.log(`▶️ [${guildId}] កំពុងចាក់: ${track.title}`);
        });
        
        // ពេលបញ្ចូលតន្ត្រី
        queue.events.on('audioTrackAdd', (queue, track) => {
            console.log(`➕ [${guildId}] បានបន្ថែម: ${track.title}`);
        });
        
        // ពេល queue ទទេ
        queue.events.on('emptyQueue', (queue) => {
            console.log(`🏁 [${guildId}] បញ្ជីចាក់ចប់`);
            this.queues.delete(guildId);
        });
        
        // ពេល disconnect
        queue.events.on('disconnect', (queue) => {
            console.log(`👋 [${guildId}] បានផ្តាច់ការភ្ជាប់`);
            this.queues.delete(guildId);
        });
        
        // ពេលមាន error
        queue.events.on('error', (queue, error) => {
            console.error(`❌ [${guildId}] Error:`, error.message);
        });
        
        // រក្សាទុកក្នុង map
        this.queues.set(guildId, {
            queue: queue,
            createdAt: Date.now(),
            voiceChannel: queue.metadata.voiceChannel
        });
    }
    
    /**
     * លុប queue សម្រាប់ guild
     */
    deleteQueue(guildId) {
        const queueData = this.queues.get(guildId);
        if (queueData) {
            queueData.queue.delete();
            this.queues.delete(guildId);
            return true;
        }
        return false;
    }
    
    /**
     * រកឃើញ queue សម្រាប់ guild
     */
    getQueue(guildId) {
        return useQueue(guildId);
    }
    
    /**
     * ពិនិត្យថា queue មានឬអត់
     */
    hasQueue(guildId) {
        return this.queues.has(guildId) && useQueue(guildId) !== undefined;
    }
    
    /**
     * ទាញយកស្ថិតិទាំងអស់
     */
    getStats() {
        return {
            totalQueues: this.queues.size,
            queues: Array.from(this.queues.entries()).map(([guildId, data]) => ({
                guildId,
                createdAt: data.createdAt,
                uptime: Date.now() - data.createdAt
            }))
        };
    }
    
    /**
     * បញ្ជីតន្ត្រីទាំងអស់ (សម្រាប់ admin)
     */
    listAllQueues() {
        return Array.from(this.queues.keys());
    }
    
    /**
     * សំអាត queues ទាំងអស់ (សម្រាប់ shutdown)
     */
    cleanup() {
        console.log('🧹 កំពុងសំអាត queues...');
        for (const [guildId, data] of this.queues) {
            try {
                data.queue.delete();
            } catch (error) {
                console.error(`Error cleaning up queue ${guildId}:`, error);
            }
        }
        this.queues.clear();
    }
}

// បង្កើត instance តែមួយ (Singleton)
const queueManager = new QueueManager();

module.exports = queueManager;