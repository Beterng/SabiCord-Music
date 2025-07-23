import { 
  CommandInteraction, 
  ApplicationCommandOptionType, 
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
  VoiceChannel,
  TextChannel
} from 'discord.js';
import { Discord, Slash, SlashOption, SlashChoice,SlashGroup } from 'discordx';
import { Category } from '@discordx/utilities';
import { injectable, container } from 'tsyringe';
import { Database } from '../../../core/Database';
import { Settings } from '../../../core/Settings';
@Discord()
@Category("Setting")
@injectable()
export class prefix {
  @Slash({ description: 'Set the bot prefix for this server' })
  async prefix(
    interaction: CommandInteraction,
    @SlashOption({
      description: 'New prefix (leave empty to view current)',
      name: 'prefix',
      required: false,
      type: ApplicationCommandOptionType.String,
      maxLength: 5,
    })
    prefix: string
  ): Promise<void> {
    try {
      const database = container.resolve<Database>('Database');
      const settings = container.resolve<Settings>('Settings');
      if (!prefix) {
        const guildSettings = await database.settings.getSettings(interaction.guild!.id);
        const currentPrefix = guildSettings.prefix || settings.prefix;
        await interaction.reply({
          content: `🔧 Current prefix: \`${currentPrefix}\``
        });
        return;
      }
      await database.settings.updateSettings(interaction.guild!.id, {
        $set: { prefix }
      });
      await interaction.reply({ 
        content: `🔧 Prefix updated to: \`${prefix}\`` 
      });
    } catch (error) {
      console.error('Error updating prefix', error as Error, 'commands');
      await interaction.reply({ 
        content: '❌ Failed to update prefix!', 
        ephemeral: true 
      });
    }
  }
}