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

Handlebars.registerHelper('upper', function (text) {
  if (text) {
    return text.toUpperCase();
  }
  return text
})

Handlebars.registerHelper('lower', function (text) {
  return text.toLowerCase()
})

Handlebars.registerHelper('upperFirst', function (text) {
  if (typeof text !== 'string') return text
  return text.charAt(0).toUpperCase() + text.slice(1)
})

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
    return Number(a) * Number(b);
});

//round down
Handlebars.registerHelper('floor', function(value) {
    return Math.floor(value);
});

// round up
Handlebars.registerHelper('ceil', function(value) {
    return Math.ceil(value);
});

Handlebars.registerHelper('calcStrPts', function(str) {
    let out = str.value-str.base;
    return out;
});

// characteristics calculations
Handlebars.registerHelper('calcDexPts', function(dex) {
    let out = (dex.value-dex.base)*dex.cost_multiplier;
    return out;
});

Handlebars.registerHelper('calcIntPts', function(int) {
    let out = int.value-int.base;
    return out;
});

Handlebars.registerHelper('calcPrePts', function(pre) {
    let out = pre.value-pre.base;
    return out;
});

Handlebars.registerHelper('calcConPts', function(con) {
    let out = (con.value-con.base)*con.cost_multiplier;
    return out;
});

Handlebars.registerHelper('calcBodyPts', function(bod) {
    let out = (bod.value-bod.base)*bod.cost_multiplier;
    return out;
});

Handlebars.registerHelper('calcEgoPts', function(ego) {
    let out = (ego.value-ego.base)*ego.cost_multiplier;
    return out;
});

Handlebars.registerHelper('calcPdPts', function(abilities) {
    let temp_str = Math.floor(abilities.STR.value/5);
    let out = abilities.PD.value-temp_str;
    return out;
});

Handlebars.registerHelper('calcEdPts', function(abilities) {
    let temp_con = Math.floor(abilities.CON.value/5)
    let out = abilities.ED.value-temp_con;
    return out;
});

Handlebars.registerHelper('calcSpdPts', function(abilities) {
    return calcSpdPts(abilities);
});

Handlebars.registerHelper('calcRecPts', function(abilities) {
    let temp_str = Math.floor(abilities.STR.value/5);
    let temp_con = Math.floor(abilities.CON.value/5);
    let out = (abilities.REC.value-(temp_str+temp_con))*2;
    return out;
});

Handlebars.registerHelper('calcEndPts', function(abilities) {
    let temp_con = abilities.CON.value*2;
    let out = Math.floor((abilities.END.value-temp_con)/2);
    return out;
});

Handlebars.registerHelper('calcStunPts', function(abilities) {
    let temp_str = Math.floor(abilities.STR.value/2);
    let temp_con = Math.floor(abilities.CON.value/2);
    let out = Math.floor((abilities.STUN.value - (temp_str+temp_con+abilities.BODY.value))*2);
    return out;
});

Handlebars.registerHelper('calcCharTotal', function(abilities) {
    let str_pts = abilities.STR.value-abilities.STR.base;

    let temp_dex = Math.floor(abilities.DEX.value/10);
    let dex_pts = (abilities.SPD.value-temp_dex)*10;

    let con_pts = (abilities.CON.value-abilities.CON.base)*abilities.CON.cost_multiplier;
    let body_pts = (abilities.BODY.value-abilities.BODY.base)*abilities.BODY.cost_multiplier;
    let int_pts = abilities.INT.value-abilities.INT.base;
    let ego_pts = (abilities.EGO.value-abilities.EGO.base)*abilities.EGO.cost_multiplier;

    let out = str_pts + dex_pts + con_pts + body_pts + int_pts + ego_pts + abilities.PRE.value + abilities.PD.value + abilities.ED.value + abilities.SPD.value + abilities.REC.value + abilities.END.value + abilities.STUN.value;
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

function calcSpdPts(abilities){
    let temp_dex = Math.floor(abilities.DEX.value/10);
    let out = (abilities.SPD.value-temp_dex)*10;
    return foundry.utils.duplicate(out);
    //return out;
}

function calcSpd(abilities){
    let temp_dex = Math.floor((abilities.DEX.value/abilities.DEX.cost_multiplier)+abilities.DEX.base);
    let out = Math.floor((temp_dex+abilities.SPD.value)/abilities.SPD.cost_multiplier)+abilities.SPD.base;
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
