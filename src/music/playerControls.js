const { getGuildSetup, saveGuildSetup } = require("../store");

async function handlePlayerButtons(interaction, client) {
  const player = client.manager.players.get(interaction.guild.id);
  const customId = interaction.customId;

  if (!customId.startsWith("music_")) return false;

  if (!player && customId !== "music_queue" && customId !== "music_autoplay" && customId !== "music_loop") {
    await interaction.reply({ content: "현재 재생중인 노래가 없습니다.", ephemeral: true });
    return true;
  }

  if (customId === "music_stop") {
    player.destroy();
    await interaction.reply({ content: "음악을 종료했어요.", ephemeral: true });
    return true;
  }

  if (customId === "music_skip") {
    player.stop();
    await interaction.reply({ content: "현재 곡을 스킵했어요.", ephemeral: true });
    return true;
  }

  if (customId === "music_shuffle") {
    player.queue.shuffle();
    await interaction.reply({ content: "대기열을 섞었어요.", ephemeral: true });
    return true;
  }

  if (customId === "music_queue") {
    if (!player || !player.queue || player.queue.size === 0) {
      await interaction.reply({ content: "대기열이 비어 있어요.", ephemeral: true });
      return true;
    }

    const queueList = player.queue.slice(0, 10).map((t, i) => `${i + 1}. ${t.title}`).join("\n");
    await interaction.reply({
      content: `현재 대기열:\n${queueList}`,
      ephemeral: true
    });
    return true;
  }

  if (customId === "music_autoplay") {
    const setup = getGuildSetup(interaction.guild.id);
    const next = !setup.autoplay;
    saveGuildSetup(interaction.guild.id, { autoplay: next });

    if (player) player.set("autoplay", next);

    await interaction.reply({
      content: `자동재생이 ${next ? "켜졌어요" : "꺼졌어요"}.`,
      ephemeral: true
    });
    return true;
  }

  if (customId === "music_loop") {
    const setup = getGuildSetup(interaction.guild.id);
    const current = setup.loopMode || "off";
    let next = "off";

    if (current === "off") next = "track";
    else if (current === "track") next = "queue";
    else next = "off";

    saveGuildSetup(interaction.guild.id, { loopMode: next });

    if (player) {
      if (next === "off") player.setLoop("none");
      if (next === "track") player.setLoop("track");
      if (next === "queue") player.setLoop("queue");
    }

    await interaction.reply({
      content: `반복재생 모드: ${next}`,
      ephemeral: true
    });
    return true;
  }

  return false;
}

module.exports = { handlePlayerButtons };
