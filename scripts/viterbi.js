var Viterbi = function(gridData) {


	var data = [];
	var timeData = [];
	var inputs = [{"action": "RIGHT","observation": "N"},{"action": "RIGHT","observation": "N"},{"action": "DOWN","observation": "H"},{"action": "DOWN","observation": "H"}];
	var result;
	init();

	var getMLE = function(prior,action,observation) {
		var _data = [];

		for(var i = 0 ; i < prior.length ; i++) {
			for(var j = 0; j < prior[0].length ; j++) {

				if(!_data[i]){
					_data[i] = [];
				}
				_data[i][j] = {};
				_data[i][j].x = i;
				_data[i][j].y = j;

				_data[i][j].type = prior[i][j].type;
				_data[i][j].color = prior[i][j].color;

				_data[i][j].prob = 0;
				_data[i][j].prev = [];

			}
		}

		for(var i = 0 ; i < prior.length ; i++) {
			for(var j = 0; j < prior[0].length ; j++) {

				var nxtCell = getNextCellWithProb(action,i,j);

				for(var n in nxtCell) {
					var cell = nxtCell[n];
					_data[cell.x][cell.y].prob += prior[i][j].prob*cell.prob*getObservationProb(cell.x,cell.y,observation);
					_data[cell.x][cell.y].prev.push(prior[i][j]);
				}


			}
		}
		_data[cell.x][cell.y].prev.reverse();
		timeData.push(_data);
		return _data;

	}

	Viterbi.prototype.start = function() {
		var _data = data;
		//timeData.push(_data);
		for(var a in inputs) {
			normalize(_data);
			_data = getMLE(_data,inputs[a].action,inputs[a].observation); 
		}
		normalize(_data);
		timeData.push(_data);
		result = timeData;
		return timeData;
	}

	Viterbi.prototype.getMaxCell = function(cell) {
		//var _data = result[i];
		var retVal;
		var max = -1;
		for(var i in cell.prev) {
			
			if(cell.prev[i].prob > max) {
				max = cell.prev[i].prob;
				retVal = cell.prev[i];
			}
			
		}

		return retVal;
	}


	function init() {

		var totalSpots = 0;

		for(var i = 0 ; i < gridData.length ; i++) {
			for(var j = 0; j < gridData[0].length ; j++) {

				if(!data[i]){
					data[i] = [];
				}

				data[i][j] = {};
				data[i][j].x = i;
				data[i][j].y = j;

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

		//actual = getCellFromProbability(Math.random());


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

	function getNextCellWithProb(action,i,j) {
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
				jRet = j-1;
				break;
			case 'right':
				jRet = j+1;
				break;

		}

		if(iRet < 0 || jRet < 0 || iRet >= iLimit || jRet >= jLimit || data[iRet][jRet].type == "B") {

			return [{'x': i,'y': j, 'prob': 1}];
		}
		return [{'x': iRet,'y': jRet, 'prob': 0.9},{'x': i,'y': j, 'prob': 0.1}];
	}

	function getObservationProb(x,y,observation) {
		if(data[x][y].type == observation) {
			return 0.9;
		}
		else {
			return 0.05;
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

	function normalize(_data) {
		var tot = 0;
		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {
				tot += _data[i][j].prob;
			}
		}

		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {
				_data[i][j].prob = _data[i][j].prob/tot;
			}
		}

	}

}