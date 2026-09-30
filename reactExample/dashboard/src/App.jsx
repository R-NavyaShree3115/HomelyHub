
import './App.css'
import Header from './components/Header'
import StudentCard from './components/StudentCard'

function App() {
 
  return (
    <>
    <Header/>
    <StudentCard name="John" cousre="MERN" Likes=""/>
    <StudentCard  name="Max" cousre="JS" Likes=""/>
    <StudentCard name="Alice" cousre="HTML" Likes=""/>
    </>
  )
}

export default App
