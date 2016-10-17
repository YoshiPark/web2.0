/*
    author:Yoshi Park
    this js file is for whac-a-mole.html
*/
window.onload = function() {
    var gamestart = document.getElementById("startgame");
    var gameend = document.getElementById("stopgame");
    var timetable = document.getElementById("time_border");
    var scoretable = document.getElementById("score_border");
    var status = document.getElementById("status");
    var gameBegin = false; /* 定义游戏开始 */
    var time, score; /* 定义display的时间跟分数 */
    var timer, clocker; /* 定义计时器 */

    initmole();
    gamestart.addEventListener("click", startgame);

    /* 初始化mole */
    function initmole() {
        var mole = document.getElementById("mole");
        for (var i = 0; i < 6 * 10; ++i) {
            var circle = document.createElement("input");
            circle.type = "radio";
            circle.name = "circle";
            circle.checked = false;
            circle.onclick = WrongClick;
            mole.appendChild(circle);
        }
        reset_time_score(0, 0);
    }
    /* 游戏开始 */
    function startgame() {
        if (gameBegin === false) {
            gameBegin = true;
            reset_time_score(30, 0);
            refreshstatus(true);
            var circle = document.getElementsByName("circle");
            for (var i = 0; i < circle.length; ++i) circle[i].disabled = false;
            selectcircle(-1);
            timer = setTimeout(function() {
                stopGame();
            }, 30000);
            clocker = setInterval(updateTime, 1000);
            gameend.addEventListener("click", stopGame);
        }
    }

    /* 随机产生"地鼠" */
    function selectcircle(num) {
        if (gameBegin) {
            var circle = document.getElementsByName("circle");
            var select;
            if (num === -1) {
                select = Math.floor(Math.random() * circle.length)
            } else {
                select = num;
            }
            circle[select].checked = true;
            /* 点击正确的按钮 */


            for (var i = 0; i < circle.length; ++i) {
                if (i == select) {
                    circle[i].onclick = function() {
                        if (gameBegin) {
                          Correctclick();
                          this.onclick = WrongClick;
                          this.checked = false;
                          selectcircle(-1);
                        }
                    }
                } else {
                    circle[i].onclick = function() {
                        if (gameBegin) {
                          refreshScore(--score);
                          this.checked = false;
                          selectcircle(select);
                        }
                    }
                }
            }

        }
    }
    /* 结束游戏 */
    function stopGame() {
        if (gameBegin) {
            refreshTime(0);
            alert("Gameover!\n" + "Your point:" + score);
            clearTimeout(timer);
            clearInterval(clocker);
            gameBegin = false;
            refreshstatus(false);
            resetcircle();
        } else {
            refreshScore(0);
            gameBegin = false;
        }
    }
    /* 游戏开始前重置时间以及分数 */
    function reset_time_score(currenttime, currentscore) {
        time = currenttime;
        score = currentscore;
        refreshTime(time);
        refreshScore(score);
    }
    /* 游戏结束后重置按钮 */
    function resetcircle() {
        var circle = document.getElementsByName("circle");
        for (var i = 0; i < circle.length; ++i) {
          circle[i].checked = false;
          circle[i].disabled = true;
        }
    }
    /* 点击错误的按钮 */
    function WrongClick() {
        if (gameBegin) {
            --score;
            refreshScore(score);
        }
    }
    /* 点击正确的按钮 */
    function Correctclick() {
        if (gameBegin) {
            ++score;
            refreshScore(score);
        }
    }
    /* 更新游戏的状态 */
    function refreshstatus(_status) {
        if (_status === true) {
            status.innerHTML = "playing";
        } else {
            status.innerHTML = "Game over";
        }
    }
    /* 更新display的时间 */
    function updateTime() {
        --time;
        refreshTime(time);
    }
    /* 改变display的时间 */
    function refreshTime(number) {
        timetable.innerHTML = number;
    }
    /* 改变display的分数 */
    function refreshScore(number) {
        scoretable.innerHTML = number;
    }
}
