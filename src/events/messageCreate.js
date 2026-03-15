const { getGuildSetup } = require("../store");

module.exports = async (message, client) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  const setup = getGuildSetup(message.guild.id);
  if (!setup.musicChannelId) return;
  if (message.channel.id !== setup.musicChannelId) return;

  const member = message.member;
  const voiceChannel = member.voice.channel;

  if (!voiceChannel) {
    const warn = await message.channel.send("먼저 음성채널에 들어가줘.");
    setTimeout(() => warn.delete().catch(() => {}), 2000);
    setTimeout(() => message.delete().catch(() => {}), 300);
    return;
  }

  let player = client.manager.players.get(message.guild.id);

  if (!player) {
    player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: voiceChannel.id,
      textChannel: message.channel.id,
      selfDeafen: true
    });

    player.connect();
    player.set("autoplay", setup.autoplay);
  }

  const search = await client.manager.search(message.content, message.author);

  if (!search || !search.tracks || search.tracks.length === 0) {
    const fail = await message.channel.send("노래를 찾지 못했어.");
    setTimeout(() => fail.delete().catch(() => {}), 2000);
    setTimeout(() => message.delete().catch(() => {}), 300);
    return;
  }

  const track = search.tracks[0];
  player.queue.add(track);

  if (!player.playing && !player.paused && !player.queue.current) {
    player.play();
  }

  const info = await message.channel.send(`대기열에 추가됨: **${track.title}**`);
  setTimeout(() => info.delete().catch(() => {}), 2000);
  setTimeout(() => message.delete().catch(() => {}), 300);
};
