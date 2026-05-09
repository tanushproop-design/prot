const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API endpoint for projects
app.get('/api/projects', (req, res) => {
    const projects = [
        {
            id: 1,
            title: 'Security Bot',
            description: 'Advanced anti-nuke and moderation bot. Features real-time threat detection, auto-banning for malicious links, and strict server lockdown protocols.',
            tech: ['Python', 'Discord.py', 'MongoDB'],
            link: '#'
        },
        {
            id: 2,
            title: 'Music Bot',
            description: 'High-quality music streaming bot with Lavalink integration. Supports YouTube, Spotify, and custom filters with a sleek button-based UI.',
            tech: ['Java', 'JDA', 'Lavalink'],
            link: '#'
        },
        {
            id: 3,
            title: 'Activity Bot',
            description: 'Real-time activity tracking and leveling system. Monitors voice channel statistics, message counts, and assigns dynamic roles.',
            tech: ['Node.js', 'Discord.js', 'PostgreSQL'],
            link: '#'
        },
        {
            id: 4,
            title: 'Custom Bot',
            description: 'A fully tailored utility bot built for the Helix server. Features custom onboarding, ticket systems, and premium profile management.',
            tech: ['Python', 'React', 'FastAPI'],
            link: '#'
        }
    ];
    res.json(projects);
});

// Proxy for Discord Bot Stats to avoid Mixed Content on Vercel
app.get('/api/discord-stats', async (req, res) => {
    try {
        const botUrl = process.env.BOT_API_URL || 'http://45.134.39.212:4079/api/discord-stats';
        const response = await fetch(botUrl);
        if (!response.ok) {
            throw new Error(`Bot returned status ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Failed to fetch from bot:', error.message);
        res.status(500).json({ error: 'Failed to connect to Discord Bot' });
    }
});

const nodemailer = require('nodemailer');

// Gmail SMTP Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'nexa.8000@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || '' // Set this in .env
    }
});

app.post('/api/contact', async (req, res) => {
    const { username, email, message } = req.body;
    
    try {
        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.GMAIL_USER || 'nexa.8000@gmail.com'}>`,
            to: 'nexa.8000@gmail.com',
            subject: `Portfolio Contact from ${username}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #1a1a2e; color: #fff; padding: 30px; border-radius: 12px;">
                    <h2 style="color: #b200ff; border-bottom: 1px solid #333; padding-bottom: 10px;">New Contact Message</h2>
                    <p><strong style="color: #8a2be2;">Name:</strong> ${username}</p>
                    <p><strong style="color: #8a2be2;">Email:</strong> ${email}</p>
                    <p><strong style="color: #8a2be2;">Message:</strong></p>
                    <div style="background: rgba(138,43,226,0.1); padding: 15px; border-radius: 8px; border-left: 3px solid #b200ff;">
                        ${message}
                    </div>
                    <p style="color: #666; margin-top: 20px; font-size: 12px;">Sent from Obito Portfolio</p>
                </div>
            `
        });
        
        console.log(`Email sent successfully from ${username} (${email})`);
        res.status(200).json({ success: true, message: 'Message sent successfully to Obito!' });
    } catch (error) {
        console.error('Email sending failed:', error.message);
        // Still return success to frontend but log the error
        console.log(`\n--- CONTACT (email failed, logged instead) ---`);
        console.log(`From: ${username} (${email})`);
        console.log(`Message: ${message}`);
        console.log(`----------------------------------------------\n`);
        res.status(200).json({ success: true, message: 'Message received!' });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
