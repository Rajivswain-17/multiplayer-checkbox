import { CheckBoxState, UserMap, CooldownMap, ActivityLog } from "../types";

const TOTAL_CHECKBOXES = 900;

const COOLDOWN_MS = 3000;


const checkboxes: Map<number, CheckBoxState> = new Map();

const users: UserMap = {};

const cooldowns: CooldownMap = {};

const activityLogs: ActivityLog[] = [];

function initCheckboxes () {
    for (let i = 0; i < TOTAL_CHECKBOXES; i++) {
        checkboxes.set(i, {
            id: i,
            checked: false,
            lastClickedBy: "",
            lastClickedAt: new Date(0)
        });

        
    }
}

function isOnCooldown(id: number): boolean {
     const cooldownEnd = cooldowns[id] || 0;
     if(!cooldownEnd) return false;
     return Date.now() < cooldownEnd;
}


function getCoolDownRemaining(id: number): number {
       const cooldownEnd = cooldowns[id] || 0;
       if(!cooldownEnd) return 0;

       const remaining = cooldownEnd - Date.now();
       return Math.max(0, remaining);

}
function setCoolDown(id: number) {
    cooldowns[id] = Date.now() + COOLDOWN_MS;
}


function addActivity(log: ActivityLog) {
    activityLogs.unshift(log);
    if(activityLogs.length > 20) {
        activityLogs.pop();
    }
}


export {
  checkboxes,
  users,
  cooldowns,
  activityLogs,
  initCheckboxes,
  isOnCooldown,
  getCoolDownRemaining,
  setCoolDown,
  addActivity,
  TOTAL_CHECKBOXES,
  COOLDOWN_MS
}