
export class HeroSystemRollDialog extends Dialog {

  /* -------------------------------------------- */
  static async create(actor, rollData) {

    let options = { classes: ["HeroSystemDialog"], width: 320, height: 'fit-content', 'z-index': 99999 };
    let html = await renderTemplate('systems/hero-system/templates/dialog/roll-dialog-generic.hbs', rollData);

    return new HeroSystemRollDialog(actor, rollData, html, options);
  }

  /* -------------------------------------------- */
  constructor(actor, rollData, html, options, close = undefined) {
    let conf = {
      title: "Roll window",
      content: html,
      buttons: {
        roll: {
          icon: '<i class="fas fa-check"></i>',
          label: "Roll !",
          callback: () => { this.roll() }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
          callback: () => { this.close() }
        }
      },
      close: close
    }

    super(conf, options);

    this.actor = actor;
    this.rollData = rollData;
  }

  /* -------------------------------------------- */
  roll() {
    let actor = game.actors.get(this.rollData.actorId)

    // ability/save/size => 0
    let diceFormula = "3d6"
    let target = 10

    if (this.rollData.charac) {
      target = this.rollData.charac.roll
    }

    if (this.rollData.item) {
      target = this.rollData.item.roll || this.rollData.item.system.roll
    }
    target += this.rollData.bonusMalus

    // Performs roll
    let myRoll = this.rollData.roll
    if (!myRoll) { // New rolls only of no rerolls
      myRoll = new Roll(diceFormula).roll({ async: false })
      //await this.showDiceSoNice(myRoll, game.settings.get("core", "rollMode"))
    }

    this.rollData.roll = myRoll
    this.rollData.target = target
    this.rollData.diceFormula = diceFormula
    this.rollData.result = myRoll.total
    this.rollData.isSuccess = false
    if (this.rollData.result <= target) {
      this.rollData.isSuccess = true
    }
    if (myRoll.terms[0].total == 3) { // Always a success
      this.rollData.isSuccess = true
    }
    if (myRoll.terms[0].total == 18) { // Always a failure
      this.rollData.isSuccess = false
    }
    this.rollData.margin = target - this.rollData.result

    this.outputRollMessage(this.rollData);
  }

  /* -------------------------------------------- */
  async refreshDialog() {
    const content = await renderTemplate("systems/hero-system/templates/dialog/roll-dialog-generic.hbs", this.rollData)
    this.data.content = content
    this.render(true)
  }

  /* -------------------------------------------- */
  activateListeners(html) {
    super.activateListeners(html);

    let dialog = this;
    function onLoad() {
    }
    $(function () { onLoad(); });

    html.find('#advantage').change((event) => {
      this.rollData.advantage = event.currentTarget.value
    })
    html.find('#disadvantage').change((event) => {
      this.rollData.disadvantage = event.currentTarget.value
    })
    html.find('#rollAdvantage').change((event) => {
      this.rollData.rollAdvantage = event.currentTarget.value
    })
    html.find('#useshield').change((event) => {
      this.rollData.useshield = event.currentTarget.checked
    })
    html.find('#hasCover').change((event) => {
      this.rollData.hasCover = event.currentTarget.value
    })
    html.find('#situational').change((event) => {
      this.rollData.situational = event.currentTarget.value
    })
    html.find('#bonusMalus').change((event) => {
      this.rollData.bonusMalus = Number(event.currentTarget.value)
    })

  }

    async outputRollMessage(rollData) {
        var msg
        var msgFlavor
        try{
            msgFlavor = await renderTemplate(`systems/hero-system/templates/chat/chat-generic-result.hbs`, rollData)
            msg = await rollData.roll.toMessage({
                user: game.user.id,
                rollMode: game.settings.get("core", "rollMode"),
                flavor: msgFlavor
            });
        } catch (error) {
          console.error('Error caught in async function:', error);
        }

        rollData.roll = duplicate(rollData.roll); // Convert to object
        msg.setFlag("world", "rolldata", rollData);
    }
}