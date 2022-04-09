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

const log = false;

const oldreel1 = [2, 2, 7, 3, 2, 4, 5, 5, 5, 3, 5, 3, 5, 7, 7, 2, 2, 6, 5, 3, 1, 5, 7, 3, 6];
const oldreel2 = [4, 5, 6, 2, 3, 1, 8, 6, 3, 2, 4, 2, 8, 7, 6, 4, 8, 6, 5, 2, 4, 4, 5, 6, 3, 2];
const oldreel3 = [1, 3, 2, 6, 2, 4, 3, 6, 8, 4, 2, 4, 6, 4, 5, 4, 6, 4, 4, 5, 8, 3, 5, 6, 4, 3, 6, 8, 6, 4, 2, 8, 4, 5, 6];

const uzastopni = false;

let reel1, reel2, reel3;

if (uzastopni) {
    reel1 = [1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 5, 5, 5, 5, 5, 5, 6, 6, 7, 7, 7, 7];

    reel2 = [1, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5 ,5, 5, 6, 6, 6, 6, 6, 7, 8, 8, 8, 8];
    reel3 = [1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 8, 8, 8, 8, 8];
}
else {
    reel1 = [1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 5, 5, 5, 5, 5, 5, 6, 6, 7, 7, 7, 7];
    reel2 = [8, 8, 1, 2, 2, 3, 2, 5 ,5, 2, 3, 7, 8, 4, 4, 4, 4, 6, 6, 8, 5, 6, 3, 2, 6, 6];
    reel3 = [8, 8, 4, 4, 6, 6, 4, 4, 5, 5, 3, 3, 1, 2, 5, 6, 6, 6, 6, 6, 3, 2, 4, 4, 6, 8, 8, 8, 2, 4, 2,  3, 4, 5, 4, 4];
}

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
        let randomIndex = parseInt(Math.random() * 10, 10);
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

    for (let i = 0; i < 3; i++) {
        if (mat[i][0] === mat[i][1] && mat[i][0] === mat[i][2] && mat[i][1] === mat[i][2]) {
            if (log)
                console.log("Line at row" + i);

            let comboString = "" + mat[i][0] + mat[i][1] + mat[i][2];
            if (combos[comboString]) {
                lineHits++;
                points += combos[comboString];

                if (log)
                    console.log(comboString);
            }
            else {
                if (mat[i][0] === 7 && mat[i][1] === 7 && mat[i][2] !== 7) {
                    lineHits++;
                    points += combos['77*'];

                    if (log)
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

                lineHits++;
            }
        }
    }

    if (mat[0][0] === mat[1][1] && mat[1][1] === mat[0][2] && mat[0][0] === mat[0][2]) {
        if (log)
            console.log("Upper zig-zag line");

        let comboString = "" + mat[0][0] + mat[1][1] + mat[0][2];
        if (combos[comboString]) {
            lineHits++;
            points += combos[comboString];

            if (log)
                console.log(comboString);
        }
        else if (mat[0][0] === 7 && mat[1][1] === 7 && mat[0][2] !== 7) {
            lineHits++;
            points += combos['77*'];

            if (log)
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
        if (log)
            console.log("Lower zig-zag line");

        let comboString = "" + mat[2][0] + mat[1][1] + mat[2][2];
        if (combos[comboString]) {
            lineHits++;
            points += combos[comboString];

            if (log)
                console.log(comboString);
        }
        else if (mat[2][0] === 7 && mat[1][1] === 7 && mat[2][2] !== 7) {
            lineHits++;
            points += combos['77*'];

            if (log)
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
console.log(`RTP: ${(balance / startingBalance) * 100}%`);