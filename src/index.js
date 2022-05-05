const fs = require("node:fs");
const process = require("node:process");
const logger = require("js-logger");

const { Client, Collection, Intents } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { NoPermissionEmbed } = require("./embeds/noPermission");

require("dotenv").config();

const TOKEN = process.env.DISCORD_TOKEN;
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_PRESENCES,
    ],
    partials: ["MESSAGE", "CHANNEL", "REACTION"]
});

function main() {

    process.on("exit", () => {
        client.emit("shutdown");

        logger.info("Graceful shutdown completed. Exiting...");
        console.log("Process terminated");
    });

    process.on("SIGINT", () => {
        console.log("Caught interrupt signal");
        process.exit();
    });

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
        .filter(file => file.endsWith(".js") && file != "example.js");

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

        const roleRequired = command.roleRequired;
        if(interaction.member.roles.cache.has(roleRequired)) {
            try {
                await command.execute(interaction);
        
            } catch (error) {
                logger.error(error);
                await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
            }

        } else
            await interaction.reply({
                embeds: [NoPermissionEmbed],
                ephemeral: true,
            });        
    });

}

main();