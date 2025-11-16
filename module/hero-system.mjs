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
  let sum = Number(value1) + Number(value2);
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

// round up
Handlebars.registerHelper('log', function(value) {
    console.log("LOG :"+JSON.stringify(value));
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

Handlebars.registerHelper('selectKey', function(values,comp_key) {
    var output = ``
    for (let key in values) {
        if(key==comp_key){
            output += `<option name='name' type='text' value='`+key+`' placeholder='Name' selected>`+key+`</option>`;
        }else{
            output += `<option name='name' type='text' value='`+key+`' placeholder='Name'>`+key+`</option>`;
        }
    };
    return output;
});

Handlebars.registerHelper('selectKeyVal', function(values,comp_key) {
    var output = ``
    for (let key in values) {
        if(key==comp_key){
            output += `<option name='name' type='text' value='`+key+`' selected>`+values[key]+`</option>`;
        }else{
            output += `<option name='name' type='text' value='`+key+`'>`+values[key]+`</option>`;
        }
    };
    return output;
});

Handlebars.registerHelper('selectLevels', function(skill_key) {
    var output = ``
    for (let i = 1; i <= 10; i++) {
        if(i==Number(skill_key)){
            output += `<option name='name' type='text' value='`+i+`' selected>`+i+` Level(s)</option>`;
        }else{
            output += `<option name='name' type='text' value='`+i+`'>`+i+` Level(s)</option>`;
        }
    }
    return output;
});

Handlebars.registerHelper('calcCompPts', function(values) {
    var output = (Number(values.select1) + Number(values.select2) + Number(values.select3) + Number(values.select4))*Number(values.multiplier);
    return output;
});

Handlebars.registerHelper('calcCompPtsTotal', function(values) {
    var output = 0;
    for (let key in values) {
        output += (Number(values[key].system.select1) + Number(values[key].system.select2) + Number(values[key].system.select3) + Number(values[key].system.select4))*Number(values[key].system.multiplier);
    }
    return output;
});

Handlebars.registerHelper('showSkills', function(abilities, skills) {
    var output = ``;
    for (let key in skills) {

        var skill = skills[key];
        var itemData = skills[key].system.values[skills[key].system.key];

        var itemType = '';
        if(itemData !== undefined){
            itemType = itemData.type;
        }

        output += `
          <li class='item flexrow' data-item-id=${skills[key]._id}>
            <div class='item-name' style='display:block;flex:0 0 50px; text-align: center;'>${Number(skill.system.baseCost)+Number(skill.system.levels)}</div>
            <div class='item-name' style='display:block;flex: 0 0 300px;padding:3px;'>
              <h4>`;

            if(itemType!=''){
              output += `<div class='resource-label' style='display: inline-block;'>${skill.system.key}</div>`;
            }else{
              output += `<div class='resource-label' style='display: inline-block;'>Undefined Skill</div>`;
            }

        output += `
              </h4>
            </div>
            <div class='item-name' style='text-align: left;'>`;

            if(itemType!=''){
                output += `
                            <span class="ability-mod rollable" data-roll="3d6" data-label='${skill.system.key} Skill Check'>
                            <i class='fas fa-dice'></i>${Number(abilities[skill.system.values[skill.system.key].type].mod)+Number(skill.system.levels)}>
                            </span>`;
            }

          output += `
            </div>
            <div class='item-controls'>
              <a class='item-control skill-edit' title='Edit Item'>
                <i class='fas fa-edit'></i>
              </a>
              <a class='item-control item-delete' title='Delete Item'>
                <i class='fas fa-trash'></i>
              </a>
            </div>
          </li>
          `;
    }
    return output;
});

Handlebars.registerHelper('showPowers', function(powers, powerlist) {
    var output = ``;
    for (let key in powers) {


        var power = powers[key];

        console.log(power);

        var itemData = powerlist[power.system.key];
        var input1Cost = 0;
        var input2Cost = 0;
        var input3Cost = 0;

        //console.log(itemData);

        var itemType = '';
        if(itemData !== undefined){
            itemType = itemData.type;
        }

        if(itemData){
            input1Cost = (itemData.levelCost == 0)?Number(itemData.baseLevels):Number(itemData.levelCost)*Number(power.system.input1);
            input2Cost = (itemData.levelCost == 0)?Number(itemData.baseLevels):Number(itemData.levelCost)*Number(power.system.input2);
            input3Cost = (itemData.levelCost == 0)?Number(itemData.baseLevels):Number(itemData.levelCost)*Number(power.system.input3);
        }

        output += `
          <li class='item flexrow' data-item-id=${power._id}>
            <div class='item-name' style='display:block;flex:0 0 50px; text-align: center;'>${input1Cost+input2Cost+input3Cost}</div>
            <div class='item-name' style='display:block;padding:3px;'>
              <h4>`;

            if(itemType!=''){
              output += `<div class='resource-label' style='display: inline-block;'>${power.system.key}</div>`;
            }else{
              output += `<div class='resource-label' style='display: inline-block;'>Undefined Power</div>`;
            }

        output += `
              </h4>
            </div>
            <div class='item-controls' style='display:block;flex: 0 0 50px;''>
              <a class='item-control skill-edit' title='Edit Item'>
                <i class='fas fa-edit'></i>
              </a>
              <a class='item-control item-delete' title='Delete Item'>
                <i class='fas fa-trash'></i>
              </a>
            </div>
          </li>
          `;
    }
    return output;
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
    let out = ((abilities.SPD.value-temp_dex)*10)-10;
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
    if(current_stun==null){
        return foundry.utils.duplicate(stun);
    }else{
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
