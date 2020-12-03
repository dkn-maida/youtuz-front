import React from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import {BrowserView,MobileView} from "react-device-detect";
import { Link } from 'react-router-dom';

class Download extends React.Component{

	constructor(props){
		super(props)
		this.url_dl='http://youtuz.net:4000/download' 
		this.videoId=new URLSearchParams(window.location.search).get("videoId")
		this.thumb=new URLSearchParams(window.location.search).get("thumb")
		this.title=new URLSearchParams(window.location.search).get("title")
		this.type=new URLSearchParams(window.location.search).get("type")
		this._download= this._download.bind(this);
		this._cancelDownload=this._cancelDownload.bind(this);
		this._closePageBrowser=this._closePageBrowser.bind(this);
		this.state= {isLoading: true, message:'Extraction from youtube in progress please wait...'};
		this.cancelToken = axios.CancelToken.source();
		//TO DO: add video size, quality, and duration
	}

	componentDidMount() {
		console.log("loaded!");
		this._download(this.videoId, this.type, this.title)
	}

	_download(id, type, title){ 

		var url=this.url_dl+'?type='+type+'&videoId='+id+'&title='+title
		console.log("trying to fetch " + url)
		var ref=this
		var size=0

		axios({
			url: url,
			method: 'GET',
			responseType: 'blob',
			cancelToken: this.cancelToken.token
		  }).then((response) => {
			title=(type === 'video')?title+'.mp4':title+'.mp3'
			let urlfake = window.URL.createObjectURL(new File([response.data], title));
			const link = document.createElement('a'); 
			link.href = urlfake;
			link.setAttribute('download', title);
			link.setAttribute('target', '_blank'); 
			link.click();
			ref.setState({isLoading: false, message: "Extraction complete"})
		}).catch(function(thrown){
			if(axios.isCancel(thrown)){console.log('Request is canceled', thrown.message)}
		}).catch((err) => {
			console.log(err)
		});
	}

	_cancelDownload(){
		this.cancelToken.cancel('Download canceled by the user.');
		this.setState({isLoading: false, message:"Download canceled"})
	}

	_closePageBrowser(){
		window.open('', '_self').close();
	}

	render(){
			return(
			<div className="container-fluid">
					<h3 className="row justify-content-center text-responsive text-center mb-3 lead font-weight-bold">{this.title}</h3>
					<div className="row justify-content-center mt-4 mb-4">
						<div className="col-sm-4"></div>
						<div className="col-sm-4"><img src={this.thumb} alt={this.title} className="img-fluid w-100 h-80"/></div>
						<div className="col-sm-4"></div>
					</div>
					<div className="row justify-content-center">
						<p className="text-responsive font-weight-bold  text-center">{this.state.message}</p>
					</div>
					<div className="row justify-content-center">
						{this.state.isLoading ? 
							( 
								<Spinner className="mt-2 mb-4" animation="border" variant="primary"  role="status" style={{width: '4rem', height: '4rem'}}></Spinner>
							):
							(<div></div>)
						}
					</div>
					<BrowserView>
						<div className="row justify-content-center">
							{this.state.isLoading ? 
								(<button type="button" className="mt-1 btn btn-danger btn-lg" onClick={this._cancelDownload}>Cancel Download</button>):
								(<button type="button" className="mt-1 btn btn-danger btn-lg" onClick={this._closePageBrowser}>Close Page</button>)
							}
						</div>
					</BrowserView>
					<MobileView>
						<div className="row justify-content-center">
							{this.state.isLoading ? 
								(<button type="button" className="mt-1 btn btn-danger btn-lg" onClick={this._cancelDownload}>Cancel Download</button>):
								(<Link to='/'><button type="button" className="mt-1 btn btn-danger btn-lg">Close</button></Link>)
							}
						</div>
					</MobileView>
					
			</div>
			)
	}
}

export { Download };