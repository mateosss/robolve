var r = { // resources variable
  character: "res/character.png",
  fonts: {
    baloo: {type: "font", name: cc.sys.isNative ? "res/fonts/baloo.ttf" : "baloo", srcs: ["res/fonts/baloo.ttf"]},
    icons: {type: "font", name: cc.sys.isNative ? "res/fonts/icons.ttf" : "icons", srcs: ["res/fonts/icons.ttf"]},
  },
  getDefaultFont: () => r.fonts.baloo.name,
  empty: "res/sprites/empty.png",
  point: "res/sprites/point.png",
  invalidPart: "res/sprites/invalidPart.png",
  base: "res/sprites/base.png",
  maps:{
    tilesheet: "res/map/tilesheet.png",
    tileset: "res/map/tileset.png",
    map1: "res/map/map1.tmx",
    map2: "res/map/map2.tmx",
    map3: "res/map/map3.tmx",
    map4: "res/map/map4.tmx",
    map5: "res/map/map5.tmx",
    map6: "res/map/map6.tmx",
  },
  ui: {
    panel: "res/sprites/ui/panel.png",
    panel_out: "res/sprites/ui/panel_out.png",
    panel_in: "res/sprites/ui/panel_in.png",
    panel_in_soft: "res/sprites/ui/panel_in_soft.png",
    panel_in_nuts: "res/sprites/ui/panel_in_nuts.png",
    buttons: [
      "red",
      "pink",
      "purple",
      "deepPurple",
      "indigo",
      "blue",
      "lightBlue",
      "cyan",
      "teal",
      "green",
      "lightGreen",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deepOrange",
      "brown",
      "gray",
      "blueGray",
      "white",
      "black",
    ],
  },
  items: {
    default: "res/sprites/items/default.png",
    gold: "res/sprites/items/gold.png",
    electricCoin: "res/sprites/items/electricCoin.png",
    fireCoin: "res/sprites/items/fireCoin.png",
    waterCoin: "res/sprites/items/waterCoin.png",
    sword: "res/sprites/items/sword.png",
    hammer: "res/sprites/items/hammer.png",
    screwdriver: "res/sprites/items/screwdriver.png",
    berserkerChip: "res/sprites/items/berserkerChip.png",
  },
  parts_png_0: "res/sprites/parts_0.png",
  parts_plist_0: "res/sprites/parts_0.plist",
  parts_png_1: "res/sprites/parts_1.png",
  parts_plist_1: "res/sprites/parts_1.plist",
};

var g_resources = [];

// Charge main files
for (var i in r) {
  if (typeof r[i] === "string") g_resources.push(r[i]);
}

// Charge maps sheets and tmx
for (var map in r.maps){
  g_resources.push(r.maps[map]);
}

// Charge ui images
for (var ui in r.ui){
  if (typeof r.ui[ui] === 'string') {
    g_resources.push(r.ui[ui]);
  }
  if (ui === 'buttons') {
    let  form = "res/sprites/ui/buttons/{}.png";
    for (var btn in r.ui.buttons) {
      r.ui[r.ui.buttons[btn]] = _.format(form, r.ui.buttons[btn]);
      r.ui[r.ui.buttons[btn] + "P"] = _.format(form, r.ui.buttons[btn] + "P");
      r.ui[r.ui.buttons[btn] + "Round"] = _.format(form, r.ui.buttons[btn] + "Round");
      r.ui[r.ui.buttons[btn] + "RoundP"] = _.format(form, r.ui.buttons[btn] + "RoundP");
      g_resources.push(r.ui[r.ui.buttons[btn]]);
      g_resources.push(r.ui[r.ui.buttons[btn] + "P"]);
      g_resources.push(r.ui[r.ui.buttons[btn] + "Round"]);
      g_resources.push(r.ui[r.ui.buttons[btn] + "RoundP"]);
    }
  }

}

// Charge item sprites
for (let item in r.items){
  g_resources.push(r.items[item]);
}
