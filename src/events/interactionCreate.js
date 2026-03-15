const { handlePlayerButtons } = require("../music/playerControls");

module.exports = async (interaction, client) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (e) {
      console.error(e);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: "명령어 실행 중 오류가 났어요.", ephemeral: true });
      } else {
        await interaction.reply({ content: "명령어 실행 중 오류가 났어요.", ephemeral: true });
      }
    }
    return;
  }

  if (interaction.isButton()) {
    await handlePlayerButtons(interaction, client);
  }
};
