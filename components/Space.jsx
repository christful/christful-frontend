import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { MaterialIcons, Ionicons} from "@expo/vector-icons";
import { Colors } from '@/constants/Colors'

export default function Space() {
  return (
    <View style={styles.item}>
          <View style={styles.itemContent}>
            <TouchableOpacity style={styles.addCommunity}>
              <Ionicons
                name="person"
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <View style={{flexDirection: 'column', justifyContent: "center", alignItems: "flex-start", marginLeft: 10}}>
                <Text style={styles.groupText}>Purity And Santification</Text>
                <Text>Shared 30mins ago</Text>
            </View>
          </View>
            <View style={{flexDirection: 'row', justifyContent: "flex-end", alignItems: "flex-end"}}>
            <MaterialIcons
                name="mic"
                size={24}
                color="grey"
              />
          <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        </View>
        </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    marginHorizontal: 20
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemParent: {
    padding: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
    width: "500px",
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  addCommunity: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: "100%",
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "reletive"
  },
  groupText: {
    fontWeight: 700,
  },
  joinButton: {
    backgroundColor: Colors.light.button,
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  joinButtonText: {
    color: "white"
  }
});