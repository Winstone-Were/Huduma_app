import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Text, Button, ActivityIndicator } from 'react-native-paper';

import { StyleSheet, View } from 'react-native';
import * as Location from "expo-location";

const InitialRegion = {
    latitude: -1.2918808496837835,
    longitude: 36.814434219500434,
    latitudeDelta: 2,
    longitudeDelta: 2
}

export default function MapScreen(props) {

    const [currentLocation, setCurrentLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
    const [locationName, setLocationName] = useState();

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied");
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location.coords);
            //console.log(location);
            let {latitude, longitude} = location.coords;
            //console.log(await (Location.reverseGeocodeAsync({location, longitude})));
            let AreaName = await Location.reverseGeocodeAsync({latitude, longitude});
            setLocationName(AreaName[0].formattedAddress);
            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
            props.setStateCurrentLocation(location.coords);
            
        }
        getLocation();
    }, []);
    const updateRegion = async (region) => {
        setCurrentLocation(region);
        let {latitude, longitude} = currentLocation;
        let AreaName = await Location.reverseGeocodeAsync({latitude, longitude});
        setLocationName(AreaName[0].formattedAddress);
        props.setState(AreaName[0].formattedAddress);
    }
    return (
        <View style={styles.container}>
            {initialRegion && (
                <MapView style={styles.map} initialRegion={initialRegion} onRegionChangeComplete={(region)=> updateRegion(region)}>
                    {currentLocation && (
                        <Marker
                            coordinate={{
                                latitude: currentLocation.latitude,
                                longitude: currentLocation.longitude,
                            }}
                            title="Your Location"
                        />
                    )}
                </MapView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom:20
    },
    map: {
        width: '100%',
        height:'100%',
    },
});
