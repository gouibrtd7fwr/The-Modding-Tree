addLayer("h", {
    name: "hydrogen", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#0000CF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "hydrogen", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('h', 12)) mult = mult.times(upgradeEffect('h', 12));
        if (hasUpgrade('h', 14)) mult = mult.pow(upgradeEffect('h', 14));
        if (hasUpgrade('h', 21)) mult = mult.times(4);
        if (hasUpgrade('he', 12)) mult = mult.times(2);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    branches: ['he'],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Double Trouble",
            cost: new Decimal(2),
            description: "Double points gain."
        },
        12: {
            title: "Great Boost",
            cost: new Decimal(4),
            description: "Boost Hydrogen based on points.",
            effect() {
                return player.points.add(1).pow(0.125)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "Synergism",
            cost: new Decimal(25),
            description: "Boost points based on themselves.",
            effect() {
                return player.points.add(1).times(3).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "More Synergism",
            cost: new Decimal(50),
            description: "Boost Hydrogen based on themselves.",
            effect() {
                effect = player.h.points.add(1).pow(0.005)
                if (hasUpgrade('he', 11)) effect = effect.times(upgradeEffect('he', 11))
                return effect
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) },
        },
        15: {
            title: "New Row and a Boost!",
            cost: new Decimal(75),
            description: "Unlock Row 2 and triples points gain."
        },
        21: {
            title: "Woah! New row!!!",
            cost: new Decimal(150),
            description: "Quadruple Hydrogen gain and unlock Helium!",
            unlocked() {
                return hasUpgrade('h', 15)
            },
        },
    },
})
addLayer("he", {
    name: "helium", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "He", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00259C",
    requires: new Decimal(150), // Can be a function that takes requirement increases into account
    resource: "helium", // Name of prestige currency
    baseResource: "hydrogen", // Name of resource prestige is based on
    baseAmount() {return player.h.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasChallenge('he', 11)) mult = mult.times(3);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasUpgrade('h', 21)},
    upgrades: {
        11: {
            title: "Finally! A boost to the worst upgrade!",
            cost: new Decimal(1),
            description: "Boost Hydrogen Upgrade 14 based on helium.",
            effect() {
                return player.he.points.add(1).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        12: {
            title: "Challenges?!",
            cost: new Decimal(2),
            description: "Double hydrogen gain and unlock helium challenges.",
        },
    },
    challenges: {
        11: {
            name: "Small Nerf",
            challengeDescription: "Hydrogen Upgrades 12 and 13 are nullified.",
            unlocked() {
                return hasUpgrade('he', 12)
            },
            goalDescription: "Get 1 Helium.",
            canComplete: function() {return player.he.points.gte(1)},
            rewardDescription: "Triple Helium gain."
        },
    },
})