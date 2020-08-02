import React from 'react';
import axios from 'axios';

class ResItem extends React.Component{

	constructor(props){
        super(props)
        this.url_dl='http://localhost:4000/download'
        this.url_gf='http://localhost:4000/files'
        this._download = this._download.bind(this);
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
								<button type="submit" className="btnAudio mt-1 btn-lg btn-primary"  onClick={() => this._download(result.id, "audio",  result.title)}><i className="fa fa-download"></i> Audio</button>
								<button type="button" className="btnVideo mt-1 btn-lg btn-info" onClick={() => this._download(result.id, "video", result.title)}><i className="fa fa-download"></i> Video</button>
							</div>
						))}
			</div>
        )}

        _download(id, type, title){       
            var url=this.url_dl+'?type='+type+'&videoId='+id+'&title='+title
            console.log("trying to fetch " + url)
            axios({
                url: url,
                method: 'GET',
                responseType: 'blob'
              }).then((response) => {
                let urlfake = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = urlfake;
                link.setAttribute('download', title); 
                link.click();
             }).catch(err => console.log(err));
        }
 } 
  
export { ResItem };