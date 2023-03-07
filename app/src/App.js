import './App.css';
import './styles/account.css';
import './styles/dropdown.css';
import './styles/overlay.css';
import './styles/CSSTransition.css';
import React, { Component, createRef, Fragment } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';

// Import pages
import MapPage from './scripts/MapPage';
import ListPage from './scripts/ListPage';
import CommunityPage from './scripts/CommunityPage';
import LoginPage from './scripts/LoginPage';
import HelpPage from './scripts/HelpPage';
import SettingsPage from './scripts/SettingsPage';
import SignUpPage from './scripts/SignUpPage';
import HomePage from './scripts/HomePage';
import OverlayComponent from './scripts/OverlayComponent';
import AccountPage from './scripts/AccountPage/AccountPage';

/** 
 * States for app
*/
const AppState = {
	Map: 4,
	List: 5,
	Community: 6,
	Home: 69
};

/**
 * App class 
 */
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			appState: AppState.Home,
			dietaryRestrictions: [
				{ id: 0, title: 'vegan', selected: false, key: 'diet', imagePath: 'images/vegan.png' },
				{ id: 1, title: 'vegetarian', selected: false, key: 'diet', imagePath: 'images/vegetarian.png' },
				{ id: 2, title: 'lactose-free', selected: false, key: 'diet', imagePath: 'images/lactose-free.png' },
				{ id: 3, title: 'gluten-free', selected: false, key: 'diet', imagePath: 'images/gluten-free.png' },
			],
			sortingChoices: [
				{ id: 0, title: 'A - Z', selected: true, key: 'sort' },
				{ id: 1, title: 'Z - A', selected: false, key: 'sort' },
				{ id: 2, title: 'Rating', selected: false, key: 'sort' },
			],
			sortingChoice: 'A - Z',
			location: '',

			popupsOpen: {
				isAccountPageOpen: false,
				isLoginPageOpen: false,
				isSignUpPageOpen: false,
				isHelpPageOpen: false,
				isSettingsPageOpen: false,
			},

			userInfo: {
				user: {},
				isUserLoggedIn: false,
				isLoginValid: false,
				isSignupValid: true,
			}
		};

		this.myRef = createRef();
	}

	componentDidMount() {
		const loggedInUser = localStorage.getItem("loggedInUser");

		if (loggedInUser) {
			const foundUser = JSON.parse(loggedInUser);
			const userInfo = this.state.userInfo;
			userInfo.isUserLoggedIn = true;
			userInfo.user = foundUser.user;
			this.setState({ userInfo: userInfo });
		}
	}

	/**
	 * @deprecated
	 * A function to handle the home page button
	 * 
	 * This will open the home page
	 */
	handleHomePageButton = () => {
		this.setState({ appState: AppState.Home });
	};

	/**
	 * A function to handle the account button
	 * 
	 * If the user is not logged in, this will open the login overlay
	 * Else, this will open the account management overlay
	 */
	handleAccountButton = () => {
		const popupsOpen = this.state.popupsOpen;
		const userInfo = this.state.userInfo;
		if (!this.state.userInfo.isUserLoggedIn) {
			popupsOpen.isLoginPageOpen = true;
			popupsOpen.isSignUpPageOpen = false;
			userInfo.isLoginValid = true;
			this.setState({
				popupsOpen: popupsOpen,
				userInfo: userInfo
			});
		}
		else {
			popupsOpen.isAccountPageOpen = true;
			this.setState({ popupsOpen: popupsOpen });
		}
	};

	/**
	 * A function to handle the signup button in the login overlay
	 * 
	 * This will open the signup overlay
	 */
	handleSignUpButton = () => {
		const popupsOpen = this.state.popupsOpen;
		const userInfo = this.state.userInfo;
		popupsOpen.isLoginPageOpen = false;
		popupsOpen.isSignUpPageOpen = true;
		userInfo.isLoginValid = true;
		userInfo.isSignupValid = true;
		this.setState({ popupsOpen: popupsOpen, userInfo: userInfo });
	};

	/**
	 * A function to handle the login button in the signup overlay
	 * 
	 * This will open the login overlay
	 */
	handleLogInButton = () => {
		const popupsOpen = this.state.popupsOpen;
		popupsOpen.isLoginPageOpen = true;
		popupsOpen.isSignUpPageOpen = false;
		this.setState({ popupsOpen: popupsOpen });
	};

	/**
	 * A function to handle the help button
	 * 
	 * This will open the help overlay
	 */
	handleHelpButton = () => {
		const popupsOpen = this.state.popupsOpen;
		popupsOpen.isHelpPageOpen = true;
		this.setState({ popupsOpen: popupsOpen });
	};

	/**
	 * A function to handle the settings button
	 * 
	 * This will open the settings overlay
	 */
	handleSettingsButton = () => {
		const popupsOpen = this.state.popupsOpen;
		popupsOpen.isSettingsPageOpen = true;
		this.setState({ popupsOpen: popupsOpen });
	};

	/**
	 * A function to handle the footer map button
	 * 
	 * This will direct user to the map page
	 */
	handleMapButton = () => {
		this.setState({ appState: AppState.Map });
	};

	/**
	 * A function to handle the footer list button
	 * 
	 * This will direct user to the list page
	 */
	handleListButton = () => {
		this.setState({ appState: AppState.List });
	};

	/**
	 * A function to handle the footer community button
	 * 
	 * This will direct user to the community page
	 */
	handleCommunityButton = () => {
		this.setState({ appState: AppState.Community });
	};

	/**
	 * A function to authenticate the user for log in
	 * @param {string} username
	 * @param {string} password
	 * 
	 * @returns true if succesful, else false
	 */
	authenticateUser = async (username, password) => {
		const popupsOpen = this.state.popupsOpen;
		const userInfo = this.state.userInfo;

		await axios.post('http://localhost:2006/auth/login/', {
			email: username,
			password: password

		})
			.then((response) => {
				if (response.status === 200) {
					popupsOpen.isLoginPageOpen = false;
					popupsOpen.isSignUpPageOpen = false;
					userInfo.isUserLoggedIn = true;
					userInfo.user = response.data.user;
					this.setState({
						popupsOpen: popupsOpen,
						userInfo: userInfo
					});
					localStorage.setItem("loggedInUser", JSON.stringify(response.data));
					return true; // Successful log in
				}
			})
			.catch((error) => {
				console.log(error.response);
				userInfo.isUserLoggedIn = false;
				userInfo.isLoginValid = false;
				this.setState({
					userInfo: userInfo
				});
				return false; // Failed to log in (invalid credentials)
			});
	};

	/**
	 * A function to let the user sign up
	 * @param {string} username
	 * @param {string} password
	 * 
	 * @returns true if succesful, else false
	 */
	signUpUser = async (username, password) => {
		const popupsOpen = this.state.popupsOpen;
		const userInfo = this.state.userInfo;

		await axios.post('http://localhost:2006/auth/register/', {
			email: username,
			password: password

		})
			.then((response) => {
				if (response.status === 201) {
					popupsOpen.isLoginPageOpen = false;
					popupsOpen.isSignUpPageOpen = false;
					userInfo.isUserLoggedIn = true;
					userInfo.user = response.data.user;
					userInfo.isSignupValid = true;
					this.setState({
						popupsOpen: popupsOpen,
						userInfo: userInfo
					});
					localStorage.setItem("loggedInUser", JSON.stringify(response.data));
					return true; // Successful signup
				}
			})
			.catch((error) => {
				console.log(error.response);
				userInfo.isUserLoggedIn = false;
				userInfo.isLoginValid = false;
				userInfo.isSignupValid = false;
				this.setState({
					userInfo: userInfo
				});
				return false; // Failed to signup (duplicate username)
			})
			.finally(() => { ; });
	};

	/**
	 * A function to update the user info
	 * @param {string} username
	 * @param {string} password
	 * 
	 * @returns true if succesful, else false
	 */
	updateUser = async (username, newUsername) => {
		const popupsOpen = this.state.popupsOpen;
		const userInfo = this.state.userInfo;

		await axios.post('http://localhost:2006/auth/update/', {
			email: username,
			newUsername: newUsername
		})
			.then((response) => {
				if (response.status === 201) {
					localStorage.clear();
					popupsOpen.isAccountPageOpen = false;
					userInfo.user = response.data;
					this.setState({
						popupsOpen: popupsOpen,
						userInfo: userInfo
					});
					localStorage.setItem("loggedInUser", JSON.stringify(response));
					return true; // Successful log in
				}
			})
			.catch((error) => {
				console.log(error.response);
				return false; // Failed to log in (invalid credentials)
			});
	};

	/**
	 * A function to let the user sign out of their account
	 */
	signUserOut = () => {
		this.resetAllOverlay();
		const userInfo = this.state.userInfo;
		userInfo.isUserLoggedIn = false;
		userInfo.user = {};
		this.setState({ userInfo: userInfo });
		localStorage.clear();
	};

	/**
	 * A helper function to reset then set the sorting choices for the list page
	 * @param {*} id 
	 * @param {*} key
	 */
	resetThenSetSortingChoices = (id, key) => {
		const temp = this.state.sortingChoices;

		temp.forEach((item) => item.selected = false);
		temp[id].selected = true;
		this.setState({
			[key]: temp,
			sortingChoice: temp[id].title
		});
	};

	/**
	 * A helper function reset all overlay open boolean to false
	 */
	resetAllOverlay = () => {
		this.setState({
			popupsOpen:
			{
				isLoginPageOpen: false,
				isSignUpPageOpen: false,
				isHelpPageOpen: false,
				isSettingsPageOpen: false,
				isAccountPageOpen: false
			}
		});
	};

	/**
	 * A helper function to set the dietary restrictions for the app
	 * @param {*} id 
	 * @param {*} key 
	 */
	setDietaryRestrictions = (id, key) => {
		const temp = this.state.dietaryRestrictions;

		temp[id].selected = !temp[id].selected;

		this.setState({
			[key]: temp
		});
	};

	/**
	 * A helper function to render the header
	 * @returns An HTML div for the header
	 */
	renderHeader() {
		return (<div className="top-container">
			<div className="top-title" onClick={this.handleHomePageButton}><span style={{ color: "white" }}>EXTRA</span><span style={{ color: "#0B963A" }}>VEGAN</span><span
				style={{ color: "black" }} >ZA</span>
			</div>
		</div>);
	}

	/**
	 * A helper function to render the footer
	 * @param {boolean} buttons A boolean for rendering the buttons
	 * @returns An HTML div for the footer
	 */
	renderFooter(buttons = true) {
		if (buttons) {
			const location = window.location.href.split('/').pop();
			return (<div className="bottom-container">
				<div className="bottom-button-container">
					<Link className={`bottom-button ${location === 'map' ? 'bottom-button-bordered' : 'bottom-button-unbordered'}`} onClick={this.handleMapButton} to="/map">
						<img className="bot-img" src="images/map.png" alt="map button" id="map-button"></img>
					</Link>

					<Link className={`bottom-button ${location === 'list' ? 'bottom-button-bordered' : 'bottom-button-unbordered'}`} onClick={this.handleListButton} to='/list'>
						<img className="bot-img" src="images/list.png" alt="list button" id="list-button"></img>
					</Link>

					<Link className={`bottom-button ${location === 'community' ? 'bottom-button-bordered' : 'bottom-button-unbordered'}`} onClick={this.handleCommunityButton} to='/community'>
						<img className="bot-img" src="images/community.png" alt="community button" id="community-button"></img>
					</Link>
				</div>
			</div>);
		}
		else {
			return (<div className="bottom-container">
			</div>);
		}
	}

	/**
	 * A helper function that renders the content of the page based on the state of the app
	 * @returns A React Fragment for the content to be displayed
	 */
	renderMiddleContent = () => {
		return (
			<Routes>
				<Route path='/' element={
					<Navigate to={"/map"} />
				}>
				</Route>
				<Route path='/list' element={
					< ListPage
						handleAccountButton={this.handleAccountButton}
						handleHelpButton={this.handleHelpButton}
						handleSettingsButton={this.handleSettingsButton}

						listContent={this.state.sortingChoices}
						resetThenSet={this.resetThenSetSortingChoices}

						dietaryRestrictions={this.state.dietaryRestrictions}
						setDietaryRestrictions={this.setDietaryRestrictions} >
					</ListPage >
				}>
				</Route>
				<Route path='/map' element={
					<MapPage
						handleAccountButton={this.handleAccountButton}
						handleHelpButton={this.handleHelpButton}
						handleSettingsButton={this.handleSettingsButton}

						dietaryRestrictions={this.state.dietaryRestrictions}
						setDietaryRestrictions={this.setDietaryRestrictions}>
					</MapPage>
				}>
				</Route>
				<Route path='/community' element={
					<CommunityPage
						handleAccountButton={this.handleAccountButton}
						handleHelpButton={this.handleHelpButton}
						handleSettingsButton={this.handleSettingsButton}

						dietaryRestrictions={this.state.dietaryRestrictions}
						setDietaryRestrictions={this.setDietaryRestrictions}>
					</CommunityPage>
				}>
				</Route>
			</Routes>
		);
	};

	/**
	 * A helper function that renders the login overlay
	 * @returns An overlay component for the login page
	 */
	renderLoginOverlay = () => {
		if (this.state.popupsOpen.isLoginPageOpen) {
			return (<OverlayComponent isOpen={this.state.popupsOpen.isLoginPageOpen} resetAllOverlay={this.resetAllOverlay}>
				<LoginPage handleSignUpButton={this.handleSignUpButton} isLoginValid={this.state.userInfo.isLoginValid} authenticateUser={this.authenticateUser}></LoginPage>
			</OverlayComponent>);
		}
		else {
			return;
		}
	};

	/**
	 * A helper function that renders the signup overlay
	 * @returns An overlay component for the signup page
	 */
	renderSignupOverlay = () => {
		if (this.state.popupsOpen.isSignUpPageOpen) {
			return (<OverlayComponent isOpen={this.state.popupsOpen.isSignUpPageOpen} resetAllOverlay={this.resetAllOverlay}>
				<SignUpPage handleLogInButton={this.handleLogInButton} isSignupValid={this.state.userInfo.isSignupValid} signUpUser={this.signUpUser}></SignUpPage>
			</OverlayComponent>);
		}
		else {
			return;
		}
	};

	/**
	 * A helper function that renders the help overlay
	 * @returns An overlay component for the help page
	 */
	renderHelpOverlay = () => {
		if (this.state.popupsOpen.isHelpPageOpen) {
			return (<OverlayComponent isOpen={this.state.popupsOpen.isHelpPageOpen} resetAllOverlay={this.resetAllOverlay}>
				<HelpPage></HelpPage>
			</OverlayComponent>);
		}
		else {
			return;
		}
	};

	/**
	 * A helper function that renders the settings overlay
	 * @returns An overlay component for the settings page
	 */
	renderSettingsOverlay = () => {
		if (this.state.popupsOpen.isSettingsPageOpen) {
			return (<OverlayComponent isOpen={this.state.popupsOpen.isSettingsPageOpen} resetAllOverlay={this.resetAllOverlay}>
				<SettingsPage></SettingsPage>
			</OverlayComponent>);
		}
		else {
			return;
		}
	};

	/**
	 * A helper function that renders the account overlay
	 * @returns An overlay component for the account page
	 */
	renderAccountOverlay = () => {
		if (this.state.popupsOpen.isAccountPageOpen) {
			return (<OverlayComponent isOpen={this.state.popupsOpen.isAccountPageOpen} resetAllOverlay={this.resetAllOverlay}>
				<AccountPage user={this.state.userInfo.user} signUserOut={this.signUserOut} updateUser={this.updateUser}></AccountPage>
			</OverlayComponent>);
		}
		else {
			return;
		}
	};

	render() {
		return (
			<Fragment>
				{this.renderHeader()}

				{this.renderMiddleContent()}
				{this.renderFooter()}

				{this.renderLoginOverlay()}
				{this.renderSignupOverlay()}
				{this.renderHelpOverlay()}
				{this.renderSettingsOverlay()}
				{this.renderAccountOverlay()}
			</Fragment>

		);
	}
}

export default App;