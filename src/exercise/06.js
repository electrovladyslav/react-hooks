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
  const [state, setState] = useState(initialState)
  const {status, pokemon, error} = state
  debugger


  useEffect(() => {
    if (pokemonName) {
      setState({
        ...state,
        status: Status.pending,
      })
      fetchPokemon(pokemonName).then(
        pokemonData => {
          setState({
            ...state,
            status: Status.resolved,
            pokemon: pokemonData,
            error: null
          })
        },
        error => {
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
      throw error
    default:
      throw new Error(`There is no such status: ${status}`);
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    console.warn(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (<this.props.FallbackComponent error={this.state.error} />);
    }

    return this.props.children;
  }
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal', color: 'red'}}>{error.message}</pre>
    </div>
  )
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
        <ErrorBoundary FallbackComponent={ErrorFallback} key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
