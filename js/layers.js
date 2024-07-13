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
        if (hasUpgrade('h', 12)) mult = mult.times(upgradeEffect('h', 12))
        if (hasUpgrade('h', 14)) mult = mult.pow(upgradeEffect('h', 14))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "h", description: "H: Reset for hydrogen", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
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
            description: "Boost hydrogen based on points.",
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
            description: "Boost hydrogen based on themselves.",
            effect() {
                return player.h.points.add(1).pow(0.005)
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) },
        },
    },
})