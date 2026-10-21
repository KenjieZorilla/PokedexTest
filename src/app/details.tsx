import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text } from "react-native";

export default function Details() {
  const params = useLocalSearchParams();  //this grabs the params passed to THIS SCREEN AFTER a user clicks/navigates to it

  const [description, setDescriptions] = useState();

  //useEffect happens AFTER the screen updates basically
  useEffect(() => {
    fetchDescriptions();
  }, [])

  async function fetchDescriptions()  {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${params.name}`);

      const responseJson = await response.json();

      console.log(responseJson.flavor_text_entries[0].flavor_text);

      setDescriptions(responseJson.flavor_text_entries[0].flavor_text);
    } catch (e) {
      console.log(e);
    }
    
    
  }
  
  return (
    <KeyboardAvoidingView>
      <ScrollView
        contentContainerStyle={{
          gap:16,
          padding: 16,
          margin: 16
        }}
      >
        <Text style={{
          textAlign: 'center',
          fontSize: 30,
          fontWeight: 'bold',
        }}>
          {params.name}
        </Text>

        <Text style={{
          textAlign: 'center',
          fontSize: 20,
          
        }}>
          {description}
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
      
  );
}

// https://pokeapi.co/api/v2/pokemon/ditto

const styles = StyleSheet.create({

});

