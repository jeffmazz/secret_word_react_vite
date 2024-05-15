import { useCallback, useEffect, useState } from 'react';

//Components
import StartScreen from './components/StartScreen';
import GameOver from './components/GameOver';
import Game from './components/Game';

//styles
import './App.css';

//Data
import {wordsList} from './data/words'


const stages = [
  {id: 1, name: 'start'},
  {id: 2, name: 'game'},
  {id: 3, name: 'end'}
]

const guessesQty = 3

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)

  const [words] = useState(wordsList)
  
  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndPickCategory = useCallback(() => {
    // Pick Random Category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // Pick a Random Word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category}
  }, [words])

  // Starts the Secret Game
  const startGame = useCallback(() => {
    // clear all letters
    clearLetterStates()

    //pick word and pick category
    const {word, category} = pickWordAndPickCategory()

    // create and array of letters
    let wordLetters = word.split("")

    // array of letter toLowerCase
    wordLetters = wordLetters.map((letter) => letter.toLowerCase())

    // fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)
    
    setGameStage(stages[1].name)
  },[pickWordAndPickCategory()])

  // Proccess the letter input
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase()

    // check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter)||wrongLetters.includes(normalizedLetter)) {
      return
    }

    // push guessed letter or remove a guess

    // Adição de elementos no array
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses-1)
    }

  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // check win condition
  useEffect(() => {

    // Código resolvendo o problema da pontuação inicializar com 100
    if(letters.length === 0) {
      return
    }

    // ...new Set(leters) = deixa apenas itens únicos em um array | letras repetidas serão excluídas
    const uniqueLetters = [...new Set(letters)]

    //win condition
    if(guessedLetters.length === uniqueLetters.length) {
      //add score
      setScore((actualScore) => actualScore += 100)

      //restart game with new word
      startGame()
    }

  }, [guessedLetters], letters, startGame)


  // check if guesses ended 
  useEffect(() => {

    if(guesses === 0) {
      // reset all states
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  // Restarts the game
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (
    <div className='App'>
      {gameStage === "start" && <StartScreen startGame={startGame}/> }

      {gameStage === "game" && <Game verifyLetter={verifyLetter} 
      pickedWord={pickedWord}
      pickedCategory={pickedCategory}
      letters={letters}
      guesses={guesses}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      score={score}
      />
      }

      {gameStage === "end" && <GameOver retry={retry} score={score}/> }
    </div>
  )

}

export default App