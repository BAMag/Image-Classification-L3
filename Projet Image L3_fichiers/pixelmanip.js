// Display value of pixel at x,y from context c
	        function getPixelValueFAST(x,y,pix){

	        	var n = getNFromIndiceIJ(x,y,imgWidth,imgHeight);
		      	var p = [pix[n]];//c.getImageData(x, y, 1, 1).data; 
		      	return p; 
		      };

		      function getIJFromIndice(n,width,height){

		      	return {i: n /4 % (width ), j: Math.floor(n/4 /width)};
		      };

		      function getNFromIndiceIJ(i,j,width,height){

		      	return i * 4 + j* width *4;
		      };
