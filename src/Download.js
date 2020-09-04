import React from 'react';
import axios from 'axios';

class Download extends React.Component{

	constructor(props){
		super(props)
		this.url_dl='http://localhost:4000/download'
		this.url_dl_size='http://localhost:4000/downloadSize'
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
		var url_size=this.url_dl_size+'?videoId='+id

		console.log("trying to fetch " + url)
		var ref=this
		var size=0

		axios({
			url: url_size,
			method: 'GET'
		  }).then((response) => {
			size=response.data
		}).catch(err => console.log(err));

		axios({
			url: url,
			method: 'GET',
			responseType: 'blob',
			onDownloadProgress(progressEvent) {
				let progress = Math.round((progressEvent.loaded /10000) * 100);
				ref.setState({downloadProgress: Math.floor(progress/size*10000)})
				console.log(ref.state.downloadProgress)
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
			return(
			<div className="container">
					<h3 className="row justify-content-center text-responsive">{this.title}</h3>
					<div className="row justify-content-center mt-4">
						<img src={this.thumb} alt={this.title} className="img-fluid px-4 img-max" />
					</div>
					<div className="row mt-3 mx-1 progress mb-4"  style={{ height: "50px"}} >
						<div  className="progress-bar progress-bar-striped progress-bar-animated text-responsive" style={{ width: this.state.downloadProgress+"%",height: "50px" }} role="progressbar" aria-valuenow={this.state.downloadProgress} aria-valuemin="0" aria-valuemax="100">Extracting from youtube...</div>
					</div>
			</div>
			)
	}
}

export { Download };