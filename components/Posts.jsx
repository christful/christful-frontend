import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Share,
  Alert
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useVideoPlayer, VideoView } from "expo-video";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

// Helper function to check media type
const isImage = (url) => /\.(jpeg|jpg|png|gif|webp)$/i.test(url);
const isVideo = (url) => /\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i.test(url);

export default function Posts({ data }) {
  const { media_url } = data;
  const videoPlayer = useVideoPlayer(media_url, (player) => player.pause());
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [textExpanded, setTextExpanded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const reactionAnim = useRef(new Animated.Value(1)).current;
  const previewVideoPlayer = useVideoPlayer(media_url, (player) => player.pause());

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleReactionPress = () => {
    // Scale animation for reaction buttons
    Animated.sequence([
      Animated.timing(reactionAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(reactionAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const actionButtons = [
    { icon: "flag", text: "Report" },
    { icon: "share-alt", text: "Share" },
    { icon: "bookmark", text: "Save" },
    { icon: "link", text: "Copy Link" },
  ];

  const handleSaveMedia = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant media access to save files');
        return;
      }

      const fileUri = FileSystem.cacheDirectory + media_url.split('/').pop();
      const downloadResult = await FileSystem.downloadAsync(media_url, fileUri);

      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync('Downloads', asset, false);

      Alert.alert('Success', 'Media saved to your photos');
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('Error', 'Failed to save media');
    }
  };

  const handleShareMedia = async () => {
    try {
      await Share.share({
        message: `Check out this post from ${data.firstname} ${data.lastname}`,
        url: media_url,
      });
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  const handleMediaPress = () => {
    if (media_url) {
      setPreviewVisible(true);
      if (isVideo(media_url)) {
        previewVideoPlayer.play();
      }
    }
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds} seconds ago`;

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const count = Math.floor(seconds / secondsInUnit);
      if (count >= 1) {
        if (unit === "day") {
          if (count === 1) return "Yesterday";
          if (count <= 7) return `${count} days ago`;
        }
        return `${count} ${unit}${count !== 1 ? 's' : ''} ago`;
      }
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.reactContainer}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            {data?.media_url ? (
              <Image
                source={require("../assets/images/react-logo.png")}
                style={styles.profileImage}
              />
            ) : (
              <FontAwesome
                name="user-circle"
                size={40}
                color="#d5d5d5"
              />
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {data.firstname} {data.lastname}
              </Text>
              <Text style={styles.timestamp}>
                {getRelativeTime(data.created_at)}
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.followButton}
              activeOpacity={0.7}
            >
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              activeOpacity={0.7}
            >
              <FontAwesome5
                name="ellipsis-h"
                size={20}
                color={Colors.light.tint}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.postContainer}>
        {data?.content && (
          <View>
            <Text
              style={styles.postText}
              numberOfLines={textExpanded ? undefined : 4}
            >
              {data?.content}
            </Text>
            {!textExpanded && data.content.length > 150 && (
              <TouchableOpacity
                onPress={() => setTextExpanded(true)}
                style={styles.seeMoreButton}
              >
                <Text style={styles.seeMoreText}>See more</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {media_url && (
          <View>
            {isImage(media_url) ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleMediaPress}
              >

                <Image
                  source={{ uri: media_url }}
                  style={styles.media}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ) : isVideo(media_url) ? (
              <VideoView
                style={styles.media}
                player={videoPlayer}
                allowsFullscreen
                allowsPictureInPicture
              />
            ) : null}
          </View>
        )}

        <View style={styles.reactionsContainer}>
          <Animated.View
            style={[styles.reactActions, { transform: [{ scale: reactionAnim }] }]}
          >
            <TouchableOpacity
              style={styles.reactionButton}
              onPress={handleReactionPress}
              activeOpacity={0.8}
            >
              <FontAwesome name="thumbs-up" size={20} color={Colors.light.tint} />
              <Text style={styles.reactionCount}>5.1k</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[styles.reactActions, { transform: [{ scale: reactionAnim }] }]}
          >
            <TouchableOpacity
              style={styles.reactionButton}
              onPress={handleReactionPress}
              activeOpacity={0.8}
            >
              <FontAwesome name="thumbs-down" size={20} color={Colors.light.tint} />
              <Text style={styles.reactionCount}>124</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[styles.reactActions, { transform: [{ scale: reactionAnim }] }]}
          >
            <TouchableOpacity
              style={styles.reactionButton}
              onPress={handleReactionPress}
              activeOpacity={0.8}
            >
              <FontAwesome name="comment" size={20} color={Colors.light.tint} />
              <Text style={styles.reactionCount}>423</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[styles.reactActions, { transform: [{ scale: reactionAnim }] }]}
          >
            <TouchableOpacity
              style={styles.reactionButton}
              onPress={handleReactionPress}
              activeOpacity={0.8}
            >
              <FontAwesome name="share" size={20} color={Colors.light.tint} />
              <Text style={styles.reactionCount}>87</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Action Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {actionButtons.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalOption}
                onPress={() => {
                  console.log(`Selected: ${action.text}`);
                  setModalVisible(false);
                }}
              >
                <FontAwesome5
                  name={action.icon}
                  size={18}
                  color={Colors.light.tint}
                  style={styles.modalIcon}
                />
                <Text style={styles.modalText}>{action.text}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Media Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent={true}
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.previewContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setPreviewVisible(false);
              previewVideoPlayer.pause();
            }}
          >
            <FontAwesome5 name="times" size={24} color="white" />
          </TouchableOpacity>

          {/* Media Content */}
          {isImage(media_url) ? (
            <Image
              source={{ uri: media_url }}
              style={styles.previewMedia}
              resizeMode="contain"
            />
          ) : isVideo(media_url) ? (
            <VideoView
              style={styles.previewMedia}
              player={previewVideoPlayer}
              allowsFullscreen
              allowsPictureInPicture
            />
          ) : null}

          {/* Action Buttons */}
          <View style={styles.previewActions}>
            <TouchableOpacity
              style={styles.previewAction}
              onPress={handleSaveMedia}
            >
              <FontAwesome5 name="download" size={24} color="white" />
              <Text style={styles.previewActionText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.previewAction}
              onPress={handleShareMedia}
            >
              <FontAwesome5 name="share-alt" size={24} color="white" />
              <Text style={styles.previewActionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  seeMoreButton: {
    marginVertical: 5,
    marginLeft: 15,
  },
  seeMoreText: {
    color: Colors.light.tint,
    fontWeight: '600',
    fontSize: 14,
  },

  // Media Preview styles
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  previewMedia: {
    width: '100%',
    height: '100%',
  },
  previewActions: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  previewAction: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
  },
  previewActionText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postContainer: {
    paddingBottom: 10,
  },
  postText: {
    fontSize: 15,
    fontWeight: '500',
    marginVertical: 15,
    marginHorizontal: 15,
    lineHeight: 20,
    color: '#333',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000',
  },
  timestamp: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  reactContainer: {
    paddingBottom: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 15,
    gap: 12,
  },
  followButton: {
    backgroundColor: Colors.light.button,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  followText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  media: {
    width: '100%',
    height: 350,
    backgroundColor: '#f5f5f5',
  },
  reactionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 15,
  },
  reactActions: {
    alignItems: 'center',
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  reactionCount: {
    marginLeft: 6,
    fontSize: 14,
    color: '#555',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    // paddingBottom: 30,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalIcon: {
    marginRight: 15,
    width: 24,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
  modalCancel: {
    marginTop: 10,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.tint,
  },
});