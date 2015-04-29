var chat=app.controller('ChatController',function($stateParams,socket,$sanitize,$ionicScrollDelegate) {
  	var self=this;
  	self.autofocus=true
  	//Add colors
  	var COLORS = [
	    '#e21400', '#91580f', '#f8a700', '#f78b00',
	    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
	    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
	  ];

	 //initializing messages array
	self.messages=[]

  	socket.on('connect',function(){

  	 //Add user
  	  socket.emit('add user', $stateParams.nickname);
  	  // On login display welcome message
  	  socket.on('login', function (data) {
	    //Set the value of connected flag
	    self.connected = true
	    self.number_message= message_string(data.numUsers)
	  	
	  });

	  // Whenever the server emits 'new message', update the chat body
	  socket.on('new message', function (data) {
	   	addMessageToList(data.username,true,data.message)
	  });

	  // Whenever the server emits 'user joined', log it in the chat body
	  socket.on('user joined', function (data) {
	  	addMessageToList("",false,data.username + " joined")
	  	addMessageToList("",false,message_string(data.numUsers)) 
	  });

	  // Whenever the server emits 'user left', log it in the chat body
	  socket.on('user left', function (data) {
	    addMessageToList(data.username,false,self.message)
	  });	
  	})

  	//function called when user hits the send button
  	self.sendMessage=function()
  	{
  		socket.emit('new message', self.message)
  		addMessageToList($stateParams.nickname,true,self.message)
  		self.message=""
  	}

  	// Display message by adding it to the message list
  	function addMessageToList(username,style_type,message){
  		username=$sanitize(username)
  		var color= style_type ? getUsernameColor(username) : null
  		self.messages.push({content:$sanitize(message),style:style_type,username:username,color:color})
  		$ionicScrollDelegate.scrollBottom();
  	}

  	//Generate color for the same user.
  	function getUsernameColor (username) {
	    // Compute hash code
	    var hash = 7;
	    for (var i = 0; i < username.length; i++) {
	       hash = username.charCodeAt(i) + (hash << 5) - hash;
	    }
	    // Calculate color
	    var index = Math.abs(hash % COLORS.length);
	    return COLORS[index];
  	}

  	// Return message string depending on the number of users
  	function message_string(number_of_users)
  	{
  		return number_of_users===1?"there's 1 participant":"there are "+number_of_users+" participants"
  	}
});

