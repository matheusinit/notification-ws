import React, { useEffect, useRef, useState } from 'react';

function App() {
  const ws = useRef<WebSocket>()

  const [username, setUsername] = useState<string>('')

  // const createNotification = () => {
  //   ws.current.send({  })
  // }

  const logar = () => {
    ws.current?.send(JSON.stringify({ 
      event: 'login',
      data: {
        username
      }
    }))  
  }

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onopen = (event) => {
      ws.current?.send(JSON.stringify({ message: "'You're connected to WebSocket Server.'" }))
    }

    ws.current.onmessage = (event) => {
      const {data} = event

      console.log(data)
    }
  }, [])

  // const apiCall = {
  //   event: "bts:subscribe",
  //   data: { channel: "order_book_btcusd" },
  // }

  // ws.onopen = (event) => {
  //   console.log()
  // };

  // ws.onmessage = function (event) {
  //   const json = JSON.parse(event.data);
  //   try {
  //     if ((json.event = "data")) {
  //       setBids(json.data.bids.slice(0, 5));
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
   <div>
      <div>
        <input type="text" name="username" onChange={(event) => setUsername(event.target.value)} value={username} />
        <button type="button" onClick={logar}>Logar</button>
      </div>

      {/* <form>
        <input type="text" name="content" />

        <button type="button">Criar notificação</button>
      </form> */}
   </div>
  );
}

export default App;
