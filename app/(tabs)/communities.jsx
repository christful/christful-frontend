import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from '@/constants/Colors';
import Group from '@/components/Group'

export default function Page() {
  return (
    <View style={styles.container}>
      <ScrollView >
        <View style={styles.itemParent}>
          <TouchableOpacity style={styles.addCommunity}>
            <MaterialIcons
              name="groups"
              size={24}
              color="white"
            />
            <MaterialIcons
              name="add-circle"
              size={24}
              color={Colors.light.icon}
              style={{position: "absolute", bottom: -5, right: -5}}
            />
             
          </TouchableOpacity>
          <Text style={styles.groupText}>New Community</Text>
        </View>
        <View style={styles.community}>
          <View style={styles.item}>
            <View style={styles.itemContent}>
              <TouchableOpacity style={styles.addCommunity}>
                <MaterialIcons
                  name="groups"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              <Text style={styles.groupText}>The Inkreo Community</Text>
            </View>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
          <View style={{borderTopWidth: 1,
      borderTopColor: "#ccc",}}>
            <Group />
            <Group />
            <Group />
          </View>
        </View>
        <View style={styles.community}>
          <View style={styles.item}>
            <View style={styles.itemContent}>
              <TouchableOpacity style={styles.addCommunity}>
                <MaterialIcons
                  name="groups"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              <Text style={styles.groupText}>The Inkreo Community</Text>
            </View>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
          <View style={{borderTopWidth: 1,
      borderTopColor: "#ccc",}}>
            <Group />
            <Group />
            <Group />
          </View>
        </View>
        
      </ScrollView >
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  itemParent: {
    padding: 15,
    width: "500px",
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    padding: 15,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  community: {
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
    alignItems: "center"

  },
  addCommunity: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 8,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "reletive"
  },
  groupText: {
    fontWeight: 700,
    marginLeft: 10
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