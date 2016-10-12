/*
    author : Yoshi Park;
    this js file is just for claculator.html
*/
window.onload = function() {
    var Result_view = document.getElementById("result-view"); /* 展示result一栏的结果 */

    var Expression_view = document.getElementById("expression-view"); /* 展示计算过程的储存结果 */

    var Result_array = []; /* 运算表达式 */

    var Expression_array = []; /* 储存运算过程Expression_view的结果 */

    var Result_show = false; /* 对是否要更新展示结果的定义 */

    var numberinput = false; /* 对是否已经输入数字的定义 */

    var bracket = 0; /* 记录没有匹配的左括号数 */

    var is_update = false; /* 按下等号后计算出来的结果是否需要再使用 */

    /* 对计算器的数字按键1-9进行相应的定义 */
    var number_botton = {
        'one': '1',
        'two': '2',
        'three': '3',
        'four': '4',
        'five': '5',
        'six': '6',
        'seven': '7',
        'eight': '8',
        'nine': '9'
    };

    /* 对计算器的符号按键进行相应的定义 */
    var operation_botton = {
        'add': '+',
        'minus': '-',
        'multiply': '*',
        'divide': '/',
        'equal': '='
    };

    var Bracket = {
        'left-bracket': '(',
        'right-bracket': ')'
    }

    /* 按下数字按键后的相应处理 */
    for (var number in number_botton) {
        document.getElementById(number).onclick = function() {
            if (Result_view.value.length < 13 && Result_show == true) {
                Result_add(Result_view.value + number_botton[this.id]);
            } else if (Result_view.value.length < 13 && Result_show == false) {
                Result_add(number_botton[this.id]);
            }
        }
    }

    function Result_add(number_str) {
        Result_view.value = number_str;
        if (is_update == true) {
            Expression_array.length = 0;
            is_update = false;
        }
        Expression_array.push(number_str[number_str.length - 1]);
        Expression_view.value = Expression_array.join("");
        Result_array.push(number_str);
        Result_show = true;
        numberinput = true;
    }
    /* 按下符号键后的相应处理 */
    for (var operation in operation_botton) {
        document.getElementById(operation).onclick = function() {
            if (numberinput == true || (numberinput == false && operation_botton[this.id] == '-')) {
                operation_cal(operation_botton[this.id]);
            } else {
                if (operation_botton[this.id] != '+') {
                    alert("wrong expression");
                    //clear();
                }
            }
        }
    }

    function operation_cal() {
        var number_str = check_expression();
        expression_cal(number_str);

    }
    /* 对冗余表达式的处理  ex. 5.0, 5. 等变成5 */
    function check_expression() {
        var s = Result_view.value;
        var i = s.length - 1;
        for (i; i >= 0; --i) {
            if (s[i] != '.' && s[i] != '0') break;
        }
        return s.substr(0, i + 1);
    }

    function operation_cal(operation_type) {
        if (is_update == true) is_update = false;
        Expression_array.push(operation_type);
        Expression_view.value = Expression_array.join("");
        Result_array.push(operation_type);
        Result_show = false;
    }

    /* 对按下CE键的处理 */
    document.getElementById("clear-entry").onclick = function() {
        clear();
    }

    function clear() {
        Result_array.length = 0;
        Result_view.value = '0';
        numberinput = true;
        Expression_array.length = 0;
        Expression_view.value = '0';
        Result_show = false;
        is_update = false;
        bracket = 0;
    }

    /* 按下括号的处理 */
    document.getElementById("left-bracket").onclick = function() {
        if (is_update == true) {
            Expression_array.length = 0;
            is_update = false;
        }
        bracket++;
        Expression_array.push(Bracket[this.id]);
        Expression_view.value = Expression_array.join("");
    }

    document.getElementById("right-bracket").onclick = function() {
        if (is_update == true) {
            Expression_array.length = 0;
            is_update = false;
        }
        bracket--;
        Expression_array.push(Bracket[this.id]);
        Expression_view.value = Expression_array.join("");
    }

    /* 按下dot键的处理 */
    document.getElementById("dot").onclick = function() {
        Expression_array.push(Bracket[this.id]);
        Expression_view.value = Expression_array.join("");
        Result_add(Result_view.value + '.');
    }

    /* 按下backspace键的处理 */
    document.getElementById("backspace").onclick = function() {
        Expression_array.pop();
        Expression_view.value = Expression_array.join("");
        Result_view.value = Result_view.value.substr(0, Result_view.value.length - 1);
        if (Result_view.value.length == 0) {
            if (Expression_view.value.length == 0) clear();
            else {
                Result_view.value = '0';
                Result_show = false;
            }
        }
    }

    /* 按下zero键的处理 */
    document.getElementById("zero").onclick = function() {
        if (Result_show == true) Result_add(Result_view.value + '0');
        else Result_add('0');
    }

    /* 按下equal键的处理 */
    document.getElementById("equal").onclick = function() {
        if (bracket != 0) {
            alert("wrong expression");
            clear();
        } else {
            Negativechange();
            var mid_expression = midtolast();
            // alert(mid_expression);
            var truly_result = lasttonum(mid_expression);
            // alert(truly_result);
            Result_view.value = truly_result;
            Result_show = false;
            Expression_array.length = 0;
            for (var i = 0; i < Result_view.value.length; ++i) Expression_array.push(Result_view.value[i]);
            is_update = true;
        }
    }

    function Negativechange() {
        if (Expression_array[0] == '-') {
            for (var i = Expression_array.length - 1; i >= 0; --i) {
                Expression_array[i + 1] = Expression_array[i];
            }
            Expression_array[0] = '0';
        }
        for (var i = 0; i < Expression_array.length - 1; ++i) {
            if (Expression_array[i + 1] == '-' && Expression_array[i] == '(') {
                for (var j = Expression_array.length - 1; j >= i + 1; --j) {
                    Expression_array[j + 1] = Expression_array[j];
                }
                Expression_array[i + 1] = '0';
            }
        }
    }

    function is_num(num_c) {
        return (!isNaN(num_c) || num_c == '0');
    }
    /* 中缀表达式转为后缀表达式 */
    function midtolast() {
        var s = Expression_array.join("");
        var stack_array = [];
        stack_array.push('!');
        var result = "";
        while (s.length != 0) {
            if (is_num(s[0])) {
                var position = 0;
                var num_string = "";
                for (var i = 0; i < s.length; ++i) {
                    if (s[i] == '.') {
                        num_string = num_string + s[i];
                        position++;
                    } else if (is_num(s[i])) {
                        num_string = num_string + s[i];
                        position++;
                    } else {
                        break;
                    }
                }
                result = result + num_string + '#';
                s = s.substr(position, s.length - position);
            } else {
                if (s[0] == ')' || s[0] == '(') {
                    if (s[0] == ')') {
                        while (stack_array[stack_array.length - 1] != '(' && stack_array.length != 1) {
                            result = result + stack_array.pop() + '#';
                        }
                        if (stack_array.length != 1) stack_array.pop();
                    } else {
                        stack_array.push(s[0]);
                    }
                } else {
                    if (s[0] == '+' || s[0] == '-') {
                        while (stack_array[stack_array.length - 1] != '(' && stack_array.length != 1) {
                            result = result + stack_array.pop() + '#';
                        }
                        stack_array.push(s[0]);
                    } else {
                        while (stack_array[stack_array.length - 1] != '+' && stack_array[stack_array.length - 1] != '-' &&
                            stack_array[stack_array.length - 1] != '(' && stack_array.length != 1) {
                            result = result + stack_array.pop() + '#';
                        }
                        stack_array.push(s[0]);
                    }
                }
                s = s.substr(1, s.length - 1);
            }
        }
        while (stack_array.length != 1) {
            if (stack_array[stack_array.length - 1] != '(' && stack_array[stack_array.length - 1] != ')') result = result + stack_array.pop() + '#';
            // stack_array.pop();
        }
        result = result.substr(0, result.length - 1);
        return result;
    }

    /* 对浮点数加减乘除的优化 */
    function add(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
    }

    function sub(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
    }

    function mul(a, b) {
        var c = 0,
            d = a.toString(),
            e = b.toString();
        try {
            c += d.split(".")[1].length;
        } catch (f) {}
        try {
            c += e.split(".")[1].length;
        } catch (f) {}
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    }

    function div(a, b) {
        var c, d, e = 0,
            f = 0;
        try {
            e = a.toString().split(".")[1].length;
        } catch (g) {}
        try {
            f = b.toString().split(".")[1].length;
        } catch (g) {}
        return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
    }

    /* 判断后缀表达式是否合法 && 后缀表达式求值  */
    function lasttonum(midtype) {
        var stack_array = [];
        while (midtype.length != 0) {
            if (midtype[0] == '#') {
                midtype = midtype.substr(1, midtype.length - 1);
            } else if (is_num(midtype[0])) {
                var position = 0;
                var num_string = "";
                for (var i = 0; i < midtype.length; ++i) {
                    if (midtype[i] == '.') {
                        num_string = num_string + midtype[i];
                        position++;
                    } else if (is_num(midtype[i])) {
                        num_string = num_string + midtype[i];
                        position++;
                    } else {
                        break;
                    }
                }
                var number = parseFloat(num_string);
                stack_array.push(number);
                midtype = midtype.substr(position, midtype.length - position);
            } else {
                if (midtype[0] == '+') {
                    if (stack_array.length >= 2) {
                        var num_1 = stack_array.pop();
                        var num_2 = stack_array.pop();
                        var num_all = add(num_1, num_2);
                        stack_array.push(num_all);
                    } else {
                        alert("wrong expression");
                        clear();
                        return 0;
                    }
                } else if (midtype[0] == '-') {
                    if (stack_array.length >= 2) {
                        var num_1 = stack_array.pop();
                        var num_2 = stack_array.pop();
                        var num_all = sub(num_2, num_1);
                        stack_array.push(num_all);
                    } else {
                        alert("wrong expression");
                        clear();
                        return 0;
                    }
                } else if (midtype[0] == '*') {
                    if (stack_array.length >= 2) {
                        var num_1 = stack_array.pop();
                        var num_2 = stack_array.pop();
                        var num_all = mul(num_1, num_2);
                        stack_array.push(num_all);
                    } else {
                        alert("wrong expression");
                        clear();
                        return 0;
                    }
                } else {
                    if (stack_array.length >= 2) {
                        var num_1 = stack_array.pop();
                        var num_2 = stack_array.pop();
                        var num_all = div(num_2, num_1);
                        stack_array.push(num_all);
                    } else {
                        alert("wrong expression");
                        clear();
                        return 0;
                    }
                }
                midtype = midtype.substr(1, midtype.length - 1);
            }
        }
        if (stack_array.length != 1) {
            alert("wrong expression");
            clear();
            return 0;
        } else {
            var result_num = stack_array.pop();
            return result_num;
        }
    }
}
