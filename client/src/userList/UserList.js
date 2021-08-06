import React, { useState } from "react";
import styled from "styled-components";

const Column = styled.div`
  width: 40%;
  border: 1px solid black;
  border-radius: 3px;
`;

const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  border: 2px solid black;
  border-radius: 3px;
`;

const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid black;
  border-radius: 3px;
`;

const Hand = ({curHand}) => {
  return (<>
    {curHand.cards ? <p>{curHand.cards.join('-')}</p> : null}
  </>)
}

const UserList = ({ users, submitPlayer, dealCards }) => {
  const [player, setPlayer] = useState("");

  const handleClick = () => {
    submitPlayer(player);
    setPlayer("");
  };

  return (
    <Column>
      <div>
        <Input value={player} onChange={e => setPlayer(e.target.value)} />
        <Button disabled={player === ""} onClick={handleClick}>New Player</Button>
      </div>
      <ul>
        {
          users.map(user =>
            <li key={user.id}>
              <h5>{user.name}</h5>
              <Button onClick={() => dealCards(user.id)}>Deal</Button>
              <Hand curHand={user.curHand} />
            </li>
          )
        }
      </ul>
    </Column>
  );
};

export default UserList;
