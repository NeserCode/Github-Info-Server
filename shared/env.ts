export interface EnvOutput {
	error?: Error
	parsed?: {
		GITHUB_AUTH?: string
		REQ_AUTH?: string
		PORT?: string
	}
}
