import { SplashScreen, Stack } from "expo-router";
import '../global.css';
import { SafeAreaView } from "react-native";
import {useFonts} from "expo-font"; 
import { useEffect } from "react";
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsloaded]=useFonts({
    "Poppins-Regular":require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold":require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold":require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Black":require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Medium":require("../assets/fonts/Poppins-Medium.ttf"),



  })
  useEffect(()=>
  {
    if(fontsloaded) SplashScreen.hideAsync();
  }
  )
  return( 
  <Stack screenOptions={{headerShown:false,gestureEnabled: false,} }>
    <Stack.Screen name="index"></Stack.Screen>
    <Stack.Screen name="(auth)"></Stack.Screen>
    <Stack.Screen name="/welcome"></Stack.Screen>
 
  </Stack>
  )
  
  ;
}
