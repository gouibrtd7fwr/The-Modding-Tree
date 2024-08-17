addLayer("a", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
    }},
    color: "yellow",
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tooltip() {
        return ("Achievements")
    },
    tabFormat: {
        "Achievements": {
            content: [
                ["achievements", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]],
                "blank",
                ],
        },
    },
    achievements: {
        rows: 18,
        cols: 6,
        11: {
            name: "Thousandaire",
            done() { return (player.points.gte(new Decimal(1e3))) },
            tooltip: "Get 1K Cash.",
        },
        12: {
            name: "Rebirth!",
            done() { return (player.reb.points.gte(new Decimal(1))) },
            tooltip: "Rebirth.",
        },
    },
    tabFormat: [
        "blank", 
        ["display-text", function() { return "Achievements: "+player.a.achievements.length+"/"+(Object.keys(tmp.a.achievements).length-2) }], 
        "blank", "blank",
        "achievements",
    ],
})
addLayer("multi", {
    name: "multiplier", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ec1313",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "multiplier", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let exp = new Decimal(0.5)
        if (hasUpgrade('multi', 13)) exp = exp.sub(0.015)
        return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('multi', 11)) mult = mult.times(2);
        mult = mult.times(tmp.reb.effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    effect() {
        let eff = player.multi.points
        if (hasUpgrade('multi', 12)) eff = eff.pow(1.035);
        if (hasUpgrade('reb', 11)) eff = eff.pow(1.0125);
        return eff;
    },
    upgrades: {
        11: {
            title: "Doubling",
            description: "x2 Multiplier and Cash.",
            cost: new Decimal(5)
        },
        12: {
            title: "Buffelicous",
            description: "Boost multiplier effect.",
            cost: new Decimal(30)
        },
        13: {
            title: "Be Cheap",
            description: "Make multiplier cheaper.",
            cost: new Decimal(100)
        },
        14: {
            title: "Rebirths",
            description: "Unlock rebirths!.",
            cost: new Decimal(150)
        },
    },
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                    function() {return "Multiplier Effect: " + format(tmp.multi.effect) + "x Cash"},
                        {}],
                "blank",
                "upgrades",
                ],
        },
    },
})
addLayer("reb", {
    name: "rebirths", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#48b6e5",
    requires: new Decimal(250), // Can be a function that takes requirement increases into account
    resource: "rebirths", // Name of prestige currency
    baseResource: "multiplier", // Name of resource prestige is based on
    baseAmount() {return player.multi.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        let exp = new Decimal(0.4)
        return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    unlocked() {return (hasUpgrade('m', 14))},
    branches: ['multi'],
    effect() {
        let eff = player.reb.points.mul(2).add(1)
        if (hasUpgrade('reb', 11)) eff = eff.pow(1.05);
        return eff;
    },
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display",
                "prestige-button",
                ["display-text",
                    function() {return "Rebirths Effect: " + format(tmp.reb.effect) + "x Multi"},
                        {}],
                "blank",
                "upgrades",
                ],
        },
    },
    upgrades: {
        11: {
            title: "Multiplying and multiplying",
            description: "Boost Multi and Rebirth effect.",
            cost: new Decimal(3)
        },
    },
})