import React from 'react'
import {BrowserRouter as Router, NavLink, Route, Routes} from 'react-router-dom'
export default class IndexComponent extends React.Component{
    render(){
        return(
            <div>
                <div className='nav nav-pills'>
                    <Router>
                        <div className='nav-item'>
                            <NavLink to = "/products" className='nav-link'>Browse Products</NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink to="/dashboard" className='nav-link'>Dashboard</NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink to="/update" className='nav-link'>Contact Us</NavLink>
                        </div>
                        
                        <br/><br/>
                        <Routes>
                            <Route path = "/products" element = {<BrowseProducts/>}></Route>
                            <Route path="/dashboard" element={<Dashboard />}></Route>
                            <Route path="/update" element={<ContactUs />}></Route>
                        </Routes>                        
                    </Router>
                </div>
            </div>
        )
    }
}
