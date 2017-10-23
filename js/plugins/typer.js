Eval ($gameTroop.turnCount()%5==1)&&(user.mp>=50): Skill 59
Eval (user.isStateAffected(51))&&(user.mp>=125): Skill 61
Random 33%: Skill 60
Random 50%: Skill 62
Always: Skill 1

Eval user.isStateAffected(47): Skill 57
Random 30%: Skill 56
Random 30%: Skill 57

    b.addState(52,{"bonus":{"pdf":-a.STR}});dmf(a,b,'phy','slash','null',1)