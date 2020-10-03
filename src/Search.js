import React from 'react';
import jsonp from 'jsonp-modernized';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { Spinner } from 'react-bootstrap';
import { ResItem } from  './ResItem'
const entities= require('entities');

class Search extends React.Component{

	constructor(props){
		super(props)
		this.url_search='http://localhost:8080/search'
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
							<h1 className="text-center mb-3 lead text-responsive">Type Keywords to search for a video or paste a youtube url</h1> 
						</div>
						<AsyncTypeahead  id="search_id" ref={this.aheadRef} onSearch={this._autoComplete} options={this.state.suggestions} minLength={1} 
						 isLoading={this.state.isLoading}  size="large"/>
						<button type="button" className="tbn btn-primary btn-block mt-1 btn-lg text-responsive" onClick={this._search}>Search</button>
		       		</div>
				</div>

				{ 
				this.state.isSearchLoading ? 
				(<div className="row justify-content-center">
					<Spinner animation="border" variant="primary"  role="status" style={{width: '4rem', height: '4rem'}} >
						<span className="sr-only text-responsive">Loading...</span>	
					</Spinner>
				</div>):
				(<div className="container-fluid">
					<ResItem results={this.state.results.slice(0, 4)} />
					<ResItem results={this.state.results.slice(4, 8)} />
					<ResItem results={this.state.results.slice(8, 12)} />
					<ResItem results={this.state.results.slice(12, 16)}/> 
				</div>)
				}

			</div>

		)
	}
}

export { Search };