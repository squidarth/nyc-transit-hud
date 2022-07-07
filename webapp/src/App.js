import './App.css';
import React, { useEffect, useState } from 'react';


function PendingDisplay() {
  return (
    <div>
      Waiting Results...
    </div>
  )
}

function Subway(props) {
  var fullTrainString = props.train;

  var direction = fullTrainString.slice(-1);
  var train = fullTrainString.slice(0, fullTrainString.length - 1)
  return (
    <span>
      <span class="train-styling">{train}</span>
      <span>direction: {direction}</span>
    </span>
  )
}

function App() {
  const [getArrivals, setArrivals] = useState({})

  useEffect(()=>{
    fetch('http://localhost:4333/arrivals').then(response => {
      console.log("SUCCESS", response)
      return response.json()
    }).then(actualData => {
      console.log(actualData)
      setArrivals(actualData)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  var content = <PendingDisplay></PendingDisplay>
  if (Object.keys(getArrivals).length !== 0) {
    content = Object.entries(getArrivals).map((item) => {
      // item[0] is the train
      // item[1] is the arrival times


      // arrivalTime[1] in the direction
      const arrivals = item[1].map((arrivalTime) => <span>{arrivalTime[1]},</span>)
      return <div>
        <span>
          <Subway train={item[0]}></Subway>
        </span>
        <span>

          {arrivals}
        </span>

        </div>
    })
  }
  return (
    <div className="App">
      <div>
          <h2>Next Arrivals</h2>
          {content}
      </div>
    </div>
  );
}

export default App;
