const stream = require('stream');
const ytdl = require('ytdl-core')
const AWS = require('aws-sdk');
const s3 = new AWS.S3();


exports.handler = function(event, context, callback) {
    
   var passthrough= new stream.PassThrough()
   var videoId=event["queryStringParameters"]['videoId']
   var type=event["queryStringParameters"]['type']
   var title=event["queryStringParameters"]['title']
   var url = "https://www.youtube.com/watch?v=" + videoId
   var key=type+"/"+title+".mp4"
   var dl=(type == 'video') ? ytdl(url, {filter: format => format.container === 'mp4'}):ytdl(url,{ filter:'audioonly'} ) 
   dl.once('error', (err) => { callback(err);});
   dl.pipe(passthrough);    
    
   var upload = new AWS.S3.ManagedUpload({
        partSize: 10 * 1024 * 1024, queueSize: 1,
        params: {Bucket: "youtuz", Key: key, Body: passthrough, ContentDisposition: "attachement", ContentType: type+'/mpeg'}
   });
   
    upload.send((err) => {
    if (err) {
      callback(err, null);
    }else {
      var url = s3.getSignedUrl('getObject', {Bucket: 'youtuz',Key: key, Expires: 300})
      callback(null, {statusCode: 200, body: url})
    }
  });
}