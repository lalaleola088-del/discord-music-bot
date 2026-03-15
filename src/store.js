const guildStore = new Map();

function getGuildSetup(guildId) {
  return guildStore.get(guildId) || {
    guildId,
    musicChannelId: null,
    dashboardMessageId: null,
    dashboardChannelId: null,
    autoplay: false,
    loopMode: "off"
  };
}

function saveGuildSetup(guildId, data) {
  const current = getGuildSetup(guildId);
  const next = { ...current, ...data, guildId };
  guildStore.set(guildId, next);
  return next;
}

module.exports = { getGuildSetup, saveGuildSetup };
