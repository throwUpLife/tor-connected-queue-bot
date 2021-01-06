const tokens = require('prismarine-tokens')
const fs = require('fs')

const credentials = '../data/credentials.txt'
const tokensLocation = '../data/tokens/'
const tokensDebug = true
const accounts = fs.readFileSync(credentials, 'utf8').split('\n')
let currentAccountCounter = 0
let currentAccount = nextAccount()

async function main() {
	for (const i in accounts) {
		const [username, password] = accounts[i].split(':')
		try {
			let options = await use({
				username,
				password,
				tokensLocation,
				tokensDebug
			})
			if (options.session && options.session.accessToken) {
				console.log('Account valid ' + username)
			} else {
				console.log('Account invalid ' + username)
			}
		} catch (e) {
			console.log('Account invalid ' + username)
		}
	}
}

function newProxy() {
	// TODO implement
}

function nextAccount() {
	if (currentAccountCounter === accounts.length) {
		console.log('No Accounts left')
		return null
	}
	const acc = accounts[currentAccountCounter]
	currentAccountCounter += 1
	return {
		username: acc.split(':')[0],
		password: acc.split(':')[1]
	}
}

function use(options) {
	return new Promise((resolve, reject) => {
		// TODO this should be using a proxy
		tokens.use(options).then((err, option_session) => {
			if (err) {
				reject(err)
				return
			}
			resolve(option_session)
		})
	})
}

module.exports = {
	authAccount: use,
	nextAccount,
	currentAccount
}

