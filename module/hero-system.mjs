// Import document classes.
import { HeroSystemActor } from './documents/actor.mjs';
import { HeroSystemItem } from './documents/item.mjs';
// Import sheet classes.
import { HeroSystemActorSheet } from './sheets/actor-sheet.mjs';
import { HeroSystemItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { HERO_SYSTEM } from './helpers/config.mjs';


/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.herosystem = {
    HeroSystemActor,
    HeroSystemItem,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  CONFIG.HERO_SYSTEM = HERO_SYSTEM;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '1d20 + @abilities.dex.mod',
    decimals: 2,
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = HeroSystemActor;
  CONFIG.Item.documentClass = HeroSystemItem;

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('hero-system', HeroSystemActorSheet, {
    makeDefault: true,
    label: 'HERO_SYSTEM.SheetLabels.Actor',
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('hero-system', HeroSystemItemSheet, {
    makeDefault: true,
    label: 'HERO_SYSTEM.SheetLabels.Item',
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (value) {
  return value.toLowerCase();
});

// sum
Handlebars.registerHelper('sum', function (value1, value2) {
  let sum = value1 + value2;
  return sum;
});

// divide
Handlebars.registerHelper('divide', function(value, divisor) {
    if (divisor === 0) {
        return 0; // Prevent division by zero errors
    }
    return value / divisor;
});

// multiply
Handlebars.registerHelper('multiply', function(a, b) {
    return a*b;
});

//round down
Handlebars.registerHelper('floor', function(value) {
    return Math.floor(value);
});
// round up
Handlebars.registerHelper('ceil', function(value) {
    return Math.ceil(value);
});

Handlebars.registerHelper('calcStr', function(str) {
    let out = str.value+str.base;
    return out;
});

// characteristics calculations
Handlebars.registerHelper('calcDex', function(dex) {
    let out = Math.floor((dex.value/dex.cost_multiplier)+dex.base);
    return out;
});

Handlebars.registerHelper('calcInt', function(int) {
    let out = int.value+int.base;
    return out;
});

Handlebars.registerHelper('calcPre', function(pre) {
    let out = pre.value+pre.base;
    return out;
});

Handlebars.registerHelper('calcCon', function(con) {
    let out = Math.floor((con.value/con.cost_multiplier)+con.base);
    return out;
});

Handlebars.registerHelper('calcBody', function(bod) {
    let out = Math.floor((bod.value/bod.cost_multiplier)+bod.base);
    return out;
});

Handlebars.registerHelper('calcEgo', function(ego) {
    let out = Math.floor((ego.value/ego.cost_multiplier)+ego.base);
    return out;
});

Handlebars.registerHelper('calcPd', function(abilities) {
    let temp_str = abilities.STR.value+abilities.STR.base;
    let out = Math.floor((temp_str)+abilities.PD.value);
    return out;
});

Handlebars.registerHelper('calcEd', function(abilities) {
    let temp_con = Math.floor((abilities.CON.value/abilities.CON.cost_multiplier)+abilities.CON.base);
    let out = Math.floor((temp_con/5)+abilities.ED.value);
    return out;
});

Handlebars.registerHelper('calcSpd', function(abilities) {
    let temp_dex = Math.floor((abilities.DEX.value/abilities.DEX.cost_multiplier)+abilities.DEX.base);
    let out = Math.floor((temp_dex+abilities.SPD.value)/abilities.SPD.cost_multiplier)+abilities.SPD.base;
    return out;
});

Handlebars.registerHelper('calcRec', function(abilities) {
    let temp_str = abilities.STR.value+abilities.STR.base;
    let temp_con = Math.floor((abilities.CON.value/abilities.CON.cost_multiplier)+abilities.CON.base);
    let out = Math.floor((temp_str/5 + temp_con/5) + abilities.REC.value/abilities.REC.cost_multiplier);
    return out;
});

Handlebars.registerHelper('calcEnd', function(abilities) {
    let temp_con = Math.floor((abilities.CON.value/abilities.CON.cost_multiplier)+abilities.CON.base);
    let out = (temp_con*2)+(abilities.STUN.value*2);
    return out;
});

Handlebars.registerHelper('calcStun', function(abilities) {
    let temp_str = abilities.STR.value+abilities.STR.base;
    let temp_con = Math.floor((abilities.CON.value/abilities.CON.cost_multiplier)+abilities.CON.base);
    let temp_body = Math.floor((abilities.BODY.value/abilities.BODY.cost_multiplier)+abilities.BODY.base);
    let out = Math.floor((temp_str/2 + temp_con/2 + temp_body)+abilities.STUN.value);
    return out;
});

Handlebars.registerHelper('calcCharTotal', function(abilities) {
    let out = abilities.STR.value + abilities.DEX.value + abilities.CON.value + abilities.BODY.value + abilities.EGO.value + abilities.PRE.value + abilities.PD.value + abilities.ED.value + abilities.SPD.value + abilities.REC.value + abilities.END.value + abilities.STUN.value;
    return out;
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

async function calcSpd(actorName){
    const actor = await game.actors.getName(actorName);
    const system = await actor.system;
    let temp_dex = Math.floor((system.abilities.DEX.value/3)+system.abilities.DEX.base);
    let out = Math.floor((temp_dex+system.abilities.SPD.value)/10)+1;
    return out;
}

async function calcRec(actorName) {
    const actor = await game.actors.getName(actorName);
    const system = await actor.system;
    let temp_str = system.abilities.STR.value + system.abilities.STR.base;
    let temp_con = Math.floor((system.abilities.CON.value/2)+system.abilities.CON.base);
    let out = Math.floor((temp_str/5 + temp_con/5) + system.abilities.REC.value/2);
    return out;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items'
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.herosystem.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'hero-system.itemMacro': true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}
