import React from 'react';
import { View, Text } from 'react-native';
import { BottomNavigation, IconButton } from 'react-native-paper';
// import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

// const Tab = createMaterialBottomTabNavigator();

// function MyTabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Settings" component={SettingsScreen} />
//     </Tab.Navigator>
//   );
// }

const WorkerHomepage = () => {
  const [index, setIndex] = React.useState(0);

  const routes = [
    { key: 'jobs', title: 'Jobs', icon: 'briefcase' },
    { key: 'pending', title: 'Pending', icon: 'clock' },
    { key: 'profile', title: 'Profile', icon: 'account' },
  ];

  const render= () => {
    switch (index) {
      case 0:
        return <JobsScreen />;
      case 1:
        return <PendingScreen />;
      case 2:
        return <ProfileScreen />;
      default:
        return <JobsScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {render()}
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
      >
        {routes.map((route, i) => (
          <BottomNavigation.Tab
            key={route.key}
            icon={() => <IconButton icon={route.icon} />}
            label={route.title}
            onPress={() => setIndex(i)}
          />
        ))}
        <BottomNavigation.Action
          icon={() => <IconButton icon="settings" />}
          onPress={() => console.log('Settings pressed')}
          style={{ position: 'absolute', right: 16, bottom: 16 }}
        />
      </BottomNavigation>
    </View>
  );
};

const JobsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Jobs Screen</Text>
    </View>
  );
};

const PendingScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Pending Screen</Text>
    </View>
  );
};

const ProfileScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
};

export default WorkerHomepage;