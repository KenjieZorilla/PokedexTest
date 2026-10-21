import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorsByType = {
  //object
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]); //deconstructing
  const [pokemonSearch, setSearch] = useState<string>(""); //deconstructing

  console.log(JSON.stringify(pokemons[0], null, 2));
  useEffect(() => {
    fetchPokemon("");
  }, []); //empty array in dependency matrix means it runs ONLY ONCE upon page reload

  async function fetchPokemon(pokemonName : string) {
    if (pokemonName === "") {
      try {
        const pokemonJSON = await fetch(
          "https://pokeapi.co/api/v2/pokemon/?limit=50",
        );
        const pokemonData = await pokemonJSON.json();

        //fetch again using the pokemonData.url to get images
        const detailedPokemons = await Promise.all(
          //study up on promises bc i don't get it at all, but it basically asks for a Promise for each fetch and returns a value
          pokemonData.results.map(async (pokemon: any) => {
            //we fetch for ALL pokemons and get all images, then we store those
            const res = await fetch(pokemon.url); //fetch
            const details = await res.json(); //turn into array
            return {
              //returning an object of type : Pokemon
              name: pokemon.name,
              image: details.sprites.front_default, //accessing the details, saving into array(with map it returns the array BACK to pokemonData)
              imageBack: details.sprites.back_default,
              types: details.types,
            };
          }),
        );

        setPokemons(detailedPokemons); //contains image
      } catch (e) {
        console.log(e);
      }
    } else {
       try {
        const pokemonJSON = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
        );
        
        if (!pokemonJSON.ok) {
          alert("Pokémon not found!");
          return;
        }

        const details = await pokemonJSON.json();

        const singlePokemon: Pokemon = {
          name: details.name,
          image: details.sprites.front_default, 
          imageBack: details.sprites.back_default,
          types: details.types,
        };

        setPokemons([singlePokemon]); 
      } catch (e) {
        console.log("Error loading single pokemon:", e);
      }
    }
    
  }

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
    >
      <Text style={styles.name}> Search</Text>
      <TextInput 
      onChangeText={setSearch} 
      value={pokemonSearch} 
      placeholder="Search Pokémon..."
      style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
      />
      <Button 
        title="Search" 
        onPress={() => 
          fetchPokemon(pokemonSearch.toLowerCase().trim())
        } 
      />
 
      {pokemons.map(
        (
          pokemon, //.map iterates over EACH pokemon from the pokemons array(grabbed freom the useState destructuring), creates a View
        ) => (
          //*Wrap Each Pokemon View in a <Pressable> element, making it interactable
          //*Notice We changed it to Link to be able to switch/navigate to other Pages,
          //*we can use onPress for Pressable and
          // //*href for Link(here, we just name the file WITHOUT the file extension, so ./details instead of ./details.tsx)

          //!IN THE VIEW below the link, I have an array of styles holding an inline elelmnts and a external stylesheet component(left to right application meaning that the inline(most right) is applied last and overrides the other styles)
          <Link
            href={{pathname: "./details", params: {name: pokemon.name}}}  //this is where we can use tell where to navigate to
            key={pokemon.name}
            style={[
              styles.container,

              {
                // @ts-ignore
                backgroundColor: colorsByType[pokemon.types[0].type.name] + 90,
              },
            ]} 
            asChild>
            <Pressable>
                <View>
                <Text style={styles.name}> {pokemon.name} </Text>
                <Text style={styles.type}>{pokemon.types[0].type.name}</Text>

                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={{ uri: pokemon.image }} //reason for double curly braces, is bc it creates an object? the first set of curly braces tells the code to "look for JavaScript,"
                    style={{ width: 100, height: 100 }}
                  />

                  <Image
                    source={{ uri: pokemon.imageBack }} //reason for double curly braces, is bc it creates an object? the first set of curly braces tells the code to "look for JavaScript,"
                    style={{ width: 100, height: 100 }} //this is an inlne style
                  />
                </View>
              </View>
            </Pressable>
          </Link>
        ),
      )}
    </ScrollView>
  );
}

// https://pokeapi.co/api/v2/pokemon/ditto

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // margin: 10,
    borderRadius: 15,
  },

  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  type: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});
