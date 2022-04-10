const combos =
{
    '111': 20,
    '222': 15,
    '333': 9,
    '444': 8,
    '555': 7,
    '666': 6,
    '323': 5,
    '424': 5,
    '525': 4,
    '626': 3,
    '77*': 2
};

const counts =
{
    '111': 0,
    '222': 0,
    '333': 0,
    '444': 0,
    '555': 0,
    '666': 0,
    '323': 0,
    '424': 0,
    '525': 0,
    '626': 0,
    '77*': 0
};

const log = false;

let reel1, reel2, reel3;

// reel1 = [1, 2, 4, 5, 2, 2, 4, 7, 3, 6];
// reel2 = [6, 2, 6, 5, 7, 3, 1, 7, 3, 3, 4, 5];
// reel3 = [6, 1, 2, 6, 3, 7, 5, 2, 5, 3, 4, 4, 6, 2];

reel1 = [1, 2, 4, 5, 2, 3, 3, 4, 3, 5, 2, 6, 7, 6, 7];
reel2 = [1, 2, 5, 3, 8, 8, 6, 4, 7, 7, 8, 8, 3, 8, 4, 8, 8];
reel3 = [1, 2, 2, 3, 8, 5, 3, 4, 4, 8, 3, 8, 6, 8];

let brojevi = {};

// reel3.forEach(br => {
//     if (!brojevi[br])
//         brojevi[br] = 0;

//     brojevi[br]++;
// });

// console.log(brojevi);

const reels = [reel1, reel2, reel3];

let mat = [];

const startingBalance = 10000000;

let balance = startingBalance;

const stake = 5;

function randomizeMat(mat, stake) {
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
            points += stake*combos['77*'];
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
                points += stake*combos[comboString];
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
        points += stake*combos['77*'];
        counts['77*']++;
        if (log) {
            console.log("Upper zig-zag", comboString);
        }
    }
    else {
        comboString = "" + mat[0][0] + mat[1][1] + mat[0][2];

        if (combos[comboString] !== undefined) {
            lineHits++;
            points += stake*combos[comboString];
            counts[comboString]++;
            if (log) {
                console.log("Upper zig-zag", comboString);
            }
        }

    }

    // lower zig-zag

    if (mat[2][0] === 7 && mat[1][1] === 7 && mat[2][2] !== 7) {
        lineHits++;
        points += stake*combos['77*'];
        counts['77*']++;
        if (log) {
            console.log("Lower zig-zag", comboString);
        }
    }
    else {
        comboString = "" + mat[2][0] + mat[1][1] + mat[2][2];

        if (combos[comboString] != undefined) {
            lineHits++;
            points += stake*combos[comboString];
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

    if (balance < stake) {
        console.log("Money is at 0");
        break;
    }

    randomizeMat(mat);

    let returnVal = check(mat);

    lineHits += returnVal.lineHits;

    balance += returnVal.points;
    balance -= stake;
}

console.log(`Iterations: ${i}`);

console.log(`Line hit ratio : ${(lineHits / iterations) * 100}%`);
console.log(`Ending balance ${balance} / ${startingBalance} starting balance`);
console.log(`RTP: ${(balance / startingBalance) * 100}%`);

console.log(counts);