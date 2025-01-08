addLayer("d", {
    name: "dollars", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#07a000",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "dollars", // Name of prestige currency
    baseResource: "cents", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('d', 12)) mult = mult.times(upgradeEffect('d', 12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for dollars", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    upgrades: {
        11: {
            title: 'Faster Money',
            description: 'Double cents speed.',
            cost: new Decimal(1)
        },
        12: {
            title: 'Deflation',
            description: 'Decrease price of dollars based on your dollars.',
            cost: new Decimal(3),
            unlocked() {return (hasUpgrade('d', 11))},
            effect() {
                let eff = player[this.layer].points.pow(0.45)
                eff = softcap(eff, new Decimal(1e3), 0.9)
                return eff
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + 'x'
            }
        }
    },
    buyables: {
        11: {
            title: "Becoming Working-class",
            unlocked() { return hasUpgrade('d', 12) },
            cost(x) {
                exp2 = 1.1
                return new Decimal(10).mul(Decimal.pow(1.1, x)).floor()
            },
            display() {
                return "Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " dollars" + "<br>Bought: " + getBuyableAmount(this.layer, this.id) + "<br>Effect: Boost Cents gain by x" + format(buyableEffect(this.layer, this.id))
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            buy() {
                let cost = new Decimal (1)
                player[this.layer].points = player[this.layer].points.sub(this.cost().mul(cost))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                base1 = new Decimal(1.2)
                base2 = x
                expo = new Decimal(1.005)
                eff = base1.pow(Decimal.pow(base2, expo))
                return eff
            },
        },
    }
})