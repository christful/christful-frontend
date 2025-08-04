import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React from 'react'
import Space from '@/components/Space'

export default function space() {
  return (
   <View style={styles.container}>
      <ScrollView >
        <View style={styles.itemParent}>
      <Space />
      <Space />
      <Space />
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