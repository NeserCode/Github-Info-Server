import express from "express"
import routes from "./routes"

import { configDotenv } from "dotenv"
import type { EnvOutput } from "../shared"

const app = express()
const envConfig: EnvOutput = configDotenv() as EnvOutput

app.use(express.json())
app.use(express.urlencoded())

const PORT = envConfig.parsed?.PORT || 3000

app.listen(PORT, async () => {
	console.log(`App is running at http://localhost:${PORT}`)

	routes(app)
})
