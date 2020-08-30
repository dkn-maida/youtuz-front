import React from 'react';
import axios from 'axios';

class Download extends React.Component{

	constructor(props){
		super(props)
		this.url_dl='http://localhost:4000/download'
		this.videoId=new URLSearchParams(window.location.search).get("videoId")
		this.thumb=new URLSearchParams(window.location.search).get("thumb")
		this.title=new URLSearchParams(window.location.search).get("title")
		this.type=new URLSearchParams(window.location.search).get("type")
		this._download= this._download.bind(this);
		this.state= {downloadProgress: 0};
	}

	componentDidMount() {
		console.log("loaded!");
		this._download(this.videoId, this.type, this.title)
	}

	_download(id, type, title){ 
		var url=this.url_dl+'?type='+type+'&videoId='+id+'&title='+title
		console.log("trying to fetch " + url)
		var ref=this
		axios({
			url: url,
			method: 'GET',
			responseType: 'blob',
			onDownloadProgress(progressEvent) {
				//console.log(progressEvent)
				console.log(progressEvent.srcElement.response)
				let progress = Math.round((progressEvent.loaded /10000) * 100);
				console.log("progress="+progress)
                ref.setState({progress : progress})
            }
		  }).then((response) => {
			title=(type === 'video')?title+'.mp4':title+'.mp3'
			let urlfake = window.URL.createObjectURL(new File([response.data], title));
			const link = document.createElement('a'); 
			link.href = urlfake;
			link.setAttribute('download', title); 
			link.click();
		}).catch(err => console.log(err));
	}

	render(){
			return(<div>
				<div>
					<p>{this.title}</p>
					<img src={this.thumb} alt={this.title} />
				</div>
				<div className="progress">
  					<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={this.state.downloadProgress} aria-valuemin="0" aria-valuemax="100">Extracting from youtube...</div>
				</div>
			</div>)
	}
}

export { Download };