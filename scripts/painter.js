var Painter = function(canvasID) {

	var xmlns = "http://www.w3.org/2000/svg";

	Painter.prototype.drawCanvas = function(data,cellWidth,cellHeight) {

		var canvasWidth = data[0].length*cellWidth;
		var canvasHeight = data.length*cellHeight;

		var canvas = document.getElementById(canvasID);
		canvas.innerHTML = "";
		canvas.style.width = canvasWidth*2;
		canvas.style.height = canvasHeight*2;

		var svg = document.createElementNS(xmlns,'svg');
		svg.setAttribute("id",'painter-svg');
		svg.setAttribute("width",canvasWidth*2);
		svg.setAttribute("height", canvasHeight*2);
		canvas.appendChild(svg);
		

		for(var i = 0 ; i < data.length ; i++) {
			for(var j = 0; j < data[0].length ; j++) {

				var y = i*cellHeight;
				var x = j*cellWidth;

				var grp = document.createElementNS(xmlns,'g');
				var text = document.createElementNS(xmlns,'text');
				text.textContent = Math.round(data[i][j].prob*10000)/10000;
				text.setAttributeNS(null, 'x', x+5.5);
				text.setAttributeNS(null, 'y', y+24);
		        text.setAttributeNS(null, 'width', cellWidth/3);
		        text.setAttributeNS(null, 'height', cellHeight/3);
		        text.setAttributeNS(null, 'font-size', '12px');

				var rect = document.createElementNS(xmlns,'rect');
				
				rect.setAttributeNS(null, 'x', x);
				rect.setAttributeNS(null, 'y', y);
		        rect.setAttributeNS(null, 'width', cellWidth);
		        rect.setAttributeNS(null, 'height', cellHeight);
		        rect.setAttributeNS(null, 'style', 'fill:#'+data[i][j].color+';stroke-width:1;stroke:#CCC');
		        //rect.innerHTML = data[i][j].prob;
		        grp.appendChild(rect);
		        grp.appendChild(text);
		        svg.appendChild(grp);

			}
		}

	}


}