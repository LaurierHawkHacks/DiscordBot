// const ShutdownHook = require("shutdown-hook");
// let shutdownHook = new ShutdownHook();
const process = require("node:process");

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

const main = async () => {
    console.log("heyhi");
    // shutdownHook.add(_ => console.log("bye"));
    // shutdownHook.register();
    // shutdownHook.on("ShutdownStarted", (e) => console.log("it has began"));
    // shutdownHook.on("ComponentShutdown", (e) => console.log("shutting down one component"));
    // shutdownHook.on("ShutdownEnded", (e) => console.log("it has ended"));
    console.log("ok");
    await sleep(4000);
};

process.on("exit", () => {
    console.log("Process terminated");
});

process.on("SIGINT", () => {
    console.log("Caught interrupt signal");
    process.exit();
});

main();