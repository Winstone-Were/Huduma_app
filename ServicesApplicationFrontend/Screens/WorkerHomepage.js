import React from 'react';
import { View, Text } from 'react-native';
import { BottomNavigation, Title, IconButton, Icon } from 'react-native-paper';

const WorkerHomepage = () => {
  const [index, setIndex] = React.useState(0);

  const routes = [
    { key: 'home', title: 'Home', Icon: 'home' },
    { key: 'jobs', title: 'Jobs', Icon: 'work' },
    { key: 'pending', title: 'Pending', Icon: 'timer' },
    { key: 'settings', title: 'Settings', Icon: 'settings' },
  ];

  const renderScene = BottomNavigation.SceneMap({//will make screens for this later
    home: () => <HomeScreen />,
    jobs: () => <JobsScreen />,
    pending: () => <PendingScreen />,
    settings: () => <SettingsScreen />,
  });
//to take you to some specific page
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}>
      {routes.map((route, index) => (
        <BottomNavigation.Tab
          key={route.key}
          icon={() => <IconButton icon={route.Icon} />}
          label={()=><Title label={route.title}/>}
          onPress={() => setIndex(index)}
          />
        ))}
      </BottomNavigation>
  );
};

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
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

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  );
};

export default WorkerHomepage;