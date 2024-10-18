// import './App.css';
import { useState } from "react";
import { Square } from "./components/Square";
import { TURNS, WINNER_COMBOS } from "../constants";
import { WinnerModal } from "./components/WinnerModal";
import confetti from "canvas-confetti"

function App() {

const [board, setBoard] = useState(() => {
  const boardFromStorage = window.localStorage.getItem('board')

  return boardFromStorage 
  ? JSON.parse(boardFromStorage) 
  : Array(9).fill(null)
});
const [turn, setTurn] = useState( () => {
  const turnsFromStorage = window.localStorage.getItem('turn')
  
  return turnsFromStorage ?? TURNS.X
});

const [winner, setWinner] = useState(null)
const checkWinner = (boardToCheck) => {
  for (const combo of WINNER_COMBOS){
    const [a, b, c] = combo
    if (boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
    ){
      return boardToCheck[a]
    }
  }
  return null;
}

const resetGame = () => {
  setBoard(Array(9).fill(null));
  setTurn(TURNS.X);
  setWinner(null);

  window.localStorage.removeItem('board')
  window.localStorage.removeItem('turn')
}

const checkEndGame = (newBoard) => {
  return newBoard.every((square) => square !== null)
}

const updateBoard = (index) => {

  if(board[index] || winner) return;

  const newBoard = [...board];
  newBoard[index] = turn;
  setBoard(newBoard)
  const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
  setTurn(newTurn);
  window.localStorage.setItem('board', JSON.stringify(newBoard))
  window.localStorage.setItem('turn', newTurn)

  const newWinner = checkWinner(newBoard)
  if(newWinner){
    setWinner(() => {
      confetti()
      return newWinner
    })
  } else if (checkEndGame(newBoard)){
    setWinner(false)
  }
}

  return (
    <main className='board'>
      <h1>tic tac toe</h1>
      <button onClick={resetGame}>Reiniciar</button>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square key={index} index={index} updateBoard={updateBoard}>
                {square}
               </Square> 
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={turn===TURNS.X}>
          {TURNS.X}
        </Square>

        <Square isSelected={turn===TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

        <WinnerModal resetGame={resetGame} winner={winner} />

    </main>
  )
}

export default App
