import React, { Component } from 'react'
import UsersListItem from './UsersListItem'

export default class UsersList extends Component {
    render() {
        return (
            <ul className={`${this.props.className}`}>
                {this.props.users.map(user=>{
                    return <UsersListItem key={user.id_user} user={user} className={this.props.childClass}></UsersListItem>
                })}
            </ul>
        )
    }
}
