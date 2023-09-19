// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'
import {useEffect, useState} from "react";

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = useState(null)


  useEffect(() => {
    if (pokemonName) {
      setPokemon(null)
      fetchPokemon(pokemonName).then(pokemonData => setPokemon(pokemonData))
    }
  }, [pokemonName])

  return (<>
    {!pokemonName
      ? 'Submit a pokemon'
      : !pokemon
        ? <PokemonInfoFallback name={pokemonName} />
        : <PokemonDataView pokemon={pokemon} />
    }
  </>)
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
