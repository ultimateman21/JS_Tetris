// создаёт новое тетромино
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

// получает следующее тетромино
function getNextTetromino() {
    while (tetrominoSequence.length < 2)
        generateSequence();

    show_next(tetrominoSequence[1]) // отображает следующее тетромино
    
    const name = tetrominoSequence.shift(); // берём первое тетромино из массива

    const matrix = tetrominos[name];

    // I и O стартуют с середины, остальные — левее
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    const row = -3; // все тетромино начинают с минус 3 строки

    return {
        name: name,      // название тетромино
        matrix: matrix,  // матрица тетромино
        row: row,        // текущая строка
        col: col         // текущий столбец
    };
}

// поворачивает матрицу на 90 градусов
function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    return result;
}

// проверка на допустимость действия
function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                // выходит за границы поля
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                // пересекается с другими тетромино
                playfield[cellRow + row][cellCol + col])) {
                return false;
            }
        }
    }
    return true; // а если условия не сработали, то допустимо
}

// когда тетромино окончательно встало на место
function placeTetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
                // если тетромино вылезло за границу поля, то игра закончилась
                if (tetromino.row + row < 0) {
                    return endGame();
                }
                // если всё в порядке, то записываем в массив игрового поля тетромино
                playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
            }
        }
    }

    let m_lines = lines // переменная чтобы вычислить разницу между сожёнными линиями

    // проверяем, чтобы заполненные ряды очистились снизу вверх
    for (let row = playfield.length - 1; row >= 0;) {
        // если ряд заполнен
        if (playfield[row].every(cell => !!cell)) {
            // очищаем его и опускаем всё вниз на одну клетку
            for (let r = row; r >= 0; r--) {
                for (let c = 0; c < playfield[r].length; c++) {
                    playfield[r][c] = playfield[r - 1][c];
                }
            }
            lines++;
            show_line(lines); // обновляет счётчик линий
        } else {
            row--; // переходим к следующему ряду
        }
    }

    level = Math.floor(lines / 10)
    show_level(level); // обновляет счётчик уровня

    if (lines - m_lines === 1) {
        score += 40 * (level + 1);
    } else if (lines - m_lines === 2) {
        score += 100 * (level + 1);
    } else if (lines - m_lines === 3) {
        score += 300 * (level + 1);
    } else if (lines - m_lines === 4) {
        score += 1200 * (level + 1);
    }

    show_score(score) // обновляет счётчик очков

    tetromino = getNextTetromino(); // получаем следующее тетромино
}

// добавляет нули перед счётчиками
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

// обновить счёт
function show_score(score) {
    scoreElement.textContent = addZeroes(score, 6)
}

// обновить линии
function show_line(line) {
    lineElement.textContent = addZeroes(line, 3)
}

// обновить уровень
function show_level(level) {
    levelElement.textContent = addZeroes(level, 2)
}

// обновить next
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

// функция для кнопки старт
function startGame() {
    // убираем меню
    start_menu.style.display = 'none';
    over_menu.style.display = 'none';

    // Очищаем массивы и переменные
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

    // Очищаем холсты
    context.clearRect(0, 0, canvas.width, canvas.height);
    context_next.clearRect(0, 0, next.width, next.height);

    // Обновляем счетчики на экране
    show_score(score);
    show_line(lines);
    show_level(level);

    tetromino = getNextTetromino(); // первое тетромино
    rAF = requestAnimationFrame(loop); // старт игры
}

function endGame() {
    cancelAnimationFrame(rAF); // прекращаем всю анимацию игры

    gameOver = true; // ставим флаг окончания

    over_menu.style.display = 'flex'; // отображаем меню
}


// считывает, обновляет, перезаписывает куки и выводит таблицу рекордов на экран
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

// считывает куки
function downloadRecords() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'Records') {
            return JSON.parse(value);
        }
    }
    return []; // Если cookie с данным именем не найден
}

// главный цикл игры
function loop() {
    rAF = requestAnimationFrame(loop); // начинаем анимацию

    context.clearRect(0, 0, canvas.width, canvas.height); // очищаем холст

    // рисуем игровое поле с учётом заполненных фигур
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

    // рисуем текущую фигуру
    if (tetromino) {

        // фигура сдвигается вниз каждые несколько кадров
        if (++count > (35 - level)) {
            tetromino.row++;
            count = 0;

            // если движение закончилось — рисуем фигуру в поле и проверяем, можно ли удалить строки
            if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
                tetromino.row--;
                placeTetromino();
            }
        }

        // отрисовываем её
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

// доступ к меню и кнопкам
const start_menu = document.getElementById('start-menu');
const start_button = document.getElementById('start');
const records_tables = document.querySelectorAll('.text.records');

const over_menu = document.getElementById('over-menu');
const save_button = document.getElementById('save');
const restart_button = document.getElementById('restart');

// доступ к счётчикам
const scoreElement = document.getElementById('score-value');
const lineElement = document.getElementById('line-value');
const levelElement = document.getElementById('level-value');

// доступ к холсту
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// к холсту для next
const next = document.getElementById('next');
const context_next = next.getContext('2d');

const grid = 32; // размер сетки

var count = 0; // счётчик кадров
var rAF = null; // кадры анимации

var gameOver; // флаг конца игры

var lines; // сожжёные линии
var score; // счёт
var level; // уровень

var score_ls = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // таблица рекордов

var tetrominoSequence; // массив с последовательностями фигур

var playfield = []; // массив для тетриса

for (let row = -3; row < 20; row++) {
    playfield[row] = [];
}

var nextfield = []; // массив для next

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

// цвет тетромино
const colors = {
    'I': ['rgb(249, 255, 27)', 'rgb(219, 169, 2)', 'rgb(251, 207, 1)'],
    'O': ['rgb(190, 58, 72)', 'rgb(121, 33, 47)', 'rgb(163, 40, 45)'],
    'T': ['rgb(212, 215, 84)', 'rgb(145, 140, 20)', 'rgb(184, 191, 16)'],
    'S': ['rgb(234, 179, 55)', 'rgb(215, 117, 0)', 'rgb(255, 165, 9)'],
    'Z': ['rgb(92, 207, 225)', 'rgb(1, 146, 178)', 'rgb(0, 172, 200)'],
    'J': ['rgb(126, 105, 146)', 'rgb(63, 41, 87)', 'rgb(102, 76, 121)'],
    'L': ['rgb(68, 108, 169)', 'rgb(36, 66, 137)', 'rgb(40, 85, 152)']
};

uploadRecords() //загружаем таблицу рекордов из куки

// следим за нажатиями на кнопки
document.addEventListener('DOMContentLoaded', function () {
    start_button.addEventListener('click', startGame);
    save_button.addEventListener('click', uploadRecords);
    restart_button.addEventListener('click', startGame);
});

// следим за нажатиями на клавиши
document.addEventListener('keydown', function (e) {
    if (gameOver) return; // если игра закончилась — выходим

    // стрелки влево и вправо
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const col = e.key === 'ArrowLeft'
            // если влево, то уменьшаем индекс в столбце, если вправо — увеличиваем
            ? tetromino.col - 1
            : tetromino.col + 1;

        // если так ходить можно, то запоминаем текущее положение
        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
    }

    // стрелка вверх — поворот
    if (e.key === 'ArrowUp') {
        // поворачиваем фигуру на 90 градусов
        const matrix = rotate(tetromino.matrix);
        // если так ходить можно — запоминаем
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
            tetromino.matrix = matrix;
        }
    }

    // стрелка вниз — ускорить падение
    if (e.key === 'ArrowDown') {
        // смещаем фигуру на строку вниз
        const row = tetromino.row + 1;
        // если опускаться больше некуда — запоминаем новое положение
        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
            tetromino.row = row - 1;
            // ставим на место и смотрим на заполненные ряды
            placeTetromino();
            return;
        }
        // запоминаем строку на которую опустилось тетромино
        tetromino.row = row;
    }
});