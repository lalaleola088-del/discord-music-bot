const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const progressBar = require("../utils/progressBar");
const { getGuildSetup, saveGuildSetup } = require("../store");

function getControlRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("music_stop").setLabel("종료").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("music_skip").setLabel("스킵").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("music_queue").setLabel("대기열").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("music_shuffle").setLabel("대기열섞기").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("music_autoplay").setLabel("자동재생").setStyle(ButtonStyle.Success)
  );
}

function getControlRow2() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("music_loop").setLabel("반복재생").setStyle(ButtonStyle.Secondary)
  );
}

async function createOrRestoreDashboard(client, guild, channel) {
  const setup = getGuildSetup(guild.id);
  let dashboardMessage = null;

  if (setup.dashboardMessageId && setup.dashboardChannelId) {
    try {
      const oldChannel = await client.channels.fetch(setup.dashboardChannelId);
      dashboardMessage = await oldChannel.messages.fetch(setup.dashboardMessageId);
      return { setup, dashboardMessage };
    } catch (e) {}
  }

  const embed = new EmbedBuilder()
    .setTitle("🎵 음악 대시보드")
    .setDescription("현재 재생 중인 노래가 없습니다.")
    .setImage("https://placehold.co/800x400?text=No+Music")
    .setFooter({ text: "재시작하면 대시보드 정보가 초기화될 수 있습니다." });

  dashboardMessage = await channel.send({
    embeds: [embed],
    components: [getControlRow(), getControlRow2()]
  });

  saveGuildSetup(guild.id, {
    musicChannelId: channel.id,
    dashboardChannelId: channel.id,
    dashboardMessageId: dashboardMessage.id
  });

  return { setup: getGuildSetup(guild.id), dashboardMessage };
}

async function updateDashboardNowPlaying(client, player, track) {
  const setup = getGuildSetup(player.guild);
  if (!setup.dashboardChannelId || !setup.dashboardMessageId) return;

  try {
    const channel = await client.channels.fetch(setup.dashboardChannelId);
    const message = await channel.messages.fetch(setup.dashboardMessageId);

    const requester = track.requester;
    const current = player.position || 0;
    const total = track.duration || 0;
    const bar = progressBar(current, total);

    const requesterText = requester?.id ? `<@${requester.id}>` : "알 수 없음";
    const requesterAvatar = requester?.displayAvatarURL?.({ dynamic: true }) || null;

    const embed = new EmbedBuilder()
      .setTitle("🎶 현재 재생중")
      .setDescription(
        `**곡 제목**: ${track.title}\n` +
        `**요청자**: ${requesterText}\n` +
        `**재생바**: ${bar}\n` +
        `**시간**: ${formatMs(current)} / ${formatMs(total)}`
      )
      .setThumbnail(requesterAvatar)
      .setImage(track.thumbnail || "https://placehold.co/800x400?text=Music")
      .setFooter({ text: "버튼으로 음악을 제어할 수 있습니다." });

    await message.edit({
      embeds: [embed],
      components: [getControlRow(), getControlRow2()]
    });
  } catch (e) {
    console.log("대시보드 업데이트 실패:", e.message);
  }
}

async function updateDashboardIdle(client, guildId) {
  const setup = getGuildSetup(guildId);
  if (!setup.dashboardChannelId || !setup.dashboardMessageId) return;

  try {
    const channel = await client.channels.fetch(setup.dashboardChannelId);
    const message = await channel.messages.fetch(setup.dashboardMessageId);

    const embed = new EmbedBuilder()
      .setTitle("🎵 음악 대시보드")
      .setDescription("현재 재생 중인 노래가 없습니다.")
      .setImage("https://placehold.co/800x400?text=No+Music")
      .setFooter({ text: "노래 제목이나 링크를 입력하면 자동 재생됩니다." });

    await message.edit({
      embeds: [embed],
      components: [getControlRow(), getControlRow2()]
    });
  } catch (e) {
    console.log("대시보드 초기화 실패:", e.message);
  }
}

function formatMs(ms) {
  if (!ms || ms < 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

module.exports = {
  createOrRestoreDashboard,
  updateDashboardNowPlaying,
  updateDashboardIdle
};
