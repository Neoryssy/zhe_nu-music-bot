const Discord = require('discord.js');
const { initQueue } = require('../modules/queue');
const { initResource, initPlayer, initConnection } = require('../modules/player');
const { initSearch } = require('../modules/search');

module.exports = {
  args: true,
  argsNotProvidedMsg: 'Не указано название трека',
  name: 'play',
  description: 'play music',
  async execute(ctx) {
    try {
      const { client } = require('..');
      let queue;

      if (!client.queues.getGuildQueue(ctx.message.guild.id)) {
        queue = initQueue();
        client.queues.addGuildQueue(ctx.message.guild.id, queue);
      } else {
        queue = client.queues.getGuildQueue(ctx.message.guild.id);
      }

      // const connection = initConnection({ guild: ctx.message.guild, voice: ctx.message.member.voice });

      const tracksInfo = await (await initSearch({ query: 'подушка' })).getInfo();
      queue.addTracks(tracksInfo);

      const current = queue.getCurrent();

      // const resource = initResource({ resourceURL: current.resourceURL, type: current.type });
      const player = initPlayer({ guild: ctx.message.guild, voice: ctx.message.member.voice });

      // connection.subscribe(player.play(resource.getResource()));

      player.play(current);
    } catch (e) {
      console.log(e);
    }
  },
};
