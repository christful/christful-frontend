import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Posts from "@/components/Posts";
import { FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useApi from "@/hooks/useApi";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

// Sample inspirational content
const DAILY_INSPIRATIONS = [
  {
    id: 1,
    title: "Verse of the Day",
    content: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11"
  },
  {
    id: 2,
    title: "Word of Encouragement",
    content: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    reference: "Philippians 4:6"
  },
  {
    id: 3,
    title: "Daily Wisdom",
    content: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6"
  }
];

export default function Page() {
  const { getAllPosts } = useApi();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [response, setResponse] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentInspiration, setCurrentInspiration] = useState(DAILY_INSPIRATIONS[0]);

  // Animation values
  const menuHeight = useSharedValue(50);
  const menuOpacity = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  // Timer for inspiration rotation
  const inspirationTimer = useRef(null);

  useEffect(() => {
    handleFetch();

    // Rotate inspirations every 10 seconds
    inspirationTimer.current = setInterval(() => {
      setCurrentInspiration(prev => {
        const currentIndex = DAILY_INSPIRATIONS.findIndex(i => i.id === prev.id);
        const nextIndex = (currentIndex + 1) % DAILY_INSPIRATIONS.length;
        return DAILY_INSPIRATIONS[nextIndex];
      });
    }, 10000);

    return () => {
      if (inspirationTimer.current) {
        clearInterval(inspirationTimer.current);
      }
    };
  }, []);

  const handleFetch = async () => {
    const result = await getAllPosts(setLoading, setError);
    setResponse(result);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);

    if (!isMenuOpen) {
      // Open menu
      menuHeight.value = withSpring(200, { damping: 15 });
      menuOpacity.value = withTiming(1, { duration: 300 });
      iconRotation.value = withSpring(45, { damping: 15 });
      buttonScale.value = withSpring(1.1, { damping: 15 });
    } else {
      // Close menu
      menuHeight.value = withSpring(50, { damping: 15 });
      menuOpacity.value = withTiming(0, { duration: 200 });
      iconRotation.value = withSpring(0, { damping: 15 });
      buttonScale.value = withSpring(1, { damping: 15 });
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      handleFetch();
      setRefreshing(false);
    }, 2000);
  }, []);

  // Animated styles
  const menuContainerStyle = useAnimatedStyle(() => {
    return {
      height: menuHeight.value,
      opacity: menuOpacity.value,
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${iconRotation.value}deg` }],
    };
  });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={30} color={Colors.light.icon} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Floating Action Button Menu */}
      <View style={styles.fabContainer}>
        <Animated.View style={[styles.menuContainer, menuContainerStyle]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.navigate("/overlayOptions/post")}
          >
            <FontAwesome6
              name="plus"
              size={20}
              color={Colors.light.icon}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Create Post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.navigate("/audio")}
          >
            <FontAwesome5
              name="microphone"
              size={20}
              color={Colors.light.icon}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Record Audio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.navigate("/bible")}
          >
            <FontAwesome5
              name="book-open"
              size={20}
              color={Colors.light.icon}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Read Bible</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.fabButton, buttonStyle]}>
          <TouchableOpacity
            style={styles.fabTouchable}
            onPress={toggleMenu}
            activeOpacity={0.8}
          >
            <Animated.View style={iconStyle}>
              <FontAwesome5 name="plus" size={24} color={"white"} />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Content */}
      <FlatList
        data={response}
        ListHeaderComponent={
          <View style={styles.inspirationContainer}>
            <View style={styles.inspirationHeader}>
              <Text style={styles.inspirationTitle}>{currentInspiration.title}</Text>
              <FontAwesome5 name="bible" size={20} color={Colors.light.tint} />
            </View>
            <Text style={styles.inspirationContent}>"{currentInspiration.content}"</Text>
            <Text style={styles.inspirationReference}>{currentInspiration.reference}</Text>
          </View>
        }
        renderItem={({ item }) => <Posts data={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.light.tint]}
            tintColor={Colors.light.tint}
          />
        }
        keyExtractor={(item) => item?.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    alignItems: "flex-end",
    zIndex: 100,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.button,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabTouchable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    width: 200,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuIcon: {
    marginRight: 15,
    width: 24,
    textAlign: "center",
  },
  menuText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  inspirationContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 20,
    margin: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.tint,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inspirationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  inspirationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.tint,
  },
  inspirationContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    fontStyle: "italic",
    marginBottom: 10,
  },
  inspirationReference: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
    fontFamily: "serif",
  },
  listContent: {
    paddingBottom: 80,
  },
});