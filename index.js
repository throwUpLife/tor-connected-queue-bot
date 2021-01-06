const Client = require('./lib/client')
const Authenticator = require('./lib/authAccounts')

let currentAccount

async function start() {
	currentAccount = Authenticator.nextAccount()
	let options = {
		username: currentAccount.username,
		password: currentAccount.password,
		tokensLocation: `./${currentAccount.username}_token.json`,
		tokensDebug: true,
		host: "2b2t.org",
		port: 25565,
		version: "1.12.2",
		proxy: {
			host: "localhost",
			port: 9050,
		}
	}

	let session_options = await Authenticator.authAccount(options)

	let client = new Client(session_options)
}
