import * as React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';

const occupations = [
  //ongeza more occupations....nb require is required
  { id: '1', name: 'Electrician', icon: require( '../../assets/Icons/electrician.png') },//
  { id: '2', name: 'Maid', icon: require('../../assets/Icons/maid.jpg') },
  { id: '3', name: 'Gardener', icon: require('../../assets/Icons/gardener.png') },
  { id: '4', name: 'Chef', icon: require('../../assets/Icons/chef.png') },
  { id: '5', name: 'Exterminator', icon: require('../../assets/Icons/exterminator.png') },
  { id: '6', name: 'Plumber', icon: require('../../assets/Icons/plumber.png') },
   { id: '5', name: 'Carpenter', icon: require('../../assets/Icons/carpenter.png') },
   { id: '7', name: 'Pet services', icon: require('../../assets/Icons/dogwalker.png') },
  
];

const OccupationItem = ({ name, icon, onPress }) => (
  <TouchableOpacity style={styles.occupationItem} onPress={onPress}>
    <Image source={icon} style={styles.icon} />
    <Text style={styles.occupationText}>{name}</Text>
  </TouchableOpacity>
);

const JobScreen = ({ navigation }) => {// will need to add nav. for the different type of occupation tables 
  const handleJobPress = (jobType) => {
    console.log("Selected job type:", jobType);//show that its clickable
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.grid}>
        {occupations.map((occupation) => (
          <OccupationItem
            key={occupation.id}
            name={occupation.name}
            icon={occupation.icon}
            onPress={() => handleJobPress(occupation.name)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20232a',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  occupationItem: {
    width: '40%',
    backgroundColor: '#333',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  occupationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default JobScreen;
