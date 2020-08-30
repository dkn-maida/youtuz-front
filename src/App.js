import React from 'react';
import jsonp from 'jsonp-modernized';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Spinner } from 'react-bootstrap';
import { ResItem } from  './ResItem'
const entities= require('entities');

class App extends React.Component{

	constructor(props){
		super(props)

		this.url_search='http://localhost:4000/search'
		this.state={
			results: [],
			suggestions: [],
			isLoading: false,
			isSearchLoading: false
		}
		this._autoComplete = this._autoComplete.bind(this);
		this._search = this._search.bind(this);
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
		if ( input === '' || input === null ) return;
		var search_url=this.url_search +'?query='+input
		var ref=this
		ref.setState({isSearchLoading: true}) 
		fetch(search_url)
		.then(response => response.json())
		.then(data => {
			console.log(data)
			ref.setState({results: data})
			console.log(ref)
			ref.setState({isSearchLoading: false})
		})
		.catch(err => console.log(err))
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

				{ 
				
				this.state.isSearchLoading ? 
				(<div className="row justify-content-center">
					<Spinner animation="border" variant="primary"  role="status" style={{width: '3rem', height: '3rem'}} >
						<span className="sr-only">Loading...</span>	
					</Spinner>
				</div>):
				(<div className="container-fluid">
					<ResItem results={this.state.results.slice(0, 3)} />
					<ResItem results={this.state.results.slice(3, 6)} />
					<ResItem results={this.state.results.slice(6, 9)} />
				</div>)
				}

			</div>

		)
	}
}

export { App };