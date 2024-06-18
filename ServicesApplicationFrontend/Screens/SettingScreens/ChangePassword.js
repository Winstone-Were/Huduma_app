import { View, Text } from 'react-native'
import React from 'react'

export default function ChangePassword() {
  return (
    <View>
      <Text>ChangePassword</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", marginHorizontal: 30 },
    input: { marginVertical: 5, borderRadius: 0 },
    row: {
      alignItems: "center",
      flexDirection: "row",
      marginVertical: 20,
      justifyContent: "space-between",
    },
    textContainer: { alignContent: 'center', alignItems: 'center' }
  
  });