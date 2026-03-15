require("dotenv").config();

module.exports = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  LAVALINK_HOST: process.env.LAVALINK_HOST,
  LAVALINK_PORT: Number(process.env.LAVALINK_PORT || 443),
  LAVALINK_PASSWORD: process.env.LAVALINK_PASSWORD,
  LAVALINK_SECURE: process.env.LAVALINK_SECURE === "true"
};
