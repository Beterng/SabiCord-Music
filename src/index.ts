import dotenv from "dotenv";
import "reflect-metadata"
import { dirname, importx } from "@discordx/importer";
import type { Interaction, Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
dotenv.config();

export const bot = new Client({
  // To use only guild command
  // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

  // Discord intents
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
  ],

  silent: false,

  simpleCommand: {
    prefix: process.env.BOT_PREFIX?.toString() || "!",
  },
});

async function run() {
  // The following syntax should be used in the commonjs environment
  //await importx(__dirname + "/{events,commands}/**/*.{ts,js}");
  // The following syntax should be used in the ECMAScript environment
  await importx(`${dirname(import.meta.url)}/{audio,commands,core,events,interfaces,ipc,localization,services,types,views}/**/*.{ts,js}`);
  
  bot.once("ready", async () => {
  // Synchronize applications commands with Discord
  await bot.initApplicationCommands();

  // It must only be executed once
  await bot.clearApplicationCommands(
    ...bot.guilds.cache.map((g) => g.id)
  );

  console.log("Bot started");
  });

  bot.on("interactionCreate", (interaction: Interaction) => {
  console.log("[interaction]", interaction);
  console.log("[interaction.constructor.name]", interaction.constructor.name);
  bot.executeInteraction(interaction);
  });

  bot.on("messageCreate", (message: Message) => {
    void bot.executeCommand(message);
  });

  if (!process.env.DISCORD_TOKEN) {
    throw Error("Could not find DISCORD_TOKEN in your environment");
  }
  await bot.login(process.env.DISCORD_TOKEN);
  
}

void run();
