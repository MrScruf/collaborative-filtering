import React, { Component } from 'react'
import { Link } from 'react-router-dom';
export default class UsersListItem extends Component {
    render() {
        return (
            <li className={`${this.props.className} mb-2 flex flex-row px-2`}>
                <Link to={`/profile/${this.props.user.id_user}`} className=" mr-2 p-0 inline-block" >
                <img className="mr-2" src="/assets/img/person.png" alt="user" width="60px"></img>
                </Link>
                <div className="flex flex-col">
                    <Link to={`/profile/${this.props.user.id_user}`} className="hover:underline hover:text-gray-600" >
                        <h3 className="text-xl font-semibold">{this.props.user.username}</h3>
                    </Link>
                    <p>Mean vote: {this.props.user.mean_vote}</p>
                </div>
            </li>
        )
    }
}
