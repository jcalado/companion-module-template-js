const io = require('socket.io-client')

module.exports = function (self) {
	let config = self.config

	self.log('info','PORRA')

	if (!config.host) return self.log('error', 'Missing Destination IP in configuration.')
	if (!config.port) return self.log('error', 'Missing Port in configuration.')

	// close existing
	if (self.socket) {
		self.log('info', `Closing client!`)
		self.socket.close()
	}

	// create connection
	const url = `http://${config.host}:${config.port}`
	self.socket = io.connect(url, { reconnection: true })
	self.log('info', `Searching for WebSocket server at ${url}...`)

	// receiver
	addListeners(self)
	// sender
	self.send = (data) => {
		self.log('info', `Sending data: ${JSON.stringify(data)}`)
		self.socket.emit('data', JSON.stringify(data))
	}
}

function addListeners(self) {
	self.socket.on('connect', () => {
		self.log('info', 'Connected to 7CG!')
		// self.checkVariables();
	})
	self.socket.on('disconnect', () => self.log('error', 'Lost connection.'))
	self.socket.on('error', (err) => self.log('error', `Error message from server: ${err}`))

	// state change
	self.socket.on('data', (data) => {
		console.log('Data received:', data)
		// data = JSON.parse(data)

		// self.checkVariables();
		// self.checkFeedbacks();
	})
}