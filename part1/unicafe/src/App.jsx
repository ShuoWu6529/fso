import { useState } from 'react'

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const Header = ({text}) => {
  return (
    <h1>{text}</h1>
  )
}

const Display = ({text, state}) => {
  return (
    <p>{text} {state}</p>
  )
}

const Statistics = ({good, neutral, bad, point, total}) => {
  return(
    <>
      <Header text={"statistics"}/>
      <Display text={"good"} state={good}/>
      <Display text={"neutral"} state={neutral}/>
      <Display text={"bad"} state={bad}/>
      <Display text={"all"} state={total}/>
      <Display text={"average"} state={point / total}/>
      <Display text={"positive"} state={good / total}/> 
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [point, setPoint] = useState(0)

  const handleGood = () => {
    const newGood = good + 1
    setGood(newGood)
    setTotal(newGood + neutral + bad)
    setPoint(point + 1)
  }

  const handleNeutral = () => {
    const newNeutral = neutral + 1
    setNeutral(newNeutral)
    setTotal(good + newNeutral + bad)
    setPoint(point + 0)
  }
  
  const handleBad = () => {
    const newBad = bad + 1
    setBad(newBad)
    setTotal(good + neutral + newBad)
    setPoint(point - 1)
  }

  return (
    <div>
      <Header text={"give feedback"}/>
      <Button onClick={handleGood} text={"good"}/>
      <Button onClick={handleNeutral} text={"neutral"}/>
      <Button onClick={handleBad} text={"bad"}/>
      <Statistics good={good} neutral={neutral} bad={bad} point={point} total={total}/>
    </div>
  )
}

export default App