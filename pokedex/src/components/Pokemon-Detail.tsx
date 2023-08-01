import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Pokemon, EvolutionChain, PokemonType } from "../utils/types";

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
      <div className="pokemon-link" key={species.name}>
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

  const getTypeStyles = (type: string): { color: string; borderRadius: string} => {
    switch (type) {
      case "bug":
        return { color: "#A8B830", borderRadius: "50% 20% / 10% 40%" };
      case "dark":
        return { color: "#705848", borderRadius: "50% 20% / 10% 40%" };
      case "dragon":
        return { color: "#7038F8", borderRadius: "50% 20% / 10% 40%" };
      case "electric":
        return { color: "#f8d030", borderRadius: "50% 20% / 10% 40%" };
      case "fairy":
        return { color: "#ee99ac", borderRadius: "50% 20% / 10% 40%" };
      case "fighting":
        return { color: "#c03028", borderRadius: "50% 20% / 10% 40%" };
      case "fire":
        return { color: "#f08030", borderRadius: "50% 20% / 10% 40%" };
      case "flying":
        return { color: "#a890f0", borderRadius: "50% 20% / 10% 40%" };
      case "ghost":
        return { color: "#705898", borderRadius: "50% 20% / 10% 40%" };
      case "grass":
        return { color: "#78c850", borderRadius: "50% 20% / 10% 40%" };
      case "ground":
        return { color: "#e0c068", borderRadius: "50% 20% / 10% 40%" };
      case "ice":
        return { color: "#98d8d8", borderRadius: "50% 20% / 10% 40%" };
      case "normal":
        return { color: "#a8a878", borderRadius: "50% 20% / 10% 40%" };
      case "poison":
        return { color: "#a040a0", borderRadius: "50% 20% / 10% 40%" };
      case "psy":
        return { color: "#f85888", borderRadius: "50% 20% / 10% 40%" };
      case "rock":
        return { color: "#b8a038", borderRadius: "50% 20% / 10% 40%" };
      case "steel":
        return { color: "#b8b8d0", borderRadius: "50% 20% / 10% 40%" };
      case "water":
        return { color: "#6890f0", borderRadius: "50% 20% / 10% 40%" };
      default:
        return { color: "inherit", borderRadius: "inherit" };
    }
  }
  
  return (
    <div>
      {pokemonDetails ? (
        <div>
          <h1>{pokemonDetails.name.toUpperCase()}</h1>
          <img src={pokemonDetails.sprites.front_default} alt={pokemonDetails.name} />
          <img src={pokemonDetails.sprites.back_default} alt={`${pokemonDetails.name} (Back)`} />
          <br></br>
          <h2 className="pokemon-link">Types :</h2>
          <ul>
            {pokemonDetails.types.map((type: PokemonType) => {
              const { color, borderRadius } = getTypeStyles(type.type.name);
              return (
                <li 
                className="pokemon-type" 
                key={type.slot}
                style={{
                  backgroundColor: color,
                  borderRadius: borderRadius
                }}
              >
                {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
              </li>
              );
            })}
          </ul>
          <br></br>
          <h2 className="pokemon-link">Caracteristics</h2>
          <p>Height: {pokemonDetails.height}</p>
          <p>Weight: {pokemonDetails.weight}</p>
          <br></br>
          <h2 className="pokemon-link">Abilities:</h2>
          <ul>
            {pokemonDetails.abilities.map((ability) => (
              <li key={ability.name}>{ability.name.charAt(0).toUpperCase() + ability.name.slice(1)}</li>
            ))}
          </ul>
          <br></br>
          <h2 className="pokemon-link">Evolutions:</h2>
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