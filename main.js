var submodules = [
	require('./modules/kemper.js')
]

module.exports = {
	
	init: function() {
		
		for (var m of submodules) {
			m.init()
		}

	},	
	
	oscOutFilter: function(data) {
		for (var m of submodules) {
			data = m.oscOutFilter(data)
			if(!data) return
		}
	},

	oscInFilter: function(data) {
		for (var m of submodules) {
			data = m.oscInFilter(data)
			if(!data) return
		}
	}, 

}
