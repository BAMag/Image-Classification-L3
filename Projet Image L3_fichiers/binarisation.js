			//TO GRAY & OTSU FUNCTIONS*************************************************************************************
			function toGrayscale(context, width, height) {
				var imageData = context.getImageData(0, 0, width, height);
				var data = imageData.data;

				for(var i = 0; i < data.length; i += 4) {
					var brightness = RED_INTENCITY_COEF * data[i] + GREEN_INTENCITY_COEF * data[i + 1] + BLUE_INTENCITY_COEF * data[i + 2];
			        // red
			        data[i] = brightness;
			        // green
			        data[i + 1] = brightness;
			        // blue
			        data[i + 2] = brightness;
			    }

			    // overwrite original image
			    context.putImageData(imageData, 0, 0);
			};

			function otsu(histogram, total) {
				var sum = 0;
				for (var i = 1; i < 256; ++i)
					sum += i * histogram[i];
				var sumB = 0;
				var wB = 0;
				var wF = 0;
				var mB;
				var mF;
				var max = 0.0;
				var between = 0.0;
				var threshold1 = 0.0;
				var threshold2 = 0.0;
				for (var i = 0; i < 256; ++i) {
					wB += histogram[i];
					if (wB == 0)
						continue;
					wF = total - wB;
					if (wF == 0)
						break;
					sumB += i * histogram[i];
					mB = sumB / wB;
					mF = (sum - sumB) / wF;
					between = wB * wF * Math.pow(mB - mF, 2);
					if ( between >= max ) {
						threshold1 = i;
						if ( between > max ) {
							threshold2 = i;
						}
						max = between;            
					}
				}
				return ( threshold1 + threshold2 ) / 2.0;
			};

			function binarize(threshold, context, width, height) {
				var imageData = context.getImageData(0, 0, width, height);
				var data = imageData.data;
				var val;

				for(var i = 0; i < data.length; i += 4) {
					var brightness = RED_INTENCITY_COEF * data[i] + GREEN_INTENCITY_COEF * data[i + 1] + BLUE_INTENCITY_COEF * data[i + 2];
					val = ((brightness > threshold) ? 255 : 0);
					data[i] = val;
					data[i + 1] = val;
					data[i + 2] = val;
				}

			    // overwrite original image
			    context.putImageData(imageData, 0, 0);
			}