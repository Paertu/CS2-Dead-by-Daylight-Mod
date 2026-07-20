import { Instance } from "cs_script/point_script";
let DEBUG_MODE = true;

Instance.OnActivate(() => {
    Instance.ServerCommand("sv_cheats 1");
    Instance.ServerCommand("mp_do_warmup_period 0");
    Instance.ServerCommand("mp_warmuptime 0");
    Instance.ServerCommand("mp_freezetime 0");
    Instance.ServerCommand("mp_buytime 10000");
});

const REPAIR_GOAL = 100;
const REPAIR_INCREMENT = 50;
let generators = {};

Instance.Msg(Object.getOwnPropertyNames(Instance));

generatorStatusCleanup();
generatorRepairAction();

function generatorRepairAction() {
    Instance.OnScriptInput("RepairAction", (ctx) => {
        // if (DEBUG_MODE) {
        //     Instance.Msg(`ctx stringified:${JSON.stringify(ctx)}`);   
        //     Instance.Msg(`caller expanded:${Object.getOwnPropertyNames(ctx.caller)}`);   
        //     Instance.Msg(`activator expanded:${Object.getOwnPropertyNames(ctx.activator)}`);   
        // }
        let gennyName = ctx.caller.GetEntityName();
        if (generators[gennyName] === undefined) {
            Instance.Msg(`genny was undefined, created one called:${JSON.stringify(gennyName)}`);   
            generators[gennyName] = {
                progress: 0,
                goal: REPAIR_GOAL,
                isRunning: false,
            }
        }

        let generator = generators[gennyName]
        if (generator.goal > generator.progress) {
            generator.progress += REPAIR_INCREMENT;
            Instance.Msg(`Progress ${gennyName}: ${generator.progress}`);   

            if (generator.goal <= generator.progress) {
                finishGenerator(gennyName)
            }
        }

    });    
}

function generatorStatusCleanup() {
    Instance.Msg("Starting Generator Status Cleanup");
    try {
        Instance.OnBeginRoundRestart(() => {
            try {
                let allGenerators = getAllGenerators(generators)
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

function finishGenerator(name) {
    if (generators[name]) {
        generators[name].isRunning = true;
        if (DEBUG_MODE) {
            Instance.Msg(`Finished ${JSON.stringify(name)}, isRunning:${generators[name].isRunning}`);      
        }
    }
}

function getAllGenerators(generators) {
    if (!generators) return [];
    let allGenerators = Object.values(generators)
    if (DEBUG_MODE) {
        Instance.Msg(`Found ${allGenerators.length} gens`);
    }
    return allGenerators;
}