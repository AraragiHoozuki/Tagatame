//=================================================================================
// Ex data files
//=================================================================================


var Lohengrin = Lohengrin || {};
Lohengrin.ExData = Lohengrin.ExData || {};


//Ex datas
var $dataClassesEx = null;
var $dataWeaponsEx = null;
var $dataArmorsEx = null;
var $dataStatesEx = null;
var $dataItemsEx = null;
var $dataEnemiesEx = null;
var $dataSkillsEx = null;

Lohengrin.ExData.Files = [
	{name: '$dataClassesEx', src: 'ClassesEx.json'},
	{name: '$dataWeaponsEx', src: 'WeaponsEx.json'},
    {name: '$dataArmorsEx', src: 'ArmorsEx.json'},
    {name: '$dataStatesEx', src: 'StatesEx.json'},
    {name: '$dataItemsEx', src: 'ItemsEx.json'},
    {name: '$dataEnemiesEx', src: 'EnemiesEx.json'},
    {name: '$dataSkillsEx', src: 'SkillsEx.json' }
];
DataManager._databaseFiles = DataManager._databaseFiles.concat(Lohengrin.ExData.Files);


Game_Item.prototype.exDataVar = function() {
    var ex;
    if (this.isWeapon()) {
        ex = $dataWeaponsEx;
    } else if (this.isArmor()) {
        ex = $dataArmorsEx;
    } else if (this.isItem()) {
        ex = $dataItemsEx;
    } else if (this.isSkill()){
        ex = $dataSkillsEx;
    } else {
        return null;
    }
    return ex;
};

Game_Item.prototype.Bonus = function() {
    var ex = this.exDataVar();
    if (!ex) {return null;}
    var itemex = ex[this._itemId];
    if (itemex&&itemex.bonus) {return itemex.bonus;} else {return null;} 
};

Game_Item.prototype.Rates = function() {
    var ex = this.exDataVar();
    if (!ex) {return null;}
    var itemex = ex[this._itemId];
    if (itemex&&itemex.rates) {return itemex.rates;} else {return null;} 
};

//Ex Status
Object.defineProperties(Game_BattlerBase.prototype, {
    STR: { get: function() { return this.getStatus("STR"); }, configurable: true },
    INT: { get: function() { return this.getStatus("INT"); }, configurable: true },
    STA: { get: function() { return this.getStatus("STA"); }, configurable: true },
    AGI: { get: function() { return this.getStatus("AGI"); }, configurable: true },
    WIL: { get: function() { return this.getStatus("WIL"); }, configurable: true },
    LUK: { get: function() { return this.getStatus("LUK"); }, configurable: true },
    //seconary status
    mhp: { get: function() { return this.getSecondaryStatus("mhp"); }, configurable: true },
    mmp: { get: function() { return this.getSecondaryStatus("mmp"); }, configurable: true },
    pdm: { get: function() { return this.getSecondaryStatus("pdm"); }, configurable: true },
    mdm: { get: function() { return this.getSecondaryStatus("mdm"); }, configurable: true },
    pdf: { get: function() { return this.getSecondaryStatus("pdf"); }, configurable: true },
    mdf: { get: function() { return this.getSecondaryStatus("mdf"); }, configurable: true },
    hit: { get: function() { return this.getSecondaryStatus("hit"); }, configurable: true },
    eva: { get: function() { return this.getSecondaryStatus("eva"); }, configurable: true },
    cri: { get: function() { return this.getSecondaryStatus("cri"); }, configurable: true },
    spd: { get: function() { return this.getSecondaryStatus("spd"); }, configurable: true },
    //resists (d for damage; r for resist)
    slash_d: { get: function() { return this.getSecondaryStatus("slash_d"); }, configurable: true },
    slash_r: { get: function() { return this.getSecondaryStatus("slash_r"); }, configurable: true },
    strike_d: { get: function() { return this.getSecondaryStatus("strike_d"); }, configurable: true },
    strike_r: { get: function() { return this.getSecondaryStatus("strike_r"); }, configurable: true },
    thrust_d: { get: function() { return this.getSecondaryStatus("thrust_d"); }, configurable: true },
    thrust_r: { get: function() { return this.getSecondaryStatus("thrust_r"); }, configurable: true },

    hot_d: { get: function() { return this.getSecondaryStatus("hot_d"); }, configurable: true },
    hot_r: { get: function() { return this.getSecondaryStatus("hot_r"); }, configurable: true },
    cold_d: { get: function() { return this.getSecondaryStatus("cold_d"); }, configurable: true },
    cold_r: { get: function() { return this.getSecondaryStatus("cold_r"); }, configurable: true },
    curse_d: { get: function() { return this.getSecondaryStatus("curse_d"); }, configurable: true },
    curse_r: { get: function() { return this.getSecondaryStatus("curse_r"); }, configurable: true },
    bless_d: { get: function() { return this.getSecondaryStatus("bless_d"); }, configurable: true },
    bless_r: { get: function() { return this.getSecondaryStatus("bless_r"); }, configurable: true },
    kinetic_d: { get: function() { return this.getSecondaryStatus("kinetic_d"); }, configurable: true },
    kinetic_r: { get: function() { return this.getSecondaryStatus("kinetic_r"); }, configurable: true },
    psi_d: { get: function() { return this.getSecondaryStatus("psi_d"); }, configurable: true },
    psi_r: { get: function() { return this.getSecondaryStatus("psi_r"); }, configurable: true }
});

Game_BattlerBase.prototype.baseStatus = function (status){
    var ex;
    if (this.isActor()){
        ex = $dataClassesEx[this._classId]; 
    } else {
        ex = $dataEnemiesEx[this._enemyId]; 
    }
    return ex[status][0] + this._level * ex[status][1];
};

Game_BattlerBase.prototype.bonusStatus = function (status){
    var value = 0;
    var masterStates = this._states;
    var bonus;
    for (var i = 0; i < masterStates.length; i++) {
        var masterState = masterStates[i];
        bonus = masterState.bonus;
        if (bonus&&bonus[status]){
            bonus = bonus[status];
            if (typeof bonus === 'string'){
                value += eval(bonus);
            } else {
                value += bonus;
            }          
        }        
    }

    if(!this.isActor()){return value;}
    var equips = this._equips;
    for (var j = 0; j < equips.length; j++) {
        var item = equips[j];
        bonus = item.Bonus();
        if (bonus&&bonus[status]) {
            bonus = bonus[status];
            if (typeof bonus=='string'){
                value += eval(bonus);
            } else {
                value += bonus;
            }
        }
    }

    var skills = this._skills;
    for (var j = 0; j < skills.length; j++) {
        var skill = new Game_Item();
        skill._dataClass = 'skill';
        skill._itemId = skills[j];
        bonus = skill.Bonus();
        if (bonus&&bonus[status]) {
            bonus = bonus[status];
            if (typeof bonus=='string'){
                value += eval(bonus);
            } else {
                value += bonus;
            }
        }
    }
    return value;
};

Game_BattlerBase.prototype.getStatus = function (status){
    return this.baseStatus(status) + this.bonusStatus(status);
};

Lohengrin.ExData.Formulas = {
    "mhp": "this.STA * 20",
    "mmp": "this.INT * 2 + this.WIL * 24",
    "pdm": "this.STR * 2",
    "mdm": "this.INT * 2 + this.WIL * 0.3",
    "pdf": "this.STA / 4",
    "mdf": "this.INT / 3 + this.WIL * 0.8",
    "hit": "this.AGI + this.WIL * 0.5 + this.STR * 0.2",
    "eva": "this.AGI * 1.2 + this.WIL * 0.2",
    "cri": "this.AGI * 0.3 + this.LUK * 2",
    "spd": "this.AGI"
};

Game_BattlerBase.prototype.getSecondaryStatus = function (secStat) {
    var ex;
    var value = 0;
    var bonus;

    if (this.isActor()){
        ex = $dataClassesEx[this._classId]; 
    } else {
        ex = $dataEnemiesEx[this._enemyId]; 
    }


    //base values
    if (ex["formulas"]&&ex["formulas"][secStat]) {
        value = eval(ex["formulas"][secStat]);
    } else {
        value = eval(Lohengrin.ExData.Formulas[secStat]||0);
    }


    //rates
    var masterStates = this._states;
    for (var i = 0; i < masterStates.length; i++) {
        var masterState = masterStates[i];
        rates = masterState.rates;
        if (rates&&rates[secStat]){
            rates = rates[secStat];
            if (typeof rates === 'string'){
                value *= eval(rates);
            } else {
                value *= rates;
            }          
        }        
    }

    if(this.isActor()){
        var equips = this._equips;
        for (var j = 0; j < equips.length; j++) {
            var eqp = equips[j];
            rates = eqp.Rates();
            if (rates&&rates[secStat]) {
                rates = rates[secStat];
                if (typeof rates=='string'){
                    value *= eval(rates);
                } else {
                    value *= rates;
                }
            }
        }

        var skills = this._skills;
        for (var j = 0; j < skills.length; j++) {
            var skill = new Game_Item();
            skill._dataClass = 'skill';
            skill._itemId = skills[j];
            rates = skill.Rates();
            if (rates&&rates[secStat]) {
                rates = rates[secStat];
                if (typeof rates=='string'){
                    value *= eval(rates);
                } else {
                    value *= rates;
                }
            }
        }
    }

    //additional values
    var masterStates = this._states;
    for (var i = 0; i < masterStates.length; i++) {
        var masterState = masterStates[i];
        bonus = masterState.bonus;
        if (bonus&&bonus[secStat]){
            bonus = bonus[secStat];
            if (typeof bonus === 'string'){
                value += eval(bonus);
            } else {
                value += bonus;
            }          
        }        
    }

    if(!this.isActor()){return value;}
    var equips = this._equips;
    for (var j = 0; j < equips.length; j++) {
        var item = equips[j];
        bonus = item.Bonus();
        if (bonus&&bonus[secStat]) {
            bonus = bonus[secStat];
            if (typeof bonus=='string'){
                value += eval(bonus);
            } else {
                value += bonus;
            }
        }
    }

    var skills = this._skills;
    for (var j = 0; j < skills.length; j++) {
        var skill = new Game_Item();
        skill._dataClass = 'skill';
        skill._itemId = skills[j];
        bonus = skill.Bonus();
        if (bonus&&bonus[secStat]) {
            bonus = bonus[secStat];
            if (typeof bonus=='string'){
                value += eval(bonus);
            } else {
                value += bonus;
            }
        }
    }
    return value;
};

Game_BattlerBase.prototype.baseAttack = function (){
    var ex;
    if (this.isActor()){
        ex = $dataClassesEx[this._classId]; 
    } else {
        ex = $dataEnemiesEx[this._enemyId]; 
    }
    if (ex&&ex.classType){
        if (classType = "phy") {return this.pdm;}
    } else {
        return this.mdm;
    }
    return this.phy;
}
// status window ==================================================================================================
Window_Status.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        ImageManager.reservePicture("#"+this._actor._name);
        var bitmap = ImageManager.loadPicture("#"+this._actor._name);
        this.contents.blt(bitmap, 0, 0, 1024, 1024, 400, -200);
        this.contents.fillAll('rgba(0, 0, 0, 0.6)');
        var lineHeight = this.lineHeight();
        this.drawBlock1(lineHeight * 0);
        this.drawBlock2(lineHeight * 1);
        this.drawHorzLine(lineHeight * 3);
        this.drawBlock3(lineHeight * 4);
        //this.drawHorzLine(lineHeight * 13);
        this.drawBlock4(lineHeight * 14);
    }
};

Window_Status.prototype.drawBlock1 = function(y) {
    this.drawActorName(this._actor, 24, y);
    this.drawActorClass(this._actor, 214, y);
    this.drawActorNickname(this._actor, 432, y);
};

Window_Status.prototype.drawBlock2 = function(y) {
    //this.drawActorFace(this._actor, 12, y);
    //this.drawBasicInfo(204, y);
    this.drawExpInfo(24, y);
};

Window_Status.prototype.drawBlock3 = function(y) {
    this.drawStatus(48, y);
    this.drawSecStatus(432, y);
    this.drawResists(816, y);
};

Window_Status.prototype.drawStatus = function(x, y) {
    var lineHeight = this.lineHeight();
    var status_array = ["STR","INT","STA","AGI","WIL","LUK"];
    var status_names = ["力量","智力","体质","敏捷","意志","幸运"];
    for (var i = 0; i < 6; i++) {
      var paramId = i + 2;
      var y2 = y + lineHeight * i;
      this.changeTextColor(this.systemColor());
      this.drawText(status_names[i], x, y2, 160);
      this.resetTextColor();
      this.drawText(Math.round(this._actor[status_array[i]]), x + 160, y2, 100, 'right');
    }
};

Window_Status.prototype.drawSecStatus = function(x, y) {
    var lineHeight = this.lineHeight();
    var status_array = ["mhp","mmp","pdm","mdm","pdf","mdf","hit","eva","cri","spd"];
    var status_names = ["生命","法力","物理伤害","魔法伤害","物理防御","魔法防御","命中","闪避","会心","速度"];
    for (var i = 0; i < 9; i++) {
      var paramId = i + 2;
      var y2 = y + lineHeight * i;
      this.changeTextColor(this.systemColor());
      this.drawText(status_names[i], x, y2, 160);
      this.resetTextColor();
      this.drawText(Math.round(this._actor[status_array[i]]), x + 160, y2, 100, 'right');
    }
};

Window_Status.prototype.drawResists = function(x, y) {
    var lineHeight = this.lineHeight();
    var status_array = ["slash","strike","thrust","hot","cold","curse","bless","kinetic","psi"];
    var status_names = ["斩击","打击","突刺","灼热","寒冷","诅咒","祝福","动能","心灵"];
    for (var i = 0; i < 9; i++) {
      var paramId = i + 2;
      var y2 = y + lineHeight * i;
      this.changeTextColor(this.systemColor());
      this.drawText(status_names[i], x, y2, 160);
      this.resetTextColor();
      this.drawText((1+this._actor[status_array[i]+"_d"])*100+"%/"+(1-this._actor[status_array[i]+"_r"])*100+"%", x + 100, y2, 200, 'right');
    }
};

Window_Status.prototype.drawExpInfo = function(x, y) {
    var lineHeight = this.lineHeight();
    var expTotal = "经验：";
    var expNext = "升级需要经验：";
    var value1 = this._actor.currentExp();
    var value2 = this._actor.nextRequiredExp();
    if (this._actor.isMaxLevel()) {
        value1 = '-------';
        value2 = '-------';
    }
    this.changeTextColor(this.systemColor());
    this.drawText(expTotal + value1, x, y, 270);
    this.drawText(expNext + value2, x, y + this.lineHeight(), 270);
};