 //HISTOGRAM FUNCTIONS****************************************************************************************  
		    // Display histogram from context c
		    function drawHistogram(c){

		    	var imgd = c.getImageData(0, 0, imgWidth, imgHeight);
		    	var pix = imgd.data;

		    	var histo = [];
	      		// Initializing array with 0 values
	      		for (var a = 0; a < 256; ++a){
	      			histo[a]= 0;
	      		}

	      		var maxValue = 0;
	      		for (var i = 0; i < pix.length; i += 4) {
	       			// console.log(pix[i+3]);
	       			histo[pix[i]]++;
	       			if(histo[pix[i]] > maxValue) maxValue = histo[pix[i]];

	       		}
	      		//console.log(histo);

			    // Draw bar background
			    var graphAreaHeight= 480;
			    var barWidth = 4, 
			    barHeight = 100;

				var heightHisto = 150;

			    // Green rectangle
			    ctx.beginPath();
			    ctx.lineWidth="4";
			    ctx.strokeStyle="black";


			    for (var a = 0; a < 256; ++a){
				    ctx.rect(a*barWidth, heightHisto +50 ,barWidth,   - (histo[a]/maxValue * heightHisto));

				}
			    ctx.stroke();
			    return histo;

			}

			function initializeHistogram(histogram, length){

				for (var a = 0; a < length; ++a){
					histogram[a]= 0;
				}
				return histogram
			}

			//****************************************************************************************************************************************************************************************************************************
		  	//Class Histogram-----------------------------------------------------------------
		  	function Histogram(x, y, width, height){
		    	this.x = x;		//Attributes -------------------------------------------------
		    	this.y = y;		//height
		    	this.height = height;
		    	this.width = width;
		    	this.objCount = 0;
		    	this.marge = 0;
		    	this.horiz = [];
		    	this.vertic = [];
		    	
		    	//Methods--------------------------------------------------------------------

		    	//Set horizontal histogram
		    	Histogram.prototype.setHorizontal = function(){
		      	// We get the image data
		      	var imgd = context.getImageData(this.x, this.y, this.width, this.height);
		      	var pix = imgd.data;

				// Initializing array with 0 values
				initializeHistogram(this.horiz, this.height);

				var maxValue = 0; // Nb of pixels of the color the most represented
				for (var i = 0; i < pix.length; i += 4) {

					var currentLine = Math.floor(i / (this.width * 4));
					if(pix[i] == 0 )
						this.horiz[currentLine]++;

				}
				//console.log(histo);  // Log histo in console

				// Draw bar background
				var graphAreaHeight= this.width;
				var barWidth = 1, 
				histoTopBarPositioninCanvas = 20,
				barHeight = 100;


				// Style parameters for the drawing
				var ctx = con ;
				ctx.beginPath();  // Get the drawing ready
				ctx.lineWidth="1";
				ctx.strokeStyle="black";

				// We clear the context in case a drawing existed before
				ctx.clearRect(0, 0, myCanvas3.width, myCanvas3.height);

				// For each histogram value (256 values representing grey level) draw rectangle (using [0-1] * height wanted)
				for (var a = 0; a < this.horiz.length; ++a){
					ctx.rect(0, a, this.horiz[a],1);	// - (histo[a]/maxValue * heightHisto));				
				}

				ctx.stroke();  // After all drawing instructions, call the stroke. Important!

			}

			//Set vertical histogram
			Histogram.prototype.setVertical = function(){
				var imgd = context.getImageData(this.x, this.y, this.width, this.height);
				var pix = imgd.data;

				// Initializing array with 0 values
				initializeHistogram(this.vertic, this.width);

					var maxValue = 0; // Nb of pixels of the color the most represented
					for (var i = 0; i < pix.length; i += 4) {
						var ij = getIJFromIndice(i, this.width, this.height);
						var currentCol = ij.i;
						if(pix[i] == 0 )
							this.vertic[currentCol]++;
					}
				//console.log(histo);  // Log histo in console


				// Draw bar background
				var graphAreaHeight= this.height;
				var barWidth = 1, 
				histoTopBarPositioninCanvas = 20,
				barHeight = 100;


				// Style parameters for the drawing
				var ctx = con2 ;
					ctx.beginPath();  // Get the drawing ready
					ctx.lineWidth="1";
					ctx.strokeStyle="black";

				// We clear the context in case a drawing existed before
				ctx.clearRect(0, 0, myCanvas3.width, myCanvas3.height);

				// For each histogram value (256 values representing grey level) draw rectangle (using [0-1] * height wanted)
				for (var a = 0; a < this.vertic.length; ++a){
						ctx.rect(0, a, this.vertic[a],1);// - (histo[a]/maxValue * heightHisto));				
					}

					ctx.stroke();  // After all drawing instructions, call the stroke. Important!
					
				}

				//Set both histogram
				Histogram.prototype.setBothHisto = function(){
					this.setHorizontal(this.x, this.y, this.width, this.height);
					this.setVertical(this.x, this.y, this.width, this.height);	
				}

		    	//Get the number of object we can detect from the horizontal histogram
		    	Histogram.prototype.getHorizObjNumb = function(){
		    		var objCountH = 0;
		    		var foundObj = false;
		    		
		    		for(var i = 0; i < this.horiz.length; i++){
		    			if(this.horiz[i] != 0 && !foundObj)
		    				foundObj = true;
		    			else if(this.horiz[i] == 0 && foundObj){
		    				foundObj = false;
		    				objCountH++;
		    			}
		    		}

		    		return objCountH;
		    	}

		    	//Get the number of object we can detect from the vertical histogram
		    	Histogram.prototype.getVerticObjNumb = function(){
		    		var objCountV = 0;
		    		var foundObj = false;

		    		for(i = 0; i < this.vertic.length; i++){
		    			if(this.vertic[i] != 0 && !foundObj)
		    				foundObj = true;
		    			else if(this.vertic[i] == 0 && foundObj){
		    				foundObj = false;
		    				objCountV++;
		    			}
		    		}
		    		return objCountV;
		    	}

		    	//true : horizontal ; false : vertical
		    	//Get the histogram to work with depending on the number of objects
		    	Histogram.prototype.getHistoToWork = function(){
		    		
		    		var objCountH = this.getHorizObjNumb();
		    		var objCountV = this.getVerticObjNumb();
		    		//alert("Vertical :"+objCountV +"; Horizontal :"+objCountH);

		    		if(objCountV <= 1 && objCountH >1){		
		    			this.objCount = objCountH;
		    			return true;
		    		}
		    		else if (objCountV > 1 && objCountH <= 1){
		    			this.objCount = objCountV;
		    			return false;
		    		}
		    		else if(objCountV > 1 && objCountH > 1){
		    			if(objCountV == 2){
		    				this.objCount = objCountV;
		    				return false
		    			}
		    			else if(objCountV == 2){
		    				this.objCount = objCountH;
		    				return true;
		    			}
		    			else if (objCountV > objCountH){
		    				this.objCount = objCountV;
		    				return false;
		    			}
		    			else{
		    				this.objCount = objCountH;
		    				return true;
		    			}
		    		}
		    		else{
		    			this.objCount = objCountH;
		    			return true;
		    		}

		    		
		    	}

		    	//Get the space beween two objects (marge); minSpace or maxSpace
		    	Histogram.prototype.getMarge = function (histo){
		    		var histog = histo;

		    		var a, b = 0;
		    		var maxSpace = 0;
		    		var minSpace =  1000000;
		    		var temp = 0;
		    		var foundObj = false;


		    		for(var i = 0; i < histog.length; i++){
		    			if(histog[i] != 0 && !foundObj){
		    				a = i;
		    				temp = (b == 0) ? 0 : a-b;
		    					//console.log("Distance", temp);
		    					maxSpace = (temp > maxSpace) ? temp : maxSpace;
		    					minSpace = (minSpace > temp) ? temp : minSpace;
		    					foundObj = true;

		    				}
		    				else if (histog[i] == 0 && foundObj){
		    					b = i;
		    					foundObj = false;
		    				}
		    			}

		    		if(maxSpace > 100)
		    			this.marge = minSpace;
		    		else
		    			this.marge = maxSpace;
		    	}
		    }

			//****************************************************************************************************************************************************************************************************************************

	        //HISTOGRAM METHOD TEST FUNCTION--------------------------------------------------------------------
	        function test(){
	        	var histo = new Histogram(0, 0, imgWidth, imgHeight);
	        	histo.setHorizontal();
	        	alert("HistoH :"+histo.horiz);
	        }
	        //--------------------------------------------------------------------------------------------------
	        //for button "Histogramme Horizontal"
	        function drawHistoHorizontal(){
	        	var histoH = new Histogram(0, 0, imgWidth, imgHeight);
	        	histoH.setHorizontal();
	        }

	        //for button "Histogramme Vertical"
	        function drawHistoVertical(){
	        	var histoV = new Histogram(0, 0, imgWidth, imgHeight);
	        	histoV.setVertical();
	        }