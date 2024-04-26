import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from "./Header.jsx"
import Wordsearch from './Wordsearch'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Wordsearch />
      
    </>
  )
}

export default App
