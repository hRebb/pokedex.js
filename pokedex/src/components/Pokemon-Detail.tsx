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

  const renderEvolutions = (evolution: any) => {
    if (!evolution) return null;

    const { species, evolves_to } = evolution;
    const pokemonId = species.url.split('/').reverse()[1];
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

    return (
      <div key={species.name}>
        <h2>{species.name.charAt(0).toUpperCase() + species.name.slice(1)}</h2>
        <img src={spriteUrl} alt={species.name} />
        {evolves_to && evolves_to.length > 0 && (
          <div>
            {evolves_to.map((nextEvolution: any) => renderEvolutions(nextEvolution))}
          </div>
        )}
      </div>
    );
  };
  
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
              <li key={ability.name}>{ability.name.charAt(0).toUpperCase() + ability.name.slice(1)}</li>
            ))}
          </ul>
          <h2>Evolutions:</h2>
          {evolutionChain && renderEvolutions(evolutionChain.chain)}
          <Link to="/">
            <button>
              Back to List
            </button>
          </Link>
          <button onClick={goToNextPokemon}>Next Pokemon</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PokemonDetail;