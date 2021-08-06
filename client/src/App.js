import React, { useState, useEffect } from "react";
import UserList from "./userList/UserList";
import { Container, Row, Column, Title, Button } from './userList/styles'

const url = new URL("http://localhost:3001");



function App() {
  const [users, setUsers] = useState([]);
  const [newHand, setNewHand] = useState({});
  const [winner, setWinner] = useState({});

  const createPlayer = player => {
    fetch(`${url}users?name=${player}`, {
      method: "POST"
    })
      .then(res => res.json())
      .then(res => setUsers([...users, res]));
  };

  const createHand = playerId => {
    fetch(`${url}hands?userId=${playerId}`, {
      method: "POST"
    })
      .then(res => res.json())
      .then(res => setNewHand(res));
  };

  const getScore = () => {
    let userIds = users.map(a => a.id).join(",");
    fetch(`${url}score?users=${userIds}`)
      .then(res => res.json())
      .then(res => setWinner(res));
  };

  useEffect(() => {
    fetch(`${url}users`)
      .then(res => res.json())
      .then(res => setUsers(res.users));
  }, [newHand]);

  return (
    <Container>
      <Title>Poker Hands</Title>
      <Row>
        <Column>
          <UserList
            users={users}
            submitPlayer={createPlayer}
            dealCards={createHand}
          />
        </Column>
        <Column>
          <Button onClick={getScore}>Get Winner</Button>
          {winner.user ? <Title>{winner.user.name}</Title> : null}
        </Column>
      </Row>
    </Container>
  );
}

export default App;
