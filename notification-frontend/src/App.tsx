import React, { useState } from 'react';

function App() {
  const [bids, setBids] = useState([0])

  const ws = new WebSocket("wss://localhost:3000");

  const apiCall = {
    event: "bts:subscribe",
    data: { channel: "order_book_btcusd" },
  }

  ws.onopen = (event) => {
    ws.send(JSON.stringify(apiCall));
  };

  ws.onmessage = function (event) {
    const json = JSON.parse(event.data);
    try {
      if ((json.event = "data")) {
        setBids(json.data.bids.slice(0, 5));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
   <div>
    {bids.map(item => (
      <p>{item}</p>
    ))}
   </div>
  );
}

export default App;
