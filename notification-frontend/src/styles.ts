import styled from 'styled-components'

export const InputContainer = styled.div`
  display: flex;
  justify-content: center;
`

export const Input = styled.input`
  padding: 4px 4px;
  border-radius: 3px;
  border: 1px solid #999;
  min-width: 250px;

  margin-right: 5px;
`

export const MessageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  & > div {
    flex: 1 1 300px;
    margin-right: 30px;
    margin-bottom: 15px;
  }
`