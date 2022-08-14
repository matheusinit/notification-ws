import { Container, Content, Header, Info } from "./styles";


interface NotificationProps {
  id: string;
  message: string;
  owner: string;
  date: Date;
}

export function Notification({ id, message, owner, date, ...props }: NotificationProps) {
  return (
    <Container {...props}>
      <Header>Criado por {owner}</Header>
      <Content>{message}</Content>
      <Info>{date.toString()}</Info>
    </Container>
  )
}