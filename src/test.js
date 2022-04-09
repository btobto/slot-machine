const combos =
{
    '111': 80,
    '222': 30,
    '333': 25,
    '444': 20,
    '555': 15,
    '224': 15,
    '334': 12,
    '666': 10,
    '332': 9,
    '442': 8,
    '552': 5,
    '662': 3,
    '77*': 1
};

const counts =
{
    '111': 0,
    '222': 0,
    '333': 0,
    '444': 0,
    '555': 0,
    '224': 0,
    '334': 0,
    '666': 0,
    '332': 0,
    '442': 0,
    '552': 0,
    '662': 0,
    '77*': 0
};

const log = false;

const oldreel1 = [2, 2, 7, 3, 2, 4, 5, 5, 5, 3, 5, 3, 5, 7, 7, 2, 2, 6, 5, 3, 1, 5, 7, 3, 6];
const oldreel2 = [4, 5, 6, 2, 3, 1, 8, 6, 3, 2, 4, 2, 8, 7, 6, 4, 8, 6, 5, 2, 4, 4, 5, 6, 3, 2];
const oldreel3 = [1, 3, 2, 6, 2, 4, 3, 6, 8, 4, 2, 4, 6, 4, 5, 4, 6, 4, 4, 5, 8, 3, 5, 6, 4, 3, 6, 8, 6, 4, 2, 8, 4, 5, 6];


let reel1, reel2, reel3;

reel1 = [1, 2, 4, 5, 3, 4, 2, 2, 4, 3, 7, 3, 6];
reel2 = [1, 6, 2, 6, 3, 7, 3, 7, 3, 3, 4, 5];
reel3 = [1, 2, 2, 7, 3, 2, 4, 2, 4, 6, 6];


const reels = [reel1, reel2, reel3];

let mat = [];

const startingBalance = 10000;

let balance = startingBalance;

const decrement = 5;

function randomizeMat(mat) {
    for (let i = 0; i < 3; i++) {
        mat[i] = [];
    }

    let i = 0;
    reels.forEach(reel => {
        let randomIndex = parseInt(Math.random() * 100, 10);
        mat[0][i] = reel[randomIndex % reel.length];
        mat[1][i] = reel[(randomIndex + 1) % reel.length];
        mat[2][i] = reel[(randomIndex + 2) % reel.length];
        i++;
    });

    if (log)
        console.table(mat);
}

function check(mat) {
    let lineHits = 0;
    let points = 0;

    let comboString = undefined;

    // horizontal line
    for (let i = 0; i < 3; i++) {
        if (mat[i][0] === 7 && mat[i][1] === 7 && mat[i][2] !== 7) {
            lineHits++;
            points += combos['77*'];
            counts['77*']++;
            if (log) {
                console.log("Line at row" + i);
                console.log(comboString);
            }
        }
        else {
            comboString = "" + mat[i][0] + mat[i][1] + mat[i][2];

            if (combos[comboString] !== undefined) {
                lineHits++;
                points += combos[comboString];
                counts[comboString]++;
                if (log) {
                    console.log("Line at row" + i);
                    console.log(comboString);
                }
            }

        }

    }


    // upper zig-zag
    if (mat[0][0] === 7 && mat[1][1] === 7 && mat[0][2] !== 7) {
        lineHits++;
        points += combos['77*'];
        counts['77*']++;
    }
    else {
        comboString = "" + mat[0][0] + mat[1][1] + mat[0][2];

        if (combos[comboString] !== undefined) {
            lineHits++;
            points += combos[comboString];
            counts[comboString]++;
            if (log) {
                console.log("Upper zig-zag", comboString);
            }
        }

    }

    // lower zig-zag

    if (mat[2][0] === 7 && mat[1][1] === 7 && mat[2][2] !== 7) {
        lineHits++;
        points += combos['77*'];
        counts['77*']++;
    }
    else {
        comboString = "" + mat[2][0] + mat[1][1] + mat[2][2];

        if (combos[comboString] != undefined) {
            lineHits++;
            points += combos[comboString];
            counts[comboString]++;
            if (log) {
                console.log("Lower zig-zag", comboString);
            }
        }

    }


    return { lineHits, points };
}

const iterations = 1000000;

let lineHits = 0;
let i = 0;

for (i = 0; i < iterations; i++) {

    if (balance < decrement) {
        console.log("Money is at 0");
        break;
    }

    randomizeMat(mat);

    let returnVal = check(mat);

    lineHits += returnVal.lineHits;

    balance += returnVal.points;
    balance -= decrement;
}

console.log(`Iterations: ${i}`);

console.log(`Ratio of lineHits : ${(lineHits / iterations) * 100}%`);
console.log(`balance ${balance}, startingBalance ${startingBalance}`);
console.log(`RTP: ${(balance / startingBalance) * 100}%`);
console.log(counts);