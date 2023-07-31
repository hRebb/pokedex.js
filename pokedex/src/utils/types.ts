type Ability = {
    name: string;
    url: string;
}

export interface EvolutionDetail {
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
    trigger : {
        name: string;
        urls: string;
    };
    turn_upside_down: boolean;
}

export type EvolutionChain = {}

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
}

export interface PokedexState {
    pokemonList: Pokemon[];
    selectedPokemon: Pokemon | null;
}