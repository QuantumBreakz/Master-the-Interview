// AI-generated async example
// Simulates async tasks with Promises and setTimeout

function asyncTask(name, delay) {
    return new Promise((resolve) => {
        console.log(`Starting task ${name}`);
        setTimeout(() => {
            console.log(`Completed task ${name}`);
            resolve(name);
        }, delay);
    });
}

async function main() {
    console.log("Running tasks sequentially...");
    await asyncTask('A', 1000);
    await asyncTask('B', 1500);
    await asyncTask('C', 500);

    console.log("Running tasks in parallel...");
    await Promise.all([
        asyncTask('X', 1000),
        asyncTask('Y', 1500),
        asyncTask('Z', 500)
    ]);

    console.log("All tasks finished");
}

main();
