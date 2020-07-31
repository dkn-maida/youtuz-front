const yts = require('yt-search')

exports.handler = function(event, context, callback) {
    var results=[]
    var query=event["queryStringParameters"]['query']
    
    yts( query, function ( err, r ) {
     if ( err ){
        callback(err, null)
     }
      const videos = r.videos
      videos.forEach( function ( v ) {
        var result={
            "id": v.videoId,
            "thumb": v.thumbnail,
            "title": v.title
        }
        results.push(result)
      })
      callback(null, {
         "statusCode": 200,
         "body": JSON.stringify(results)
       })
    })
};