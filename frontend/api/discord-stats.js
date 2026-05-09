export default async function handler(req, res) {
  try {
      const botUrl = process.env.BOT_API_URL || 'http://45.134.39.212:4079/api/discord-stats';
      const response = await fetch(botUrl);
      if (!response.ok) {
          throw new Error(`Bot returned status ${response.status}`);
      }
      const data = await response.json();
      res.status(200).json(data);
  } catch (error) {
      console.error('Failed to fetch from bot:', error.message);
      res.status(500).json({ error: 'Failed to connect to Discord Bot' });
  }
}
