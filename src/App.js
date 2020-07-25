import React from 'react';
import jsonp from 'jsonp-modernized';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import Popup from "reactjs-popup";
const entities= require('entities');

class App extends React.Component{

	constructor(props){
		super(props)
		this.url_search='https://2s53ok0gah.execute-api.us-east-1.amazonaws.com/dev/search'
		this.url_dl='https://2s53ok0gah.execute-api.us-east-1.amazonaws.com/dev/dl'
		this.state={
			results: [],
			suggestions: [],
			isLoading: false
		}
		this._autoComplete = this._autoComplete.bind(this);
		this._search = this._search.bind(this);
		this._download = this._download.bind(this);
		this.aheadRef = React.createRef();
	}

	_autoComplete(query){
		this.setState({isLoading: true});
		var input=entities.encodeHTML(query)
		var options={
			parameters: {
				"ds": "yt", 
		        "q": input, 
		        "client": "youtube"
			}
		}
		var ref=this
	 	jsonp('https://suggestqueries.google.com/complete/search', options)
		.then(function(rep)
		{		 	
			let suggestions=rep[1].map((item) => item[0])
			ref.setState({suggestions : suggestions});
			console.log("suggestions = " + ref.state.suggestions)
			ref.setState({isLoading: false});
		})
		.catch(function(error){ console.log("autosuggest error: " + error)})
	}

	_search()
	{	
		console.log(this.aheadRef)
		var input=this.aheadRef.current.getInput().value
		var search_url=this.url_search +'?query='+input
		var ref=this
		fetch(search_url)
		.then(response => response.json())
		.then(data => {
			console.log(data)
			ref.setState({results: data})
		})
	}

	_download(id, type){
		let params = {type: type, videoId: id}
		let url=this.url_dl + '?' +new URLSearchParams(params).toString();
		fetch(this.url_dl+'?type='+type+'&videoId='+id)
		.then(response => {response.text().then(text => {
			var elem = document.createElement('a');
		    elem.href = text;
		    elem.target = '#'
		    elem.download=''
		    elem.click();
		})})
	}

	render(){
		return(
			<div id="app" className="container">
				<div className="row justify-content-center mb-4">
					<div className="col-11">
						<div className="row justify-content-center"> 
							<h1 className="mb-3 justify-content-center lead text-responsive">Download audio and video from Youtube</h1> 
						</div>
						<AsyncTypeahead id="search_id" ref={this.aheadRef} onSearch={this._autoComplete} options={this.state.suggestions} minLength={1} 
						placeholder="Search for a youtube video" isLoading={this.state.isLoading}  size="large"/>
						<button type="button" className="tbn btn-primary btn-block mt-1 btn-lg" onClick={this._search}>Search</button>
		       		</div>
				</div>
				<div className="container-fluid">
					<div className="card-deck p-3 text-center">
						{this.state.results.slice(0, 3).map(result => (
							<div className="card border-0" key={result.id}> 
								<div className="card-body p-0">
									<img className="img-fluid" src={result.thumb} alt={result.title}></img>
									<span className="mt-2">{result.title}</span> 
								</div>
								<button type="submit" className="btnAudio mt-1 btn-lg btn-primary"  onClick={() => this._download(result.id, "audio")}><i className="fa fa-download"></i> Audio</button>
								<button type="button" className="btnVideo mt-1 btn-lg btn-info" onClick={() => this._download(result.id, "video")}><i className="fa fa-download"></i> Video</button>
							</div>
						))}
					</div>
					<div className="card-deck p-3 text-center">
						{this.state.results.slice(3, 6).map(result => (
							<div className="card  border-0" key={result.id}>
								<div className="card-body p-0"> 
									<img className="img-fluid" src={result.thumb} alt={result.title}></img>
									<span className="mt-2">{result.title}</span>
								</div>
								<button type="button" className="btnAudio mt-1 btn-lg  btn-primary" onClick={() => this._download(result.id, "audio")}><i className="fa fa-download"></i> Audio</button>
								<button type="button" className="btnVideo mt-1 btn-lg  btn-info" onClick={() => this._download(result.id, "video")}><i className="fa fa-download"></i> Video</button>
							</div>
						))}
					</div>
					<div className="card-deck p-3 text-center">
						{this.state.results.slice(6, 9).map(result => (
							<div className="card  border-0" key={result.id}> 
								<div className="card-body p-0">
									<img className="img-fluid" src={result.thumb} alt={result.title}></img>
									<span className="mt-2">{result.title}</span>
								</div>
								<button type="button" className="btnAudio mt-1 btn-lg  btn-primary" onClick={() => this._download(result.id, "audio")}><i className="fa fa-download"></i> Audio</button>
								<button type="button" className="btnVideo mt-1 btn-lg  btn-info" onClick={() => this._download(result.id, "video")}><i className="fa fa-download"></i> Video</button>
							</div>
						))}
					</div>
				</div>
			</div>

		)
	}
}

export { App };