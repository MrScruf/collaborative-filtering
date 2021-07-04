import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import "../../assets/main.css"
export default class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = { burgerMenu: false, active: "Home" }
    }
    links = [{ text: "Recommendations", path: "/recommendations", roles:["user"] }, { text: "Movies", path: "/movies?page=1", roles:[] }, { text: "My Profile", path: "/profile?page=1", roles:["user"] }, { text: "Administration", path: "/admin?page=1", roles:["admin"] }]
    myBurgerMenu(e) {
        this.setState(({ burgerMenu: !this.state.burgerMenu }));
    }
    render() {
        const rolesArray = window.localStorage.getItem("roles") ? JSON.parse(window.localStorage.getItem("roles")) : []
        return (
            <nav className="flex pt-1 bg-NavBar4">
                <button className={"sm:hidden flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white transform transition duration-300 object-left-top "
                    + (this.state.burgerMenu ? "rotate-90" : "rotate-0")} onClick={(e) => this.myBurgerMenu(e)}>
                    <svg className="fill-current text-blue-600 h-8 w-8" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                </button>
                <div className={"flex sm:flex-row flex-col w-full transition duration-300 fixed sm:static text-MovDet4 bg-NavBar4 text-2xl sm:top-0 top-11 sm:pt-0 pt-5 transform "
                    + (this.state.burgerMenu ? "-translate-x-0" : "-translate-x-full sm:-translate-x-0")}>
                    <ul className="flex sm:flex-row flex-col sm:w-full flex-grow sm:items-center">
                        {this.links.filter(element=>{
                            for(let i = 0; i < element.roles.length; i++){
                                if(rolesArray.some(role=>role === element.roles[i])){
                                    return true;
                                }
                            }
                            return element.roles.length === 0;
                        }).map((link) => {
                            return <li key={link.path}  className={"mr-1 text-xl sm:text-2xl px-3 mx-1 rounded mb-4 sm:mb-2 py-1 text-MovDet4 text-center " + (this.state.active === link.text ? "text-opacity-100" : "")}><Link className="w-full" to={link.path} onClick={(e) => this.setState({ active: link.text })}>{link.text}</Link></li>
                        })}
                        <li className="sm:mt-0 mt-4 sm:ml-auto mr-1 text-xl sm:text-2xl px-3 mx-1 rounded mb-3 sm:mb-1 py-3 text-center text-MovDet4">
                            {this.props.loggedIn ?
                                <Link to="/" className="" onClick={(e) => this.setState({ active: "Home" }, () => this.props.logoutCallback())}>Logout</Link> :
                                <Link to="/login" className="" onClick={(e) => this.setState({ active: "Login" })}>Login</Link>}
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}
