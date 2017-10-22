var Lohengrin = Lohengrin || {};
Lohengrin.MasterEnemy = Lohengrin.MasterEnemy || {};

function EXBattleStart(troopId, canEscape, canLose, levels) {
    BattleManager.setup(troopId, canEscape, canLose, levels);
    $gamePlayer.makeEncounterCount();
    SceneManager.push(Scene_Battle);
}

Game_Enemy.prototype.initMembers = function() {
    Game_Battler.prototype.initMembers.call(this);
    this._enemyId = 0;
    this._letter = '';
    this._plural = false;
    this._screenX = 0;
    this._screenY = 0;
    this._level = 0;
};

Game_Enemy.prototype.setup = function(enemyId, x, y, level) {
    if(!level) {level = $dataEnemiesEx[enemyId].lv;}
    this._enemyId = enemyId;
    this._screenX = x;
    this._screenY = y;
    this._level = level;
    this.recoverAll();
};

Game_Enemy.prototype.initialize = function(enemyId, x, y, level) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(enemyId, x, y, level);
};

BattleManager.setup = function(troopId, canEscape, canLose, levels) {
    this.initMembers();
    this._canEscape = canEscape;
    this._canLose = canLose;
    $gameTroop.setup(troopId, levels||null);
    $gameScreen.onBattleStart();
    this.makeEscapeRatio();
};

Game_Enemy.prototype.exp = function() {
    return this.enemy().exp * this._level;
};

Game_Enemy.prototype.gold = function() {
    return this.enemy().gold * this._level;
};

Game_Enemy.prototype.makeDropItems = function() {    
    var drops = this.enemy().dropItems.reduce(function(r, di) {
        if (di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()) {
            return r.concat(this.itemObject(di.kind, di.dataId));
        } else {
            return r;
        }
    }.bind(this), []);

    var ex = $dataEnemiesEx[this._enemyId];
    if(ex&&ex.drops){
        drops = ex.drops.reduce(function(r, di) {
            if (di.kind > 0 && Math.random() < this.dropItemRate() * (di.prob + (this._level - ex.lv) / 100)) {
                var num = di.num;
                do {r = r.concat(this.itemObject(di.kind, di.id)); num--; } while (num > 0);
                return r;
            } else {
                return r;
            }
        }.bind(this), drops);
    }

    return drops;
};