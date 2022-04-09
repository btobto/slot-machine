const weights = [
    20,
    10,
    9,
    8,
    8,
    6,
    4,
    3,
    5,
    2,
    3
];

const combos =
{
    '111': 20,
    '222': 10,
    '333': 9,
    '444': 8,
    '555': 8,
    '666': 6,
    '332': 4,
    '442': 3,
    '552': 5,
    '662': 2,
    '77*': 3
};

const reel1 = [2, 2, 7, 3, 2, 4, 5, 5, 5, 3, 5, 3, 5, 7, 7, 2, 2, 6, 5, 3, 1, 5, 7, 3, 6];

const reel2 = [4, 5, 6, 2, 3, 1, 8, 6, 3, 2, 4, 2, 8, 7, 6, 4, 8, 6, 5, 2, 4, 4, 5, 6, 3, 2];

const reel3 = [1, 3, 2, 6, 2, 4, 3, 6, 8, 4, 2, 4, 6, 4, 5, 4, 6, 4, 4, 5, 8, 3, 5, 6, 4, 3, 6, 8, 6, 4, 2, 8, 4, 5, 6];

const reels = [reel1, reel2, reel3];

let mat = [];

const startingBalance = 1000;

let balance = startingBalance;

const decrement = 5;

function randomizeMat(mat) {
    for (let i = 0; i < 3; i++) {
        mat[i] = [];
        for (let j = 0; j < 3; j++) {
            const randomIndex = parseInt((Math.random() * 10) % reels[j].length, 10);
            mat[i][j] = reels[j][randomIndex];
        }
    }

    // console.table(mat);
}


function check(mat) {
    let lineHits = 0;
    let points = 0;

    for (let i = 0; i < 3; i++) {
        if (mat[i][0] === mat[i][1] && mat[i][0] === mat[i][2] && mat[i][1] === mat[i][2]) {
            console.log("Line at row" + i);

            let comboString = "" + mat[i][0] + mat[i][1] + mat[i][2];
            if (combos[comboString]) {
                lineHits++;
                points += combos[comboString];

                console.log(comboString);
            }
            else {
                if (mat[i][0] === 7 && mat[i][1] === 7 && mat[i][2] !== 7) {
                    lineHits++;
                    points += combos['77*'];

                    console.log(comboString);
                }
            }
        }
        else if (mat[i][0] === mat[i][1] && mat[i][2] === 2) {
            if ([3, 4, 5, 6].includes(mat[i][0])) {
                switch (mat[i][0]) {
                    case 3:
                        points += combos['332'];
                        break;
                    case 4:
                        points += combos['442'];
                        break;
                    case 5:
                        points += combos['552'];
                        break;
                    case 6:
                        points += combos['662'];
                        break;
                }

                console.log(mat[i][0], mat[i][1], mat[i][2]);

                lineHits++;
            }
        }
    }

    if (mat[0][0] === mat[1][1] && mat[1][1] === mat[0][2] && mat[0][0] === mat[0][2]) {
        console.log("Upper zig-zag line");

        let comboString = "" + mat[0][0] + mat[1][1] + mat[0][2];
        if (combos[comboString]) {
            lineHits++;
            points += combos[comboString];

            console.log(comboString);
        }
        else if (mat[0][0] === 7 && mat[1][1] === 7 && mat[0][2] !== 7) {
            lineHits++;
            points += combos['77*'];

            console.log(comboString);
        }
        else if (mat[0][0] === mat[1][1] && mat[0][2] === 2) {
            if ([3, 4, 5, 6].includes(mat[i][0])) {
                switch (mat[i][0]) {
                    case 3:
                        points += combos['332'];
                        break;
                    case 4:
                        points += combos['442'];
                        break;
                    case 5:
                        points += combos['552'];
                        break;
                    case 6:
                        points += combos['662'];
                        break;
                }

                hits++;
            }
        }
    }

    if (mat[2][0] === mat[1][1] && mat[1][1] === mat[2][2] && mat[2][0] === mat[2][2]) {
        console.log("Lower zig-zag line");

        let comboString = "" + mat[2][0] + mat[1][1] + mat[2][2];
        if (combos[comboString]) {
            lineHits++;
            points += combos[comboString];

            console.log(comboString);
        }
        else if (mat[2][0] === 7 && mat[1][1] === 7 && mat[2][2] !== 7) {
            lineHits++;
            points += combos['77*'];

            console.log(comboString);
        }
        else if (mat[2][0] === mat[1][1] && mat[2][2] === 2) {
            if ([3, 4, 5, 6].includes(mat[i][0])) {
                switch (mat[i][0]) {
                    case 3:
                        points += combos['332'];
                        break;
                    case 4:
                        points += combos['442'];
                        break;
                    case 5:
                        points += combos['552'];
                        break;
                    case 6:
                        points += combos['662'];
                        break;
                }

                lineHits++;
            }
        }

    }

    return { lineHits, points };
}

const iterations = 10000;

let lineHits = 0;

for (let i = 0; i < iterations; i++) {

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

console.log(`Iterations: ${iterations}`);

console.log(`Ratio of lineHits : ${(lineHits / iterations) * 100}%`);
console.log(`RTP: ${(balance / startingBalance) * 100}%`);