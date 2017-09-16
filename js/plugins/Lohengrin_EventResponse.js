// Event Responses

//onDamage
Game_Battler.prototype.onDamage = function(action, value) {
    this.removeStatesByDamage();
    this.chargeTpByDamage(value / this.mhp);
    //===================================================================
    var a = action.subject();
    var b = this;
    var states = this._states;
    var dmg = value;

    for (var i = 0; i < states.length; i++){
        var masterState = states[i];
        if (masterState.onDamage) {
            eval(masterState.onDamage);
        }
    }

    if(!this.isActor()){return;}

    var skills = this._skills;
    var equips = this._equips;

    for (var i = 0; i < skills.length; i++){
        var skillex = $dataSkillsEx[skills[i]];
        if (skillex&&skillex.onDamage){
            eval(skillex.onDamage);
        }
    }
};


Game_Action.prototype.executeHpDamage = function(target, value) {
    if (this.isDrain()) {
        value = Math.min(target.hp, value);
    }
    this.makeSuccess(target);
    if (value > 0) {
        target.onDamage(this, value);
    }
    /*if (value < 0) {
        value = target.onHeal(this, value);
    }*/
    target.gainHp(-value);
    this.gainDrainedHp(value);
};

//onTurnStart
// need yep battle engine core
Game_Battler.prototype.onTurnStart = function() {
    this.updateStateTurnStart();
    //=======================================================================================
    var states = this._states;
    var a = this;

    for (var i = 0; i < states.length; i++){
        var masterState = states[i];
        if (masterState.onTurnStart) {
            eval(masterState.onTurnStart);
        }
    }

    if(!this.isActor()){return;}

    var skills = this._skills;
    var equips = this._equips;

    for (var i = 0; i < skills.length; i++){
        var skillex = $dataSkillsEx[skills[i]];
        if (skillex&&skillex.onTurnStart){
            eval(skillex.onTurnStart);
        }
    }
};

// onTurnEnd
//need yep battle engine core
Game_Battler.prototype.onTurnEnd = function() {
    this.clearResult();
    if (BattleManager.isTurnBased()) {
      this.regenerateAll();
    } else if (BattleManager.isTickBased() && !BattleManager.isTurnEnd()) {
      this.regenerateAll();
    }
    this.removeStatesAuto(2);
    //=================================================================================
    var states = this._states;
    var a = this;

    for (var i = 0; i < states.length; i++){
        var masterState = states[i];
        if (masterState.dot) {
            this.gainHp(-masterState.dot);
        }
        if (masterState.onTurnEnd) {
            eval(masterState.onTurnEnd);
        }
    }

    if(!this.isActor()){return;}

    var skills = this._skills;
    var equips = this._equips;

    for (var i = 0; i < skills.length; i++){
        var skillex = $dataSkillsEx[skills[i]];
        if (skillex&&skillex.onTurnEnd){
            eval(skillex.onTurnEnd);
        }
    }
};

//onStateRemove
// see Lohengrin_MasterState.js