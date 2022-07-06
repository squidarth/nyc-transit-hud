import React, { useEffect, useState } from 'react';


function PendingDisplay() {
  return (
    <div>
      Waiting Results...
    </div>
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


  console.log(getArrivals)
  var content = <PendingDisplay></PendingDisplay>
  if (Object.keys(getArrivals).length !== 0) {
    content = Object.entries(getArrivals).map((item) => {
      // item[0] is the train
      // item[1] is the arrival times

      const arrivals = item[1].map((arrivalTime) => arrivalTime[1]).map((arrivalTime) => <span>{arrivalTime} </span>)
      return <div>
        <span>

          {item[0]} : 
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
          {content}
      </div>
    </div>
  );
}

export default App;
