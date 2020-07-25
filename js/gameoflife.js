function seed() {
  return Array.from(arguments);
}

function same([x, y], [j, k]) {
  //return (JSON.strisngify(Array.from(arguments[0])) === JSON.stringify(Array.from(arguments[1])));
  return (x === j) && (y === k)
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  let result = false;

  for (let i=0; i<this.length; i++) {
    if (same(this[i], cell)) {
      result = true;
      break;
    }
  }
/*
  this.forEach(element => {
    if (same(element, cell)) result = true;
  });*/
  return result;   
}

const printCell = (cell, state) => {
  let output = '';
  if (contains.call(state, cell)) output = '\u25A3'; else output = '\u25A2';
  return output;
};

const corners = (state = []) => {
  let corners = {
    topRight: [0,0],
    bottomLeft: [0,0]
  };

  if (state !== []) {
    let maxX = 0, maxY = 0, minX = 0, minY = 0;
    let currentX = 0, currentY = 0;
    let count = 0;

    state.forEach(element => {
      currentX = element[0];
      currentY = element[1];
      if (count !== 0) {
        if (currentX > maxX) maxX = currentX; else if (currentX < minX) minX = currentX;
        if (currentY > maxY) maxY = currentY; else if (currentY < minY) minY = currentY;
      } else {
        maxX = currentX; minX = currentX;
        maxY = currentY; minY = currentY;
      }
      count++;
    });
    corners.topRight = [maxX,maxY];
    corners.bottomLeft = [minX,minY];
  }
  return corners;
};

const printCells = (state) => {
  let crn = corners(state);
  let output = '';

  for (let y=crn.topRight[1]; y>=crn.bottomLeft[1]; y--) {
    for (let x=crn.bottomLeft[0]; x<=crn.topRight[0]; x++) {
      output = output + printCell([x,y],state) + ' ';
    }
    output = output + '\n';
  }
  return output;
};

const getNeighborsOf = ([x, y]) => {
  let output = [];
  for (let i=x-1; i<=x+1; i++) {
    for (let j=y-1; j<=y+1; j++) {
      if (!same([x,y],[i,j])) output.push([i,j]);
    }
  }
  return output;
};

const getLivingNeighbors = (cell, state) => {
  let output = [];
  let neighbours = getNeighborsOf(cell);

  neighbours.forEach(element => {
    let contains_bound = contains.bind(state, element)

    if (contains_bound(state, element)) output.push(element);
  })
  return output;
}

const willBeAlive = (cell, state) => {
  let livingNeighbours = getLivingNeighbors(cell,state)
  let alive = false;
  
  if (((contains.call(state, cell)) && (livingNeighbours.length === 2)) || (livingNeighbours.length === 3)) alive = true;
  return alive;
};

const calculateNext = (state) => {
  let newState = [];
  let crn = corners(state);

  minX = crn.bottomLeft[0]-1;
  minY = crn.bottomLeft[1]-1;
  maxX = crn.topRight[0]+1;
  maxY = crn.topRight[1]+1;

  for (let i=minX; i<=maxX; i++){
    for (let j=minY; j<=maxY; j++){
      let cell=[i,j];
      let willBeAlive_bound = willBeAlive.bind(state,cell,state)
      if (willBeAlive_bound(cell,state)) newState.push(cell);
    }
  }
  return newState;
};

const iterate = (state, iterations) => {

  let gameStates = [];
  
  gameStates.push(state);

  for (let i=1; i<=iterations; i++) {
    let newState = calculateNext(gameStates[i-1]);
    gameStates.push(newState);
  }
  return gameStates;
};

const main = (pattern, iterations) => {
  let initialState = startPatterns[pattern];
  let allStates = [];
  let output = '';
  let iterate_bound = iterate.bind(initialState,initialState,iterations);

  allStates = iterate_bound(initialState,iterations);
  
  allStates.forEach(state => {
    output = output + printCells(state) + '\n';
  })
  
  console.log(output);
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;