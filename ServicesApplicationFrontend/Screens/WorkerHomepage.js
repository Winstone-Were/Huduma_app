import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import JobScreen from './Jobs';
import ProfileScreen from './Profile';
import PendingScreen from './Pending';

const Tab = createMaterialBottomTabNavigator();

function WorkerHomepage() {
  return (
    <Tab.Navigator
      initialRouteName="Jobs"
      activeColor="#e91e63"
      barStyle={{ backgroundColor: 'tomato' }}
    >
      <Tab.Screen
        name="Jobs"
        component={JobScreen}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="briefcase" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Pending"
        component={PendingScreen}
        options={{
          tabBarLabel: 'Pending',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clock" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default WorkerHomepage;