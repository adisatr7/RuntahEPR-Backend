import express from "express"
import cors from "cors"
import { initDB } from "./database/connection.js"


initDB()

const app = express()
const PORT = 8080

app.use(express.json())

app.use(cors())

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}!`)
})
