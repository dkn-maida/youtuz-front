import React from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

class Download extends React.Component{

	constructor(props){
		super(props)
		this.url_dl='http://localhost:4000/download'
		//this.url_dl_size='http://localhost:4000/downloadSize'
		this.videoId=new URLSearchParams(window.location.search).get("videoId")
		this.thumb=new URLSearchParams(window.location.search).get("thumb")
		this.title=new URLSearchParams(window.location.search).get("title")
		this.type=new URLSearchParams(window.location.search).get("type")
		this._download= this._download.bind(this);
		this.state= {isLoading: true};
		this.cancelToken = axios.CancelToken;
		//TO DO: add video size, quality, and duration
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
			console.log("Size=" + size)
		}).catch(err => console.log(err));

		axios({
			url: url,
			method: 'GET',
			responseType: 'blob'
			// onDownloadProgress(progressEvent) {
			// 	let progress = Math.round(progressEvent.loaded /100);
			// 	ref.setState({downloadProgress: Math.floor(progress/size*10000)})
			// 	console.log(ref.state.downloadProgress)
            // }
		  }).then((response) => {
			title=(type === 'video')?title+'.mp4':title+'.mp3'
			let urlfake = window.URL.createObjectURL(new File([response.data], title));
			const link = document.createElement('a'); 
			link.href = urlfake;
			link.setAttribute('download', title);
			link.setAttribute('target', '_blank'); 
			link.click();
			ref.setState({isLoading: false})
		}).catch(err => console.log(err));
	}

	render(){
			return(
			<div className="container-fluid">
					<h3 className="row justify-content-center text-responsive">{this.title}</h3>
					<div className="row justify-content-center mt-4 mb-4">
						<img src={this.thumb} alt={this.title} className="mx-auto w-30 h-30" />
					</div>
					{/* <div className="row mt-3 mx-1 progress mb-4 w-50 mx-auto"  style={{ height: "25px"}} >
						<div  className="progress-bar progress-bar-striped progress-bar-animated text-responsive" style={{ width: this.state.downloadProgress+"%",height: "25px" }} role="progressbar" aria-valuenow={this.state.downloadProgress} aria-valuemin="0" aria-valuemax="100"></div>
					</div> */}
					<div className="row justify-content-center">
						{this.state.isLoading ? 
							(
								<Spinner className="mt-2 mb-4" animation="border" variant="primary"  role="status" style={{width: '4rem', height: '4rem'}} >	
								</Spinner>
							):
							(<p className="text-responsive">Exctraction Complete !</p>)
						}
					</div>
					<div className="row justify-content-center">
						{this.state.isLoading ? 
							(<button type="button" className="mt-1 btn btn-danger btn-lg">Cancel Download</button>):
							(<button type="button" className="mt-1 btn btn-danger btn-lg">Close Page</button>)
						}
					</div>
			</div>
			)
	}
}

export { Download };