import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'
import { InputContainer, Input, MessageContainer } from './styles';

function getOrCreateSessionId(
  setSessionId: React.Dispatch<React.SetStateAction<string>>
) {
  if (!localStorage.getItem('session')) {
    const sessionId = uuidv4()
    setSessionId(sessionId)
    localStorage.setItem('session', sessionId)
  } else {
    const sessionId = String(localStorage.getItem('session'))
    setSessionId(sessionId)
  }
}

interface Message {
  id: string
  message: string;
}

function App() {
  const ws = useRef<WebSocket>()

  const [message, setMessage] = useState<string>('')
  const [messageList, setMessageList] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string>('')

  const criarMensagem = () => {
    ws.current?.send(JSON.stringify({ 
      event: 'message:create',
      data: {
        id: sessionId,
        message
      } 
    }))
  }

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onopen = (event) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        const sessionId = localStorage.getItem('session')

        const data = JSON.stringify({ event: 'establish', data: {
          sessionId
        }}) 

        ws.current.send(data)
      }
    }

    getOrCreateSessionId(setSessionId)

    ws.current.onmessage = (event) => {
      const { data } = event

      const response = JSON.parse(data)

      if (response.event === 'message:recover' && response.data) {
        setMessageList(prev => [...prev, ...response.data]) 
      } else if (response.event === 'message:create') {
        setMessageList([...response.data])
      } else if (response.event === 'all') {
        setMessageList([...response.data])
      }
    }
  }, [])

  return (
    <div>
      <InputContainer>
          <Input 
            type="text" 
            placeholder="Digite sua mensagem..." 
            onChange={(event) => setMessage(event.target.value)} 
            value={message} 
            />

          <button type="button" onClick={criarMensagem}>Enviar mensagem</button>
      </InputContainer>

      <MessageContainer>
        {messageList.map(item => (
          <div key={item.id}>{item.message}</div>
        ))}
      </MessageContainer>
    </div>
  );
}

export default App;
