import { configDotenv } from "dotenv"
import { Express, Request, Response } from "express"
import { EnvOutput, UserRequestBody, RepoRequestBody } from "../../shared"

const envConfig: EnvOutput = configDotenv() as EnvOutput
const Github_AccessToken =
	envConfig.parsed?.GITHUB_AUTH || (process.env.GITHUB_AUTH as string) || null
const Request_AccessToken =
	envConfig.parsed?.REQ_AUTH || (process.env.REQ_AUTH as string) || null

function cors(res: Response) {
	if (envConfig.parsed?.CORS || process.env.CORS) {
		return parseInt(envConfig.parsed?.CORS || process.env.CORS || "0") === 1
			? res.setHeader("Access-Control-Allow-Origin", "*")
			: null
	}
}

function routes(app: Express) {
	app.get("/", (req: Request, res: Response) => {
		cors(res)
		return res.status(200).send("Thanks for using Github Info API.")
	})

	app.post("/user", (req: Request, res: Response) => {
		const AuthHeader = req.headers.authorization?.split(" ")[1] ?? null
		if (
			!AuthHeader ||
			!Github_AccessToken ||
			AuthHeader !== Request_AccessToken
		) {
			cors(res)
			return res.status(401).send("Unauthorized")
		}

		const params: UserRequestBody = req.body

		if (!params.username) {
			cors(res)
			return res.status(403).send("Missing parameters.")
		}

		fetch(`https://api.github.com/users/${params.username}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${Github_AccessToken}`,
			},
		})
			.then((githubRes) => githubRes.json())
			.then((data) => {
				cors(res)
				return res.status(200).send(data)
			})
			.catch((err) => {
				cors(res)
				return res.status(400).send(err)
			})
	})

	app.post("/repo", (req: Request, res: Response) => {
		const AuthHeader = req.headers.authorization?.split(" ")[1] ?? null
		if (
			!AuthHeader ||
			!Github_AccessToken ||
			AuthHeader !== Request_AccessToken
		) {
			cors(res)
			return res.status(401).send("Unauthorized")
		}

		const params: RepoRequestBody = req.body

		if (!params.username || !params.repo) {
			cors(res)
			return res.status(403).send("Missing parameters.")
		}

		fetch(`https://api.github.com/repos/${params.username}/${params.repo}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/vnd.github.v3+json",
				Authorization: `Bearer ${Github_AccessToken}`,
			},
		})
			.then((githubRes) => githubRes.json())
			.then((data) => {
				cors(res)
				return res.status(200).send(data)
			})
			.catch((err) => {
				cors(res)
				return res.status(400).send(err)
			})
	})
}

export default routes
