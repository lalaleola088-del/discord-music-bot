const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  entersState,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", () => {
  console.log(`봇 로그인: ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "play") return;

  await interaction.deferReply(); // 3초 안에 응답 처리

  try {
    const url = interaction.options.getString("url", true);
    const member = interaction.member;
    const voiceChannel = member?.voice?.channel;

    if (!voiceChannel) {
      return interaction.editReply("먼저 음성채널에 들어가야 해.");
    }

    if (!voiceChannel.joinable || !voiceChannel.speakable) {
      return interaction.editReply("그 음성채널에 들어가거나 말할 권한이 없어.");
    }

    if (!ytdl.validateURL(url)) {
      return interaction.editReply("유효한 유튜브 링크를 넣어줘.");
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: true,
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

    const stream = ytdl(url, {
      filter: "audioonly",
      highWaterMark: 1 << 25,
    });

    stream.on("error", async (err) => {
      console.error("ytdl 오류:", err);
      try {
        await interaction.followUp("유튜브 스트림을 가져오지 못했어.");
      } catch {}
    });

    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    player.on("error", (err) => {
      console.error("오디오 플레이어 오류:", err);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      try {
        connection.destroy();
      } catch {}
    });

    player.play(resource);
    connection.subscribe(player);

    return interaction.editReply("노래 재생 시작 🎵");
  } catch (err) {
    console.error("play 명령 오류:", err);
    if (interaction.deferred || interaction.replied) {
      return interaction.editReply("재생 중 오류가 났어.");
    }
    return interaction.reply("재생 중 오류가 났어.");
  }
});

client.login(process.env.DISCORD_TOKEN);
