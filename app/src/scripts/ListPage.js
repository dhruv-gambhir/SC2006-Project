import { Component } from "react";
import DietaryRestrictionsSidebar from "./DietaryRestrictionsSidebar";
import DropdownMenu from "./dropdown";

export default class ListPage extends Component {
    render() {
        return (<div className='middle-container'>
            <div className="middle-container-left-side">
                <DietaryRestrictionsSidebar
                    className='uid'
                    list={this.props.dietaryRestrictions}
                    resetThenSet={this.props.setDietaryRestrictions}>
                </DietaryRestrictionsSidebar>
            </div>

            <div className="middle-container-right-side">
                <div className="nav-container">
                    <div className="searchbar-container">
                        <input className="searchbar searchbar-smaller" type="text" placeholder="Search"></input>
                        <DropdownMenu
                            className="uid"
                            title={this.props.sortingChoices.find(x => x.selected).title}
                            list={this.props.sortingChoices}
                            resetThenSet={this.props.resetThenSetSortingChoices}>
                        </DropdownMenu>
                    </div>
                    <div className="right-buttons">
                        <div className="right-sidebar-button">
                            <img className="right-img" src="images/account.png" alt="account button" id="account-button" onClick={this.props.handleAccountButton}></img>
                        </div>
                        <div className="right-sidebar-button">
                            <img className="right-img" src="images/help.png" alt="help button" id="help-button" onClick={this.props.handleHelpButton}></img>
                        </div>
                        <div className="right-sidebar-button">
                            <img className="right-img" src="images/settings.png" alt="settings button" id="settings-button" onClick={this.props.handleSettingsButton}></img>
                        </div>
                    </div>
                </div>

                <div className="main-content-container">
                    I identify as a list
                </div>
            </div>
        </div>);
    }
}