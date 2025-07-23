import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";
import { getPlayer } from '../../../audio/index';

@Discord()
export class Ping {
    @Slash({ description: "ping the bot to check if it's responsive." })
  async ping(interaction: CommandInteraction) {
    const start = Date.now();
    await interaction.deferReply();
    const apiLatency = Date.now() - start;
    const wsLatency = interaction.client.ws.ping;
    const player = getPlayer(interaction.guildId!);
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🏓 Pong!')
      .addFields([
        { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
        { name: 'WebSocket Latency', value: `${wsLatency}ms`, inline: true },
      ]);
    if (player) {
      embed.addFields([
        { name: 'Node', value: player.node.identifier, inline: true },
        { name: 'Queue Size', value: `${player.queue.size()}`, inline: true },
      ]);
    }
    interaction.editReply({ embeds: [embed] });
  }}