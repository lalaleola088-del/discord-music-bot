const { Manager } = require("erela.js");
const config = require("../config");

function createManager(client) {
  const manager = new Manager({
    nodes: [
      {
        identifier: "main",
        host: config.LAVALINK_HOST,
        port: config.LAVALINK_PORT,
        password: config.LAVALINK_PASSWORD,
        secure: config.LAVALINK_SECURE
      }
    ],
    send(id, payload) {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    }
  });

  manager
    .on("nodeConnect", (node) => {
      console.log(`[LAVALINK] 연결됨: ${node.options.identifier}`);
    })
    .on("nodeError", (node, error) => {
      console.log("[LAVALINK] 오류:", error);
    })
    .on("trackStart", async (player, track) => {
      const { updateDashboardNowPlaying } = require("./dashboard");
      await updateDashboardNowPlaying(client, player, track);
    })
    .on("queueEnd", async (player) => {
      const { updateDashboardIdle } = require("./dashboard");
      await updateDashboardIdle(client, player.guild);
      if (!player.get("autoplay")) {
        player.destroy();
      }
    });

  return manager;
}

module.exports = { createManager };
