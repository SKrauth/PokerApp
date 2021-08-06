import React, { useState, useEffect } from "react";
import UserList from "./userList/UserList";

const url = new URL("http://localhost:3001");

function App() {
  const [users, setUsers] = useState([]);
  const [newHand, setNewHand] = useState({});
  const [winner, setWinner] = useState({})

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
    let userIds = users.map(a => a.id).join(',');
    fetch(`${url}score?users=${userIds}`)
      .then(res => res.json())
      .then(res => setWinner(res))
  }

  useEffect(() => {
    fetch(`${url}users`)
      .then(res => res.json())
      .then(res => setUsers(res.users));
  }, [newHand]);

  return (
    <div className="App">
      <h1>Poker Hands</h1>
      <UserList
        users={users}
        submitPlayer={createPlayer}
        dealCards={createHand}
      />
      <button onClick={getScore}>Get Winner</button>
      {
        winner.user ?
          <p>{winner.user.name}</p> :
          null
      }
    </div>
  );
}

export default App;
