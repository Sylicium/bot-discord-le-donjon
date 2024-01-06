
const { table } = require("console")
const fs = require("fs")

let config = {
    inputFilePath: "./backup1.log",
    databaseName: "donjon",
    tableName: "user", // users user_stats levels
}

let inputFileContent = fs.readFileSync(`${config.inputFilePath}`, "utf-8")

let t1 = JSON.parse(inputFileContent)

if(config.tableName == "user_stats") {
    // FIX XP -202402842424 :
    t1 = list.map(x => {
        let t = x
        t.xp = ( parseInt(x.level) * 10 + 110) *  parseInt(x.level) + 1 // CHECK AVEC events/functions/userStats.js ligne ~ 269
        t.level = parseInt(t.level) + 1
        return t
    })
    result = list.map(x => {
        return `INSERT INTO user_stats (user_id, xp, messages, minutesInVoice, adminGive, react, img, level, bonus) VALUES (${x.user_id},${x.xp},0,0, 0,0,0,${x.level}, ${x.bonus}) ON DUPLICATE KEY UPDATE user_id=user_id;`
    })
} else if(config.tableName == "users") {
    result = list.map(x => {
        return `INSERT INTO users (user_id, isMember, discord_username) VALUES (${x.user_id},${x.isMember ?? false},${x.discord_username}) ON DUPLICATE KEY UPDATE user_id=user_id;`
    })
} else if(config.tableName == "levels") {
    console.error("Not coded")
} else {
    console.error(`Invalid table name: ${config.tableName}`)
}



console.log(result.join("\n"))

/*
, // user_id
, // xp
0, // messages
0, // hoursInVoice
0, // adminGive
0, // react
0, // img
x.level, // level
x.bonus, // bonus
*/