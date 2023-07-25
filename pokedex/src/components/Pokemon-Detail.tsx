import { Component } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Pokemon } from "../utils/types";

class PokemonDetail extends Component {
  state = {
    pokemonDetails: null as Pokemon | null,
  };

  componentDidMount() {
    const { pokemonName } = useParams<{ pokemonName?: string }>();
    if (pokemonName) {
        this.fetchPokemonDetails(pokemonName);
    }
  }

  fetchPokemonDetails = async (pokemonName: string) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const speciesResponse = await axios.get(response.data.species.url);
      const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);

      const pokemonDetails: Pokemon = {
        ...response.data,
        abilities: response.data.abilities.map((ability: any) => ability.ability),
        species: speciesResponse.data,
        evolution_chain: evolutionResponse.data.chain,
      };

      this.setState({
        pokemonDetails,
      });
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  render() {
    const { pokemonDetails } = this.state;

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
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

export default PokemonDetail;