// --- Deck ---
const face = val => {
  switch (val % 13) {
    case 0:
      return "A";
    case 10:
      return "J";
    case 11:
      return "Q";
    case 12:
      return "K";
    default:
      return (val % 13) + 1;
  }
};

const suit = val => {
  switch (Math.floor(val / 13)) {
    case 0:
      return "H";
    case 1:
      return "D";
    case 2:
      return "C";
    case 3:
      return "S";
    default:
      return "";
  }
};

// this is some mild magic here
// Array.from() takes an array-like obj as the first arg
// so we pass an obj with a length property and from() uses it to create the rest of the array
// the second arg is a map func, which we pass our new empty array to create the cards
const newDeck = Array.from({ length: 52 }, (_, i) => `${face(i)}${suit(i)}`);

// --- Hand ---

// keeps the remaining cards in memory
// TODO: create db store to track game & deck state
let curDeck = newDeck;

const drawHand = () => {
  let hand = [];

  // similated shuffling, only when the deck is empty
  // would ideally shuffle on new game instead
  // this is my solution without implementing game tracking
  curDeck = curDeck.length < 5 ? newDeck : curDeck;

  for (var i = 0; i < 5; i++) {
    const cardIn = Math.floor(Math.random() * curDeck.length);
    hand.push(curDeck[cardIn]);

    // cards are unique, so remove them from the current deck when dealt
    curDeck.splice(cardIn, 1);
  }

  return hand;
};

// --- User ---

let nextId = 0;
let userList = [];

const user = name => ({
  id: nextId++,
  name: name,
  curHand: []
});

// --- exports ---

exports.newHand = userId => {
  let userIndex = userList.map(usr => usr.id).indexOf(parseInt(userId));
  if (userIndex < 0) {
    throw new Error("unknown user");
  }

  let hand = {
    user: userId,
    cards: drawHand()
  };

  userList[userIndex].curHand = hand;

  return hand;
};

exports.newUser = name => {
  const curUser = user(name);
  userList.push(curUser);
  return curUser;
};
