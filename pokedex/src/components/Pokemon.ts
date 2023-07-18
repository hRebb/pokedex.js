interface Pokemon {
    name: string;
    pokemon_type: string;
    level: number;
}

class PokemonObject implements Pokemon {
    name!: string;
    pokemon_type!: string;
    level!: number;

    constructor(_name: string, _pokemon_type: string, _level: number) {}

    displayInfo() {
        console.log(`Name: ${this.name}`);
        console.log(`Type: ${this.pokemon_type}`);
        console.log(`Level: ${this.level}`);
    }
}

export default PokemonObject;