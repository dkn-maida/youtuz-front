import React from 'react';
import { Link } from 'react-router-dom';

class ResItem extends React.Component{

	constructor(props){
        super(props)
        
	}

  _buildUrl(videoId, thumb, title, type){
    return "/download?videoId="+videoId+"&thumb="+thumb+"&title="+title+"&type="+type
  }

	render(){ 

		return(
            <div className="card-deck p-3 text-center">
						{this.props.results.map(result => (
							<div className="card border-0" key={result.id}> 
								<div className="card-body p-0">
									<img className="img-fluid" src={result.thumb} alt={result.title}></img>
									<span className="mt-2">{result.title}</span> 
								</div>
                <Link to={this._buildUrl(result.id, result.thumb, result.title, 'audio')}>
                  <button type="button" className="btnAudio mt-1 btn-lg btn-primary"><i className="fa fa-download"></i> Audio</button>
                </Link>
                <Link to={this._buildUrl(result.id, result.thumb, result.title, 'video')}>
                  <button type="button" className="btnVideo mt-1 btn-lg btn-primary"><i className="fa fa-download"></i> Video</button>
                </Link>
								{/* <button type="button" className="btnAudio mt-1 btn-lg btn-primary"  onClick={() => this._download(result.id, "audio",  result.title)}><i className="fa fa-download"></i> Audio</button>
								<button type="button" className="btnVideo mt-1 btn-lg btn-info" onClick={() => this._download(result.id, "video", result.title)}><i className="fa fa-download"></i> Video</button> */}
							</div>
						))}
			</div>
    )}

      
 } 
  
export { ResItem };