BattleManager.updateActionLoop = function() {
	target = this._targets.shift();
    while (target)
    {
        this.invokeAction(this._subject, target);
        target = this._targets.shift();
    }
    this.endAction();
};

BattleManager.InstantAction = function(subject, skillId, targets){
    var phase = this._phase;
    if (this._phase != 'action') {
        this._subject = subject;
    }
	var action = new Game_Action(subject);
	if (skillId==1) {
		action.setAttack();
	} else {
		action.setSkill(skillId);
	}
	if (!targets) {
		targets = action.makeTargets();
	} else {
		targets = action.repeatTargets(targets);
	}
    this._action = action;
    this._targets = targets;
    subject.useItem(action.item());
    this._action.applyGlobal();
    this.refreshStatus();
    if (this._phase != 'action') {
        this.updateActionLoop();
    }
    this._phase = phase;
}

Game_BattlerBase.prototype.instantAction = function(skillId, target) {
    this.clearActions();
    var action = new Game_Action(this, true);
    action.setSkill(skillId);
    action.setTarget(target.index())
    this._actions.push(action);
    BattleManager.forceAction(this);
}