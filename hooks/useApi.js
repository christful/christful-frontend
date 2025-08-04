import axios from "axios";
import { Alert } from "react-native";
import { router, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cloudinary } from "@cloudinary/url-gen";
// import { upload } from "@cloudinary/url-gen";

const useApi = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const signup = async (
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    setLoading
  ) => {
    if (firstName && lastName && email && password && confirmPassword) {
      if (emailPattern.test(email)) {
        if (password.length < 8) {
          Alert.alert(
            "Signup Error",
            "Your password must be more than 8 characters"
          );
        } else {
          if (password == confirmPassword) {
            setLoading(true);
            try {
              const res = await axios.post(
                `https://christful-server.vercel.app/register`,
                {
                  firstName,
                  lastName,
                  email,
                  password,
                }
              );

              Alert.alert("", res.data.message);
              router.back();
            } catch (err) {
              console.log(err.response.data.message);
              const errorMessage = err.response
                ? err.response.data.message
                : "An error occurred";

              setLoading(false);
              Alert.alert("Signup Error", errorMessage);
            } finally {
              setLoading(false);
            }
          } else {
            Alert.alert("Signup Error", "Password does not match");
          }
        }
      } else {
        Alert.alert("Signup Error", "Email is not valid");
      }
    } else {
      Alert.alert("Signup Error", "Please fill up the form before submission");
    }
  };

  const login = async (email, password, setLoading) => {
    if (email && password) {
      setLoading(true);

      try {
        const res = await axios.post(
          `https://christful-server.vercel.app/login`,
          {
            email,
            password,
          }
        );
        console.log(res.data);
        if (res.data.token) {
          Alert.alert("", "Login Successfully");
          console.log(res.data.token);
          await AsyncStorage.setItem("token", res.data.token);
          router.replace("/(tabs)/sermon");
        }
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message
          : "An error occurred";

        Alert.alert(
          "Login Error",
          errorMessage.length == 0 ? "Try Again" : errorMessage
        );
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Login Error", "Please fill up the form before submission");
    }
  };

  const logout = async () => {
    try {
      const token = await AsyncStorage.removeItem("token");
      const response = await axios.get(
        `https://christful-server.vercel.app/logout`
      );
      Alert.alert(response.data.message);
      return response.data.message;
    } catch (error) {
      console.log(error.response);
    }
  };

  const profile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://christful-server.vercel.app/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.log(error.response);
    }
  };

  const getAllPosts = async (setLoading, setError) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(
        `https://christful-server.vercel.app/getAllPosts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      // Check for invalid token in response
      if (response.data.message === "Invalid token") {
        await AsyncStorage.removeItem("token");
        router.replace("/auth/login"); // Ensure router is passed as a parameter
        return; // Stop further execution
      }

      setError(false);
      return response.data.data ? response.data.data.reverse() : [];
    } catch (error) {
      console.log(error.response);
      setError(true);
      if (error.response.data.message === "Invalid token") {
        await AsyncStorage.removeItem("token");
        router.replace("/auth/login"); // Ensure router is passed as a parameter
        return; // Stop further execution
      }
      // router.replace("/auth/login"); // Ensure router is passed as a parameter
      // Handle network error or other issues
      // console.error("Network error:", error.message);
      Alert.alert("Network Error", "Check your network connection");
    } finally {
      setLoading(false);
    }
  };

  const checkMediaForNSFW = async (mediaUri, setIsContentSafe, isImage) => {
    try {
      let formData = new FormData();
      // Append media file (Use actual file path, NOT base64)
      let file = {
        uri: mediaUri, // Direct URI from image picker
        name: "image.jpg",
        type: "image/*",
      };

      formData.append("media", file);
      formData.append("models", "nudity-2.1");
      formData.append("api_user", "1030119388");
      formData.append("api_secret", "4qfzZfQ6GsFzMsq9NcktWnCovezM2a8t");

      // Make the API request
      const response = await axios.post(
        "https://api.sightengine.com/1.0/check.json",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle API response
      console.log("response of media", response.data);
      const { nudity } = response.data;
      if (
        nudity.sexual_activity > 0.9 ||
        nudity.suggestive_classes.bikini >= 0.9
      ) {
        Alert.alert("Warning", "Your media contains NSFW content.");
        setIsContentSafe(false);
        console.log(response.data);
      } else {
        Alert.alert("Success", "Media is safe.");
        setIsContentSafe(true);
        console.log(response.data);
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      Alert.alert("Error", "Failed to check media content.");
    }
  };

  const createPost = async (content, media_url, setLoading) => {
    if (content || media_url) {
      try {
        setLoading(true);
        console.log(media_url);
        const token = await AsyncStorage.getItem("token");
        const response = await axios.post(
          `https://christful-server.vercel.app/post`,
          { content, media_url },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.message);
        Alert.alert("Post Sucessful", response.data.message);
        return response.data.message;
      } catch (error) {
        console.log(error.response);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Post Error", "Try typing or uploading before submission");
    }
  };

  const mediaUpload = async (mediaUri, setMedia_url, setLoading, isImage) => {
    try {
      setLoading(true);
      const mediaType = isImage ? "image" : "video";
      const formData = new FormData();
      formData.append("file", {
        uri: mediaUri,
        name: isImage ? "image.jpg" : "video.mp4",
        type: isImage ? "image/jpeg" : "video/mp4",
      });
      formData.append("upload_preset", "medias");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dskxvlrhq/${mediaType}/upload`, // Correct endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload Successful:", response.data);
      setMedia_url(response.data.url);
      return response.data.secure_url; // URL of uploaded media
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const uriToBlob = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Error converting URI to Blob:", error);
    }
  };

  return {
    signup,
    login,
    logout,
    profile,
    createPost,
    getAllPosts,
    checkMediaForNSFW,
    mediaUpload,
    uriToBlob,
  };
};

export default useApi;
