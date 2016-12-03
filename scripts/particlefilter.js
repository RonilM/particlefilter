var ParticleFilter = function(gridData,nParticles) {

	var data = [];
	var particles = [];
	var actual = {};
	init();

	ParticleFilter.prototype.nextIteration = function(action) {
		this.createSamples();
		this.transitionSamples(action);
		this.moveActual(action);
		this.weighSamplesUsingObservation();
		this.updateProbabilitiesUsingParticles();

	}	

	ParticleFilter.prototype.getData = function() {
		return data;
	}

	ParticleFilter.prototype.moveActual = function(action) {

		actual = getNextCell(action,actual.x,actual.y);
	}
	
	ParticleFilter.prototype.getActual = function() {
		return actual;
	}


	ParticleFilter.prototype.createSamples = function () {
		particles = [];
		for(var i = 0; i < nParticles ; i++) {
			var rand = Math.random();
			var particle = {};
			particle.cell = getCellFromProbability(rand);
			particles.push(particle);
		}

		//updateProbabilitiesUsingParticles();

	}

	ParticleFilter.prototype.transitionSamples = function (action) {
		for(var i = 0; i  < nParticles ; i++) {
			var particle = particles[i];
			var nxtCell = getNextCell(action,particle.cell.x,particle.cell.y);
			var rand = Math.random();
			if(rand < 0.9) {
				particle.cell = nxtCell;
			}
		}
	}	
	
	ParticleFilter.prototype.weighSamplesUsingObservation = function () {

		var observed = getActualObservation();
		for(var i = 0; i  < nParticles ; i++) {
			var particle = particles[i];
			var type = data[particle.cell.x][particle.cell.y].type;
			if(type == observed) {
				particle.weight = 0.9;
			}
			else {
				particle.weight = 0.05;	
			}
		}
	}

	ParticleFilter.prototype.updateProbabilitiesUsingParticles = function() {

		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {
				data[i][j].prob = 0;
			}
		}

		var totWeight = 0;
		for(var i = 0 ;  i  < particles.length ; i++) {
			totWeight += particles[i].weight;
		}

		for(var i = 0 ;  i  < particles.length ; i++) {
			var particle = particles[i];
			data[particle.cell.x][particle.cell.y].prob += particle.weight;
		}	

		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {
				data[i][j].prob = data[i][j].prob/totWeight;
			}
		}	

		updateProbabilityRanges(data);		

	}

	function init() {



		var totalSpots = 0;

		for(var i = 0 ; i < gridData.length ; i++) {
			for(var j = 0; j < gridData[0].length ; j++) {

				if(!data[i]){
					data[i] = [];
				}

				data[i][j] = {};

				data[i][j].type = getCellType(gridData[i][j]);
				data[i][j].color = getCellcolor(gridData[i][j]);
				data[i][j].prob = 0;
				if(gridData[i][j] != 'B'){
					totalSpots++;
				}

			}
		}

		for(var i = 0 ; i < gridData.length ; i++) {
			for(var j = 0; j < gridData[0].length ; j++) {
				if(gridData[i][j] != 'B')
					data[i][j].prob = 1/totalSpots;
			}
		}

		updateProbabilityRanges(data);

		actual = getCellFromProbability(Math.random());


	}



	function updateProbabilityRanges(data) {

		//var start = 0;
		var end = 0;

		for(var i = 0 ; i < gridData.length ; i++) {
			for(var j = 0; j < gridData[0].length ; j++) {

				data[i][j].probStart = end;
				data[i][j].probEnd = data[i][j].prob + end;
				end = data[i][j].probEnd;

			}
		}

	}


	function getCellType(str) {
		return str;
	}

	function getCellcolor(str) {

		switch(str) {
			case "H":
				return "00ff00";
			case "N":
				return "0000ff";
			case "T":
				return "ff0000";
			case "B":
				return "000000";
		}

		//return str;
	}

	function getCellFromProbability(probability) {
		//console.log("********");
		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0 ; j < data[0].length ; j++) {
				var start = data[i][j].probStart;
				var end  = data[i][j].probEnd;
				//console.log(start+","+end);
				if(start <= probability && end > probability && data[i][j].type != 'B') {
					return {'x': i, 'y': j};
				}
			}
		}

		return null;
	}

	function updateProbabilitiesUsingParticles() {

	}

	function getNextCell(action,i,j) {
		var iLimit = data.length;
		var jLimit = data[0].length;
		var iRet = i
			jRet = j;
		switch(action.toLowerCase()) {
			case 'up':
				iRet = i-1;
				break;
			case 'down':
				iRet = i+1;
				break;
			case 'left':
				jRet = i-1;
				break;
			case 'right':
				jRet = i+1;
				break;

		}
		//console.log(iRet+","+jRet);
		//console.log(iLimit+","+jLimit);
		if(iRet < 0 || jRet < 0 || iRet >= iLimit || jRet >= jLimit || data[iRet][jRet].type == "B") {

			return {'x': i,'y': j};
		}
		return {'x': iRet,'y': jRet};
	}

	function getActualObservation() {
		var actData = data[actual.x][actual.y];
		var rand = Math.random();
		var str = ["N","H","T"];
		var search_term = actData.type;
		for (var i=str.length-1; i>=0; i--) {
		    if (str[i] === search_term) {
		        str.splice(i, 1);
		        break;
		    }
		}

		if(rand < 0.9) {
			return actData.type;
		}
		else if (rand < 0.95) {
			return str[0];
		}
		else {
			return str[1];
		}

	}


}