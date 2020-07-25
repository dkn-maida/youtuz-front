import 'yt-search' from 'yt-search';
const yts = require( 'yt-search' )

yts( 'robocop theme').then(results => {
	let videos = results.videos
	videos.forEach( v => {
		console.log(v)
	})
})