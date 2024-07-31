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
    tabFormat: {
        "Achievements (1)": {
            content: [
                ["achievements", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]],
                "blank",
                ],
        },
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
        mult = mult.times(buyableEffect('p', 11));
        if (hasUpgrade('p', 14)) mult = mult.pow(upgradeEffect('p', 14));
        if (hasUpgrade('p', 15)) mult = mult.times(1.35);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "milestones",
                "blank",
                "upgrades",
                ],
        },
        "Buyables": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "buyables",
                ],
        },
    },
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
            unlocked() {return (hasUpgrade('p', 14))}
        },
        21: {
            title: "New features!",
            description: "x1.2 Points and unlock Buyables.",
            cost: new Decimal(400),
            unlocked() {return (hasUpgrade('p', 15))}
        },
    },
    milestones: {
        1: {
            requirementDescription: "Hundred thingies",
            effectDescription: "Unlock a new upgrade",
            done() {return player.p.points.gte(100)}
        },
    },
    buyables: {
            11: {
                title: "Incremental Prestige!",
                unlocked() {return (hasUpgrade('p', 21))},
                cost(x) {
                    let exp1 = new Decimal(1.005)
                    return new Decimal(250).pow(exp1, x).floor()
                },
                display() {return "Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " PP." + "<br>Bought: " + getBuyableAmount(this.layer, this.id) + "<br>Effect: Boost PP gain by x" + format(buyableEffect(this.layer, this.id))},
                canAfford() { return player[this.layer].points.gte(this.cost()) },
                buy() {
                    let cost = new Decimal(1)
                    player.p.points = player.p.points.sub(this.cost().mul(cost))
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                },
                effect(x) {
                    let base1 = new Decimal(1.25)
                    let base2 = x
                    let eff = base1.pow(base2)
                    return eff
                },
            },
        },
})