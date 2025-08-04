import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  ActivityIndicator,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { FontAwesome5, FontAwesome6, MaterialIcons, Ionicons } from "@expo/vector-icons";
import useApi from "@/hooks/useApi";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { VideoView } from "expo-video";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [media_url, setMedia_url] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { createPost, mediaUpload, checkMediaForNSFW, uriToBlob } = useApi();

  const handlePost = async () => {
    if (!content.trim() && !media_url) {
      Alert.alert("Empty Post", "Please add text or media to create a post");
      return;
    }

    try {
      setIsUploading(true);
      let uploadedMediaUrl = "";

      // Upload media if selected
      if (media_url) {
        uploadedMediaUrl = await mediaUpload(
          media_url,
          setMedia_url,
          setLoading,
          image
        );
      }

      // Create post with or without media
      await createPost(content, uploadedMediaUrl, setMedia_url, setLoading);
      router.back();
    } catch (error) {
      console.error("Error in handlePost:", error);
      Alert.alert("Error", "An error occurred while creating the post.");
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'][0],
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setVideo(null);
      setMedia_url(uri);

      // Check if image is safe (optional)
      await checkMediaForNSFW(uri, setIsImageSafe => {
        if (!setIsImageSafe) {
          Alert.alert("Content Warning", "This image may contain sensitive content");
        }
      }, uri);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setVideo(uri);
      setImage(null);
      setMedia_url(uri);
    }
  };

  const removeMedia = () => {
    setMedia_url("");
    setImage(null);
    setVideo(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome6 name="arrow-left" size={20} color={Colors.light.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Create Post</Text>

        <TouchableOpacity
          style={[
            styles.postButton,
            (!content && !media_url) && styles.disabledButton
          ]}
          onPress={handlePost}
          disabled={!content && !media_url}
        >
          {isUploading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView
        style={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.input}
          placeholder="Share your thoughts or testimony..."
          placeholderTextColor="#888"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          onChangeText={setContent}
          value={content}
          autoFocus
        />

        {/* Media Preview */}
        {(image || video) && (
          <View style={styles.mediaPreviewContainer}>
            {image ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: image }} style={styles.mediaPreview} />
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={removeMedia}
                >
                  <Ionicons name="close-circle" size={24} color={Colors.light.tint} />
                </TouchableOpacity>
              </View>
            ) : video ? (
              <View style={styles.videoPreview}>
                <VideoView
                  style={styles.mediaPreview}
                  source={{ uri: video }}
                  resizeMode="cover"
                  paused={true}
                />
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={removeMedia}
                >
                  <Ionicons name="close-circle" size={24} color={Colors.light.tint} />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>

      {/* Media Options */}
      <View style={styles.mediaOptionsContainer}>
        <Text style={styles.sectionTitle}>Add Media</Text>
        <View style={styles.mediaButtons}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={pickImage}
          >
            <FontAwesome5 name="image" size={24} color={Colors.light.tint} />
            <Text style={styles.mediaButtonText}>Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediaButton}
            onPress={pickVideo}
          >
            <MaterialIcons name="smart-display" size={24} color={Colors.light.tint} />
            <Text style={styles.mediaButtonText}>Video</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => Alert.alert("Coming Soon", "Audio recording feature will be available soon")}
          >
            <MaterialIcons name="headset" size={24} color={Colors.light.tint} />
            <Text style={styles.mediaButtonText}>Audio</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Overlay */}
      {isUploading && (
        <View style={styles.overlay}>
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.tint} />
            <Text style={styles.uploadingText}>Creating your post...</Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "white",
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
  },
  postButton: {
    backgroundColor: Colors.light.button,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 80,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  postButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.text,
    minHeight: 150,
    paddingBottom: 20,
  },
  mediaPreviewContainer: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  imagePreview: {
    position: "relative",
  },
  videoPreview: {
    position: "relative",
  },
  mediaPreview: {
    width: windowWidth - 32,
    height: 300,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  removeMediaButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
    padding: 4,
  },
  mediaOptionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 12,
  },
  mediaButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  mediaButton: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    width: 100,
  },
  mediaButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.light.text,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingContainer: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  uploadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
});