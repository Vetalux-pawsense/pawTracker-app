import { SafeAreaView, Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView
    style={{

      flex: 1,
      backgroundColor: "rgb(44, 0, 95)",
      justifyContent: "center", 
      alignItems: "center", 
    }}>
    <View  style={{
      backgroundColor: "rgb(44, 0, 95)",
      width: "100%", 
      height: "100%",
    }}>
<Text style={{backgroundColor:'white', fontFamily:'Poppins-Regular'}}>Welcome to Tailwind</Text>

<Link href="/(auth)/signup">signup</Link>
<Link href="/(auth)">signup</Link>
<Link href="/main/scan">scan</Link>
<Link href="/main/welcome">welcome</Link>
<Link href="/main/home">home</Link>
<Link href="/petSignup/PetData">pet</Link>


    </View>
    </SafeAreaView>
  );
}
