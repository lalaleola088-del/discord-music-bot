const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const ytdl = require("ytdl-core");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

client.once("ready", () => {
  console.log(`봇 로그인: ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "play") {
    const url = interaction.options.getString("url");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply("먼저 음성채널에 들어가세요.");
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

    const stream = ytdl(url, { filter: "audioonly" });

    const player = createAudioPlayer();
    const resource = createAudioResource(stream);

    player.play(resource);
    connection.subscribe(player);

    interaction.reply("노래 재생 시작 🎵");
  }
});

client.login(process.env.DISCORD_TOKEN);
require("http").createServer((req,res)=>res.end("봇 실행중")).listen(process.env.PORT || 3000);
