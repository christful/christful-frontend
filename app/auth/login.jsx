import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import useApi from "@/hooks/useApi";
import { setStatusBarStyle } from "expo-status-bar";

export default function Page() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const { login, error, response } = useApi();

  const handleLogin = async () => {
    if (loading) return;
    await login(email.trim(), password, setLoading);
  };
  setStatusBarStyle("dark");
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop: 50 }}>
          <Image
            style={styles.image}
            source={require("@/assets/images/logo.png")}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.Input}
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
            />
            <View style={[styles.Input, styles.passwordContainer]}>
              <TextInput
                placeholder="Password"
                secureTextEntry={showPassword}
                style={{ width: 200 }}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <FontAwesome5
                  name={!showPassword ? "eye-slash" : "eye"}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading && true}
            >
              {loading && <ActivityIndicator color={"white"} />}
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.cta}>
              <Text style={styles.ctaText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.navigate("/auth/signup")}>
                <Text style={styles.ctaButtonText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    height: "100%",
  },
  text: {
    fontSize: 30,
    fontFamily: "IrishGrover",
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 141,
    resizeMode: "contain",
  },
  inputContainer: {
    width: Dimensions.get("window").width,
    flexDirection: "column",
    marginTop: 30,
    alignItems: "center",
    height: 200,
  },
  Input: {
    padding: 5,
    paddingLeft: 20,
    width: "80%",
    height: 45,
    marginTop: 20,
    backgroundColor: "#E3E3E3",
    borderRadius: 10,
  },
  passwordContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
  },
  button: {
    marginTop: 20,
    padding: 5,
    paddingLeft: 20,
    width: "80%",
    height: 45,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.button,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    fontWeight: "800",

    marginHorizontal: "auto",
    marginLeft: 10,
  },
  cta: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaButtonText: {
    color: "blue",
  },
});
