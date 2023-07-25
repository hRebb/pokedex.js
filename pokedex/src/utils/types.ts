type Ability = {
    name: string;
    url: string;
}

type EvolutionChain = {
    url: string;
}

export type Pokemon = {
    weight: number;
    height: number;
    sprites : {
        front_default: string;
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

export interface pokemonDetailParams {
    [key: string]: string;
}