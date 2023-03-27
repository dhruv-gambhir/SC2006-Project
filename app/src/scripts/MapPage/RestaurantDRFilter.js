import { Component, Fragment, useState, useEffect, useCallback } from "react";
import axios from "axios";

function RestaurantDRFilter(props) {
	const [data, setData] = useState([]);
	const [filteredRestaurants, setFilteredRestaurants] = useState([]);
	const [outputRestaurants, setOutputRestaurants] = useState([]);
	const [anyhow, setAnyhow] = useState(0);

	useEffect(() => {
		async function help() {
			var buf = [];
			await axios.get('http://localhost:2007/api/restaurants', {})
				.then((response) => {
					if (response.status === 200) {
						response.data.restaurants.forEach(element => {
							if (!buf.some((obj) => (obj.id === element.id))) {
								buf.push(element);
							}
						});
					}
					setData(buf);
				});
		}
		help();
	}, [props.mapSearchInfo.address]);

	useEffect(() => {
		setFilteredRestaurants(filterRestaurants());
	}, [data]);

	useEffect(() => {
		setOutputRestaurants(filterRestaurantsWithinDistance());
	}, [filteredRestaurants]);

	useEffect(() => {
		console.log("Filter has " + outputRestaurants.length);
		props.setFilteredRestaurantsWithinRestaurants(outputRestaurants);
		setAnyhow(anyhow + 1);
	}, [outputRestaurants]);

	const { dietaryRestrictions, mapSearchInfo } = props;

	function filterRestaurants() {
		return data.filter(restaurant => {
			const selectedRestrictions = dietaryRestrictions.filter(restriction => restriction.selected);
			const hasVegan = selectedRestrictions.some(restriction => restriction.title === 'vegan');
			const hasVegetarian = selectedRestrictions.some(restriction => restriction.title === 'vegetarian');
			const hasGlutenFree = selectedRestrictions.some(restriction => restriction.title === 'gluten-free');
			const hasLactoseFree = selectedRestrictions.some(restriction => restriction.title === 'lactose-free');

			if (hasVegan && hasVegetarian && hasGlutenFree && hasLactoseFree) {
				return restaurant.vegan > 5 && restaurant.vegetarian > 5 && restaurant.glutenFree > 5 && restaurant.lactoseFree > 5;
			} else if (hasVegan && hasVegetarian && hasGlutenFree) {
				return restaurant.vegan > 5 && restaurant.vegetarian > 5 && restaurant.glutenFree > 5;
			} else if (hasVegan && hasVegetarian && hasLactoseFree) {
				return restaurant.vegan > 5 && restaurant.vegetarian > 5 && restaurant.lactoseFree > 5;
			} else if (hasVegetarian && hasGlutenFree && hasLactoseFree) {
				return restaurant.vegetarian > 5 && restaurant.glutenFree > 5 && restaurant.lactoseFree > 5;
			} else if (hasVegan && hasGlutenFree && hasLactoseFree) {
				return restaurant.vegan > 5 && restaurant.glutenFree > 5 && restaurant.lactoseFree > 5;
			} else if (hasVegan && hasVegetarian) {
				return restaurant.vegan > 5 && restaurant.vegetarian > 5;
			} else if (hasVegan && hasGlutenFree) {
				return restaurant.vegan > 5 && restaurant.glutenFree > 5;
			} else if (hasVegan && hasLactoseFree) {
				return restaurant.vegan > 5 && restaurant.lactoseFree > 5;
			} else if (hasVegetarian && hasGlutenFree) {
				return restaurant.vegetarian > 5 && restaurant.glutenFree > 5;
			} else if (hasVegetarian && hasLactoseFree) {
				return restaurant.vegetarian > 5 && restaurant.lactoseFree > 5;
			} else if (hasGlutenFree && hasLactoseFree) {
				return restaurant.glutenFree > 5 && restaurant.lactoseFree > 5;
			} else if (hasVegan) {
				return restaurant.vegan > 5;
			} else if (hasVegetarian) {
				return restaurant.vegetarian > 5;
			} else if (hasGlutenFree) {
				return restaurant.glutenFree > 5;
			} else if (hasLactoseFree) {
				return restaurant.lactoseFree > 5;
			}
			return true;
		});
	}

	function calculateDistance(lat1, lng1, lat2, lng2) {
		const R = 6371; // Radius of the earth in km
		const dLat = deg2rad(lat2 - lat1);
		const dLng = deg2rad(lng2 - lng1);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
			Math.sin(dLng / 2) * Math.sin(dLng / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c; // Distance in km
		return distance;
	}

	function deg2rad(deg) {
		return deg * (Math.PI / 180);
	}

	function filterRestaurantsWithinDistance() {
		return filteredRestaurants.filter(restaurant => {
			const distance = calculateDistance(mapSearchInfo.lat, mapSearchInfo.lng, restaurant.y, restaurant.x);
			return distance <= 2; // Filter within 2 km
		}).map(restaurant => ({ name: restaurant.name, x: restaurant.x, y: restaurant.y }));
	}

	return (
		<div>
			{/* your component JSX here */}
		</div>
	);
}


export default RestaurantDRFilter;
