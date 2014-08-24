$.fn.spellcheckAutocomplete = function(options) {
	
	if ($.ui === undefined) {
		// check if jquery ui is loaded
		console.log('Error: jquery ui not found. aborting');
		return;
	}

	if ($(this).length === 0) {
		return;
	}

	if (options.threshold === undefined) {
		options.threshold = 0.9;
	}

	var sourceArr = options.source;

	options.source = function(request, response) {
		// if the var holding the available options is blank, return an empty list of suggestions
		if ( sourceArr === undefined ) {
			response([]);
			return;
		}

		var userInput = request.term.toLowerCase();

		var suggestions = [];

		// loop through the options
		sourceArr.forEach (function(tag){
			
			var tagLabel;

			if (tag.label === undefined) {
				tagLabel = tag;
			} else {
				tagLabel = tag.label;
			}

			var tagLower = tagLabel.toLowerCase();

			if ( tagLower.indexOf(userInput)>=0 ) {
			// if the user input is a substring of the option add the option it in the suggestions list
				suggestions.push(tag);
			} else if (levenshteinRatio(userInput, tagLower) >= options.threshold) {
			// if levenshtein ratio between the user input and the option is greater than the threshold
			// add the option in the suggestions list
				suggestions.push(tag);
			}
		});
		//console.log(suggestions);
		response(suggestions);
	};

	$(this).autocomplete(options);


	function levenshteinRatio(a, b) {

		if(a.length === 0) { return b.length; }
		if(b.length === 0) { return a.length; }

		a = a.toLowerCase();
		b = b.toLowerCase();

		var matrix = [];

		// increment along the first column of each row
		var i;
		for(i = 0; i <= b.length; i++){
			matrix[i] = [i];
		}

		// increment each column in the first row
		var j;
		for(j = 0; j <= a.length; j++){
			matrix[0][j] = j;
		}

		// Fill in the rest of the matrix
		for(i = 1; i <= b.length; i++) {
			for(j = 1; j <= a.length; j++) {
				if(b.charAt(i-1) == a.charAt(j-1)) {
					matrix[i][j] = matrix[i-1][j-1];
				} else {

					// substitution are counted twice (+2), instead of once (+1) 
					// to match python's Levenshtein.ratio() function
					// this answer explains better  http://stackoverflow.com/a/14296743/855475

					matrix[i][j] = Math.min(matrix[i-1][j-1] + 2, // substitution
					Math.min(matrix[i][j-1] + 1, // insertion
					matrix[i-1][j] + 1)); // deletion
				}
			}
		}

		dist = matrix[b.length][a.length];
		sumLen = a.length + b.length;  
		return (sumLen - dist) / sumLen;
	}
};


