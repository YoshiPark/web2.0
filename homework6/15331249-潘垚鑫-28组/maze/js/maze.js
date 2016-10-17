/*
    author:Yoshi Park
    this js file is for maze.html
*/

/* 生成迷宫 */
generate_Maze = function() {
    /* 定义generate_Maze内相应的函数 */
    function point(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
    /* 初始化迷宫里面的每一个点 */
    function initWall(horison, vertical) {
        this.horison = horison;
        this.vertical = vertical;
    }
    /* 减去相邻的两个点之间的墙 */
    function subwall(point1, point2) {
        if (point1.x == point2.x) {
            wall[point1.x][Math.max(point1.y, point2.y)].horison = false;
        } else {
            wall[Math.max(point1.x, point2.x)][point1.y].vertical = false;
        }
    }
    /* DFS算法生成迷宫 */
    function createmaze(currentpoint) {
        var neighborpoint_array = new Array();
        var curr_x = currentpoint.x,
            curr_y = currentpoint.y;
        for (var i = 0; i < 4; ++i) {
            var nx = curr_x + direction[i][0],
                ny = curr_y + direction[i][1];
            if (nx >= 0 && nx < border_x && ny >= 0 && ny < border_y && visit[nx][ny] === false) {
                neighborpoint_array.push(new point(nx, ny));
            }
        }
        while (neighborpoint_array.length) {
            var selection = Math.floor(neighborpoint_array.length * Math.random());
            var nx = neighborpoint_array[selection].x;
            var ny = neighborpoint_array[selection].y;
            if (visit[nx][ny] === false) {
                visit[nx][ny] = true;
                subwall(currentpoint, neighborpoint_array[selection]);
                createmaze(neighborpoint_array[selection]);
            }
            neighborpoint_array.splice(selection, 1);
        }
    }
    /* 显示墙在html页面上 */
    function addwall(width, height, left, top) {
        var wallBlock = document.createElement("div");
        wallBlock.className = "normalwall";
        wallBlock.style.position = "absolute";
        wallBlock.style.left = left + "px";
        wallBlock.style.top = top + "px";
        wallBlock.style.width = width + "px";
        wallBlock.style.height = height + "px";
        mazeContent.appendChild(wallBlock);
    }

    /* 开始执行函数 */
    var mazeContent = document.getElementById("maze_content");
    var border_x = 33,
        border_y = 20; // 定义迷宫的行数跟列数
    var wall = new Array(); // 定义迷宫内的每一个点
    var visit = new Array(); // 定义每个点是否被访问过
    var direction = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
    ]; // 定义上下左右四个方向
    for (var i = 0; i < border_x; ++i) {
        visit[i] = new Array();
        wall[i] = new Array();
        for (var j = 0; j < border_y; ++j) {
            visit[i][j] = false;
            wall[i][j] = new initWall(true, true);
        }
    }
    visit[border_x - 1][0] = true;
    createmaze(new point(border_x - 1, 0));
    for (var i = 0; i < border_x; ++i) {
        var prev = -1;
        for (var j = 0; j <= border_y; ++j) {
            if (j == border_y || wall[i][j].vertical == false) {
                if (j - 1 > prev) {
                    addwall(3, 30 * (j - 1 - prev) + 3, 30 * i, 30 * (prev + 1));
                }
                prev = j;
            }
        }
    }
    addwall(3, border_y * 30 + 3, 30 * border_x, 0);
    for (var i = 0; i < border_y; ++i) {
        prev = -1;
        for (var j = 0; j <= border_x; ++j) {
            if (j == border_x || wall[j][i].horison === false) {
                if (j - 1 > prev) {
                    addwall(30 * (j - 1 - prev) + 3, 3, 30 * (prev + 1), 30 * i);
                }
                prev = j;
            }
        }
    }
    addwall(border_x * 30 + 3, 3, 0, 30 * border_y);
}

window.onload = function() {
    generate_Maze();
    var maze = document.getElementById("maze_content");
    var start = document.getElementById("start");
    var end = document.getElementById("end");
    var wall = document.getElementsByClassName("normalwall");
    var message = document.getElementById("message");
    var check = document.getElementById("check");
    var game = false; /* 定义游戏开始 */
    var cheat = true; /* 定义游戏作弊 */
    /* 鼠标进入start */
    start.onmouseover = function() {
            game = true;
            cheat = true;
            startgame();
        }
        /* 鼠标触碰墙壁 */
    for (var i = 0; i < wall.length; ++i) {
        wall[i].onmouseover = function() {
            if (game) {

                showover();
            }
            game = false;
        }
    }
    /* 判断是否作弊 */
    check.onmouseover = function() {
            if (game) cheat = false;
        }
        /* 鼠标进入end */
    end.onmouseover = function() {
            if (game) {
                if (cheat === true) {
                    message.className = "cheating";
                    message.innerHTML = "Don't cheat, you should start form the 'S' and move to the 'E' inside the maze!";
                } else {
                    message.className = "succeed";
                    message.innerHTML = "You win!";
                }
            }
            cheat = false;
            game = false;
        }
        /* 鼠标离开迷宫 */
    maze.onmouseout = function(event) {
            var left = maze.offsetLeft;
            var right = maze.offsetLeft + maze.offsetWidth;
            var top = maze.offsetTop;
            var bottom = maze.offsetTop + maze.offsetHeight;
            if (event.pageX < left || event.pageX >= right || event.pageY < top || event.pageY >= bottom) {
                resetwall();
                cheat = true;
            }
        }
        /* 游戏开始时候重置游戏 */
    function startgame() {
        message.className = "startgame";
        message.innerHTML = "Start Game!";
        resetwall();
    }
    /*  鼠标触碰墙壁,墙壁颜色发生变化 */
    function showover() {
        message.className = "endgame";
        message.innerHTML = "You Lose!";
        var norwall = document.getElementsByClassName("normalwall");
        while (norwall.lenth !== 0) {
            norwall[0].className = "redwall";
        }
    }
    /* 重置墙的颜色 */
    function resetwall() {
        var redwall = document.getElementsByClassName("redwall");
        while (redwall.length !== 0) {
            redwall[0].className = "normalwall";
        }
        check = false;
    }
}
