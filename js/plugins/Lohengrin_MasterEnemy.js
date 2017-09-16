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


Game_Troop.prototype.setup = function(troopId, levels) {
    this.clear();
    this._troopId = troopId;
    this._enemies = [];
    this.troop().members.forEach(function(member) {
        if ($dataEnemies[member.enemyId]) {
            var enemyId = member.enemyId;
            var x = member.x;
            var y = member.y;
            var enemy = new Game_Enemy(enemyId, x, y, levels?levels.shift():null);
            if (member.hidden) {
                enemy.hide();
            }
            this._enemies.push(enemy);
        }
    }, this);
    this.makeUniqueNames();
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