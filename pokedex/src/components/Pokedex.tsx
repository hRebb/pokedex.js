import { Component } from 'react';
import axios from 'axios';

type Pokemon = {
  weight: number;
  height: number;
  sprites: {
    front_default: string;
  };
  name: string;
  url: string;
};

interface PokedexState {
  pokemonList: Pokemon[];
  selectedPokemon: Pokemon | null;
}

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
      const pokemonList: Pokemon[] = response.data.results;

      const pokemonWithDetailsPromises = pokemonList.map(async (pokemon) => {
        const pokemonResponse = await axios.get(pokemon.url);
        return pokemonResponse.data;
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
              {pokemon.name}
            </li>
          ))}
        </ul>
        {selectedPokemon && (
          <div>
            <h2>{selectedPokemon.name}</h2>
            <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} />
            <p>Height: {selectedPokemon.height}</p>
            <p>Weight: {selectedPokemon.weight}</p>
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