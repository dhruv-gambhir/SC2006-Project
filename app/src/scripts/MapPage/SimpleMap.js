import React, { Component, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

/**
 * A React component to render the googlemap 
 * @date 20/13/2023 - 11:51:00 am
 *
 * @export
 * @class SimpleMap
 * @typedef {SimpleMap}
 * @extends {Component}
 */
const containerStyle = {
  width: '100%',
  height: '100%'
};

// Define the SimpleMap component
export default class SimpleMap extends Component {
  constructor(props) {
    super(props);
    // Set the initial state of the component
    this.state = {
      showInfoWindow: false // Whether to show the info window or not
    };
  }

  // A method that toggles the "showInfoWindow" property in the component's state
  handleMarkerClick = () => {
    this.setState({ showInfoWindow: !this.state.showInfoWindow });
  };

  // A method that sets the "showInfoWindow" property to false
  handleInfoWindowClose = () => {
    this.setState({ showInfoWindow: false });
  };

  // The render method for the component
  render() {
    return (
      // Use the LoadScript component to load the Google Maps API with the provided API key
      <LoadScript
        googleMapsApiKey="AIzaSyDGlFQgWtdKStDPPWSahOj9PQoXDP6aIpo"
      >
        {/* Use the GoogleMap component to display the map */}
        <GoogleMap
          mapContainerStyle={containerStyle} // Set the size of the map container
          center={this.props.center} // Set the center of the map to the "center" prop passed in
          zoom={13} // Set the zoom level of the map
        >
          {/* Use the Marker component to display a marker on the map */}
          <Marker
            position={this.props.center} // Set the position of the marker to the "center" prop passed in
            onClick={this.handleMarkerClick} // Set the onClick handler for the marker
          />

          {/* Use the InfoWindow component to display an info window on the map */}
          {/* The info window will be displayed if the "showInfoWindow" property in the component's state is true */}
          {this.state.showInfoWindow && (
            <InfoWindow
              position={this.props.center} // Set the position of the info window to the "center" prop passed in
              onCloseClick={this.handleInfoWindowClose} // Set the onCloseClick handler for the info window
            >
              <div>
                <h3>{this.props.address}</h3> {/* Display the address passed in as a prop */}
                <p>Info window content goes here.</p>

                {/* Embed a Street View panorama using the Google Maps Embed API */}
                {/* The URL of the panorama is constructed using the latitude and longitude of the center of the map passed in as props */}
                <iframe
                  width="100%"
                  height="200"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed/v1/streetview?key=AIzaSyDGlFQgWtdKStDPPWSahOj9PQoXDP6aIpo&location=${this.props.center.lat},${this.props.center.lng}&heading=210&pitch=10`}
                  allowFullScreen
                />
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    )
  }
}
