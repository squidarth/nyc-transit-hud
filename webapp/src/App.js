import './App.css';
import React, { useEffect, useState } from 'react';


const domain = ""
// Enable for development
//const domain = "http://127.0.0.1:5000"
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
    case "4":
      return {backgroundColor: "green"}
    case "5":
      return {backgroundColor: "green"}
    default:
      return {}
  }
}

function PendingDisplay() {
  return (
    <div>
      Waiting Results...
    </div>
  )
}

function Alerts(props) {
  return props.alerts.alerts.map( alert =>
    <p key={alert}><span style={getTrainExtraStyles(alert[0])}className="train-styling">{alert[0]}</span>{alert[1]}</p>
  )
}
function Direction(props) {
  var directionString = ""
  if (props.direction === "N") {
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
  const [getAlerts, setAlerts] = useState({})

  useEffect(()=>{
      fetch(domain + '/arrivals').then(response => {
        console.log("SUCCESS", response)
        return response.json()
      }).then(actualData => {
        console.log(actualData)
        setArrivals(actualData)
      }).catch(error => {
        console.log(error)
      })
    setInterval(() => {
        fetch(domain + '/arrivals').then(response => {
          console.log("SUCCESS", response)
          return response.json()
        }).then(actualData => {
          console.log(actualData)
          setArrivals(actualData)
        }).catch(error => {
          console.log(error)
        })
    }, 10000)
      fetch(domain + '/alerts').then(response => {
        console.log("SUCCESS", response)
        return response.json()
      }).then(actualData => {
        console.log(actualData)
        setAlerts(actualData)
      }).catch(error => {
        console.log(error)
      })
    setInterval(() => {
        fetch(domain + '/alerts').then(response => {
          console.log("SUCCESS", response)
          return response.json()
        }).then(actualData => {
          console.log(actualData)
          setAlerts(actualData)
        }).catch(error => {
          console.log(error)
        })
    }, 60000)
  }, [])

  var arrivalsContent = <PendingDisplay></PendingDisplay>
  if (Object.keys(getArrivals).length !== 0) {
    arrivalsContent = Object.entries(getArrivals).map((item) => {
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

  var alertsContent = <div></div>
  if (Object.keys(getAlerts).length !== 0) {
    alertsContent = <Alerts alerts={getAlerts}></Alerts>
  }
  return (
    <div className="App">
      <div className="arrivals">
          <h2>Next Arrivals at Atlantic Ave / Barclays Center</h2>
          <div className="content-block">

            {arrivalsContent}
          </div>
      </div>
      <div className="alerts">
        {alertsContent}
      </div>
    </div>
  );
}

export default App;
