import express from "express"
import cors from "cors"
import * as dotenv from "dotenv"
import { initDB } from "./database/index.js";
import barangController from "./controllers/BarangController.js"


// Inisiasi env
dotenv.config()

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


app.listen(process.env.BACKEND_PORT, () => {
    console.log(`Backend server is running on port ${process.env.BACKEND_PORT}!`)
})
