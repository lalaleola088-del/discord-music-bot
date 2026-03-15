module.exports = async (client) => {
  console.log(`${client.user.tag} 로그인 완료`);
  client.manager.init(client.user.id);
};
