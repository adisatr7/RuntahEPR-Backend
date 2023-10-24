import express from "express"
import cors from "cors"
import env from "./env.js"
import { initDB } from "./database/index.js";
import barangController from "./controllers/BarangController.js"


// Inisiasi database
initDB()

// Inisiasi express untuk server backend
const app = express()

// Gunakan middleware agar express dapat membaca body dari request
app.use(express.json())

// Gunakan middleware agar express dapat melakukan CORS
app.use(cors())

// Inisiasi route untuk barang
app.use(barangController)


app.listen(env.BACKEND_PORT, () => {
    console.log(`Backend server is running on port ${env.BACKEND_PORT}!`)
})
