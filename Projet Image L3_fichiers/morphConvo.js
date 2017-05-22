 //MORPH TRANSFORM & CONVOLUTION FUNCTIONS*************************************************************************
	        function sortNumber(a,b) {
	        	return a - b;
	        }

	        function makeMedianAt(i,pix,matConv){

	            //var outValue = 0;
	            var ij = getIJFromIndice(i, imgWidth, imgHeight);
	            var arrayMatValue = [];

	            for(var x = 0; x< matConv.length; ++x){
	            	var line = matConv[x];
	            	for(var y = 0; y< line.length; ++y){

	            		var currentI = ij.i - Math.floor(line.length  /2)  + y ;
	            		var currentJ = ij.j - Math.floor(matConv.length /2) + x ;

	            		if(currentI>=0 && currentJ>=0 && currentI < imgWidth && currentJ < imgHeight){

	            			var currentValue = getPixelValueFAST(currentI, currentJ, pix)[0];
	            			arrayMatValue.push(currentValue); 
	            		}

	            	}
	            }

	            arrayMatValue.sort(sortNumber); 
	            return arrayMatValue[Math.floor(arrayMatValue.length/2)];
	        };


	        function makeConvolutionAt(i,pix,matConv){

	        	var outValue = 0;
	        	var ij = getIJFromIndice(i, imgWidth, imgHeight);
	        	for(var x = 0; x< matConv.length; ++x){
	        		var line = matConv[x];
	        		for(var y = 0; y< line.length; ++y){

	        			var currentI = ij.i - Math.floor(line.length /2)  + y ;
	        			var currentJ = ij.j - Math.floor(matConv.length /2) + x ;

	        			if(currentI>=0 && currentJ>=0 && currentI < imgWidth && currentJ < imgHeight){

	        				var currentValue = getPixelValueFAST(currentI, currentJ, pix)[0];
	        				outValue += matConv[x][y] * currentValue;	
	        			}

	        		}
	        	}

	        	return outValue;
	        };


	        function applyConvolution(filterName){

	        	switch(filterName){
	        		case 'Med': 
	        		var m = context.getImageData(0, 0, imgWidth, imgHeight);
	                  	var pix2 = []; // New image after effect
	                  	for (var i = 0; i < _pix.length; i += 4) {
	                  		var convolutionedValue = makeMedianAt(i,_pix,matriceMed);
	                  		pix2.push(convolutionedValue,convolutionedValue,convolutionedValue,255); 
	                  	}
	                  	m.data.set(pix2);
	                context.putImageData(m , 0, 0);   // Replace original image with the new image
	                break;
	                case 'Sobel':
	                var m = context.getImageData(0, 0, imgWidth, imgHeight);
	                  	var pix2 = []; // New image after effect
	                  	for (var i = 0; i < _pix.length; i += 4) {
	                  		var convolutionedValue = makeConvolutionAt(i,_pix,matriceSobel);
	                  		pix2.push(convolutionedValue,convolutionedValue,convolutionedValue,255); 
	                  	}
	                  	m.data.set(pix2);
	                context.putImageData(m , 0, 0);   // Replace original image with the new image
	                break;
	            } 
	        };

	        function dilate(i, pix, structElem){

	        	var outValue = 0;
	        	var ij = getIJFromIndice(i, imgWidth, imgHeight);
	        	for(var x = 0; x< structElem.length; ++x){
	        		var line = structElem[x];
	        		for(var y = 0; y< line.length; ++y){

	        			var currentI = ij.i - Math.floor(line.length /2)  + y ;
	        			var currentJ = ij.j - Math.floor(structElem.length /2) + x ;

	        			if(currentI>=0 && currentJ>=0 && currentI < imgWidth && currentJ < imgHeight){

	        				var currentValue = getPixelValueFAST(currentI, currentJ, pix)[0];
	        				outValue += structElem[x][y] * currentValue;
	        			}

	        		}
	        	}

	        	if(outValue != 0) return 255;
	        	return outValue;
	        }

	        function erode(i, pix, structElem){

	        	var outValue = 0;

	        	var ij = getIJFromIndice(i, imgWidth, imgHeight);
	        	for(var x = 0; x < structElem.length; ++x){
	        		var line = structElem[x];
	        		for(var y = 0; y < line.length; ++y){

	        			var currentI = ij.i - Math.floor(line.length /2)  + y ;
	        			var currentJ = ij.j - Math.floor(structElem.length /2) + x ;

	        			if(currentI>=0 && currentJ>=0 && currentI < imgWidth && currentJ < imgHeight){

	        				var currentValue = getPixelValueFAST(currentI, currentJ, pix)[0];
	        				if(currentValue == 0 && structElem[x][y] == 1)return 0;
	        			}

	        		}
	        	}

	        	return 255;
	        }

	        function applyOuverture(){
	        	
	        	var _img = context.getImageData(0, 0, imgWidth, imgHeight);
	        	var pix = _img.data;
	        	var pix2 = [];
	        	var pix3 = [];

	        	for(var i=0; i<pix.length; i+=4){

	        		var result = erode(i, pix, structElem);
	        		pix2.push(result, result, result, 255);
	        	}

	        	for(var j=0; j<pix.length; j+=4){

	        		var result = dilate(j, pix2, structElem);
	        		pix3.push(result, result, result, 255);
	        	}

	        	_img.data.set(pix3);
	        	context.putImageData(_img, 0, 0);

	        }

	        function applyFermeture(){

	        	var _img = context.getImageData(0, 0, imgWidth, imgHeight);
	        	var pix = _img.data;
	        	var pix2 = [];
	        	var pix3 = [];

	        	for(var i=0; i<pix.length; i+=4){

	        		var result = dilate(i, pix, structElem);
	        		pix2.push(result, result, result, 255);
	        	}

	        	for(var j=0; j<pix.length; j+=4){

	        		var result = erode(j, pix2, structElem);
	        		pix3.push(result, result, result, 255);
	        	}

	        	_img.data.set(pix3);
	        	context.putImageData(_img, 0, 0);	        	
	        }