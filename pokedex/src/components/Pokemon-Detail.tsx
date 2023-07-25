import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Pokemon, EvolutionChain } from "../utils/types";

const PokemonDetail = () => {
  const [pokemonDetails, setPokemonDetails] = useState<Pokemon | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [currentPokemonId, setCurrentPokemonId] = useState<number | null>(null);

  const { pokemonName } = useParams<{ pokemonName?: string }>();
  const navigate = useNavigate();

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
      setEvolutionChain(evolutionResponse.data);
      setCurrentPokemonId(response.data.id);
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  const goToNextPokemon = () => {
    if (evolutionChain && currentPokemonId !== null) {
      const nextPokemonId = currentPokemonId + 1; 
      if (nextPokemonId <= 151) { 
        navigate(`/pokemon/${nextPokemonId}`);
      } else {
        navigate("/");
      }
    }
  };

  const getNextPokemon = (chain: EvolutionChain, currentId: number): Pokemon | null => {
    if (chain.species.id === currentId) {
      if (chain.evolves_to && chain.evolves_to.length > 0) {
        return chain.evolves_to[0].species;
      }
    } else {
      for (const evolution of chain.evolves_to || []) {
        const nextPokemon = getNextPokemon(evolution, currentId);
        if (nextPokemon) {
          return nextPokemon;
        }
      }
    }

    return null;
  };

  const getEvolutionFamily = (chain: EvolutionChain): string[] => {
    const family: string[] = [];

    if (chain.species && chain.species.name) {
      family.push(chain.species.name);
    }

    if (chain.evolves_to && chain.evolves_to.length > 0){
      chain.evolves_to.forEach((evolution: EvolutionChain) => {
        console.log("Evolution Name:", evolution.species.name);
        family.push(...getEvolutionFamily(evolution))
      });
    }

    return family;
  }

  return (
    <div>
      {pokemonDetails ? (
        <div>
          <h1>{pokemonDetails.name.toUpperCase()}</h1>
          <img src={pokemonDetails.sprites.front_default} alt={pokemonDetails.name} />
          <img src={pokemonDetails.sprites.back_default} alt={`${pokemonDetails.name} (Back)`} />
          <p>Height: {pokemonDetails.height}</p>
          <p>Weight: {pokemonDetails.weight}</p>
          <p>Abilities:</p>
          <ul>
            {pokemonDetails.abilities.map((ability) => (
              <li key={ability.name}>{ability.name}</li>
            ))}
          </ul>
          <p>
            Evolution Family :
          </p>
          <ul>
            {evolutionChain && getEvolutionFamily(evolutionChain).map((pokemonName) => (
              <li key={pokemonName}>{pokemonName}</li>
            ))}
          </ul>
          <Link to="/">Back to List</Link>
          <button onClick={goToNextPokemon}>Next Pokemon</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PokemonDetail;