import { ExecuteOptions, GuildCommand } from '../types/Command/Command';

const e = async ({ subscription, message }: ExecuteOptions) => {
  subscription!.joinChannel(message.member!.voice!.channelId!);
};

module.exports = new GuildCommand({
  createSubscription: true,
  description: 'Присоединиться к текущему голосовому каналу',
  e,
  name: 'join',
});
