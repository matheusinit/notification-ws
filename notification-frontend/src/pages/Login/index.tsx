import { useEffect, useRef, useState } from "react"

export function Login() {
  const [username, setUsername] = useState<string>('')
  const ws = useRef<WebSocket>()

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
      console.log('You\'re connected to WebSocket Server.')
    }

    ws.current.onmessage = (event) => {
      const {data} = event
      
      console.log(data)
    }
  }, [])

  return (
    <div>
      <input type="text" name="username" onChange={(event) => setUsername(event.target.value)} value={username} />
      <button type="button" onClick={logar}>Logar</button>
    </div>
  )
}