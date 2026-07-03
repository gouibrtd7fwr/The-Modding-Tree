addLayer("f", {
    name: "foam", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "QF", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#3c76f5",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "quantum foam", // Name of prestige currency
    baseResource: "matter balls", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('f', 14)) mult = mult.mul(upgradeEffect('f', 14))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "f", description: "F: Reset for quantum foam", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Matter",
            description: "Start generating matter balls.",
            cost: new Decimal(1),
        },
        12: {
            title: "Fabric Boosting",
            description: "Quantum foam boosts matter balls.",
            cost: new Decimal(2),
            effect() {
                let eff = player.f.points.plus(1).pow(0.4)
                return eff
            },
            effectDisplay() {return format(tmp.f.upgrades[12].effect) + 'x'}
        },
        13: {
            title: "Synergistic Spacetime",
            description: "Matter balls boost themselves.",
            cost: new Decimal(5),
            effect() {
                let eff = player.points.plus(1).pow(0.15)
                if (hasUpgrade('f', 15)) eff = eff.mul(1.25)
                return eff
            },
            effectDisplay() {return format(tmp.f.upgrades[13].effect) + 'x'}
        },
        14: {
            title: "Teamwork",
            description: "Matter balls boost quantum foam.",
            cost: new Decimal(15),
            effect() {
                let eff = player.points.plus(1).pow(0.125)
                return eff
            },
            effectDisplay() {return format(tmp.f.upgrades[14].effect) + 'x'}
        },
        15: {
            title: "Upgraded Matter Production",
            description: "x3 matter balls and boost upgrade 3's effect.",
            cost: new Decimal(50),
            unlocked() {return hasUpgrade('f', 14)},
            tooltip() {return "x1.25 upgrade 3's effect."}
        },
        16: {
            title: "The (Quantum) Key",
            description: "Unlock Foam Milestones.",
            cost: new Decimal(100),
            unlocked() {return hasUpgrade('f', 15)}
        },
    },
    milestones: {
        1: {
            requirementDescription: "Get 150 quantum foam.",
            effectDescription: "Boost matter balls production by x2.",
            done() {return player.f.points.gte(150)}
        },
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "upgrades"
            ]
        },
        "Milestones": {
            unlocked() {return hasUpgrade('f', 16)},
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "milestones"
            ]
        }
    },
})
