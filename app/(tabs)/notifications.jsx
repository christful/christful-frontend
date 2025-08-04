import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React from 'react'
import Notification from '@/components/Notification'

export default function notification() {
  return (
   <View style={styles.container}>
      <ScrollView >
        <View style={styles.itemParent}>
      <Notification />
      <Notification />
      <Notification />
      <Notification />
      <Notification />
      <Notification />
      <Notification />
      <Notification />
      <Notification />
    </View>
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  itemParent: {
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
    alignItems: "center",
  }
})