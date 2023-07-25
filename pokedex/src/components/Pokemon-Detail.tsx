import React from "react";
import { useParams } from 'react-router-dom';
import { pokemonDetailParams } from "../utils/types";

class PokemonDetail extends React.Component {
    render() {
        const params: Partial<pokemonDetailParams> = useParams();
        return (
            <div>
                <h1>
                    {params.pokemonName}
                </h1>
            </div>
        )
    }
}