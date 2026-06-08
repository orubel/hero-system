// Import document classes.
import { HeroSystemActor } from './documents/actor.mjs';
import { HeroSystemItem } from './documents/item.mjs';
// Import sheet classes.
import { HeroSystemActorSheet } from './sheets/actor-sheet.mjs';
import { HeroSystemItemSheet } from './sheets/item-sheet.mjs';
import { HeroSystemCombat, HeroSystemCombatTracker } from "./hero-system-combat.mjs";
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
    formula: "1d6",
    decimals: 2
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = HeroSystemActor;
  CONFIG.Item.documentClass = HeroSystemItem;
  CONFIG.ui.combat = HeroSystemCombatTracker;

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

Handlebars.registerHelper('selectValue', function(values,comp_key) {
    var output = ``
    for (let key in values) {
        if(key==comp_key){
            output += `<option name='name' type='text' value='`+values[key]+`' placeholder='Name' selected>`+values[key]+`</option>`;
        }else{
            output += `<option name='name' type='text' value='`+values[key]+`' placeholder='Name'>`+values[key]+`</option>`;
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

Handlebars.registerHelper('selectValKey', function(values,comp_key) {
    var output = ``
    for (let key in values) {
        if(values[key]==comp_key){

            output += `<option name='name' type='text' value='`+values[key]+`' selected>`+key+`</option>`;
        }else{
            output += `<option name='name' type='text' value='`+values[key]+`'>`+key+`</option>`;
        }
    };
    return output;
});

Handlebars.registerHelper('selectLevels', function(skill_key) {
    var output = ``
    for (let i = 0; i <= 10; i++) {
        if(i==Number(skill_key)){
            output += `<option name='name' type='text' value='`+i+`' selected>`+i+` Level(s)</option>`;
        }else{
            output += `<option name='name' type='text' value='`+i+`'>`+i+` Level(s)</option>`;
        }
    }
    return output;
});

Handlebars.registerHelper('calcPtsSpent', function(abilities, skills, skilllist, powers, powerlist, frameworks, frameworklist, advantages, disadvantages) {
    var charTotal = calcCharTotal(abilities);
    var skillTotal = calcSkillPtsTotal(skills,skilllist);
    var powTotal = calcPowPtsTotal(powers, powerlist, frameworks, frameworklist, advantages, disadvantages);
    return Number(charTotal)+Number(skillTotal)+Number(powTotal)
});

Handlebars.registerHelper('calcPtsAvail', function(comps, complicationlist, biodata) {
    var compPts = calcCompPtsTotal(comps,complicationlist);
    var basePts = biodata.basePts;
    var xp = biodata.xpearned;
    return Number(compPts)+Number(basePts)+Number(xp)
});

Handlebars.registerHelper('calcPts', function(abilities, skills, skilllist, powers, powerlist, frameworks, frameworklist, advantages, disadvantages, comps, complicationlist, biodata) {
    var output = "";

    var charTotal = calcCharTotal(abilities);
    var skillTotal = calcSkillPtsTotal(skills,skilllist);
    var powTotal = calcPowPtsTotal(powers, powerlist, frameworks, frameworklist, advantages, disadvantages);
    var ptsSpent = Number(charTotal)+Number(skillTotal)+Number(powTotal);

    var compPts = calcCompPtsTotal(comps,complicationlist);
    var basePts = biodata.basePts;
    var xp = biodata.xpearned;
    var ptsAvail = Number(compPts)+Number(basePts)+Number(xp)

    if(ptsSpent>ptsAvail){
        output = `
        <div style="background-color:red;">${ptsSpent}</div>
        <div style="flex:0 0 100px;background-color:red;">${ptsAvail - ptsSpent}</div>
        `;
    }else{
        output = `
        <div>${ptsSpent}</div>
        <div style="flex:0 0 100px;">${ptsAvail - ptsSpent}</div>
        `;
    }
    output += `<div>${ptsAvail}</div>`;
    return output;
});

Handlebars.registerHelper('calcCharTotal', function(abilities) {
    return calcCharTotal(abilities);
});



Handlebars.registerHelper('calcCompPts', function(comps) {
    return calcCompPts(comps);
});

Handlebars.registerHelper('calcCompPtsTotal', function(comps,complist) {
    return calcCompPtsTotal(comps,complist);
});

Handlebars.registerHelper('calcSkillPtsTotal', function(skills,skilllist) {
    return calcSkillPtsTotal(skills,skilllist);
});

Handlebars.registerHelper('calcPowPtsTotal', function(powers, powerlist, frameworks, frameworklist, advantages, disadvantages) {
    return calcPowPtsTotal(powers, powerlist, frameworks, frameworklist, advantages, disadvantages)
});

Handlebars.registerHelper('showSkills', function(abilities, skills, skilllist) {
    var output = ``;
    for (let key in skills) {

        var skill = skills[key];
        var itemData = skilllist[skills[key].system.key];

        var itemType = '';
        if(itemData !== undefined){
            itemType = itemData.type;
        }

        output += `
          <li class='item flexrow' data-item-id=${skill._id}>
            <div class='item-name' style='display:block;flex:0 0 50px; text-align: center;'>${Number(skill.system.baseCost)+Number(skill.system.levels)}</div>
            <div class='item-name' style='display:block;flex: 0 0 250px;padding:3px;'>
              <h4>`;

            if(itemType!=''){
              output += `<div class='resource-label' style='display: inline-block;'>${skill.system.key} (${itemData.type})</div>`;
            }else{
              output += `<div class='resource-label' style='display: inline-block;'>Undefined Skill</div>`;
            }

        output += `
              </h4>
            </div>

            <div class='item-name' style='display:block;flex: 0 0 100px;padding:3px;'>
              <h4>`;

            if(itemType!=''){
              output += `<div class='resource-label' style='display: inline-block;'>${itemData.baseCost[skill.system.baseCost]}</div>`;
            }else{
              output += `<div class='resource-label' style='display: inline-block;'></div>`;
            }

        output += `
              </h4>
            </div>

            <div class='item-name' style='display:block;flex: 0 0 50px;padding:3px;'>
              <h4>`;

            if(itemType!=''){
              output += `<div class='resource-label' style='display: inline-block;'>${skill.system.levels}</div>`;
            }else{
              output += `<div class='resource-label' style='display: inline-block;'></div>`;
            }

        output += `
              </h4>
            </div>


            <div class='item-name' style='text-align: left;'>`;

            if(itemType!=''){
                output += `
                            <span class="ability-mod rollable" data-roll="3d6" data-label='${skill.system.key} Skill Check'>`;
                switch(itemData.baseCost[skill.system.baseCost]){
                    case 'Everyman':
                    case 'Familiar':
                        output += `<i class='fas fa-dice'></i>8>`;
                        break;
                    case 'Skilled':
                        output += `<i class='fas fa-dice'></i>${Number(abilities[itemData.type].mod)+Number(skill.system.levels)}>`;
                        break;
                }

                output += `
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

Handlebars.registerHelper('showFrameworks', function(frameworks, frameworklist, powers) {
    var output = ``;

    for (let key in frameworks) {

        var framework = frameworks[key];

        output += `
          <li class='item flexrow' data-item-id=${framework._id}>
            <div class='item-name' style='display:block;flex:0 0 50px; text-align: center;'>`;

            if(framework.system.points>0){
                output += `${framework.system.points}`;
            }else{
                output += `0`;
            }

        output += `
            </div>
            <div class='item-name' style='display:block;padding:3px;'>
              <h4>`;

            if(framework.system.key!=''){
              output += `<div class='resource-label' style='display: inline-block;'>${framework.system.key}</div>`;
            }else{
              output += `<div class='resource-label' style='display: inline-block;'>Undefined Framework</div>`;
            }


        output += `
              </h4>
            </div>

            <div class='item-controls' style='display:block;flex: 0 0 100px;''>
                  <a class='item-control power-create' title='Create Power' data-type='power'>
                    <input type="hidden" name="framework_id" value="`+framework._id+`">
                    <i class='fas fa-plus'></i>New Power
                  </a>
            </div>

            <div class='item-controls' style='display:block;flex: 0 0 50px;''>
              <a class='item-control item-edit' title='Edit Power'>
                <i class='fas fa-edit'></i>
              </a>
              <a class='item-control item-delete' title='Delete Power'>
                <i class='fas fa-trash'></i>
              </a>
            </div>
          </li>
          `;
    }
    return output;
});

Handlebars.registerHelper('showPowers', function(powers, powerlist, advantages, disadvantages, frameworks) {
    var output = ``;
    for (let key in powers) {

        var power = powers[key];
        var itemData = powerlist[power.system.key];

        var input1Cost = 0;
        var input2Cost = 0;
        var input3Cost = 0;
        var select1Cost = 0;
        var select2Cost = 0;
        var advCost = 0;
        var disCost = 0;
        var fwName = '';
        var fwPoints = 0;

        var itemType = '';
        if(itemData !== undefined){
            itemType = itemData.type;
        }

        if(itemData){
            input1Cost = (itemData.input1)?Number(itemData.input1.levelCost)*Number(power.system.input1):0;

            if(itemData.input2){
                input2Cost = (itemData.input2)?Number(itemData.input2.levelCost)*Number(power.system.input2):0;
            }

            if(itemData.input3){
                input3Cost = (itemData.input3)?Number(itemData.input3.levelCost)*Number(power.system.input3):0;
            }

            if(itemData.select1){
                select1Cost = Number(power.system.select1);
            }

            if(itemData.select2){
                select2Cost = Number(power.system.select2);
            }

            for (let fw in frameworks) {
                if(power.system.frameworkId == frameworks[fw]._id){
                    fwName = frameworks[fw].system.key
                    fwPoints = frameworks[fw].system.points;
                }
            }

            for (let adv in advantages) {
                if(power._id == advantages[adv].system.powerId){
                    var cost = (Number(advantages[adv].system.select1)+Number(advantages[adv].system.select2)+Number(advantages[adv].system.select3)+Number(advantages[adv].system.baseCost))/100;
                    advCost += cost;
                }
            }

            for (let dis in disadvantages) {
                if(power._id == disadvantages[dis].system.powerId){
                    var cost = (Number(disadvantages[dis].system.select1)+Number(disadvantages[dis].system.select2)+Number(disadvantages[dis].system.select3)+Number(disadvantages[dis].system.baseCost))/100;
                    disCost += cost;
                }
            }
        }

        output += `
          <li class='item flexrow' data-item-id=${power._id}>
            <div class='item-name' style='display:block;flex:0 0 50px; text-align: center;'>`;

            if(itemData){
                var cost = Math.ceil(input1Cost+input2Cost+input3Cost+select1Cost+select2Cost+Number(itemData.baseCost));
                if(fwName!=''){
                    switch(fwName){
                        case 'Multipower':
                            // if cost below or equal to frameworks[fw].system.points, then active points equal cost/5
                            if(cost>=fwPoints){
                                cost = cost/5;
                            }
                            break;
                        case 'Elemental Control':
                            // if cost below or equal to frameworks[fw].system.points, then active points equal cost-fwPoints
                            if(cost>=fwPoints){
                                cost = cost-fwPoints;
                            }
                            break;
                    }
                }
                var disAmount = cost*disCost;
                var advAmount = cost*advCost;

                output += `${Math.ceil(cost+(advAmount+disAmount))}`;
            }else{
                output += `0`;
            }

        output += `
            </div>
            <div class='item-name' style='display:block;padding:3px;'>
              <h4>`;

            if(itemType!=''){
                if(fwName!=''){
                    output += `<div class='resource-label' style='display: inline-block;'>(${fwName}) ${power.system.key}-${power.system.name} (`;
                }else{
                    output += `<div class='resource-label' style='display: inline-block;'>${power.system.key}-${power.system.name} (`;
                }


              if (power.system.input1){ output += `${power.system.input1} ${itemData.input1.label}`;}

              if (power.system.input2){ output += `,${power.system.input2} ${itemData.input2.label}`;}

              if (power.system.input3){ output += `,${power.system.input3} ${itemData.input3.label}`;}

              output += `)</div>`;
            }else{
              output += `<div class='resource-label' style='display: inline-block;'>Undefined Power</div>`;
            }



        output += `
              </h4>
            </div>
            <input type="hidden" name="powers[${key}]._id" value="`+power._id+`">
            <div class='item-controls' style='display:block;flex: 0 0 125px;''>
                  <a class='item-control adv-create' title='Create Advantage' data-type='advantage'>
                    <i class='fas fa-plus'></i>New Advantage
                  </a>
            </div>

            <div class='item-controls' style='display:block;flex: 0 0 125px;''>
                <a class='item-control dis-create' title='Create Disadvantage' data-type='disadvantage'>
                  <i class='fas fa-plus'></i>New Disadvantage
                </a>
            </div>

            <div class='item-controls' style='display:block;flex: 0 0 50px;''>
              <a class='item-control item-edit' title='Edit Power'>
                <i class='fas fa-edit'></i>
              </a>
              <a class='item-control item-delete' title='Delete Power'>
                <i class='fas fa-trash'></i>
              </a>
            </div>
          </li>
          `;
    }
    return output;
});


Handlebars.registerHelper('showAdvantages', function(advantages, advantagelist, powers) {
    var output = ``;
    for (let key in advantages) {

        var adv = advantages[key];

        var itemData = advantagelist[adv.system.key];

        var baseCost = Number(adv.system.baseCost);
        var select1Cost = Number(adv.system.select1);
        var select2Cost = Number(adv.system.select2);
        var select3Cost = Number(adv.system.select3);

        var itemType = '';
        if(itemData !== undefined){
            itemType = itemData.type;
        }

        var powername = "";
        for (let key in powers) {
            if(powers[key]._id == adv.system.powerId){
                powername = powers[key].system.key
            }
        }

        output += `
          <li class='item flexrow' data-item-id=${adv._id}>
            <div class='item-name' style='display:block;flex:0 0 75px; text-align: center;'>`;
            if(itemData){
                output += `${(select1Cost+select2Cost+select3Cost+baseCost)/100}`;
            }else{
                output += `0`;
            }
        output += `
            </div>
            <div class='item-name' style='display:block;padding:3px;'>
              <h4>`;

            if(itemType!=''){
              output += `<div class='resource-label' style='display: inline-block;'>${adv.system.key} (${powername})</div>`;
            }else{
              output += `<div class='resource-label' style='display: inline-block;'>Undefined Advantage</div>`;
            }

        output += `
              </h4>
            </div>

            <div class='item-controls' style='display:block;flex: 0 0 50px;''>
              <a class='item-control item-edit' title='Edit Power'>
                <i class='fas fa-edit'></i>
              </a>
              <a class='item-control item-delete' title='Delete Power'>
                <i class='fas fa-trash'></i>
              </a>
            </div>
          </li>
          `;
    }
    return output;
});

Handlebars.registerHelper('showDisadvantages', function(disadvantages, disadvantagelist, powers) {
    var output = ``;
    for (let key in disadvantages) {

        var dis = disadvantages[key];

        var itemData = disadvantagelist[dis.system.key];

        var baseCost = Number(dis.system.baseCost);
        var select1Cost = Number(dis.system.select1);
        var select2Cost = Number(dis.system.select2);
        var select3Cost = Number(dis.system.select3);

        var itemType = '';
        if(itemData !== undefined){
            itemType = itemData.type;
        }

        var powername = "";
        for (let key in powers) {
            if(powers[key]._id == dis.system.powerId){
                powername = powers[key].system.key
            }
        }

        output += `
          <li class='item flexrow' data-item-id=${dis._id}>
            <div class='item-name' style='display:block;flex:0 0 75px; text-align: center;'>`;
            if(itemData){
                output += `${(select1Cost+select2Cost+select3Cost+baseCost)/100}`;
            }else{
                output += `0`;
            }
        output += `
            </div>
            <div class='item-name' style='display:block;padding:3px;'>
              <h4>`;

            if(itemType!=''){
              output += `<div class='resource-label' style='display: inline-block;'>${dis.system.key} (${powername})</div>`;
            }else{
              output += `<div class='resource-label' style='display: inline-block;'>Undefined Disadvantage</div>`;
            }

        output += `
              </h4>
            </div>

            <div class='item-controls' style='display:block;flex: 0 0 50px;''>
              <a class='item-control item-edit' title='Edit Power'>
                <i class='fas fa-edit'></i>
              </a>
              <a class='item-control item-delete' title='Delete Power'>
                <i class='fas fa-trash'></i>
              </a>
            </div>
          </li>
          `;
    }
    return output;
});

Handlebars.registerHelper('showComplications', function(comps, complist) {
    var output = ``;
    for (let key in comps) {

        var comp = comps[key];

        var itemData = complist[comp.system.key];

        var select1Cost = 0;
        var select2Cost = 0;
        var select3Cost = 0;
        var select4Cost = 0;
        var multiplier = 0;


        var itemType = '';
        if(itemData !== undefined){
            itemType = itemData.type;
        }

        if(itemData){
            if(itemData.select1){
                select1Cost = Number(comp.system.select1);
            }

            if(itemData.select2){
                select2Cost = Number(comp.system.select2);
            }

            if(itemData.select3){
                select3Cost = Number(comp.system.select3);
            }

            if(itemData.select4){
                select4Cost = Number(comp.system.select4);
            }

            if(itemData.multiplier){
                multiplier = Number(comp.system.multiplier);
            }
        }

        output += `
      <li class='item flexrow' data-item-id='${comp._id}'>
        <div class='item-name' style='display:block;flex:0 0 50px; text-align: center;'>`;

            if(itemData){
                if(multiplier>0){
                    output += `${(select1Cost + select2Cost + select3Cost + select4Cost)*multiplier}`;
                }else{
                    output += `${(select1Cost + select2Cost + select3Cost + select4Cost)}`;
                }
            }else{
                output += `0`;
            }

        output += `
        </div>
        <div class='item-name' style='padding:3px;'>
          <h4>
            <div class='resource-label' style='display: inline-block;'>${ comp.system.key } :</div>
            <div style='display: inline-block;'>${ comp.system.name }</div>
            <div style='display: inline-block;'>(`;


        if(itemData){
            if (itemData.select1){
                output += `${itemData.select1.values[comp.system.select1]}`;
            }

            if (itemData.select2){
                output += `, ${itemData.select2.values[comp.system.select2]}`;
            }

            if (itemData.select3){
                output += `, ${itemData.select3.values[comp.system.select3]}`;
            }

            if (itemData.select4){
                output += `, ${itemData.select4.values[comp.system.select4]}`;
            }

            if (itemData.multiplier){
                output += `, ${itemData.multiplier.values[comp.system.multiplier]}`;
            }
        }

        output += `
            )
            </div>
          </h4>
        </div>
        <div class='item-controls'>
          <a class='item-control complication-edit' title='Update Complication'>
            <i class='fas fa-edit'></i>
          </a>
          <a class='item-control item-delete' title='Delete Complication'>
            <i class='fas fa-trash'></i>
          </a>
        </div>
      </li>`;
    }
    return output;
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
  HeroSystemCombat.ready()
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

function calcCompPts(values) {
    return (Number(values.select1) + Number(values.select2) + Number(values.select3) + Number(values.select4))*Number(values.multiplier);
}

function calcCompPtsTotal(values,complist){
    var output = 0;

    for (let key in values) {
        if(values[key].system.key){
            if(Number(values[key].system.multiplier)>0){
                var test = (Number(values[key].system.select1) + Number(values[key].system.select2) + Number(values[key].system.select3) + Number(values[key].system.select4))*Number(values[key].system.multiplier);
                output = output+test;
            }else{
                var test = (Number(values[key].system.select1) + Number(values[key].system.select2) + Number(values[key].system.select3) + Number(values[key].system.select4));
                output = output+test;
            }
        }
    }
    return output;
}

function calcSkillPtsTotal(values,skilllist) {
    var output = 0;

    for (let key in values) {
        if(values[key].system.key){
            var test = Number(values[key].system.baseCost)+Number(values[key].system.levels);
            output = output+test;
        }
    }
    return output;
}

function calcCharTotal(abilities){
    let out = calcStrPts(abilities.STR) + calcDexPts(abilities.DEX) + calcConPts(abilities.CON) + calcBodyPts(abilities.BODY) + calcIntPts(abilities.INT) + calcEgoPts(abilities.EGO) + calcPrePts(abilities.PRE) + calcPdPts(abilities) + calcEdPts(abilities) + calcSpdPts(abilities) + calcRecPts(abilities) + calcEndPts(abilities) + calcStunPts(abilities);
    return out;
}

function calcPowPtsTotal(powers, powerlist, frameworks, frameworklist, advantages, disadvantages){
    var output = 0;
    var fwName = '';
    var fwPoints = 0;

    for (let key in powers) {
        var power = powers[key];
        var itemData = powerlist[power.system.key];

        var input1Cost = 0;
        var input2Cost = 0;
        var input3Cost = 0;
        var select1Cost = 0;
        var select2Cost = 0;
        var advCost = 0;
        var disCost = 0;

        var itemType = '';
        if(itemData !== undefined){
            itemType = itemData.type;
        }

        if(itemData){
            input1Cost = (itemData.input1)?Number(itemData.input1.levelCost)*Number(power.system.input1):0;

            if(itemData.input2){
                input2Cost = (itemData.input2)?Number(itemData.input2.levelCost)*Number(power.system.input2):0;
            }

            if(itemData.input3){
                input3Cost = (itemData.input3)?Number(itemData.input3.levelCost)*Number(power.system.input3):0;
            }

            if(itemData.select1){
                select1Cost = Number(power.system.select1);
            }

            if(itemData.select2){
                select2Cost = Number(power.system.select2);
            }

            for (let fw in frameworks) {
                if(power.system.frameworkId == frameworks[fw]._id){
                    fwName = frameworks[fw].system.key
                    fwPoints = frameworks[fw].system.points;
                }
            }

            for (let adv in advantages) {
                if(power._id == advantages[adv].system.powerId){
                    var cost = (Number(advantages[adv].system.select1)+Number(advantages[adv].system.select2)+Number(advantages[adv].system.select3)+Number(advantages[adv].system.baseCost))/100;
                    advCost += cost;
                }
            }

            for (let dis in disadvantages) {
                if(power._id == disadvantages[dis].system.powerId){
                    var cost = (Number(disadvantages[dis].system.select1)+Number(disadvantages[dis].system.select2)+Number(disadvantages[dis].system.select3)+Number(disadvantages[dis].system.baseCost))/100;
                    disCost += cost;
                }
            }

            var cost = Math.ceil(input1Cost+input2Cost+input3Cost+select1Cost+select2Cost+Number(itemData.baseCost));
            if(fwName!=''){
                switch(fwName){
                    case 'Multipower':
                        // if cost below or equal to frameworks[fw].system.points, then active points equal cost/5
                        if(cost>=fwPoints){
                            cost = cost/5;
                        }
                        break;
                    case 'Elemental Control':
                        // if cost below or equal to frameworks[fw].system.points, then active points equal cost-fwPoints
                        if(cost>=fwPoints){
                            cost = cost-fwPoints;
                        }
                        break;
                }
            }
            var disAmount = cost*disCost;
            var advAmount = cost*advCost;

            output += Math.ceil(cost+(advAmount+disAmount));
        }
    }

    output+=Number(fwPoints)

    return output;
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
