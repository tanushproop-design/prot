import mongoose from 'mongoose';

// Cache the MongoDB connection across serverless invocations
let cached = global._mongooseCache;
if (!cached) {
    cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI).then((m) => m);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

// Define the same schema as the bot uses
const discordStatsSchema = new mongoose.Schema({
    _id: String,
    server: {
        total: Number,
        online: Number,
        offline: Number,
        bots: Number
    },
    users: [{
        id: String,
        username: String,
        displayName: String,
        avatar: String,
        avatarDecoration: String,
        status: String,
        activities: [{
            name: String,
            type: { type: Number },
            state: String,
            details: String
        }]
    }],
    targetBots: [{
        id: String,
        username: String,
        tag: String,
        displayName: String,
        avatar: String,
        status: String,
        activities: [{
            name: String,
            type: { type: Number },
            state: String,
            details: String
        }]
    }],
    updatedAt: Date
});

// Prevent model recompilation in serverless environment
const DiscordStats = mongoose.models.DiscordStats || mongoose.model('DiscordStats', discordStatsSchema);

export default async function handler(req, res) {
    try {
        await connectDB();

        const stats = await DiscordStats.findById('helix_stats').lean();

        if (!stats) {
            return res.status(404).json({ error: 'No activity data found yet. Bot may not have synced.' });
        }

        // Return in the same format the frontend expects
        res.status(200).json({
            server: stats.server,
            users: stats.users,
            targetBots: stats.targetBots,
            _lastSync: stats.updatedAt
        });
    } catch (error) {
        console.error('MongoDB read error:', error.message);
        res.status(500).json({ error: 'Failed to fetch activity data from database' });
    }
}
