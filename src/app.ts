import express from "express"
import routes from "./routes"

import { configDotenv } from "dotenv"
import type { EnvOutput } from "../shared"

const app = express()
const envConfig: EnvOutput = configDotenv() as EnvOutput

app.use(express.json())
app.use(express.urlencoded())

const PORT = envConfig.parsed?.PORT || (process.env.PORT as string) || 3000

app.all("*", function (req, res, next) {
	if (envConfig.parsed?.CORS || process.env.CORS)
		if (parseInt(envConfig.parsed?.CORS || process.env.CORS || "0") === 1) {
			res.setHeader("Access-Control-Allow-Credentials", "true")
			res.setHeader("Access-Control-Allow-Origin", "*") // 添加这一行代码，代理配置不成功
			res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
			res.header(
				"Access-Control-Allow-Headers",
				"Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since"
			)
		}
	next()
})

app.listen(PORT, async () => {
	console.log(`App is running at http://localhost:${PORT}`)

	routes(app)
})
