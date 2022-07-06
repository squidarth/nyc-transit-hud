import './App.css';
import React, { useEffect, useState } from 'react';


function App() {
  const [getArrivals, setArrivals] = useState({})

  useEffect(()=>{
    fetch('http://localhost:4333/arrivals').then(response => {
      console.log("SUCCESS", response)
      setArrivals(response)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Sid's new react app 
          {getArrivals}
        </p>

      </header>
      <body>

        <p>Some text</p>
      </body>
    </div>
  );
}

export default App;
