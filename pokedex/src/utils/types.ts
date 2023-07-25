type Ability = {
    name: string;
    url: string;
}

export type EvolutionChain = {
    species: any;
    evolves_to: any;
    url: string;
}

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