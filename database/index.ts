import Surreal from "surrealdb.js"
import env from "../env.js"


const db = new Surreal()

export async function initDB() {
    try {
        console.log("Initializing database...")

        // Validasi env
        if (!env.SURREAL_DB_USER || !env.SURREAL_DB_PASSWORD || !env.SURREAL_DB_HOST) {
            throw new Error("DB_USERNAME or DB_PASSWORD not set")
        }

        // Hubungkan ke database
        await db.connect(`${env.SURREAL_DB_HOST}/rpc`)

            // Jika berhasil
            .then(() => {
                console.log("Connected to database")
            })

            // JIka gagal
            .catch((err) => {
                throw new Error(`Error connecting to database: ${err}`)
            })

        // Login ke database
        await db.signin({ user: env.SURREAL_DB_USER, pass: env.SURREAL_DB_PASSWORD })

            // Jika berhasil
            .then((res) => {
                console.log("Signed in to database", res)
            })

            // Jika gagal
            .catch((err) => {
                throw new Error(`Error signing in to database: ${err}`)
            })

        await db.use({
            ns: "runtah",   // Nama namespace
            db: "runtah"    // Nama database
        })
    }

    // Jika terjadi error
    catch (err) {
        console.error(err)
    }
}

export default db