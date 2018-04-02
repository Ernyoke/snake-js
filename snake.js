const R = require('ramda');

// Constants
const NORTH = { x: 0, y: -1 };
const SOUTH = { x: 0, y: 1 };
const EAST = { x: 1, y: 0 };
const WEST = { x: -1, y: 0 };

// Helper functions
const random = min => max => Math.floor(Math.random() * max) + min;

const rndPos = table => ({
  x: random(0)(table.cols - 1),
  y: random(0)(table.rows - 1),
});

// Next head value based on current state
const nextHead = (state) => {
  if (state.snake.length === 0) {
    return {
      x: 2,
      y: 2,
    };
  }
  return {
    x: R.mathMod(state.snake[0].x + state.moves[0].x)(state.cols),
    y: R.mathMod(state.snake[0].y + state.moves[0].y)(state.rows),
  };
};

// Booleans
const willEat = state => R.equals(nextHead(state))(state.apple);
const willCrash = state => state.snake.find(R.equals(nextHead(state)));
const validMove = move => state =>
  state.moves[0].x + move.x !== 0 || state.moves[0].y + move.y !== 0;

// Next values based on state
const nextMoves = (state) => {
  if (state.moves.length > 1) {
    return R.drop(1, state.moves);
  }
  return state.moves;
};

const nextApple = (state) => {
  if (willEat(state)) {
    return rndPos(state);
  }
  return state.apple;
};

const nextSnake = (state) => {
  if (willCrash(state)) {
    return [{ x: 2, y: 2 }];
  }
  return willEat(state) ?
    [nextHead(state)].concat(state.snake) :
    [nextHead(state)].concat(R.dropLast(1, state.snake));
};

// Initial state
const initialState = () => ({
  cols: 20,
  rows: 14,
  moves: [EAST],
  snake: [],
  apple: { x: 16, y: 2 },
});

const next = R.applySpec({
  rows: R.prop('rows'),
  cols: R.prop('cols'),
  moves: nextMoves,
  snake: nextSnake,
  apple: nextApple,
});

const enqueue = (state, move) => {
  if (validMove(move)(state)) {
    return R.merge(state)({ moves: state.moves.concat([move]) });
  }
  return state;
};

module.exports = {
  EAST, NORTH, SOUTH, WEST, initialState, enqueue, next,
};
