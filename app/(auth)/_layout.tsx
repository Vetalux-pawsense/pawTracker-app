import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <>
      <StatusBar backgroundColor="#000" barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}
