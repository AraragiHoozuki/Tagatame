//=================================================================================
// Master State
//=================================================================================

var Lohengrin = Lohengrin || {};



Lohengrin.MasterState = function () {
	this.initialize.apply(this,arguments);
};
Lohengrin.MasterState.prototype.constructor = Lohengrin.MasterState;

Lohengrin.MasterState.prototype.initialize = function(stateId,param) {
	var state = $dataStates[stateId];
	var exstate = $dataStatesEx[stateId];
    this.id = stateId;
    this.duration = state.maxTurns;
    this.icon = state.icon;//Need Lohengrin_Icon.js
    this.traits = state.traits;
    for (var key in param) {
        this[key] = param[key];
    }
    if (exstate) {
        for (var key in exstate) {
            if(!this[key]) {this[key] = exstate[key];}
        }
    }
};

Lohengrin.MasterState.prototype.isExpired = function() {
    return this.duration === 0;
};

Lohengrin.MasterState.prototype.onStateRemove = function() {
    var a = this.owner;
    if(this.onRemove){
        eval(this.onRemove);
    }
};

Game_BattlerBase.prototype.states = function() { //states() for states ids, _states for masterStates
    return this._states.map(function(masterState) {
        return $dataStates[masterState.id];
    });
};

Game_BattlerBase.prototype.addNewState = function(stateId, param) {
	param = param||{};
    if (stateId === this.deathStateId()) {
        this.die();
    }
    var restricted = this.isRestricted();
    var masterState = new Lohengrin.MasterState(stateId, param);
    this._states.push(masterState);
    masterState.owner = this;
    //this.sortStates();
    if (!restricted && this.isRestricted()) {
        this.onRestrict();
    }
};

Game_BattlerBase.prototype.isStateAffected = function(stateId) {
	var stateids = this._states.map(function(masterState) {
        return masterState.id;
    });
    return stateids.contains(stateId);
};

Game_BattlerBase.prototype.getStateById = function(stateId) {
    var states = this._states;
    for (var i = 0; i < states.length; i++){
        if(states[i].id == stateId) {return states[i];}
    }
};


Game_Battler.prototype.addState = function(stateId, param) {
	param = param||{};
	var exstate = $dataStatesEx[stateId];
    var reappliable = false;
    if(exstate&&exstate.reappliable) {reappliable = true;}
    if (this.isStateAddable(stateId)) {
        if ((!this.isStateAffected(stateId))||reappliable) {
            this.addNewState(stateId,param);
            this.refresh();
        }
        //this.resetStateCounts(stateId);
        this._result.pushAddedState(stateId);
    }
};

Game_BattlerBase.prototype.eraseState = function(stateId) {
    for (var i=0;i<this._states.length;i++) {
    	if (this._states[i].id==stateId) {
            this._states[i].onStateRemove();
    		this._states.splice(i,1)
    	}
    }
};


Game_Battler.prototype.removeStateByIndex = function(index) {
	var id = this._states[index].id;
    if (this._states.length > index) {
        if (id === this.deathStateId()) {
            this.revive();
        }
        this._states[index].onStateRemove();
        this._states.splice(index,1);
        this.refresh();
        this._result.pushRemovedState(id);
    }
};

Game_BattlerBase.prototype.updateStateTurns = function() {
    this._states.forEach(function(masterState) {
        if (masterState.duration > 0) {
            masterState.duration--;
        }
    }, this);
};

Game_BattlerBase.prototype.isStateExpired = function(masterState) {
    return this._stateTurns[stateId] === 0;
};


Game_Battler.prototype.removeStatesAuto = function(timing) {
	for (var i=0; i<this._states.length; i++){
		var masterState = this._states[i];
		if (masterState.isExpired() && $dataStates[masterState.id].autoRemovalTiming === timing) {
            this.removeStateByIndex(i);
        }
	}
};

//this is for yep battle engine
Game_BattlerBase.prototype.updateStateTurnTiming = function(timing) {
    if (this.isBypassUpdateTurns()) return;
    this._freeStateTurn = this._freeStateTurn || [];
    for (var i = 0; i < this._states.length; ++i) {
      var masterState = this._states[i];
      if ($dataStates[masterState.id].autoRemovalTiming !== timing) continue;
      masterState.duration -= 1;
      if (masterState.duration <= 0) {this.removeStateByIndex(i);}
    }
};

//Traits
Game_BattlerBase.prototype.traitObjects = function() {
    // Returns an array of the all objects having traits. States only here.
    return this._states;
};