const fs = require("fs")

const backpupInputFile = "./backup_input.json"

// =======


class new_JSONBigInt {
    constructor() {}
    parse(json) {
      return this._forceParse(json)
    }
    stringify(json) {
      return this._forceStringify(json)
    }
    _replacer(key, value) {
      if (typeof value === 'bigint') {
        return {
          type: 'bigint',
          value: value.toString()
        };
      } else {
        return value;
      }
    }
    _reviver(key, value) {
      if (value && value.type == 'bigint') {
        return BigInt(value.value);  
      }
      return value;
    }
    _forceStringify(json) {
      return JSON.stringify(json, this._replacer);
    }
    _forceParse(json) {
      return JSON.parse(json, this._reviver);
    }
}

const JSONBigInt = new new_JSONBigInt()

const backupSQLFileOutput = "./backup_output.sql"
fs.writeFileSync(backupSQLFileOutput, "")
let backupJSON = JSONBigInt.parse(fs.readFileSync(backpupInputFile), "utf-8")


function appendLine(text) {
    fs.appendFileSync(backupSQLFileOutput, `${text}\n`)
}
appendLine("USE donjon;")

for(let user_i in backupJSON.users) {
    let user = backupJSON.users[user_i]
    appendLine(`INSERT INTO users (user_id, isMember, discord_username) VALUES ("${user.user_id}",${user.isMember ?? false},"${user.discord_username}") ON DUPLICATE KEY UPDATE user_id=user_id;`)
}
for(let user_stat_i in backupJSON.userstats) { // userstats in the JSON not user_stats
    let x = backupJSON.userstats[user_stat_i]
    appendLine(`INSERT INTO user_stats (user_id, xp, messages, minutesInVoice, adminGive, react, img, level, bonus) VALUES ("${x.user_id}",${(x.xp)},0,0, 0,0,0,${x.level}, ${x.bonus}) ON DUPLICATE KEY UPDATE user_id=user_id;`)
}

for(let user_level_i in backupJSON.levels) {
    // not coded
}

