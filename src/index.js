const fs = require("node:fs");
const logger = require("js-logger");

const { Client, Collection, Intents } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

const TOKEN = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

function main() {
    logger.useDefaults({
        defaultLevel: logger.DEBUG,
        formatter: (messages, context) =>
            messages.unshift(`[${new Date().toUTCString()}] [${context.level.name}]: `)
    });

    client.once("ready", () => {
        registerCommands();
        handleCommands();
        logger.info("Bot loaded!");
    });

    client.login(TOKEN);
}

/**
 * Load all command files from the "commands" folder, and POST them to the Discord 
 * command endpoint for the specific server.
 * 
 * @private
 * 
 */
function registerCommands() {
    logger.info("Loading commands!");
    client.commands = new Collection();

    const files = fs.readdirSync("./src/commands")
        .filter(file => file.endsWith(".js") && file != "example.command.js");

    for (const file of files) {
        const command = require(`./commands/${file}`);
        if (!command.enabled)
            continue;

        client.commands.set(command.data.name, command);
        logger.info(`Loaded command from file: commands/${file}`);
    }

    const rest = new REST({ version: "9" }).setToken(TOKEN);
    (async () => {
        try {
            logger.info("Started refreshing application (/) commands.");
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: client.commands.map(command => command.data.toJSON()) },
            );

            logger.info("Successfully reloaded application (/) commands.");
        } catch (error) {
            logger.error(error);
        }
    })();
}

function handleCommands() {
    client.on("interactionCreate", async interaction => {
        if (!interaction.isCommand())
            return;
        
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return;
        
        try {
            await command.execute(interaction);
        
        } catch (error) {
            logger.error(error);
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    });

}

main();