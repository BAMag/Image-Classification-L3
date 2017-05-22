//SEGMENTATION FUNCTIONS***********************************************************************************
			//xS = x start, xE = x end, yS = y start, yE = y end
		    //Draw a rectangle
		    function drawRect(x1, x2, y1, y2, texte){
		    	console.log("Draw xS = ",x1 ," xE = ",x2 ," yS = ",y1 ," yS =  ", y2);

		    	context.lineWidth = '5';

		    	context.strokeStyle = (texte) ? 'red' : 'blue';

		    	context.beginPath();
		    	context.moveTo(x1, y1);

		    	context.lineTo(x1, y2);
		    	context.lineTo(x2, y2);
		    	context.lineTo(x2, y1);
		    	context.lineTo(x1, y1);

		    	//CLASSIFICATION //TODO

		    	context.stroke();	
		    };

		    //Global segmentation
		    function segmentation(xS, xE, yS, yE){
		    	//console.log("Entree segmentation xS = ", xS," xE = ", xE," yS = ", yS," yE = ",yE);
		    	
		    	var texte = false;		//true -> object == text ; false -> object == image
		    	var foundObj = false;

		    	//init histograms------------------------------
		    	var histo = new Histogram(xS, yS, xE-xS, yE-yS);

		    	histo.setBothHisto();
		    	histo.getHistoToWork();
		    	//---------------------------------------------

		    	if(histo.objCount <= 1){		//One object

		    		drawRect(xS, xE, yS, yE, texte);
		    		return;

		    	}else if(histo.getHistoToWork()){	//Horizontal

		    		histo.getMarge(histo.horiz);
		    		console.log("Marge horizontale = ", histo.marge);
		    		var y1 = 0
		    		var y2 = 0;
		    		var temp = 0;

		    		for(var i = 0; i < histo.horiz.length; i++){

		    			if(histo.horiz[i] != 0 && !foundObj){	//found an object
		    				foundObj = true;
		    				y1 = i;
		    				temp = i;
		    			}
		    			else if(histo.horiz[i] == 0 && foundObj){	//end object
		    				y2 = i;
		    				foundObj = false;

		    				if(y2-temp > 70 || histo.marge == 0){	//size object too big to be a text
		    					segmentationLocVert(xS, xE, y1, y2, texte);
		    				}
		    				//if there's another object near with a distance marge
		    				else if(i + histo.marge + 5 < histo.horiz.length){

		    					var j = i;
		    					//Check if there's any object near with a distance = marge
		    					while(j < i + histo.marge + 5 && !foundObj){
		    						if(histo.horiz[j] != 0){	//found an object
		    							histo.marge = j - i;
		    							//console.log("	New marge = ", histo.marge);
		    							i = j;
		    							temp = i;
		    							foundObj = true;
		    							texte = true;
		    						}	//go to next iteration
		    						else
		    							j++;
		    					}

			    				if(!foundObj){					//objec not found
			    					y2 -= 1;
		    						segmentationLocVert(xS, xE, y1, y2, texte);
		    					}	
		    				}
		    				else{
		    					y2-=1;
		    					foundObj = false;
		    					//console.log("y1 =", y1, " y2 =", y2);

		    					segmentationLocVert(xS, xE, y1, y2, texte);
		    				}
		    			}
		    		}
		    	}else {		//Vertical
		    		histo.getMarge(histo.vertic);
		    		console.log("Marge verticale = ", histo.marge);

		    		var x1 = 0;
		    		var x2 = 0;
		    		var temp = 0;

		    		//console.log("histoHorizLoc :", histoHoriz);

		    		for(var i = 0; i < histo.vertic.length; i++){
		    			
		    			if(histo.vertic[i] != 0 && !foundObj){	//if we found an object
		    				x1 = i;								//get the x1 coordinate
		    				temp = i;
		    				foundObj = true;
		    				//console.log("x1=", x1);
		    			}
		    			else if(histo.vertic[i] == 0 && foundObj){	//if void
		    				x2 = i;							//get the x2 coordinate		
		    				foundObj = false;

		 	   				if(histo.marge == 0){	//No marge => one object

		    					//console.log("x2=", x2);
		    					segmentationLocHoriz(xS, xE, yS, yE, texte);
		    				}
			    			//Multiple objects
			    			else if(i + histo.marge + 5< histo.vertic.length){

			    				var j = i;
			    				//Check if there's any object near with a distance = marge
			    				while(j < i + histo.marge && !foundObj){
			    					if(histo.vertic[j] != 0){
			    						histo.marge = j - i;
			    						i = j;
			    						temp = i;
			    						foundObj = true;
			    						texte = true;
			    					}
			    					else
			    						j++;
			    				}

			    				if(!foundObj){
			    					x2 = i-1;
		    						//console.log("x2=", x2);
		    						segmentationLocHoriz(x1, x2, yS, yE, texte);
		    					}	
		    				}
		    				else{
		    					x2 = i-1;
		    					//console.log("x2=", x2);
		    					segmentationLocHoriz(x1, x2, yS, yE, texte);
		    				}		
		    			}

		    		}
		    	}
		    	console.log("Sortie segmentation");
		    };

		    //Local segmentation (Vertical)
		    function segmentationLocVert(xS, xE, yS, yE, texte){
		    	//console.log("Entree segmentation verticale xS = ", xS," xE = ", xE," yS = ", yS," yE = ",yE);

		    	var foundObj = false;
		    	var histo = new Histogram(xS, yS, xE-xS, yE-yS);
		    	histo.setVertical();
		    	histo.getMarge(histo.vertic);

		    	//console.log("Marge verticale locale = ", histo.marge);

		    	var x1 = 0;
		    	var x2 = 0;
		    	
		    	if(histo.marge == 0)	//One object
		    	{
		    		for(var i = 0; i < histo.vertic.length; i++)	//in order to get xS and xE coordinates
		    		{

		    			if(histo.vertic[i] != 0 && !foundObj)
		    			{	//if we found an object
		    				x1 = i;							//get the x1 coordinate
		    				foundObj = true;
		   	 				//console.log("x1=", x1);
		   	 			}
		    			else if(histo.vertic[i] == 0 && foundObj)
		    			{	//if void
		   					x2 = i;							//get the x2 coordinate		
		   					foundObj = false;
		   					if(!texte)
		   						drawRect(x1, x2, yS, yE, texte);
		   					else drawRect(x1, x2, yS, yE, !texte);		
		   				}
		   			}
		   			return;
		   		}
		   		else
		   		{
		   			for(var i = 0; i < histo.vertic.length; i++)
		   			{

		    			if(histo.vertic[i] != 0 && !foundObj)
		    			{	//if we found an object
		    				x1 = i;							//get the x1 coordinate
		  	  				foundObj = true;
		    				//console.log("x1=", x1);
		    			}
		    			else if(histo.vertic[i] == 0 && foundObj)
		    			{	//if void
		   					x2 = i;							//get the x2 coordinate		
		   					foundObj = false;
			   				//Multiple objects
			   				if(i + histo.marge + 5 < histo.vertic.length)
			   				{
			   					var j = i;
			    				//Check if there's any object near with a distance = marge
				    			while(j < i + histo.marge + 5 && !foundObj)
			    				{
			    					if(histo.vertic[j] != 0)
			    					{
			    						i = j;
			    						foundObj = true;
			    						texte = true;
				    				}	//go to next iteration
				    				else
				    					j++;
				    			}

				    			if(!foundObj)
				    			{
			    					x2 = i;

		    						//console.log("x2=", x2);
		    						//segmentationLocHoriz(x1, x2, yS, yE);
		    						drawRect(x1, x2, yS, yE, texte);
		    					}	
		    				}
		    				else
		    				{
			   					var j = i;
			    				//Check if there's any object near with a distance = marge
				    			while(j < histo.vertic.length && !foundObj)
			    				{
			    					if(histo.vertic[j] != 0)
			    					{
			    						i = j;
			    						foundObj = true;
			    						texte = true;
				    				}	//go to next iteration
				    				else
				    					j++;
				    			}

				    			if(!foundObj)
				    			{
			    					x2 = i;

		    						//console.log("x2=", x2);
		    						//segmentationLocHoriz(x1, x2, yS, yE);
		    						drawRect(x1, x2, yS, yE, texte);
		    					}    				
		    				}		
		    			}
		    		}
		   		}

			};

			//Local segmentation (Horizontal)
			function segmentationLocHoriz(xS, xE, yS, yE, texte){
				console.log("Entree segmentation horiz xS = ", xS," xE = ", xE," yS = ", yS," yE = ",yE);

				var foundObj = false;

				var histo = new Histogram(xS, yS, xE-xS, yE-yS);
				histo.setHorizontal();
				histo.getMarge(histo.horiz);

				console.log("Marge horizontale locale = ", histo.marge);

				var y1 = 0;
				var y2 = 0;

				if(histo.marge == 0){		//One Object
					for(var i = 0; i < histo.horiz.length; i++){

		    			if(histo.horiz[i] != 0 && !foundObj){	//if we found an object
		   					y1 = i;							//get the x1 coordinate
		   					foundObj = true;
		   	 				//console.log("x1=", x1);
		   	 			}	
		    			else if(histo.horiz[i] == 0 && foundObj){	//if void
		   					y2 = i;							//get the x2 coordinate		
		   					drawRect(xS, xE, y1, y2, !texte);
		   					foundObj = false;
		   				}
		   			}
		   			return;
		   		}
		   		else{

		   			for(var i = 0; i < histo.horiz.length; ++i){

		    			if(histo.horiz[i] != 0 && !foundObj){	//found an object
		    				foundObj = true;
		    				y1 = i;
		    				
		    			}
		    			else if(histo.horiz[i] == 0 && foundObj){	//end object
		    				y2 = i;
		    				foundObj = false;

		    				if(i + histo.marge + 5 < histo.horiz.length){

		    					var j = i;
		    					//Check if there's any object near with a distance = marge
		    					while(j < i + histo.marge + 5 && !foundObj){
		    						if(histo.horiz[j] != 0){	//found an object
		    							i = j;
		    							foundObj = true;
		    							texte = true;		
		    						}			//go to next iteration
		    						else
		    							j++;
		    					}

			    				if(!foundObj){					//objec not found
			    					y2 = i;
		    						drawRect(xS, xE, y1, y2, texte);
		    					}	
		    				}
		    				else{
		    					var j = i;
		    					//Check if there's any object near with a distance = marge
		    					while(j < histo.horiz.length && !foundObj){
		    						if(histo.horiz[j] != 0){	//found an object
		    							i = j;
		    							foundObj = true;
		    							texte = true;		
		    						}			//go to next iteration
		    						else
		    							j++;
		    					}

			    				if(!foundObj){					//objec not found
			    					y2 = i;
		    						drawRect(xS, xE, y1, y2, texte);
		    					}
		    				}
		    			}
		    		}
		    	}	
		    }