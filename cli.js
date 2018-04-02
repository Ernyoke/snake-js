const readline = require('readline');
const Snake = require('./snake');
const R = require('ramda');

// Mutable state
let State = Snake.initialState();

// Matrix operations
const Matrix = {
  make: table => R.repeat(R.repeat('.')(table.cols))(table.rows),
  set: val => pos => R.adjust(R.adjust(R.always(val))(pos.x))(pos.y),
  addSnake: state => R.pipe(...R.map(Matrix.set('X'))(state.snake)),
  addApple: state => Matrix.set('o')(state.apple),
  addCrash: (state) => {
    if (state.snake.length === 0) {
      return R.map(R.map(R.always('#')));
    }
    return R.identity;
  },
  toString: xsxs => xsxs.map(xs => xs.join(' ')).join('\r\n'),
  fromState: state => R.pipe(
    Matrix.make,
    Matrix.addSnake(state),
    Matrix.addApple(state),
    Matrix.addCrash(state),
  )(state),
};

// Key events
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  }
  switch (key.name.toUpperCase()) {
    case 'W': case 'K': case 'UP': State = Snake.enqueue(State, Snake.NORTH); break;
    case 'A': case 'H': case 'LEFT': State = Snake.enqueue(State, Snake.WEST); break;
    case 'S': case 'J': case 'DOWN': State = Snake.enqueue(State, Snake.SOUTH); break;
    case 'D': case 'L': case 'RIGHT': State = Snake.enqueue(State, Snake.EAST); break;
    default: break;
  }
});

// Game loop
const show = () => console.log('\x1Bc' + Matrix.toString(Matrix.fromState(State)));
const step = () => {
  State = Snake.next(State);
};

// Main
setInterval(() => { step(); show(); }, 80);
