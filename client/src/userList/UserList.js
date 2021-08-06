import React, { useState } from "react";
import { Border, Input, Button, List, Row, Column, CardBox } from "./styles";

const Hand = ({ curHand }) => {
  return (
    <Row>
      {curHand.cards
        ? curHand.cards.map(card => (
            <Column>
              <CardBox
                color={card[1] == "H" || card[1] == "D" ? "red" : "black"}
              >
                {card}
              </CardBox>
            </Column>
          ))
        : null}
    </Row>
  );
};

const UserList = ({ users, submitPlayer, dealCards }) => {
  const [player, setPlayer] = useState("");

  const handleClick = () => {
    submitPlayer(player);
    setPlayer("");
  };

  return (
    <Border>
      <div>
        <Input value={player} onChange={e => setPlayer(e.target.value)} />
        <Button disabled={player === ""} onClick={handleClick}>
          New Player
        </Button>
      </div>
      <ul>
        {users.map(user => (
          <List key={user.id}>
            <Row>
              <Column>
                <h4>{user.name}</h4>
              </Column>
              <Column>
                <Button onClick={() => dealCards(user.id)}>Deal</Button>
              </Column>
            </Row>
            <Row>
              <Hand curHand={user.curHand} />
            </Row>
          </List>
        ))}
      </ul>
    </Border>
  );
};

export default UserList;
