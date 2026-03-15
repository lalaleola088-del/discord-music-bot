const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");
const { getGuildSetup, saveGuildSetup } = require("../store");
const { createOrRestoreDashboard } = require("../music/dashboard");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("음악채널만들기")
    .setDescription("음악 전용 채널과 대시보드를 생성합니다.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const guild = interaction.guild;
    const setup = getGuildSetup(guild.id);
    let musicChannel = null;

    if (setup.musicChannelId) {
      try {
        musicChannel = await guild.channels.fetch(setup.musicChannelId);
      } catch (e) {}
    }

    if (!musicChannel) {
      musicChannel = await guild.channels.create({
        name: "🎵음악채널",
        type: ChannelType.GuildText
      });
    }

    await createOrRestoreDashboard(client, guild, musicChannel);
    saveGuildSetup(guild.id, { musicChannelId: musicChannel.id });

    await interaction.reply({
      content: `음악채널 생성 완료: ${musicChannel}`,
      ephemeral: true
    });
  }
};
