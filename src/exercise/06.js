// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'
import {useEffect, useState} from "react";

const Status = {
  idle: 'no request made yet',
  pending: 'request started',
  resolved: 'request successful',
  rejected: 'request failed',

}

const initialState = {
  status: Status.idle,
  pokemon: null,
  error: null,
}

function PokemonInfo({pokemonName}) {
  // const [pokemon, setPokemon] = useState(null)
  // const [error, setError] = useState(null)
  // const [status, setStatus] = useState(Status.idle)
  const [state, setState] = useState(initialState)
  const {status, pokemon, error} = state
  debugger


  useEffect(() => {
    if (pokemonName) {
      // setStatus(Status.pending)
      setState({
        ...state,
        status: Status.pending,
      })
      fetchPokemon(pokemonName).then(
        pokemonData => {
          // setPokemon(pokemonData)
          // setStatus(Status.resolved)
          setState({
            ...state,
            status: Status.resolved,
            pokemon: pokemonData,
            error: null
          })
        },
        error => {
          // setError(error)
          // setStatus(Status.rejected)
          setState({
            ...state,
            status: Status.rejected,
            error
          })
        }
      )
    }
  }, [pokemonName])

  switch (status) {
    case Status.idle:
      return 'Submit a pokemon'
    case Status.pending:
      return <PokemonInfoFallback name={pokemonName} />
    case Status.resolved:
      return <PokemonDataView pokemon={pokemon} />
    case Status.rejected:
      return <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    default:
      throw new Error(`There is no such status: ${status}`);
  }


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
