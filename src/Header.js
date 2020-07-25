import React from 'react';
import logo from './images/logo_youtuz.png'

class Header extends React.Component{

	render(){ 
		return(
		<nav className="shadow navbar navbar-expand-lg navbar-light bg-light p-3 mb-5 border-bottom header">
		  <a href="#" className="navbar-brand">
			<img src={logo} alt="youtuz logo" className="img-responsive"></img>
		  </a>
		  <div className="collapse navbar-collapse" id="navbarNav">
		    <ul className="nav navbar-nav ml-auto">
		      <li className="nav-item"><a className="nav-link" href="#">About</a></li>
		      <li className="nav-item"><a className="nav-link" href="#">Terms of use</a></li>
		      <li className="nav-item"><a className="nav-link" href="#">Privacy policy</a></li>
		      <li className="nav-item"><a className="nav-link" href="#">Contact</a></li>
		    </ul>
	      </div>
	    </nav>
		)}
 }

export { Header };