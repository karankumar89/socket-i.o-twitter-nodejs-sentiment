var socket = io.connect();
socket.on('sentiment',function(result_s){
  socket.on('stream', function(tweet){
    if(result_s.score > 0){
      $('.timeline').prepend("<li  class=\"timeline-inverted\" ><div class=\"timeline-badge success\"><i class=\"glyphicon glyphicon-credit-card\"></i></div><div class=\"timeline-panel\" style=\"background-color:white;color:black\"><div class=\"timeline-heading\"><span>score: "+result_s.score+"</span><h4 class=\"timeline-title\">"+tweet.user.name+"</h4><p><small class=\"text-muted\"><i class=\"glyphicon glyphicon-time\"></i> Just Now via Twitter</small></p></div><div class=\"timeline-body\"> "+tweet.text+"</div></div></li>").slideDown();
      //$('.timeline-body').append(tweet);
    } else {
      $('.timeline').prepend("<li><div class=\"timeline-badge danger\"><i class=\"glyphicon glyphicon-thumbs-up\"></i></div><div class=\"timeline-panel\" style=\"background-color:white;color:black\"><div class=\"timeline-heading\"><span>score: "+result_s.score+"</span><h4 class=\"timeline-title\">"+tweet.user.name+"</h4><p><small class=\"text-muted\"><i class=\"glyphicon glyphicon-time\"></i> Just Now via Twitter</small></p></div><div class=\"timeline-body\"> "+tweet.text+"</div></div></li>").slideDown();
      //$('.timeline-body').append(tweet);
    }
  //console.log(tweet.user.time_zone);
  //sentiment test

  //console.log("sentiment score");
  //console.log(result_s.score);
  });
});