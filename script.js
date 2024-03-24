const { Chess } = require("chess.js");

// give me fen of a game which ends in 1 more move
const chess = new Chess();
// "bn4r1/r3q2P/pB1k2pb/2p1p3/1p1PQPB1/2p1P2N/PP5n/RN2K2R w - - 0 26"

console.log(chess.moves());

while (chess.moves().length > 0) {
  const move = chess.moves()[Math.floor(Math.random() * chess.moves().length)];
  chess.move(move);
  console.log(chess.fen());
  console.log(chess.ascii());
  console.log(move);
  console.log(chess.isCheckmate());
}
