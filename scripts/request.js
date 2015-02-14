function createPOSTRequest(url, data, callback){
	var request = new XMLHttpRequest();
	request.open('POST', url, true);
	request.onreadystatechange = function(event){
		console.log('ready state change');
		if(request.readyState === 4){
			//console.log('ready state 4');
			//INVARIANT: the request is finished
			if(request.status === 200){
				//console.log('request state 200');
				//INVARIANT: the request was successful
				callback(request.responseText);
			}
		}
	};
	var stringifiedData = JSON.stringify(data);
	request.send(stringifiedData);
}