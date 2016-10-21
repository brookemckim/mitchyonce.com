var Config = {}

Config.getUrl = function() {
  if (url) return url;
  var port = window.location.port;
  var url = window.location.protocol + '//' + window.location.hostname;
  if (port) url = url + ':' + port;
  return url;
}

Parse.initialize('myAppId','unused');
Parse.serverURL = Config.getUrl() + '/parse'

var Comment = Parse.Object.extend("Comment");
/**
 *  Parse requests handler
 */

$("#publishComment").click(function(e) {
  var body = $("#comment").val();
  if (body == "") { return false }
  var comment = new Comment();

  comment.set("body", body);
  comment.save(null, {
    success: function(comment) {
      //renderComment(comment);
    }
  });

  e.preventDefault();
});

var renderComment = function(comment) {
 var comments = $("#comments");
 var newComment = $("<div>", { id: comment.id, class: "renderedComment pure-g step--container" }).append(
   $("<div>", { class: "pure-u-1" }).append(
   $("<p>").text(comment.get("body"))
  )
 );
 $("#comment").val("");
 comments.append(newComment);
}

$(document).ready(function() {
  var queryObject = new Parse.Query(Comment);
  queryObject.find({ 
    success: function(results) {
      for (var i = 0; i < results.length; i++) {
        var c = results[i];
        renderComment(c);
      }
    }
  })

  var liveQuery = new Parse.Query('Comment');
  var subscription = liveQuery.subscribe();

  subscription.on('create', function(c) {
    renderComment(c);
  });
});

