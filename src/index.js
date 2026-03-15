require("dotenv").config();
const fs = require("fs");
const path = require("path");
const http = require("http");
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { createManager } = require("./music/manager");
const config = require("./config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

client.manager = createManager(client);

client.once("ready", async () => {
  const readyEvent = require("./events/ready");
  await readyEvent(client);
});

client.on("interactionCreate", async (interaction) => {
  const event = require("./events/interactionCreate");
  await event(interaction, client);
});

client.on("messageCreate", async (message) => {
  const event = require("./events/messageCreate");
  await event(message, client);
});

client.on("raw", (d) => client.manager.updateVoiceState(d));

const PORT = Number(process.env.PORT || 10000);
http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Discord music bot is running.");
}).listen(PORT, () => {
  console.log(`포트 서버 실행중: ${PORT}`);
});

client.login(config.DISCORD_TOKEN);
