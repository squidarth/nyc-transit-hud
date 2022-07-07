import './App.css';
import React, { useEffect, useState } from 'react';

function getTrainExtraStyles(train) {
  switch(train) {
    case "2":
      return {backgroundColor: "red"}
    case "3":
      return {backgroundColor: "red"}
    case "Q":
      return {backgroundColor: "yellow", color: "black"}
    case "N":
      return {backgroundColor: "yellow", color: "black"}
    case "R":
      return {backgroundColor: "yellow", color: "black"}
    case "D":
      return {backgroundColor: "orange"}
    case "B":
      return {backgroundColor: "orange"}
    case "F":
      return {backgroundColor: "orange"}

  }
}

function PendingDisplay() {
  return (
    <div>
      Waiting Results...
    </div>
  )
}

function Direction(props) {
  var directionString = ""
  if (props.direction == "N") {
    directionString = "Northbound"
  } else {
    directionString = "Southbound"
  }
  return <span style={{marginRight: "10px", marginLeft: "10px", fontWeight: "bold"}}>{directionString}</span>
}
function Subway(props) {
  var fullTrainString = props.train;

  var direction = fullTrainString.slice(-1);
  var train = fullTrainString.slice(0, fullTrainString.length - 1)
  return (
    <span>
      <span style={getTrainExtraStyles(train)}className="train-styling">{train}</span>
      <Direction direction={direction}></Direction>
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
      const arrivals = item[1].map((arrivalTime) => <span style={{marginLeft: "5px"}}>{arrivalTime[1]},  </span>)
      return <div className="subway-line">
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
          <h2>Next Arrivals at Atlantic Ave / Barclays Center</h2>
          <div className="content-block">

            {content}
          </div>
      </div>
    </div>
  );
}

export default App;
