import { Instance } from "cs_script/point_script";
Instance.ServerCommand("sv_cheats 1");
Instance.ServerCommand("mp_do_warmup_period 0");
Instance.ServerCommand("mp_warmuptime 0");
Instance.ServerCommand("mp_freezetime 0");
Instance.ServerCommand("mp_buytime 10000");

const repairGoal = 100;
let repairProgress = 0;
let is_running = false;
let is_special = false;

Instance.Msg(Object.getOwnPropertyNames(Instance));

Instance.OnScriptInput("RepairAction", (ctx) => {
    let gennyName = ctx.caller.GetEntityName();
    Instance.Msg(`caller expanded:${Object.getOwnPropertyNames(ctx.caller)}`);   
    Instance.Msg(`genny name:${JSON.stringify(gennyName)}`);   

    if (!is_running) {
        repairProgress = repairProgress + 25;
        Instance.Msg(`ctx stringified:${JSON.stringify(ctx)} Progress: ${repairProgress}`);   
    }
    Instance.Msg(`ctx stringified:${JSON.stringify(ctx)} Progress: ${repairProgress}`);
    if (repairGoal <= repairProgress) {
        is_running = true;
        Instance.Msg(`Generator is running ${is_running}`);
    }
});