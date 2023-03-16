import { Component, Fragment } from "react";
import Search from "../Utils/Search";
import SimpleMap from "./SimpleMap";

/**
 * A React component to render the map page
 * @date 3/13/2023 - 2:04:02 PM
 *
 * @export
 * @class MapPage
 * @typedef {MapPage}
 * @extends {Component}
 */

export default class MapPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 1.34640300173588,
            lng: 103.686721630348,
            address: 'Nanyang Technological University Hall 1'
        };
        this.handleCoordinatesChange = this.handleCoordinatesChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
    }

    handleCoordinatesChange(lat, lng) {
        this.setState({
            lat: lat,
            lng: lng
        });
    }

    handleAddressChange(address) {
        this.setState({
            address: address
        });
    }

    render() {
        return (
            <Fragment>
                <div className="main-content-container">
                    <Search onCoordinatesChange={this.handleCoordinatesChange} onAddressChange={this.handleAddressChange} />
                    {console.log(this.state.address)}
                    {console.log(this.state.lat)}
                    {console.log(this.state.lng)}

                    <SimpleMap center={{ lat: Number(this.state.lat), lng: Number(this.state.lng) }} address={this.state.address}/>
                </div>
            </Fragment>
        );
    }
}
