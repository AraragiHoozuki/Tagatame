// Damage Filter

var Lohengrin = Lohengrin || {};
Lohengrin.DF = Lohengrin.DF || {};

Lohengrin.DF.damageFilter = function (source,target,type0,type1,type2,rate,base){
	var damage={};
	var value;
    base = base||source.baseAttack();
	
	rate = rate||1;
	value = base * rate;

	//判定物理魔法
	var armor_rate = 0;
	if (type0 == "phy") {armor_rate = target.pdf / (target.pdf + 500 + target._level * 50);}
	if (type0 == "mag") {armor_rate = target.mdf / (target.mdf + 500 + target._level * 50);}
	value = value * (1 - armor_rate);

	//判定类型
	var hittype_rate = 1;
	if (type1=="null") {
		hittype_rate = 1;
	} else {
		hittype_rate = (1 + source[type1+"_assist"]) * (1 - target[type1+"_resist"]);
	}
	value = value * hittype_rate;

	//元素类型
	var ele_rate = 1;
	if (type2=="null") {
		ele_rate = 1;
	} else {
		ele_rate = (1 + source[type2+"_assist"]) * (1 - target[type2+"_resist"]);
	}
	value = value * ele_rate;

	damage.value = value;
	damage.source = source;
	damage.target = target;
	damage.type = type0;
	damage.hittype = type1;
	damage.eletype = type2;

	value = Lohengrin.DF.onPreDamage(damage);
	return value;
};

Lohengrin.DF.onPreDamage = function (damage) {
	var dmg = damage.value;
    var states = damage.target._states;
    var a = damage.source;
    var b = damage.target;

    for (var i = 0; i < states.length; i++){
        var masterState = states[i];
        if (masterState.onPreDamage) {
            eval(masterState.onPreDamage);
        }
    }

    if(!damage.target.isActor()){return dmg;}

    var skills = damage.target._skills;
    var equips = damage.target._equips;

    for (var i = 0; i < skills.length; i++){
        var skillex = $dataSkillsEx[skills[i]];
        if (skillex&&skillex.onPreDamage){
            eval(skillex.onPreDamage);
        }
    }
	return dmg;
}

var dmf = Lohengrin.DF.damageFilter;

// Game_Action
Game_Action.prototype.itemCri = function(target) {
    return this.item().damage.critical ? this.subject().cri / (this.subject().cri + 200 + this.subject()._level * 10) : 0;
};

Game_Action.prototype.apply = function(target) {
    var result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = false;

    var hi = this.subject().hit;
    var ev = target.eva;
    result.evaded = (!this.isCertainHit())&&(Math.random() <= (1 - ((10 * hi)/(10 * hi + ev)) * (1 - ev / (10 * hi + ev))));

    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = (Math.random() < this.itemCri(target));
            var value = this.makeDamageValue(target, result.critical);
            this.executeDamage(target, value);
        }
        this.item().effects.forEach(function(effect) {
            this.applyItemEffect(target, effect);
        }, this);
        this.applyItemUserEffect(target);
    }
};

Game_Action.prototype.applyCritical = function(damage) {
    return damage * 1.5;
};

Game_Action.prototype.evalDamageFormula = function(target) {
    try {
        var item = this.item();
        var d;
        var a = this.subject();
        var b = target;
        var v = $gameVariables._data;
        var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
        var value = Math.max(eval(item.damage.formula), 0) * sign;
		if (isNaN(value)) value = 0;
		return value;
    } catch (e) {
        return 0;
    }
};

Game_Action.prototype.makeDamageValue = function(target, critical) {
    var item = this.item();
    var baseValue = this.evalDamageFormula(target);
    var value = baseValue;
    if (baseValue < 0) {
        value *= target.rec;
    }
    if (critical) {
        value = this.applyCritical(value);
    }
    value = this.applyVariance(value, item.damage.variance);
    value = Math.round(value);
    return value;
};