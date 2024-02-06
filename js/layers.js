addLayer("s", {
    name: "starter", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#808080",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "starter points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('s', 13)) mult = mult.times(upgradeEffect('s', 13));
        if (hasUpgrade('s', 21)) mult = mult.times(3);
        mult = mult.times(player.p.points.add(1));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Double your points",
            description: "Self-explanatory",
            cost: new Decimal(1)
        },
        12: {
            title: "Synergy",
            description: "Boost points by themselves",
            cost: new Decimal(3),
            effect() {
                let eff = player.points.add(1).pow(0.5)
                return eff;
             },
             effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "Synergy 2.0",
            description: "Boost starter points by themselves",
            cost: new Decimal(5),
            effect() {
                let eff = player.s.points.add(1).pow(0.5).div(player.s.points.pow(0.25))
                return eff;
             },
             effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21: {
            title: "Triple Trouble",
            description: "Triple starter points, but halve points",
            cost: new Decimal(20),
        },
    },
    challenges: {
        11: {
            name: "Timewall",
            challengeDescription: "Square root points.",
            canComplete: function() {return player.s.points.gte(10)},
            goalDescription: "Get 10 starter points.",
                rewardDescription: "Points are buffed based on completions.",
                rewardEffect() {
                    let ret = Decimal.pow(1.1, challengeCompletions(this.layer, this.id));
                    return ret;
                },
             completionLimit: "5",
        },
    }
})
addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#00C1FF",
    requires: new Decimal(25), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "starter points", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.05, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 11)) mult = mult.times(upgradeEffect('p', 11));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Self-care",
            description: "Boost prestige points by itself",
            cost: new Decimal(1),
            effect() {
                let eff = player.p.points.add(1).pow(0.3)
                return eff;
             },
             effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    }
})