import { Player } from './player.js';

const combos =
{
    '111': 120,
    '222': 65,
    '333': 50,
    '444': 25,
    '555': 20,
    '224': 15,
    '334': 10,
    '666': 8,
    '332': 7,
    '442': 6,
    '552': 5,
    '662': 4,
    '77*': 2
};

const log = false;

let reel1, reel2, reel3;

reel1 = [1, 2, 4, 5, 2, 2, 4, 7, 3, 6];
reel2 = [6, 2, 6, 5, 7, 3, 1, 7, 3, 3, 4, 5];
reel3 = [6, 1, 2, 6, 3, 7, 5, 2, 5, 3, 4, 4, 6, 2];

// reel1 = [1, 2, 4, 5, 2, 3, 3, 4, 3, 5, 2, 6, 7, 6, 7];
// reel2 = [1, 2, 5, 3, 8, 8, 6, 4, 7, 7, 8, 8, 3, 8, 4, 8, 8];
// reel3 = [1, 2, 2, 3, 8, 5, 3, 4, 4, 8, 3, 8, 6, 8];

const reels = [reel1, reel2, reel3];

function spinSlot(player) {
    if (player.balance < player.stake) {
        console.log("No money left!");
        return;
    }
    
    let mat = [];
    for (let i = 0; i < 3; i++) {
        mat[i] = [];
    }

    randomizeMat(mat, player);

    let returnVal = check(mat);

    player.balance -= stake;
    player.balance += returnVal.points;
}

function randomizeMat(mat, player) {
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
