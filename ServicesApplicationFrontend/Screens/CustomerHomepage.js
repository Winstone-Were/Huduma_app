// import React from 'react';
// import { View, Text } from 'react-native';
// import { BottomNavigation, IconButton, Title } from 'react-native-paper';

// const CustomerHomepage = () => {
//   const [index, setIndex] = React.useState(0);

//   const routes = [
//     { key: 'home', title: 'Home', icon: 'home' },
//     { key: 'request', title: 'Request', icon: 'add-circle' },
//     { key: 'history', title: 'History', icon: 'history' },
//     { key: 'settings', title: 'Settings', icon: 'settings' },
//   ];

//   // const renderScene = BottomNavigation.SceneMap({
//   //   home: () => <HomeScreen />,
//   //   request: () => <RequestScreen />,
//   //   history: () => <HistoryScreen />,
//   //   settings: () => <SettingsScreen />,
//   // });

//   return (
//     <BottomNavigation
//       navigationState={{ index, routes }}
//       onIndexChange={setIndex}
//       renderScene={renderScene}>
//       {routes.map((route, index) => (
//         <BottomNavigation.Tab
//           key={route.key}
//           icon={() => <IconButton icon={route.icon} />}
//           label={()=><Title label={route.title}/>}
//           onPress={() => setIndex(index)}
//         />
//       ))}
//     </BottomNavigation>
//   );
// };

// const HomeScreen = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Home Screen</Text>
//     </View>
//   );
// };

// const RequestScreen = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Request Screen</Text>
//     </View>
//   );
// };

// const HistoryScreen = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>History Screen</Text>
//     </View>
//   );
// };

// const SettingsScreen = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Settings Screen</Text>
//     </View>
//   );
// };

// export default CustomerHomepage;