
const somef = require("./someFunctions")
const Mariadb = require('mariadb');

/**
 * @description Base de donnée SQL
 * @version 1.1.0
 * @date 09/08/2023
 * @author Sylicium
*/


let Temp_ = {
}


class Database {
    constructor() {
        this._Mariadb = Mariadb
        this._Pool = null;
        this._initialized = false

        this.socket = new somef.Emitter()

        this._cacheConn = undefined

        /*
        TypeError: Cannot read properties of null (reading 'getConnection')
        -> ajouter __waitForInit__() car la base de donnée n'as pas encore chargée
        */
    }

    async _makeQuery(query, params) {
        await this.__waitForInit__()
        let conn;
        let queryResponse = undefined
        // logger.debug("this._Pool:",this._Pool)
        try {

            if(this._cacheConn == undefined) {
                this._cacheConn = await this._Pool.getConnection();
            }
            let conn = this._cacheConn
            

            let queryRes = await conn.query(query, params)

            queryResponse = queryRes
        } catch (err) {
            console.log("error",err)
            throw err;
        } finally {
            if (conn) conn.release()
            return queryResponse
        }
    }

    async __init__() {
        try {
            const pool = await this._Mariadb.createPool({
                host: 'localhost', 
                user:'bot',
                password: 'ledonjon',
                database: 'donjon',
                connectionLimit: 100
            })
            this._Pool = await pool
            this._initialized = true
    
            this.socket.emit('ready', (
                true
            ))
        } catch(e) {
            console.log(e)
            this.socket.emit('ready', (
                false,
                e
            ))
            console.log(e)
        }
        console.log("init this._Pool2:",this._Pool)
    }

    async __waitForInit__() {
        if(this._initialized) {
            return true
        } else {
            await somef.sleep(10);
            return this.__waitForInit__()
        }
    }

    __get__() { return this }

    async initUser(member) {
        await this._makeQuery(`INSERT INTO users (user_id, isMember, discord_username) VALUES(?,?,?) ON DUPLICATE KEY UPDATE    
      isMember=?
      `, [
        member.id, // user_id
        true, // isMember
        member?.user?.username ?? ( member.username ?? "<erreur>"), // discord_username
        true, // isMember ON DUPLICATE KEY UPDATE
      ])
      await this._makeQuery(`INSERT INTO user_stats (user_id, xp, messages, minutesInVoice, adminGive, react, img, level, bonus) VALUES (?,?,?,?, ?,?,?,?, ?) ON DUPLICATE KEY UPDATE user_id=user_id`, [
        member.id, // user_id
        0, // xp
        0, // messages
        0, // hoursInVoice

        0, // adminGive
        0, // react
        0, // img
        0, // level

        0, // bonus
      ])

    }

    /**
     * f(): Récupère toutes les statistiques d'un utilisateur donnée sur une guilde
     * @param {*} user_id - Identifiant de l'utilisateur
     * @returns Object
     */
    async getUserDatas(user_id) {
        let user_datas_temp = await this._makeQuery(`SELECT * FROM user_stats
        WHERE
          user_id=?`, [
            user_id
        ])
      
        return (user_datas_temp.length == 0 ? null : user_datas_temp[0])
    }

    async getUser(user_id) {
        let user_datas_temp = await this._makeQuery(`SELECT * FROM users
        WHERE user_id=?`, [
            user_id
        ])
        return (user_datas_temp.length == 0 ? null : user_datas_temp[0])
    }


}

let Database_ = new Database()

module.exports = Database_

Database_.__init__()


Database_.socket.on("ready", (status, error) => {
    if(error) throw error
    if(!status) return console.log("ready status not ok.")
    console.log("Database loaded.")
})