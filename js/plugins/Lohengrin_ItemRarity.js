//=============================================================================
// Lohengrin Icon Rarity
//=============================================================================
/*:
 * @plugindesc 置于 Yanfly Item Core 之下
 * @author Lohengrin
*/
var Lohengrin = Lohengrin || {};
Lohengrin.IR = Lohengrin.IR || {};

Lohengrin.IR.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!Lohengrin.IR.DataManager_isDatabaseLoaded.call(this)) return false;
  if (!Lohengrin._loaded_LOH_IR) {
    this.processIRNotetag($dataItems);
    this.processIRNotetag($dataWeapons);
    this.processIRNotetag($dataArmors);
    Lohengrin._loaded_LOH_IR = true;
  }
	return true;
};

DataManager.processIRNotetag = function(group) {
	var matcher = /(?:RR):[ ](\S+)&/i;
	for (var i = 1; i < group.length; i++) {
		var obj = group[i];
		var notedata = obj.note.split(/[\r\n]+/);
		obj.rarity = 'bronze';//bronze, silver, golden, legendary
		for (var j = 0; j < notedata.length; j++) {
			var line = notedata[j];
			if (line.match(matcher)) {
				obj.rarity = RegExp.$1;
        break;
			}
		}
	}
};

Lohengrin.IR.Colors = {
	'bronze': 0,
	'silver': 1,
	'golden': 13,
	'legendary': 2
};

Window_Base.prototype.drawItemName = function(item, x, y, width, withText) {
	withText = withText||true;
	width = width || 312;
	if (item) {
		var h = this.lineHeight() - 9;
		this.resetTextColor();
		this.drawIcon(item.rarity, x+6, y+6, h, h);
		this.drawIcon(item.icon, x+6, y +6, h, h);
		if (withText) {
			if (DataManager.isItem(item)||DataManager.isWeapon(item)||DataManager.isArmor(item)) {
				this.changeTextColor(this.textColor(Lohengrin.IR.Colors[item.rarity]));
			}
			this.drawText(item.name, x + h + 24, y, width - h);
		}
	}
};