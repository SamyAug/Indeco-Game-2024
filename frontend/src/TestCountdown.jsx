import React, { useEffect, useState, useRef } from 'react'
import TestCountdownDisplay from './TestCountdownDisplay'

const TestCountdown = () => {
    const [timer, setTimer] = useState(10)
    const intervalRef = useRef(null)

    // useEffect(() => {
    //     countdown()
    // }, [])

    // function countdown() {
    //   if(timer > 0) {
    //     console.log(timer)
    //     setTimeout(() => {
    //       setTimer(prevTimer => prevTimer - 1)
    //       countdown()
    //     }, 1000)
    //   }
    // }

    useEffect(() => {
      if(timer <= 0) {
        return () => [clearTimeout(countdown), console.log("Cleaned up effect")]
      }
      const countdown = setTimeout(() => {
          setTimer(prevTimer => prevTimer - 1)
        }, 1000)
      //return () => [clearTimeout(countdown), console.log("Cleaned up effect")]

    }, [timer])

    
    // function countdown() {
    //   intervalRef.current = setInterval(() => {
    //     if(timer <= 0) {
    //       clearInterval(intervalRef.current)
    //     }
    //     setTimer(prevTimer => prevTimer - 1)
    //   }, 1000)
    // }



  return (
    <div>
      <button onClick={() => countdown()}>X</button>
      {timer}
    </div>
  )
}

export default TestCountdown
