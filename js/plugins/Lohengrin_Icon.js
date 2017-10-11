//=============================================================================
// Lohengrin separated icon
//=============================================================================

var Lohengrin = Lohengrin || {};
Lohengrin.IconEx = Lohengrin.IconEx || {};

//=============================================================================

//=============================================================================
/*:
 * @plugindesc 图标插件
 * @author Lohengrin
 * @help
 * 在 "img/icons" 目录中置入 png 图片，在 note 里用 "ICON: filename&" 指定图标。
 * 敌人状态显示成一排
 * 敌人状态显示回合数

*/

//==============================================================================================
// basic data
//==============================================================================================
Lohengrin.IconEx.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!Lohengrin.IconEx.DataManager_isDatabaseLoaded.call(this)) return false;
  if (!Lohengrin._loaded_LOH_IconEx) {
  	this.processIconNotetag($dataActors);
    this.processIconNotetag($dataSkills);
    this.processIconNotetag($dataItems);
  	this.processIconNotetag($dataEnemies);
  	this.processIconNotetag($dataClasses);
  	this.processIconNotetag($dataWeapons);
  	this.processIconNotetag($dataArmors);
  	this.processIconNotetag($dataStates);
    Lohengrin._loaded_LOH_IconEx = true;
  }
	return true;
};

DataManager.processIconNotetag = function(group) {
	var matcher = /(?:ICON):[ ](\S+)&/i;
	for (var i = 1; i < group.length; i++) {
		var obj = group[i];
		var notedata = obj.note.split(/[\r\n]+/);
		obj.icon = 'default';
		for (var j = 0; j < notedata.length; j++) {
			var line = notedata[j];
			if (line.match(matcher)) {
				obj.icon = RegExp.$1;
        break;
			}
		}
	}
};

var iconlist =
["adfdown","adfup","am_blue_magarmor","atsdown","atsup","attack","battle_notice_status_07","blind","bronze","common","dead","default","defdown","defup","empty","evil_blade","evilkey","fascinated","golden","gold","hammer","high_potion_blue","immune","it_branch","it_cons_exp","it_cons_revive","it_cons_skillscroll_br","it_cons_skillscroll_gl","it_cons_skillscroll_sl","IT_EQ_ANAS_GANTLET","IT_EV_DARK_POT","IT_EV_FIRE_POT","IT_EV_RAINBOW_POT","IT_EV_WATER_POT","IT_EV_WIND_POT","it_ingot_bronze","it_ingot_golden","it_ingot_silver","IT_KEY_QUEST_APPLE","IT_KEY_QUEST_GOLD","IT_KEY_QUEST_ORE","IT_US_EXTRA_POTION","IT_US_FATE_SANDWICH","IT_US_PARALYSIS","legendary","lolipop_red","mace","noattack","noheal","null","passive","七斗术师","双刀术师","金职证明","银职证明","七斗术","双刀术","圣剑技","圣骑士","武芸技","神圣术","锻造师","主教","剑技","剑豪","战士","战技","拳圣","拳套","拳技","武圣","盗技","盗贼","舞者","舞踏","薙刀","锻技","poison","potion_blue","potion_green","potion_purple","potion_rainbow","pot_yellow","regeneration","remove","s_barb_act","s_barb_burning_blood","s_barb_critical_slash","s_barb_dire_bond","s_barb_pas","s_barb_rage","scythe","silver","sk_hwiz_act","sk_hwiz_pas","sk_mag_act","sleep","s_md_elemental_explosion","s_md_fire_strike","s_md_snow_strike","spddown","spdup","s_pray_act","s_pray_pas","st_down","strdown","strup","stun","st_up","sword","thanatos","twinblade_red","up","we_big_sword","wp_jewelry_wand","wp_woodsword"]

;

Lohengrin.IconEx.Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
Scene_Boot.loadSystemImages = function() {
    Lohengrin.IconEx.Scene_Boot_loadSystemImages.call(this)
    iconlist.map(function(iconName){
        ImageManager.reserveBitmap('img/icons/', iconName, 0, false, ImageManager._systemReservationId);
    });
};

//==============================================================================================
// show enemy state
//==============================================================================================
Game_BattlerBase.prototype.stateIcons = function() {
    return this._states.map(function(masterState) {
        return masterState.icon;
    });
};

Game_BattlerBase.prototype.allIcons = function() {
    return this.stateIcons();
};

Sprite_StateIcon.prototype.initMembers = function() {
    this._battler = null;
    this._icons = [];
    this._animationCount = 0;
    this._animationIndex = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
};

Sprite_StateIcon.prototype.loadBitmap = function() {
    this.bitmap = new Bitmap(Sprite_StateIcon._iconWidth,Sprite_StateIcon._iconHeight);
    this.bitmap.fontSize = 16;
    this.setFrame(0, 0, 0, 0);
};

Sprite_StateIcon.prototype.setup = function(battler) {
    this._battler = battler;
};

Sprite_StateIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updateIcon();
        this.updateFrame();
        this._animationCount = 0;
    }
};

Sprite_StateIcon.prototype.animationWait = function() {
    return 40;
};

Sprite_StateIcon.prototype.updateIcon = function() {
    var icons = [];
    if (this._battler && this._battler.isAlive()) {
        icons = this._battler.allIcons();
    }
    this._icons = icons;
};

Sprite_StateIcon.prototype.updateFrame = function() {
    var pw = Sprite_StateIcon._iconWidth;
    var ph = Sprite_StateIcon._iconHeight;
    var sx = 0;//this._iconIndex % 16 * pw;
    var sy = 0;//Math.floor(this._iconIndex / 16) * ph;
    this.bitmap.clear();
    this.bitmap.resize(pw*this._icons.length,ph);
    for (i = 0; i < this._icons.length; i++){
      var bitmap = ImageManager.loadBitmap('img/icons/',this._icons[i],0,true);
      this.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, pw * i, 0,pw,ph);
      this.bitmap.drawText(this._battler._states[i].duration, -3+pw*i, 8, pw, ph, 'right');
    }
    this.setFrame(sx, sy, pw * this._icons.length, ph);
};

//==============================================================================================
// draw icon
//==============================================================================================
Window_Base.prototype.drawIcon = function(iconName, x, y, w, h) {
    h = h||this.lineHeight()-4;
    w = h||w;
    ImageManager.reserveBitmap('img/icons/', iconName, 0, false, ImageManager._systemReservationId);
    var bitmap = ImageManager.loadBitmap('img/icons/', iconName,0,true);
    var pw = bitmap.width;//Window_Base._iconWidth;
    var ph = bitmap.height;//Window_Base._iconHeight;
    var sx = 0;
    var sy = 0;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, w, h);
};

/*
Window_Base.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
    if (item) {
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.resetTextColor();
        this.drawIcon(item.icon, x + 2, y + 2);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
    }
};
*/

BattleManager.displayDropItems = function() {
    var items = this._rewards.items;
    if (items.length > 0) {
        $gameMessage.newPage();
        items.forEach(function(item) {
            $gameMessage.add(TextManager.obtainItem.format(item.name));
        });
    }
};