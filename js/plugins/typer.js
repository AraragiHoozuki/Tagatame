Eval ($gameTroop.turnCount()%4==1)&&(user.mp>=80): Skill 67
Eval (!user.isStateAffected(57))&&user.mp>=50&&Math.random()<=0.8: Skill 69
Eval user.isStateAffected(57)&&(user.mp>=65)&&Math.random()<=0.8: Skill 66
Random 50%: Skill 71
Eval user.hpRate()<=0.3: Skill 68
Always: Skill 1

Eval user.isStateAffected(47): Skill 57
Random 30%: Skill 56
Random 30%: Skill 57

    b.addState(52,{"bonus":{"pdf":-a.STR}});dmf(a,b,'phy','slash','null',1)

    d=dmf(a,b,'phy','slash','curse',0.75);if(!b.isStateAffected(5)){b.addState(5,{"dot": d*0.25,"duration":3});}else{var t_state=b.getStateById(5);t_state.dot*=1.5;t_state.duration+=2;};d
