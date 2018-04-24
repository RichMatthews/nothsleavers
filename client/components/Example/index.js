import React from 'react';
import Types from '../../redux/types';
import axios, { auth } from 'axios';
import { connect } from 'react-redux';
import { secret } from '../../../secret';
import firebase from '../../firebase';
import './index.scss';

export class Example extends React.Component {

  state = {
    searchTerm: ''
  }

  axiosRequest = (pageNumber) => {
    return axios({
      method: 'get',
      url: `https://api.github.com/orgs/notonthehighstreet/members?page=${pageNumber}`,
      auth: {
        username: 'richmatthews',
        password: secret
      }
    })
  }

  readFromFirebase = () => {
    return firebase.database().ref('/users').once('value').then((snapshot) => {
      console.log(Object.values(snapshot.val()), 'snap');
    })
  }

  componentDidMount = () => {
    axios.all(
      [this.axiosRequest(1),
       this.axiosRequest(2),
       this.axiosRequest(3)]
    ).then(axios.spread((page1, page2, page3) => {
        let response = page1.data.concat(page2.data).concat(page3.data)
        this.props.pullMembersFromGithub(response)
      }))
    .then(() => {
      this.mapGitHubNameToRealName()
    })
  }

  mapGitHubNameToRealName = () => {
    this.state.members.map((member) => {
      axios.get(`https://api.github.com/users/${member.login}`).then((response) => {
        member.realName = response.data.name;
        this.setState({member});
      });
    })
  }

  gitHubDeleteUser = (user) => {
    axios({
      method: 'delete',
      url: `https://api.github.com/orgs/RichTestOrg/members/${user.login}`,
      auth: {
        username: 'richmatthews',
        password: secret
      }
    }).then(() => {
      alert('User successfully removed')
      this.props.removeGithubMember(user);
    })
  }

  filterUsers = (members) => {
    return members.filter(member => member.login.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
  }

  searchTerm = e => {
    this.setState({searchTerm: e.target.value})
  }

  render(){
    return(
      <article>
        <h3> notonthehighstreet </h3>
        <div className="searchContainer">
          <input
            className="search"
            onChange={this.searchTerm}
            placeholder="Search for an employee..."
          />
        </div>
          <span>Users found: {this.filterUsers(this.props.members).length}</span>
          <table>
            <tr>
              <th className="employeeColumn">Employee</th>
              <th>Revoke Github access</th>
              <th>Revoke GTM access</th>
              <th>Revoke Slack access</th>
              <th>Left NOTHS?</th>
              <button onClick={() => this.readFromFirebase()}>test</button>
            </tr>
          {
          this.props.members &&
          this.filterUsers(this.props.members).length > 0 &&
          this.filterUsers(this.props.members) ?
            this.filterUsers(this.props.members).map((member) => (
              <tr className="employeeContainer">
                <td>{member.login}</td>
                <td><button onClick={() => this.gitHubDeleteUser(member)}>Remove</button></td>
                <td><button>Remove</button></td>
                <td><button>Remove</button></td>
                <td><button>Kill user</button></td>
              </tr>
            ))
            :
            <div> No users found </div>
          }
        </table>
      </article>
    )
  }
}

const mapStateToProps = state => ({
  members: state.members
});

const mapDispatchToProps = (dispatch) => ({
  pullMembersFromGithub: (data) => {
    dispatch({
      type: Types.PULL_MEMBERS_FROM_GITHUB,
      data
    })
  },
  removeGithubMember: (data) => {
    dispatch({
      type: Types.REMOVE_GITHUB_MEMBER,
      data
    })
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Example);
