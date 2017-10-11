b.removeState(33);
if(b.mp>=dmg){
	b.mp -= dmg;
	dmg = dmf(b,a,'mag','null','null',1,dmg);
	a.gainHp(-dmg);
} else{
	b.addState(6);
}
dmg = 0;