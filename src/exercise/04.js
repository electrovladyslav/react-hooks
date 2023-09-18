// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useState} from "react";
import {useLocalStorageState} from "../utils";

const key = 'TIC_TAC_TOE_KEY'

function Board({selectSquare, squares}) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>

    </div>
  )
}
const historyInitState = {
  steps: [ Array(9).fill(null)],
  currentStep: 0
}

function Game() {
  const [history, setHistory] = useLocalStorageState(key, historyInitState)
  const {steps, currentStep} = history
  const currentSquares = steps[currentStep]

  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  const moves = steps.map((step, index) => {
    const stepName = index ? ` move #${index}` : ' game start';
    const isCurrent = index === currentStep;
    return <li key={String(step)}>
      <button
        onClick={()=> goToStep(index)}
        disabled={isCurrent}
      >Go to {stepName}{isCurrent && ' (current)'}</button>
    </li>
  })

  function goToStep(newStep) {
    setHistory(prevHistory => ({
      ...prevHistory,
      currentStep: newStep
    }))
  }

  function selectSquare(square) {
    if (currentSquares[square] !== null || winner !== null) return
    const squaresCopy = [...currentSquares]
    const newHistorySteps = [...steps].slice(0, currentStep + 1)

    squaresCopy[square] = nextValue

    setHistory(prevHistory => ({
      steps: [...newHistorySteps, squaresCopy],
      currentStep: prevHistory.currentStep + 1

    }))
  }

  function restart() {
    setHistory(historyInitState)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board selectSquare={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
