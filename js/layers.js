addLayer("a", {
    startData() { return {
        unlocked: true,
    }},
    color: "yellow",
    row: "side",
    layerShown() {return true}, 
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievements: {
    rows: 25,
    cols: 6,
        11: {
            name: "The first boost!",
            done() {return (hasUpgrade('p', 11))},
            tooltip: "Get the first upgrade!"
        },
        12: {
            name: "The first exponent!",
            done() {return (hasUpgrade('p', 14))},
            tooltip: "Get 'Exponentiation'. Reward: x1.5 Points"
        },
    },
})
addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#22c0e3",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 12)) mult = mult.times(4);
        if (hasUpgrade('p', 14)) mult = mult.pow(upgradeEffect('p', 14));
        if (hasUpgrade('p', 15)) mult = mult.times(1.35);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Simple.",
            description: "Double points.",
            cost: new Decimal(1),
        },
        12: {
            title: "Wow. Big!",
            description: "QUADRUPLE Prestige Points.",
            cost: new Decimal(5),
        },
        13: {
            title: "Synergism detected!",
            description: "Boost points based on themselves.",
            cost: new Decimal(25),
            effect() {
                let p3exp = 0.125
                let eff = player.points.add(1).pow(p3exp)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" + " Points"},
        },
        14: {
            title: "Exponentiation",
            description: "Boost prestige points based on points.",
            cost: new Decimal(125),
            unlocked() {return (hasMilestone('p', 1))},
            effect() {
                let p4exp = 0.005
                let eff = player.points.add(1).pow(p4exp)
                return eff
            },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) + " PP"},
        },
        15: {
            title: "Buff or Nerf?",
            description: "/1.25 Points but x1.35 Prestige Points",
            cost: new Decimal(200),
        },
    },
    milestones: {
        1: {
            requirementDescription: "Hundred thingies",
            effectDescription: "Unlock a new upgrade",
            done() {return player.p.points.gte(100)}
        },
    },
})