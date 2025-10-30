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
    return calcStrPts(str);
});

// characteristics calculations
Handlebars.registerHelper('calcDexPts', function(dex) {
    return calcDexPts(dex);
});

Handlebars.registerHelper('calcIntPts', function(int) {
    return calcIntPts(int);
});

Handlebars.registerHelper('calcPrePts', function(pre) {
    return calcPrePts(pre);
});

Handlebars.registerHelper('calcConPts', function(con) {
    return calcConPts(con);
});

Handlebars.registerHelper('calcBodyPts', function(bod) {
    return calcBodyPts(bod);
});

Handlebars.registerHelper('calcEgoPts', function(ego) {
    return calcEgoPts(ego);
});

Handlebars.registerHelper('calcPdPts', function(abilities) {
    return calcPdPts(abilities);
});

Handlebars.registerHelper('calcEdPts', function(abilities) {
    return calcEdPts(abilities);
});

Handlebars.registerHelper('calcSpdPts', function(abilities) {
    return calcSpdPts(abilities);
});

Handlebars.registerHelper('calcRecPts', function(abilities) {
    return calcRecPts(abilities);
});

Handlebars.registerHelper('calcEndPts', function(abilities) {
    return calcEndPts(abilities);
});

Handlebars.registerHelper('calcStunPts', function(abilities) {
    return calcStunPts(abilities);
});

Handlebars.registerHelper('calcCurrentStun', function(stun,current_stun) {
    return calcCurrentStun(stun,current_stun);
});

Handlebars.registerHelper('calcCharTotal', function(abilities) {
    let out = calcStrPts(abilities.STR) + calcDexPts(abilities.DEX) + calcConPts(abilities.CON) + calcBodyPts(abilities.BODY) + calcIntPts(abilities.INT) + calcEgoPts(abilities.EGO) + calcPrePts(abilities.PRE) + calcPdPts(abilities) + calcEdPts(abilities) + calcSpdPts(abilities) + calcRecPts(abilities) + calcEndPts(abilities) + calcStunPts(abilities);
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

function calcStrPts(str){
    let out = str.value-str.base;
    return foundry.utils.duplicate(out);
}

function calcDexPts(dex){
    let out = (dex.value-dex.base)*dex.cost_multiplier;
    return foundry.utils.duplicate(out);
}

function calcIntPts(int){
    let out = int.value-int.base;
    return foundry.utils.duplicate(out);
}

function calcPrePts(pre){
    let out = pre.value-pre.base;
    return foundry.utils.duplicate(out);
}

function calcConPts(con){
    let out = (con.value-con.base)*con.cost_multiplier;
    return foundry.utils.duplicate(out);
}

function calcBodyPts(bod){
    let out = (bod.value-bod.base)*bod.cost_multiplier;
    return foundry.utils.duplicate(out);
}

function calcEgoPts(ego){
    let out = (ego.value-ego.base)*ego.cost_multiplier;
    return foundry.utils.duplicate(out);
}

function calcPdPts(abilities){
    let temp_str = Math.floor(abilities.STR.value/5);
    let out = abilities.PD.value-temp_str;
    return foundry.utils.duplicate(out);
}

function calcEdPts(abilities){
    let temp_con = Math.floor(abilities.CON.value/5)
    let out = abilities.ED.value-temp_con;
    return foundry.utils.duplicate(out);
}

function calcSpdPts(abilities){
    let temp_dex = Math.floor(abilities.DEX.value/10);
    let out = (abilities.SPD.value-temp_dex)*10;
    return foundry.utils.duplicate(out);
}

function calcRecPts(abilities){
    let temp_str = Math.floor(abilities.STR.value/5);
    let temp_con = Math.floor(abilities.CON.value/5);
    let out = (abilities.REC.value-(temp_str+temp_con))*2;
    return foundry.utils.duplicate(out);
}

function calcEndPts(abilities){
    let temp_con = abilities.CON.value*2;
    let out = Math.floor((abilities.END.value-temp_con)/2);
    return foundry.utils.duplicate(out);
}

function calcStunPts(abilities){
    let temp_str = Math.floor(abilities.STR.value/2);
    let temp_con = Math.floor(abilities.CON.value/2);
    let out = Math.floor((abilities.STUN.value - (temp_str+temp_con+abilities.BODY.value))*2);
    return foundry.utils.duplicate(out);
}

function calcCurrentStun(stun,current_stun){
    console.log(current_stun);
    if(current_stun==null){
        console.log("is empty");
        return foundry.utils.duplicate(stun);
    }else{
        console.log("NOT empty");
        return foundry.utils.duplicate(current_stun);
    }
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
