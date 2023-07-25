import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from 'react-router-dom';
import { Pokemon, EvolutionChain } from "../utils/types";

const PokemonDetail = () => {
  const [pokemonDetails, setPokemonDetails] = useState<Pokemon | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);

  const { pokemonName } = useParams<{ pokemonName?: string }>();

  useEffect(() => {
    if (pokemonName) {
      fetchPokemonDetails(pokemonName);
    }
  }, [pokemonName]);

  const fetchPokemonDetails = async (pokemonName: string) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const speciesResponse = await axios.get(response.data.species.url);
      const evolutionResponse = await axios.get<EvolutionChain>(speciesResponse.data.evolution_chain.url);

      const pokemonDetails: Pokemon = {
        ...response.data,
        abilities: response.data.abilities.map((ability: any) => ability.ability),
        species: speciesResponse.data,
        evolution_chain: evolutionResponse.data,
      };

      setPokemonDetails(pokemonDetails);
      setEvolutionChain(evolutionResponse.data); // Store the entire evolution chain data
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  return (
    <div>
      {pokemonDetails ? (
        <div>
          <h1>{pokemonDetails.name}</h1>
          <img src={pokemonDetails.sprites.front_default} alt={pokemonDetails.name} />
          <p>Height: {pokemonDetails.height}</p>
          <p>Weight: {pokemonDetails.weight}</p>
          <p>Abilities:</p>
          <ul>
            {pokemonDetails.abilities.map((ability) => (
              <li key={ability.name}>{ability.name}</li>
            ))}
          </ul>
          <Link to="/">Back to List</Link>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PokemonDetail;

