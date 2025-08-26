// ������ ����� ���������
function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    let history;
    
    piece = sequence[Math.floor(Math.random() * sequence.length)];

    if (piece === history) {
        piece = sequence[Math.floor(Math.random() * sequence.length)];
    }
    history = piece;
    tetrominoSequence.push(piece);
}

// �������� ��������� ���������
function getNextTetromino() {
    while (tetrominoSequence.length < 2)
        generateSequence();

    show_next(tetrominoSequence[1]) // ���������� ��������� ���������
    
    const name = tetrominoSequence.shift(); // ���� ������ ��������� �� �������

    const matrix = tetrominos[name];

    // I � O �������� � ��������, ��������� � �����
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    const row = -3; // ��� ��������� �������� � ����� 3 ������

    return {
        name: name,      // �������� ���������
        matrix: matrix,  // ������� ���������
        row: row,        // ������� ������
        col: col         // ������� �������
    };
}

// ������������ ������� �� 90 ��������
function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    return result;
}

// �������� �� ������������ ��������
function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                // ������� �� ������� ����
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                // ������������ � ������� ���������
                playfield[cellRow + row][cellCol + col])) {
                return false;
            }
        }
    }
    return true; // � ���� ������� �� ���������, �� ���������
}

// ����� ��������� ������������ ������ �� �����
function placeTetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
                // ���� ��������� ������� �� ������� ����, �� ���� �����������
                if (tetromino.row + row < 0) {
                    return endGame();
                }
                // ���� �� � �������, �� ���������� � ������ �������� ���� ���������
                playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
            }
        }
    }

    let m_lines = lines // ���������� ����� ��������� ������� ����� �������� �������

    // ���������, ����� ����������� ���� ���������� ����� �����
    for (let row = playfield.length - 1; row >= 0;) {
        // ���� ��� ��������
        if (playfield[row].every(cell => !!cell)) {
            // ������� ��� � �������� �� ���� �� ���� ������
            for (let r = row; r >= 0; r--) {
                for (let c = 0; c < playfield[r].length; c++) {
                    playfield[r][c] = playfield[r - 1][c];
                }
            }
            lines++;
            show_line(lines); // ��������� ������� �����
        } else {
            row--; // ��������� � ���������� ����
        }
    }

    level = Math.floor(lines / 10)
    show_level(level); // ��������� ������� ������

    if (lines - m_lines === 1) {
        score += 40 * (level + 1);
    } else if (lines - m_lines === 2) {
        score += 100 * (level + 1);
    } else if (lines - m_lines === 3) {
        score += 300 * (level + 1);
    } else if (lines - m_lines === 4) {
        score += 1200 * (level + 1);
    }

    show_score(score) // ��������� ������� �����

    tetromino = getNextTetromino(); // �������� ��������� ���������
}

// ��������� ���� ����� ����������
function addZeroes(number, digits) {
    let numStr = number.toString();
    let zeroesToAdd = digits - numStr.length;

    if (zeroesToAdd > 0) {
        for (let i = 0; i < zeroesToAdd; i++) {
            numStr = '0' + numStr;
        }
    }
    return numStr;
}

// �������� ����
function show_score(score) {
    scoreElement.textContent = addZeroes(score, 6)
}

// �������� �����
function show_line(line) {
    lineElement.textContent = addZeroes(line, 3)
}

// �������� �������
function show_level(level) {
    levelElement.textContent = addZeroes(level, 2)
}

// �������� next
function show_next(name) {
    context_next.clearRect(0, 0, next.width, next.height);

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
            if (tetrominos[name][row + 1][col]) {
                nextfield[row][col] = name;
            } else {
                nextfield[row][col] = 0;
            }
        }
    }

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
            if (nextfield[row][col]) {
                let x = col * grid;
                let y = row * grid;

                context_next.fillStyle = colors[nextfield[row][col]][0];
                context_next.fillRect(x, y, grid, grid);

                context_next.fillStyle = colors[nextfield[row][col]][1];
                context_next.beginPath();
                context_next.moveTo(x + grid, y);
                context_next.lineTo(x, y);
                context_next.lineTo(x, y + grid);
                context_next.lineTo(x + 5, y + grid - 5);
                context_next.lineTo(x + 5, y + 5);
                context_next.lineTo(x + grid - 5, y + 5);
                context_next.closePath();
                context_next.fill();

                context_next.fillStyle = colors[nextfield[row][col]][2];
                context_next.beginPath();
                context_next.moveTo(x + grid, y);
                context_next.lineTo(x + grid, y + grid);
                context_next.lineTo(x, y + grid);
                context_next.lineTo(x + 5, y + grid - 5);
                context_next.lineTo(x + grid - 5, y + grid - 5);
                context_next.lineTo(x + grid - 5, y + 5);
                context_next.closePath();
                context_next.fill();
            }
        }
    }
}

// ������� ��� ������ �����
function startGame() {
    // ������� ����
    start_menu.style.display = 'none';
    over_menu.style.display = 'none';

    // ������� ������� � ����������
    for (let row = -3; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            playfield[row][col] = 0;
        }
    }

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
            nextfield[row][col] = 0;
        }
    }

    count = 0;

    lines = 0;
    score = 0;
    level = 0;

    tetrominoSequence = [];
    tetromino = null;
    gameOver = false;

    // ������� ������
    context.clearRect(0, 0, canvas.width, canvas.height);
    context_next.clearRect(0, 0, next.width, next.height);

    // ��������� �������� �� ������
    show_score(score);
    show_line(lines);
    show_level(level);

    tetromino = getNextTetromino(); // ������ ���������
    rAF = requestAnimationFrame(loop); // ����� ����
}

function endGame() {
    cancelAnimationFrame(rAF); // ���������� ��� �������� ����

    gameOver = true; // ������ ���� ���������

    over_menu.style.display = 'flex'; // ���������� ����
}


// ���������, ���������, �������������� ���� � ������� ������� �������� �� �����
function uploadRecords() {
    let records = downloadRecords();

    if (records.length === 0) {
        records = score_ls
    }

    records.sort((a, b) => b - a);

    if (records[records.length - 1] < score) {
        records[records.length - 1] = score;
        records.sort((a, b) => b - a);
    }
    score_ls = records;

    let expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 1);

    //document.cookie = "Records=" + JSON.stringify(score_ls); + "; max-age=2592000; path=/";

    document.cookie = "Records=" + JSON.stringify(score_ls); + "; expires=" + expirationDate.toUTCString(); + "; path=/";

    records_tables.forEach(function (list) {
        var listItems = list.getElementsByTagName("li");
        for (var i = 0; i < listItems.length; i++) {
            listItems[i].textContent = addZeroes(score_ls[i], 6);
        }
    });
}

// ��������� ����
function downloadRecords() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'Records') {
            return JSON.parse(value);
        }
    }
    return []; // ���� cookie � ������ ������ �� ������
}

// ������� ���� ����
function loop() {
    rAF = requestAnimationFrame(loop); // �������� ��������

    context.clearRect(0, 0, canvas.width, canvas.height); // ������� �����

    // ������ ������� ���� � ������ ����������� �����
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                let x = col * grid;
                let y = row * grid;

                context.fillStyle = colors[playfield[row][col]][0];
                context.fillRect(x, y, grid, grid);

                context.fillStyle = colors[playfield[row][col]][1];
                context.beginPath();
                context.moveTo(x + grid, y);
                context.lineTo(x, y);
                context.lineTo(x, y + grid);
                context.lineTo(x + 5, y + grid - 5);
                context.lineTo(x + 5, y + 5);
                context.lineTo(x + grid - 5, y + 5);
                context.closePath();
                context.fill();

                context.fillStyle = colors[playfield[row][col]][2];
                context.beginPath();
                context.moveTo(x + grid, y);
                context.lineTo(x + grid, y + grid);
                context.lineTo(x, y + grid);
                context.lineTo(x + 5, y + grid - 5);
                context.lineTo(x + grid - 5, y + grid - 5);
                context.lineTo(x + grid - 5, y + 5);
                context.closePath();
                context.fill();
            }
        }
    }

    // ������ ������� ������
    if (tetromino) {

        // ������ ���������� ���� ������ ��������� ������
        if (++count > (35 - level)) {
            tetromino.row++;
            count = 0;

            // ���� �������� ����������� � ������ ������ � ���� � ���������, ����� �� ������� ������
            if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
                tetromino.row--;
                placeTetromino();
            }
        }

        // ������������ �
        for (let row = 0; row < tetromino.matrix.length; row++) {
            for (let col = 0; col < tetromino.matrix[row].length; col++) {
                if (tetromino.matrix[row][col]) {
                    let x = (tetromino.col + col) * grid;
                    let y = (tetromino.row + row) * grid;

                    context.fillStyle = colors[tetromino.name][0];
                    context.fillRect(x, y, grid, grid);

                    context.fillStyle = colors[tetromino.name][1];
                    context.beginPath();
                    context.moveTo(x + grid, y);
                    context.lineTo(x, y);
                    context.lineTo(x, y + grid);
                    context.lineTo(x + 5, y + grid - 5);
                    context.lineTo(x + 5, y + 5);
                    context.lineTo(x + grid - 5, y + 5);
                    context.closePath();
                    context.fill();

                    context.fillStyle = colors[tetromino.name][2];
                    context.beginPath();
                    context.moveTo(x + grid, y);
                    context.lineTo(x + grid, y + grid);
                    context.lineTo(x, y + grid);
                    context.lineTo(x + 5, y + grid - 5);
                    context.lineTo(x + grid - 5, y + grid - 5);
                    context.lineTo(x + grid - 5, y + 5);
                    context.closePath();
                    context.fill();
                }
            }
        }
    }
}

// ������ � ���� � �������
const start_menu = document.getElementById('start-menu');
const start_button = document.getElementById('start');
const records_tables = document.querySelectorAll('.text.records');

const over_menu = document.getElementById('over-menu');
const save_button = document.getElementById('save');
const restart_button = document.getElementById('restart');

// ������ � ���������
const scoreElement = document.getElementById('score-value');
const lineElement = document.getElementById('line-value');
const levelElement = document.getElementById('level-value');

// ������ � ������
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// � ������ ��� next
const next = document.getElementById('next');
const context_next = next.getContext('2d');

const grid = 32; // ������ �����

var count = 0; // ������� ������
var rAF = null; // ����� ��������

var gameOver; // ���� ����� ����

var lines; // ������� �����
var score; // ����
var level; // �������

var score_ls = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // ������� ��������

var tetrominoSequence; // ������ � �������������������� �����

var playfield = []; // ������ ��� �������

for (let row = -3; row < 20; row++) {
    playfield[row] = [];
}

var nextfield = []; // ������ ��� next

for (let row = 0; row < 3; row++) {
    nextfield[row] = [];
}

const tetrominos = {
    'I': [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    'J': [
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    'L': [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    'O': [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    'S': [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    'Z': [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    'T': [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]
};

// ���� ���������
const colors = {
    'I': ['rgb(249, 255, 27)', 'rgb(219, 169, 2)', 'rgb(251, 207, 1)'],
    'O': ['rgb(190, 58, 72)', 'rgb(121, 33, 47)', 'rgb(163, 40, 45)'],
    'T': ['rgb(212, 215, 84)', 'rgb(145, 140, 20)', 'rgb(184, 191, 16)'],
    'S': ['rgb(234, 179, 55)', 'rgb(215, 117, 0)', 'rgb(255, 165, 9)'],
    'Z': ['rgb(92, 207, 225)', 'rgb(1, 146, 178)', 'rgb(0, 172, 200)'],
    'J': ['rgb(126, 105, 146)', 'rgb(63, 41, 87)', 'rgb(102, 76, 121)'],
    'L': ['rgb(68, 108, 169)', 'rgb(36, 66, 137)', 'rgb(40, 85, 152)']
};

uploadRecords() //��������� ������� �������� �� ����

// ������ �� ��������� �� ������
document.addEventListener('DOMContentLoaded', function () {
    start_button.addEventListener('click', startGame);
    save_button.addEventListener('click', uploadRecords);
    restart_button.addEventListener('click', startGame);
});

// ������ �� ��������� �� �������
document.addEventListener('keydown', function (e) {
    if (gameOver) return; // ���� ���� ����������� � �������

    // ������� ����� � ������
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const col = e.key === 'ArrowLeft'
            // ���� �����, �� ��������� ������ � �������, ���� ������ � �����������
            ? tetromino.col - 1
            : tetromino.col + 1;

        // ���� ��� ������ �����, �� ���������� ������� ���������
        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
    }

    // ������� ����� � �������
    if (e.key === 'ArrowUp') {
        // ������������ ������ �� 90 ��������
        const matrix = rotate(tetromino.matrix);
        // ���� ��� ������ ����� � ����������
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
            tetromino.matrix = matrix;
        }
    }

    // ������� ���� � �������� �������
    if (e.key === 'ArrowDown') {
        // ������� ������ �� ������ ����
        const row = tetromino.row + 1;
        // ���� ���������� ������ ������ � ���������� ����� ���������
        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
            tetromino.row = row - 1;
            // ������ �� ����� � ������� �� ����������� ����
            placeTetromino();
            return;
        }
        // ���������� ������ �� ������� ���������� ���������
        tetromino.row = row;
    }
});