addLayer("f", {
    name: "foam", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "QF", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        time: new Decimal(0),
        timeSpeed: new Decimal(1),
        timeBoost: new Decimal(1)
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
        // -- mult
        // upgrades
        if (hasUpgrade('f', 14)) mult = mult.mul(upgradeEffect('f', 14))
        // passives
        mult = mult.mul(player.f.timeBoost)
        // -- exp
        if (hasUpgrade('f', 31)) mult = mult.pow(1.1)
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
    calculateTimeGain() {
        let gain = new Decimal(1)
        if (hasUpgrade('f', 23)) gain = gain.mul(upgradeEffect('f', 23))
        if (hasUpgrade('f', 32)) gain = gain.mul(1.5)
        if (hasMilestone('f', 3)) gain = gain.mul(1.2)
        return gain
    },
    update(delta) {
        if (hasUpgrade('f', 22)) {
            player.f.time = player.f.time.add(player.f.timeSpeed.mul(delta))
            player.f.timeBoost = player.f.time.add(1).pow(0.125)
            player.f.timeSpeed = this.calculateTimeGain()
        }
    },
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
                if (hasUpgrade('f', 21)) eff = eff.mul(1.3)
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
                if (hasUpgrade('f', 21)) eff = eff.mul(1.15)
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
                if (hasUpgrade('f', 21)) eff = eff.mul(1.1)
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
        21: {
            title: "Nitrous Boosting!",
            description: "Boost upgrade 2, 3, and 4's effect.",
            cost: new Decimal(500),
            unlocked() {return hasMilestone('f', 2)},
            tooltip() {return "x1.3 U2, x1.15 U3, x1.1 U4"}
        },
        22: {
            title: "Space, and now Time",
            description: "Unlock Time.",
            cost: new Decimal(1e3),
            unlocked() {return hasMilestone('f', 2)}
        },
        23: {
            title: "Speed Up",
            description: "Time is boosted by matter balls at a reduced rate.",
            cost: new Decimal(3e3),
            unlocked() {return hasMilestone('f', 3)},
            effect() {
                let eff = player.points.add(1).pow(0.075).mul(0.5).add(1)
                return eff
            },
            effectDisplay() {return format(tmp.f.upgrades[23].effect) + 'x'}
        },
        31: {
            title: "Exponents?",
            description: "Boost quantum foam by ^1.1.",
            cost: new Decimal(15),
            currencyDisplayName: "seconds of time",
            unlocked() {return hasUpgrade('f', 22)},

            canAfford(){return player.f.time.gte(15)},
			pay(){player.f.time = player.f.time.sub(15)}
        },
        32: {
            title: "More Matter",
            description: "x2.5 matter balls production.",
            cost: new Decimal(100),
            currencyDisplayName: "seconds of time",
            unlocked() {return hasMilestone('f', 3)},

            canAfford(){return player.f.time.gte(100)},
			pay(){player.f.time = player.f.time.sub(100)}
        },
        33: {
            title: "Another Time Traveler...",
            description: "x1.5 Time gain.",
            cost: new Decimal(250),
            currencyDisplayName: "seconds of time and 7,500 quantum foam",
            unlocked() {return hasUpgrade('f', 32)},

            canAfford(){return player.f.time.gte(250) && player.f.points.gte(7500)},
			pay() {
                player.f.time = player.f.time.sub(250)
                player.f.points = player.f.points.sub(7500)
            }
        },
    },
    milestones: {
        1: {
            requirementDescription: "Get 150 quantum foam.",
            effectDescription: "Boost matter balls production by x2.",
            done() {return player.f.points.gte(150)}
        },
        2: {
            requirementDescription: "Get 750 quantum foam.",
            effectDescription: "Unlock 2 more quantum upgrades.",
            done() {return player.f.points.gte(750)}
        },
        3: {
            requirementDescription: "Get 2,500 quantum foam and 100 seconds of time.",
            effectDescription: "Unlock 2 new upgrades and boost time gain by 1.2x.",
            done() {return player.f.points.gte(2500) && player.f.time.gte(100)}
        },
    },

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14], ["upgrade", 15], ["upgrade", 16]]],
                ["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23]]],
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
        },
        "Time": {
            unlocked() {return hasUpgrade('f', 22)},
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text",
                    function() {return 'You have gained ' + format(player.f.time) + ' seconds. This is boosting quantum foam by ' + format(player.f.timeBoost) + 'x'}
                ],
                ["display-text",
                    function() {return 'You are gaining ' + formatTime(player.f.timeSpeed) + '/second.'}
                ],
                ["row", [["upgrade", 31], ["upgrade", 32], ["upgrade", 33]]],
            ]
        },
    },
})
