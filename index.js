const tokens = require('prismarine-tokens')
const dns = require('dns')
const mc = require('minecraft-protocol')
const socks = require('socks').SocksClient
const ProxyAgent = require('proxy-agent')

const secret = require('./secret.json')

const proxy = {
	host: "localhost",
	port: 9050,
}

let options = {
	username: secret.username,
	password: secret.password,
	tokensLocation: './bot_tokens.json',
	tokensDebug: true,
	host: "2b2t.org",
	port: 25565,
	version: "1.12.2",
}

tokens.use(options, (err, options_session) => {
	if (err) return console.error(err)
	if (!options_session.session) {
		console.error('Account auth failed?', options_session)
		return
	}
	createBot(options_session)
})

function createBot(_botOptions) {
	const client = mc.createClient({
		connect: client => {
			// Try to resolve SRV records for the comain
			dns.resolveSrv('_minecraft._tcp.' + _botOptions.host, (err, addresses) => {
				// Error resolving domain
				if (err) {
					console.error('Could not resolve address', _botOptions.host)
					client.emit('error', 'Could not resolve address ' + _botOptions.host)
					return
				}
				// SRV Lookup resolved conrrectly
				if (addresses && addresses.length > 0) {
					console.info('Lookup success', addresses)
					_botOptions.host = addresses[0].name
					_botOptions.port = addresses[0].port
					socks.createConnection({
						proxy: {
							host: proxy.host,
							port: proxy.port,
							type: 5
						},
						command: 'connect',
						destination: {
							host: _botOptions.host,
							port: _botOptions.port
						}
					}, (err, info) => {
						if (err) {
							console.log(err)
							client.emit('error', err)
							return
						}
						console.log('Info', info)
						console.log('Socket', info.socket)
						if (!info.socket) return client.emti('error', 'No socket')
						client.setSocket(info.socket)
						client.emit('connect')
					})
				} else {
					// Otherwise, just connect using the provided hostname and port
					socks.createConnection({
						proxy: {
							host: proxy.host,
							port: proxy.port,
							type: 5
						},
						command: 'connect',
						destination: {
							host: _botOptions.host,
							port: _botOptions.port
						}
					}, (err, info) => {
						if (err) {
							console.log(err)
							client.emit('error', err)
							return
						}
						console.log('Info', info)
						console.log('Socket', info.socket)
						if (!info.socket) return client.emti('error', 'No socket')
						client.setSocket(info.socket)
						client.emit('connect')
					})
				}
			})
		},
		agent: new ProxyAgent({protocol: 'socks5:', host: proxy.host, port: proxy.port}),
		...options
	})

	client.on('connect', function () {
		console.info('connected')
	})
	client.on('disconnect', function (packet) {
		console.log('disconnected: ' + packet.reason)
	})
	client.on('end', function (reason) {
		console.log('Connection lost', reason)
	})
	client.on('chat', function (packet) {
		const jsonMsg = JSON.parse(packet.message)
		console.log(jsonMsg)
	})
}
