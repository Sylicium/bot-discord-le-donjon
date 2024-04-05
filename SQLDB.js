
const SF = require("somefunctions")
const Mariadb = require('mariadb');

/**
 * @description Base de donnée SQL
 * @version 3.1.0
 * @date 03/04/2024
 * @author Sylicium
*/

/*
Dependancies:
- someFunctions (Code by Sylicium)
npm install mariadb
*/

let Temp_ = {
}


class Database {
    #__config
    #_Mariadb
    #_Pool
    #_initialized
    #_initializing
    #_waitForInit_maxRecursive
    #_waitForInit_waitDelayBetweenTests
    #_waitForInit_doThrowErrorWhenRecurseExceed
    #_cacheConn
    constructor(config) {
        this.#__config = {
            //host: "localhost",
            //port: null,
            //database: "databaseName",
            //user: "databaseUser",
            //password: "databasePassword",
            //connectionLimit: 100,
        }
        if( config.hasOwnProperty("host")            && config.host              != undefined   && typeof config.host               == 'string'                             )  { this.#__config.host              = config.host               } else { throw new Error(`Invalid data for 'host' key in given config. Expected 'string', got ${typeof config.host} (isNull:${config.host == null}).`) }
        if( config.hasOwnProperty("port")            && config.port              !== undefined  && (typeof config.port              == 'number') || (config.port == null)   )  { this.#__config.port              = config.port               } else { throw new Error(`Invalid data for 'port' key in given config. Expected 'number', got ${typeof config.port} (isNull:${config.port == null}).`) }
        if( config.hasOwnProperty("database")        && config.database          != undefined   && typeof config.database           == 'string'                             )  { this.#__config.database          = config.database           } else { throw new Error(`Invalid data for 'database' key in given config. Expected 'string', got ${typeof config.database} (isNull:${config.database == null}).`) }
        if( config.hasOwnProperty("user")            && config.user              != undefined   && typeof config.user               == 'string'                             )  { this.#__config.user              = config.user               } else { throw new Error(`Invalid data for 'user' key in given config. Expected 'string', got ${typeof config.user} (isNull:${config.user == null}).`) }
        if( config.hasOwnProperty("password")        && config.password          != undefined   && typeof config.password           == 'string'                             )  { this.#__config.password          = config.password           } else { throw new Error(`Invalid data for 'password' key in given config. Expected 'string', got ${typeof config.password} (isNull:${config.password == null}).`) }
        if( config.hasOwnProperty("connectionLimit") && config.connectionLimit   != undefined   && typeof config.connectionLimit    == 'number'                             )  { this.#__config.connectionLimit   = config.connectionLimit    } else { throw new Error(`Invalid data for 'connectionLimit' key in given config. Expected 'number', got ${typeof config.connectionLimit} (isNull:${config.connectionLimit == null}).`) }

        this.#_Mariadb = Mariadb
        this.#_Pool = null;
        this.#_initialized = false
        this.#_initializing = false
        this.#_waitForInit_maxRecursive = 1000 // Default 1000 | Maximum of retry before abandonning. 
        this.#_waitForInit_waitDelayBetweenTests = 10 // Default 10 | milliseconds
        this.#_waitForInit_doThrowErrorWhenRecurseExceed = true // Default true | If true, when __waitForInit__ is called and exceeds the maxrecursive value, function throws a new Error() instead of returning false.

        this.socket = new SF.Emitter()

        this.#_cacheConn = undefined

        /*
        TypeError: Cannot read properties of null (reading 'getConnection')
        -> ajouter __waitForInit__() car la base de donnée n'as pas encore chargée
        */

        this.socket.on("ready", (status, error) => {
            if(error) throw error
            if(!status) return console.log("[SQLDB][i] ready status not ok.")
            console.log("[SQLDB][i] Database loaded.")
        })
    }

    async _makeQuery(query, params) {
        let waitInit = await this.__waitForInit__()
        if(!waitInit) return [];
        let conn;
        let queryResponse = undefined
        // logger.debug("this._Pool:",this._Pool)
        conn = await this.#_Pool.getConnection();
        try {

            /*if(this.#_cacheConn == undefined) {
                this.#_cacheConn = await this.#_Pool.getConnection();
            }
            conn = this.#_cacheConn*/
            
            let queryRes = await conn.query(query, params)

            queryResponse = queryRes
            //conn.end()
            //conn.release()
            return queryResponse
        } catch (err) {
            console.log("SQLDB error",err)
            //conn.end()    
            throw err;
        } finally {
            conn.release()
        }
    }

    async __init__() {
        if(this.#_initialized) throw new Error(`[SQLDB][w] Cannot init Database again. Database has already been initialized.`)
        if(this.#_initializing) throw new Error(`[SQLDB][w] Cannot init Database. Database is currently initializing.`)
        this.#_initializing = true
        try {
            /*{
                host: config.database.host, 
                user: config.database.user,
                port: config.database.port,
                password: config.database.password,
                database: config.database.database,
                connectionLimit: config.database.connectionLimit
            }*/
            let payload = {}
            if(this.#__config.host != null) payload.host = this.#__config.host; 
            if(this.#__config.port != null) payload.port = this.#__config.port; 
            if(this.#__config.user != null) payload.user = this.#__config.user; 
            if(this.#__config.password != null) payload.password = this.#__config.password; 
            if(this.#__config.database != null) payload.database = this.#__config.database; 
            if(this.#__config.connectionLimit != null) payload.connectionLimit = this.#__config.connectionLimit;
            const pool = await this.#_Mariadb.createPool(payload)
            this.#_Pool = await pool
            this.#_initialized = true
            this.#_initializing = false
    
            this.socket.emit('ready', (
                true
            ))
        } catch(e) {
            console.log(e)
            this.#_initializing = false
            this.socket.emit('ready', (
                false,
                e
            ))
        }
        //console.log("init this._Pool2:",this._Pool)
    }

    async __waitForInit__() {
        let c = 0;
        if(this.#_initialized) {
            return true
        } else {
            c++
            if(c > this.#_waitForInit_maxRecursive) {
                if(this.#_waitForInit_doThrowErrorWhenRecurseExceed) { throw new Error(`[SQLDB][!] Error thrown due to retry time and amount exeeding set values in config.`) }
                else { return false }
            }
            await SF.sleep(this.#_waitForInit_waitDelayBetweenTests);
            return this.__waitForInit__()
        }
    }

    __get__() { return this }

}

/**
 * @name createDB - Creates a database connection
 * @param  {Object} - Config of database connection. Example:
 * @example {
 *      host: "localhost",
        port: null,
        database: "databaseName",
        user: "databaseUser",
        password: "databasePassword",
        connectionLimit: 100,
 * }
 * @returns 
 */
async function createDB(config, autoInit) {
    /*
    config:
        host: "localhost",
        port: null,
        database: "databaseName",
        user: "databaseUser",
        password: "databasePassword",
        connectionLimit: 100,
    autoInit: boolean
    */
    let _db = new Database(config)
    if(autoInit === true) {
        await _db.__init__()
    }
    return _db
}

module.exports = createDB
