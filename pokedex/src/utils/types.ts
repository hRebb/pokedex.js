type Ability = {
    name: string;
    url: string;
}

interface EvolutionDetail {
    gender: any;
    held_item: any;
    item: any;
    known_move: any;
    known_move_type: any;
    location: any;
    min_affection: any;
    min_beauty: any;
    min_happiness: any;
    min_level: number;
    needs_overworld_rain: boolean;
    party_species: any;
    party_type: any;
    relative_physical_stats: any;
    time_of_day: string;
    trade_species: any;
    trigger: {
      name: string;
      url: string;
    };
    turn_upside_down: boolean;
  }
  
export interface EvolutionChain {
    baby_trigger_item: any;
    chain: {
      evolution_details: EvolutionDetail[];
      evolves_to: EvolutionChain[];
      species: {
        name: string;
        url: string;
      };
    };
    id: number;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};
    
export type Pokemon = {
    id: number;
    weight: number;
    height: number;
    sprites : {
        front_default: string;
        back_default: string;
    }
    name: string;
    url: string;
    abilities: Ability[];
    evolution_chain: EvolutionChain;
    types: PokemonType[];
}

export interface PokedexState {
    pokemonList: Pokemon[];
    selectedPokemon: Pokemon | null;
}