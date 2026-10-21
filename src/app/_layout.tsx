import { Stack } from "expo-router";

export default function RootLayout() {
  //we are able to change the screen names here, using name: property, we can pass the file name and change it using options and passing an object of title and renaming it using that
  return (<Stack>
    <Stack.Screen name="index" options={{ title: "Home" }}/>  
    <Stack.Screen 
      name="details" 
      options={{ title: "Description", 
                  headerBackButtonDisplayMode: "minimal",
                  presentation: "formSheet",
                  sheetAllowedDetents: [0.3, 0.5, 0.7],
                  sheetGrabberVisible: true,
                  contentStyle: { backgroundColor: '#ffffff' }, 
                  headerShown: false,
                  }}   //formSheet and modal are similar, but with formSheet you can customize it
      
    />
  </Stack>
  );
}
