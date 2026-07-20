import { Instance } from "cs_script/point_script";
let DEBUG_MODE = false;

Instance.OnActivate(() => {
    Instance.ServerCommand("sv_cheats 1");
    Instance.ServerCommand("mp_do_warmup_period 0");
    Instance.ServerCommand("mp_warmuptime 0");
    Instance.ServerCommand("mp_freezetime 0");
    Instance.ServerCommand("mp_buytime 10000");
});

const repairGoal = 100;
let repairProgress = 0;
let generators = {};

Instance.Msg(Object.getOwnPropertyNames(Instance));

generatorStatusCleanup();

Instance.OnScriptInput("RepairAction", (ctx) => {
    if (DEBUG_MODE) {
        Instance.Msg(`ctx stringified:${JSON.stringify(ctx)}`);   
        Instance.Msg(`caller expanded:${Object.getOwnPropertyNames(ctx.caller)}`);   
        Instance.Msg(`activator expanded:${Object.getOwnPropertyNames(ctx.activator)}`);   
    }
    let gennyName = ctx.caller.GetEntityName();
    if (generators[gennyName] === undefined) {
        Instance.Msg(`genny was undefined, created one called:${JSON.stringify(gennyName)}`);   
        generators[gennyName] = {
            progress: 0,
            goal: repairGoal,
            isRunning: false,
        }
    }

    let generator = generators[gennyName]
    if (generator.goal > generator.progress) {
        generator.progress += 5;
        Instance.Msg(`Progress: ${generator.progress}`);   
    }
});

function generatorStatusCleanup() {
    Instance.Msg("Starting Generator Status Cleanup");
    try {
        Instance.OnBeginRoundRestart(() => {
            try {
                Instance.Msg("Attempting to reset gens");
                let allGenerators = Object.values(generators);
                Instance.Msg(`Attempting to reset ${allGenerators.length} gens`);

                allGenerators.forEach(gen => {
                    gen.progress = 0;
                    gen.isRunning = false;
                });
            }
            catch (error) {
                Instance.Msg(`CLEANUP ERROR: ${error}`);
            }
            Instance.Msg("Reset generators");
        });
    }
    catch (error) {
        Instance.Msg(`CLEANUP FUNCTION ERROR: ${error}`);
    }
}
