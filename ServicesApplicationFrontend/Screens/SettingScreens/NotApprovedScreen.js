import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'

export default function NotApprovedScreen({navigation}) {
  return (
    <View>
      <Text>Your Work account has not yet been approved </Text>
      <Button onPress={()=> navigation.replace('WorkerBuildProfileScreen')}> Go to Build Profile </Button>
    </View>
  )
}