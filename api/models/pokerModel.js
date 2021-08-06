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

// TODO: store userList in db and assign ID there
let nextId = 0;
let userList = [];

const user = name => ({
  id: nextId++,
  name: name,
  curHand: {}
});

// --- Scores ---

const score = (valid, rank) => ({
  value: valid,
  rank: rank
});

// a smarter dev would've stored the card values too (self burn)
const decodeFace = face => {
  switch (face) {
    case "A":
      return 0;
    case "J":
      return 10;
    case "Q":
      return 11;
    case "K":
      return 12;
    default:
      return parseInt(face);
  }
};

// sort cards in decending order
const sortCards = cards =>
  cards.sort((a, b) => decodeFace(a[0]) < decodeFace(b[0]));

const isStraight = cards => {
  return (
    decodeFace(cards[4][0]) === decodeFace(cards[3][0]) + 1 &&
    decodeFace(cards[3][0]) === decodeFace(cards[2][0]) + 1 &&
    decodeFace(cards[2][0]) === decodeFace(cards[1][0]) + 1 &&
    decodeFace(cards[1][0]) === decodeFace(cards[0][0]) + 1
  );
};

// High Card: Hands which do not fit any higher category are ranked by the value of their highest card. If the highest cards have the same value, the hands are ranked by the next highest, and so on.
const highCard = cards => {
  return score(true, decodeFace(cards[0]));
};

// Pair: Two of the five cards in the hand have the same value. Hands which both contain a pair are ranked by the value of the cards forming the pair. If these values are the same, the hands are ranked by the values of the cards not forming the pair, in decreasing order.
const pair = cards => {
  // if statements are broken up here so we don't have to actually figure out what the pair is
  if (cards[0][0] === cards[1][0] || cards[1][0] === cards[2][0]) {
    return score(true, decodeFace(cards[1][0]));
  }

  if (cards[2][0] === cards[3][0] || cards[3][0] === cards[4][0]) {
    return score(true, decodeFace(cards[3][0]));
  }

  return score(false, 0);
};

// Two Pairs: The hand contains two different pairs. Hands which both contain two pairs are ranked by the value of their highest pair. Hands with the same highest pair are ranked by the value of their other pair. If these values are the same the hands are ranked by the value of the remaining card.
const twoPairs = cards => {
  // a sorted set with a pair in the first position can also have a 2-3 pair or a 3-4 pair
  if (
    cards[0][0] === cards[1][0] &&
    (cards[2][0] === cards[3][0] || cards[3][0] === cards[4][0])
  ) {
    return score(true, decodeFace(cards[0][0]));
  }

  // a sorted set with a unique card in the first position can only have 2-3 & 4-5 pairs
  if (cards[1][0] === cards[2][0] && cards[3][0] === cards[4][0]) {
    return score(true, decodeFace(cards[1][0]));
  }

  return score(false, 0);
};

// Three of a Kind. Three of the cards in the hand have the same value. Hands which both contain three of a kind are ranked by the value of the three cards.
const threeOfAKind = cards => {
  // a sorted set of 5 with three matches will always include the middle value
  if (
    (cards[2][0] === cards[0][0] && cards[2][0] === cards[1][0]) ||
    (cards[2][0] === cards[1][0] && cards[2][0] === cards[3][0]) ||
    (cards[2][0] === cards[3][0] && cards[2][0] === cards[4][0])
  ) {
    return score(true, decodeFace(cards[2][0]));
  }

  return score(false, 0);
};

// Straight. Hand contains five cards with consecutive values. Hands which both contain a straight are ranked by their highest card.
const straight = cards => {
  if (isStraight(cards)) {
    return score(true, decodeFace(cards[0][0]));
  }
  return score(false, 0);
};

// Flush. Hand contains five cards of the same suit. Hands which are both flushes are ranked using the rules for High Card.
const flush = cards => {
  if (
    cards[0][1] === cards[1][1] &&
    cards[0][1] === cards[2][1] &&
    cards[0][1] === cards[3][1] &&
    cards[0][1] === cards[4][1]
  ) {
    return score(true, decodeFace(card[0]));
  }
  return score(false, 0);
};

// Full House. Three cards of the same value, with the remaining two cards forming a pair. Ranked by the value of the three cards.
const fullHouse = cards => {
  // value of first 3 and last 2 are the same
  if (
    cards[0][0] === cards[1][0] &&
    cards[0][0] === cards[2][0] &&
    cards[3][0] === cards[4][0]
  ) {
    return score(true, decodeFace(cards[0][0]));
  }

  // value of first 2 and last 3 are the same
  if (
    cards[0][0] === cards[1][0] &&
    cards[2][0] === cards[3][0] &&
    cards[2][0] === cards[4][0]
  ) {
    return score(true, decodeFace(cards[2][0]));
  }
  return score(false, 0);
};

// Four of a Kind. Four cards with the same value. Ranked by the value of the four cards.
const fourOfAKind = cards => {
  // unique value is last
  if (
    cards[0][0] === cards[1][0] &&
    cards[1][0] === cards[2][0] &&
    cards[2][0] === cards[3][0]
  ) {
    return score(true, decodeFace(cards[0][0]));
  }

  // unique value is first
  if (
    cards[1][0] === cards[2][0] &&
    cards[2][0] === cards[3][0] &&
    cards[3][0] === cards[4][0]
  ) {
    return score(true, decodeFace(cards[4][0]));
  }

  return score(false, 0);
};

// Straight Flush. Five cards of the same suit with consecutive values. Ranked by the highest card in the hand.
const straightFlush = cards => {
  if (
    isStraight(cards) &&
    cards[0][1] === cards[1][1] &&
    cards[1][1] === cards[2][1] &&
    cards[2][1] === cards[3][1] &&
    cards[3][1] === cards[4][1]
  ) {
    return score(true, decodeFace(cards[0][0]));
  }
  return score(false, 0);
};

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

exports.getUsers = () => ({ users: userList });

exports.getHighScore = users => {
  // scoreCheckers are order by importance, highest first
  let scoreCheckers = [
    straightFlush,
    fourOfAKind,
    fullHouse,
    flush,
    straight,
    threeOfAKind,
    twoPairs,
    pair,
    highCard
  ];

  // get hands and sort
  let hands = users
    .split(",")
    .map(userId => userList.find(user => user.id == userId));

  // expected data types here:
  // <score[]> results
  // <user[]> hands,
  // <function (string[]): score>[] scoreCheckers
  // hands passed to scoreCheckers MUST BE SORTED
  // user and score are custom objects defined above
  for (var ii = 0; ii < scoreCheckers.length; ii++) {
    // pass sorted hands to each score checker
    let results = hands.map(hand => scoreCheckers[ii](sortCards(hand.curHand.cards)));
    // we want the highest ranked user with a score
    if (results.some(score => score.value)) {
      let winner;

      for (var jj = 0; jj < hands.length; jj++) {
        let newWinner = {
          user: hands[jj],
          score: results[jj]
        };

        if (results[jj].value && !winner) {
          winner = newWinner;
        }

        // resolve ties here
        const breakTie = (king, challenger) => {
          let kingHand = sortCards(king.user.curHand.cards);
          let challengerHand = sortCards(challenger.curHand.cards);
          for (var kk = 0; kk < kingHand.length; kk++) {
            if (kingHand[kk][0] !== challengerHand[kk][0]) {
              return decodeHand(kingHand[kk][0]) >
                decodeHand(challengerHand[kk][0])
                ? king
                : challenger;
            }
          }

          throw Error("unresolvable tie")
        };

        if (results[jj].score && winner.user) {
          winner =
            winner.score.rank !== results[jj].rank
              ? winner.score.rank > results[jj].rank
                ? winner
                : newWinner
              : breakTie(winner, newWinner);
        }
      }

      // return winner as soon as we find one
      return winner;
    }
  }

  // this response is a bit nuclear but we shouldn't hit this unless we have no users
  //
  throw new Error("no winner found");
};
