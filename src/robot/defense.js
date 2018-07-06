var Defense = Computer.extend({
  target: null,// Target robot to fire
  animAttackSpeed: 1.0,// Attack speed animation
  isDummy: false, // If it is a dummy defense, (a.k.a. a defense preview in the map)
  built: 0, // Built percentage of the defense
  buildBar: null, // The progress bar showing defense build progress
  DEBUG: true,
  STATS: new Map([
    ['life', {0: 500, 1: 600, 2: 700}],
    ['element', {
      electric: "Electro",
      fire: "Fire",
      water: "Water",
    }],
    ['range', {0: 200, 1: 300, 2: 500}],
    ['terrain', {0: 'walk', 1: 'fly'}],
    ['damage', {0: 25, 1: 50, 2:75}],
    ['attackSpeed', {0: 0.5, 1: 1.0, 2: 2.0}],
  ]),
  PARTS: { // Necessary info for the parts to make a defense
    head: {plural: "heads", z: 2, partName: defense => defense.element + ["Weak", "Normal", "Strong"][defense.damage]},
    middle: {plural: "middles", z: 1, partName: defense => defense.element + ["Weak", "Normal", "Strong"][defense.life]},
    base: {plural: "bases", z: 0, partName: defense => defense.element + ["Walk", "Fly"][defense.terrain]}
  },
  STATES: [ // Possible states for this defense
    rb.states.defense.build,
    rb.states.defense.repair,
    rb.states.defense.idle,
    rb.states.defense.still,
    rb.states.defense.attack,
    rb.states.defense.die,
  ],
  ctor:function(level, life, element, range, terrain, damage, attackSpeed, isDummy) {
    if (arguments.length === 0) return;
    this._super.apply(this, arguments);
    this.setAnchorPoint(0.5, 0.1); // TODO quirk because of the bad tiles proportions
    if (!isDummy) this.realDefenseInit();
    this.isDummy = isDummy;
  },
  realDefenseInit: function() { // Things that dummy defenses should not execute
    this.setTouchEvent();
    this.scheduleUpdate();
    if (!this.isBuilt()) this.createBuildBar();
  },
  // Build and Repair related things
  getLifePercentage: function() {
    return this.sLife / this.getDefaultStat('life') * 100;
  },
  addBuilt: function(amount) {
    this.built += amount;
    if (this.built >= 100) {
      this.built = 100;
      this.sm.setState('idle');
      this.hideBuildBar();
    }
    this.buildBar.changePercent(Math.floor(this.built));
  },
  setBuilt: function() {
    this.addBuilt(100);
  },
  isBuilt: function() {
    return this.built == 100;
  },
  addRepaired: function(amount) {
    this.sLife += amount;
    let fullLife = this.getDefaultStat('life');
    if (this.sLife >= fullLife) {
      this.sLife = fullLife;
      this.sm.setState('idle');
      this.hideBuildBar();
    }
    this.buildBar.changePercent(Math.floor(this.sLife / fullLife * 100));
    this.updateHealthBar();
  },
  setRepaired: function() {
    this.addRepaired(this.getDefaultStat('life'));
  },
  isRepaired: function() {
    return this.sLife == this.getDefaultStat('life');
  },
  createBuildBar: function() {
    let color = {fire: "orange", electric: "yellow", water: "blue"}[this.element];
    this.buildBar = new Progress({swallow: false, text: "{}%", color: color, x: "0px", y:"64px", scale: 0.5, height:"32px", width:"128px", fontSize: 56});
    this.buildBar.setAnchorPoint(0.5, 0.5);
    this.buildBar.addTo(this, 10);
    this.buildBar.titleContainer = new Panel({swallow: false, x: "center", width: "150pw", top: "48px", height: "350ph", bgImage: r.ui.panel, scale: 2});
    this.buildBar.titleContainer.addTo(this.buildBar, -1);
    this.buildBar.title = new Text({text: "building", x: "center", y: "64px", top: cc.sys.isNative ? "0px" : "5px", fontSize: 56});
    this.buildBar.title.addTo(this.buildBar);

    this.buildBar.scale = 0;
    this.showBuildBar();
  },
  showBuildBar: function(initialPercentage) {
    this.buildBar.changePercent(Math.floor(initialPercentage) || 0);
    let scaleUp = new cc.EaseBackOut(new cc.ScaleTo(0.5, 0.5, 0.5));
    this.buildBar.runAction(scaleUp);
  },
  hideBuildBar: function() {
    let scaleDown = new cc.EaseBackIn(new cc.ScaleTo(0.5, 0, 0));
    this.buildBar.runAction(scaleDown);
  },

  toString: () => "Defense",
  setTouchEvent: function() {
    easyTouchEnded(this, function(defense) {
      if (defense.getNumberOfRunningActions() === 0) {
        if (!defense.level.dummyDefense && !defense.isDummy) {
          var increase = new cc.ScaleBy(0.1, 1.2);
          var decrease = new cc.ScaleBy(0.1, 1 / 1.2);
          defense.runAction(new cc.Sequence(increase, decrease));
          if (!defense.isBuilt()) {
            defense.level.character.goBuild(defense);
          } else {
            // defense.level.hud.dd.show(defense);
            defense.level.hud.preview.show(defense);
          }
        }
      }
    });
  },
  getTarget: function(){
    // This function returns the robot to which this defense has to attack

    //Looks for robots in tower range
    var inRange = this.level.robots.filter(function(robot) {
      return this.getDistanceTo(robot) <= this.sRange && robot.terrain == this.terrain && robot.sLife > 0;
    }, this);
    //if no robot in range return null
    if (inRange.length === 0) {
      this.target = null;
      if (this.sm.isInState('attack')) this.sm.setState('idle');
      return null;
    }
    //If there are robots in range proceed to detect which of them is closest
    //To the base, set it to target and return it
    var minDistanceToBase = 0;
    var closestRobot = null;
    inRange.forEach(function(robot) {
      var distanceToBase = cc.pDistance(robot, this.level.base);
      if (minDistanceToBase === 0 || distanceToBase < minDistanceToBase) {
        minDistanceToBase = distanceToBase;
        closestRobot = robot;
      }
    }, this);
    this.target = closestRobot;
    return this.target;
  },
  attack: function(target) {
    this._super(target);
    if (target) {

      var bullet = new cc.DrawNode();
      bullet.drawDot(cc.p(0, 0), 8 * (this.damage + 1), rb.palette[this.element]);
      bullet.setPosition(this.x, this.y + 128);
      this.level.map.addChild(bullet);

      var follow = new cc.MoveTo(0.5, cc.p(target.x, target.y + 96));
      var destroy = new cc.RemoveSelf();
      var sequence = [follow, destroy];
      bullet.runAction(new cc.Sequence(sequence));
    }
  },
  debug: function(){
    // Creates a debugger for verbose information directly on the canvas
    this.debugger = new Debugger(this);
    this.debugger.methods = [ // Modify debug information on canvas
      // { method: this.debugger.debugAnchor },
      // { method: this.debugger.debugRange },
    ];
    this.debugger.debug();
  },
  canBePlacedOn: function(tilePos) {
    var tile = this.level.map.getLayer("Background").getTileGIDAt(tilePos);
    var tileProps = this.level.map.getPropertiesForGID(tile) || {};
    var isRoad = tileProps.hasOwnProperty('road');
    if (isRoad && tileProps.road == "1") {
      return {result: false, cause: "Can't place on here"};
    } else {
      for (var i = 0; i < this.level.defenses.length; i++) {
        if (cc.pointEqualToPoint(
          this.level.map.tileCoordFromChild(this.level.defenses[i]),
          tilePos
        )) {
          return {result: false, cause: "There is already a tower there"};
        }
      }
      return {result: true, cause: _.format("Placed - ${}", rb.prices.createDefense)}; // TODO estos mensajes no estan muy bien aca
    }
  },
  update: function(delta) {
    if (this.isDummy) return;
    var target = this.getTarget();
    this.debugger.debugLine(this, {stop: true});
    if (target && !this.sm.isInState('build') && !this.sm.isInState('repair')) {
      this.debugger.debugLine(this, {target: target, offset: cc.p(0, 128), color: rb.palette[this.element]});
      this.sm.setState('attack', {target: target});
    }
  }
});
