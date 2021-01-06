const dns = require('dns')
const mc = require('minecraft-protocol')
const socks = require('socks').SocksClient
const ProxyAgent = require('proxy-agent')
const Event = require('events')

module.exports = class extends Event{
	constructor(_botOptions) {
		super();
		this.client = mc.createClient({
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
								host: _botOptions.proxy.host,
								port: _botOptions.proxy.port,
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
								host: _botOptions.proxy.host,
								port: _botOptions.proxy.port,
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
			agent: new ProxyAgent({protocol: 'socks5:', host: _botOptions.proxy.host, port: _botOptions.proxy.port}),
			..._botOptions
		})

		this.client.on('connect', function () {
			console.log(_botOptions.username + ' connected')
			// this.emit('connect')
		})
		this.client.on('disconnect', function (packet) {
			console.log(_botOptions.username + ' disconnected: ' + packet.reason)
		})
		this.client.on('end', function (reason) {
			console.log(_botOptions.username + ' Connection lost', reason)
			// this.emit('end')
		})
		this.client.on('chat', function (packet) {
			const jsonMsg = JSON.parse(packet.message)
			if (jsonMsg.extra && jsonMsg.extra.length > 0) {
				console.log(_botOptions.username + ' Position in queue: ', jsonMsg.extra[1].text)
			} else {
				if (jsonMsg.text && jsonMsg.text.length > 0) {
					console.log(_botOptions.username + 'Chat: ' + jsonMsg.text)
				}
			}
		})
	}
}
