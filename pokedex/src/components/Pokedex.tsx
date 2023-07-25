import { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Pokemon,
  PokedexState 
} from '../utils/types';

class Pokedex extends Component<{}, PokedexState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      pokemonList: [],
      selectedPokemon: null,
    };
  }

  componentDidMount() {
    this.fetchPokemonList();
  }

  fetchPokemonList = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
      const pokemonList: Pokemon[] = response.data.results.map((pokemon: any) => ({
        ...pokemon,
        id: parseInt(pokemon.url.split('/').slice(-2, -1)[0]),
      }));
  
      const pokemonWithDetailsPromises = pokemonList.map(async (pokemon) => {
        const pokemonResponse = await axios.get(pokemon.url);
        const speciesResponse = await axios.get(pokemonResponse.data.species.url);
        const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);
  
        const pokemonDetails: Pokemon = {
          ...pokemonResponse.data,
          abilities: pokemonResponse.data.abilities.map((ability: any) => ability.ability),
          species: speciesResponse.data,
          evolution_chain: evolutionResponse.data.chain,
        };
  
        return pokemonDetails;
      });
  
      const pokemonWithDetails = await Promise.all(pokemonWithDetailsPromises);
  
      this.setState({
        pokemonList: pokemonWithDetails,
        selectedPokemon: null,
      });
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
    }
  };
  
  render() {
    const { pokemonList, selectedPokemon } = this.state;

    return (
      <div>
        <h1>Pokédex</h1>
        <ul>
          {pokemonList.map((pokemon) => (
            <li key={pokemon.name} onClick={() => this.handlePokemonSelect(pokemon)}>
              <Link to={`/pokemon/${pokemon.name}`}>
                {pokemon.id} - {pokemon.name}
              </Link>
            </li>
          ))}
        </ul>
        {selectedPokemon && (
          <div>
            <h2>{selectedPokemon.name}</h2>
            <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} />
            <p>Height: {selectedPokemon.height}</p>
            <p>Weight: {selectedPokemon.weight}</p>
            <p>Abilities:</p>
            <ul>
                {selectedPokemon.abilities.map((ability) => (
                    <li key={ability.name}>{ability.name}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  handlePokemonSelect = (pokemon: Pokemon) => {
    this.setState({
      selectedPokemon: pokemon,
    });
  };
}

export default Pokedex;