// Lohengrin Raid Menu
var Lohengrin = Lohengrin || {};
Lohengrin.RM = Lohengrin.RM || {};

Lohengrin.RM.TestRaidList = [
	{name:'刻耳伯洛斯', troopId:13, levels:[[15],[30],[50],[75]]},
	{name:'奇美拉', troopId:14, levels:[[10],[20],[45],[60]]},
	{name:'伊丽莎白', troopId:15, levels:[[15],[30],[60],[90]]},
    {name:'由莉', troopId:20, levels:[[20],[55],[90],[120]]}
];

Lohengrin.RM.SkillRaidList = [
	{name:'初级祈祷、凯魔道（无难度区别）', troopId:16, levels:[[20],[20],[20],[20]]},
    {name:'高级祈祷、凯魔道（无难度区别）', troopId:22, levels:[[30],[30],[30],[30]]}
];

Lohengrin.RM.UnitRaidList = [
    {name:'阵（隐秘）', troopId:21, levels:[[25],[50],[75],[100]]}
];


//================================================================================================================
// Add Command
Lohengrin.RM.Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
    Lohengrin.RM.Window_MenuCommand_addOriginalCommands.call(this);
    this.addRaidCommand();
};

Window_MenuCommand.prototype.addRaidCommand = function() {
    this.addCommand("副本", 'Raid', true);
};

Lohengrin.RM.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    Lohengrin.RM.Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler('Raid', this.commandRaid.bind(this));
};

Scene_Menu.prototype.commandRaid = function() {
    SceneManager.push(Scene_Raid);
};

//Command Window
//=========================================================================================
function Window_RaidEventSelect() {
    this.initialize.apply(this, arguments);
};

Window_RaidEventSelect.prototype = Object.create(Window_Command.prototype);
Window_RaidEventSelect.prototype.constructor = Window_RaidEventSelect;

Window_RaidEventSelect.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
};

Window_RaidEventSelect.prototype.windowWidth = function() {
    return 240;
};

Window_RaidEventSelect.prototype.makeCommandList = function() {
	this.addEventsCommands();
    this.addFinishCommand();
};

Window_RaidEventSelect.prototype.addEventsCommands = function() {
	this.addCommand('测试BOSS', 'test', true);
	this.addCommand('技能传承', 'skill', true);
    this.addCommand('灵魂碎片', 'unit', true);
};

Window_RaidEventSelect.prototype.addFinishCommand = function() {
    this.addCommand('返回', 'cancel', true);
};

//==================================================================================
//RaidSelect Window
function Window_RaidSelect(){
	this.initialize.apply(this, arguments);
};

Window_RaidSelect.prototype = Object.create(Window_Selectable.prototype);
Window_RaidSelect.prototype.constructor = Window_RaidSelect;

Window_RaidSelect.prototype.initialize = function() {
	Window_Selectable.prototype.initialize.call(this, 250, 0, 1000, Graphics.boxHeight);
	this.refresh();
};

Window_RaidSelect.prototype.maxItems = function() {
    if(this.source) {return this.source.length};
    return 0;
};

Window_RaidSelect.prototype.itemHeight = function() {
    return 32;
};

Window_RaidSelect.prototype.numVisibleRows = function() {
    return Math.floor(Graphics.boxHeight / this.itemHeight);
};

Window_RaidSelect.prototype.drawItem = function(index) {
    var text = this.source[index].name;
    var rect = this.itemRect(index);
    this.resetTextColor();
    this.drawText(text, rect.x, rect.y);
};

//=========================================================================
//Difficulty Select

function Window_RaidDiffculty() {
    this.initialize.apply(this, arguments);
};

Window_RaidDiffculty.prototype = Object.create(Window_Command.prototype);
Window_RaidDiffculty.prototype.constructor = Window_RaidDiffculty;

Window_RaidDiffculty.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
};

Window_RaidDiffculty.prototype.windowWidth = function() {
    return 240;
};

Window_RaidDiffculty.prototype.makeCommandList = function() {
	this.addCommand('初级', 'easy', true);
	this.addCommand('中级', 'normal', true);
	this.addCommand('上级', 'hard', true);
	this.addCommand('超级', 'crazy', true);
};

//==========================================================================================
//Scene Raid
function Scene_Raid() {
    this.initialize.apply(this, arguments);
};

Scene_Raid.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Raid.prototype.constructor = Scene_Raid;

Scene_Raid.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Raid.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createRaidWindow();
 
};

Scene_Raid.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_RaidEventSelect();
    this._commandWindow.setHandler('cancel', this.onCancelOk.bind(this));
    this._commandWindow.setHandler('test', this.showBosses.bind(this, Lohengrin.RM.TestRaidList));
    this._commandWindow.setHandler('skill', this.showBosses.bind(this, Lohengrin.RM.SkillRaidList));
    this._commandWindow.setHandler('unit', this.showBosses.bind(this, Lohengrin.RM.UnitRaidList));
    this.addWindow(this._commandWindow);
};

Scene_Raid.prototype.createRaidWindow = function() {
	this._raidWindow = new Window_RaidSelect();
	this.addWindow(this._raidWindow);
};

Scene_Raid.prototype.createDifficultyWindow = function() {
	var index = this._raidWindow.index();
	var rect = this._raidWindow.itemRect(index);
	this._diffcultyWindow = new Window_RaidDiffculty(256, rect.y + 32);
	this._diffcultyWindow.raid = this._raidWindow.source[index];
	this._diffcultyWindow.setHandler('cancel', this.onDifficultySelectCancel.bind(this));
	this._diffcultyWindow.setHandler('easy', this.onSelectDifficulty.bind(this, 0));
	this._diffcultyWindow.setHandler('normal', this.onSelectDifficulty.bind(this, 1));
	this._diffcultyWindow.setHandler('hard', this.onSelectDifficulty.bind(this, 2));
	this._diffcultyWindow.setHandler('crazy', this.onSelectDifficulty.bind(this, 3));
	this.addWindow(this._diffcultyWindow);
};

Scene_Raid.prototype.onCancelOk = function() {
    this.popScene();
};

Scene_Raid.prototype.showBosses = function(Raidlist) {
	this._raidWindow.source = Raidlist;
	this._raidWindow.setHandler('cancel', this.onRaidSelectCancel.bind(this));
	this._raidWindow.refresh();
	this._raidWindow.activate();
	this._raidWindow.select(0);
    this._raidWindow.setHandler('ok', this.onSelectRaid.bind(this));
};

Scene_Raid.prototype.onRaidSelectCancel = function() {
    this._raidWindow.deselect();
    this._commandWindow.activate();
};

Scene_Raid.prototype.onSelectRaid = function() {
	this.createDifficultyWindow();
    this._raidWindow.deselect();
    this._diffcultyWindow.activate();
};

Scene_Raid.prototype.onDifficultySelectCancel = function() {
	this._raidWindow.activate();
	this._diffcultyWindow.close();
};

Scene_Raid.prototype.onSelectDifficulty = function(di) {
	var troopId = this._diffcultyWindow.raid.troopId;
	var level = this._diffcultyWindow.raid.levels[di];
	this._diffcultyWindow.close();
	EXBattleStart(troopId,0,0,level);
};