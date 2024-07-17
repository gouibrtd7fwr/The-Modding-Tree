let modInfo = {
	name: "The Elements Tree",
	id: "dumbperson123",
	author: "me!!!",
	pointsName: "protons",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 2147483647,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.2.1",
	name: "Helium p2",
}

let changelog = `<h1>Changelog:</h1><br>
<h2>NOTE:</h2><br>
	<h3>Versions are in vA.B.C.D!</h3><br>
	<h3>A: Complete Rework, B: Major Rework/Massive Update, C: Normal Update, D: Patches/Bugfixes.</h3><br>
<h2>0.0.2.1:</h2><br>
	<h3>Added a challenge and 2 upgrades.</h3><br>
	<h3>Added achievements for QoL.</h3><br>
<h2>0.0.2:</h2><br>
	<h3>Added He layer and 2 upgrades.</h3><br>
	<h3>Added challenges.</h3><br>
<h2>0.0.1:</h2><br>
	<h3>Added H layer and 4 upgrades.</h3><br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (hasAchievement('a', 11)) gain = gain.times(1.5);
	if (hasUpgrade('h', 11)) gain = gain.times(2);
	if (hasUpgrade('h', 13)) gain = gain.times(upgradeEffect('h', 13));
	if (hasUpgrade('h', 15)) gain = gain.times(3);
	if (hasChallenge('he', 12)) gain = gain.pow(1.2);
	if (hasUpgrade('he', 14)) gain = gain.pow(1.001);
	return gain
	
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return hasUpgrade('he', 14)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(2453535335) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}