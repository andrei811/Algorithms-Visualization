
const no_rows = 30;
const no_cols = 70;

var speed_board = 50;
var speed_vector = 2500;
var speed_sort = 200;

var alg_running = false;
var take_a_break = false;
var current_algorithm = null;

// board
// fast - 0
// medium - 50
// slow - 100

// vector
// fast - 800
// medium - 2500
// slow - 4000

//sort
//fast - 50
//medium - 200
//slow - 500

var is_board = false, is_vector = false;

class Cube {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.Id = row + "-" + col;
        this.status = "unvisited";
        this.last_status = null;
        this.distance = 100000;
    }
}

class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.targetx = Math.floor(rows / 2);
        this.targety = 2 * Math.floor(cols / 3);
        this.startx = Math.floor(rows / 2);
        this.starty = Math.floor(cols / 3) - 5;

        this.otargetx = Math.floor(rows / 2);
        this.otargety = 2 * Math.floor(cols / 3);
        this.ostartx = Math.floor(rows / 2);
        this.ostarty = Math.floor(cols / 3) - 5;

        this.aux_number = 2;
        this.mouseDown = false;
        this.stratdrawx = -1;
        this.stratdrawy = -1;
        this.startmoving = false;
        this.targetmoving = false;
        this.unvisited_n = "unvisited";
        this.wall_n = "wall";
        this.start_n = "start";
        this.target_n = "target";
        this.target_filled_n = 'target-filled';
        this.target_path_filled_n = 'target-path-filled';
        this.filled_n = "filled";

        this.cube_board = [];
        for (let i = 0; i < rows; i++)
            this.cube_board[i] = new Array(cols);

        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++) {
                this.cube_board[i][j] = new Cube(i, j);
            }

        this.queuex = [], this.queuey = [], this.cubes_to_animate = [];
        this.dx = [-1, 0, 1, 0];
        this.dy = [0, 1, 0, -1];
        this.path = [];
    }

    CreateBoard = () => {
        is_vector = false;
        is_board = true;

        var tableHTML = "";
        for (let i = 0; i < this.rows; i++) {
            var rowHTML = "<tr>";

            for (let j = 0; j < this.cols; j++) {
                var clas = i + '-' + j;
                rowHTML += '<td class="unvisited" id="' + clas + '"></td>';
            }

            rowHTML += "</tr>";

            tableHTML += rowHTML;
        }
        document.getElementById('board').innerHTML = tableHTML;

        // setting start cube
        this.cube_board[this.ostartx][this.ostarty].status = "start";
        document.getElementById(this.cube_board[this.ostartx][this.ostarty].Id).className = this.start_n;

        // setting target cube
        this.cube_board[this.otargetx][this.otargety].status = "target";
        document.getElementById(this.cube_board[this.otargetx][this.otargety].Id).className = this.target_n;

        // disable other elements
        var elem = document.getElementById("add");
        elem.style.height = "0px";
        elem.style.visibility = "hidden";
    }

    ClearDistances = () => {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                this.cube_board[i][j].distance = 100000;
    }

    ClearPathBlocks = () => {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++) {
                if (this.cube_board[i][j].status == this.target_path_filled_n) {
                    this.cube_board[i][j].status = this.target_n;
                    document.getElementById(this.cube_board[i][j].Id).className = this.target_n;
                }
                else if (this.cube_board[i][j].status == this.filled_n) {
                    this.cube_board[i][j].status = this.unvisited_n;
                    document.getElementById(this.cube_board[i][j].Id).className = this.unvisited_n;
                }
            }
    }

    ClearBoard = () => {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++) {
                if (i == this.ostartx && j == this.ostarty) {
                    document.getElementById(this.cube_board[i][j].Id).className = this.start_n;
                    this.cube_board[i][j].status = this.start_n;
                    this.startx = this.ostartx;
                    this.starty = this.ostarty;
                }
                else if (i == this.otargetx && j == this.otargety) {
                    document.getElementById(this.cube_board[i][j].Id).className = this.target_n;
                    this.cube_board[i][j].status = this.target_n;
                    this.targetx = this.otargetx;
                    this.targety = this.otargety;
                }
                else {
                    document.getElementById(this.cube_board[i][j].Id).className = this.unvisited_n;
                    this.cube_board[i][j].status = this.unvisited_n;
                }
            }
    }

    Add_Events_Listeners = () => {

        // for drawing
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++) {

                var ID = i + '-' + j;

                const block = document.getElementById(ID);

                block.onmousedown = () => {
                    if (alg_running)
                        return;
                    if (this.cube_board[i][j].status == this.unvisited_n || this.cube_board[i][j].status == this.filled_n) {
                        block.className = this.wall_n;
                        this.cube_board[i][j].status = this.wall_n;
                        this.mouseDown = true;
                    }
                    else if (this.cube_board[i][j].status == this.wall_n) {
                        block.className = this.unvisited_n;
                        this.cube_board[i][j].status = this.unvisited_n;
                        this.mouseDown = true;
                    }
                    else if (this.cube_board[i][j].status == this.start_n) {
                        this.startmoving = true;
                    }
                    else if (this.cube_board[i][j].status == this.target_n) {
                        this.targetmoving = true;
                    }
                }

                block.onmouseup = () => {
                    this.mouseDown = false;
                    this.targetmoving = false;
                    this.startmoving = false;
                }

                block.onmouseenter = () => {
                    if (alg_running)
                        return;
                    if (this.mouseDown) {
                        if (this.cube_board[i][j].status == this.unvisited_n || this.cube_board[i][j].status == this.filled_n) {
                            block.className = '';
                            block.classList.add(this.wall_n);
                            this.cube_board[i][j].status = this.wall_n;
                        }
                        else if (this.cube_board[i][j].status == this.wall_n) {
                            block.className = '';
                            block.classList.add(this.unvisited_n);
                            this.cube_board[i][j].status = this.unvisited_n;
                        }
                    }
                    if (this.startmoving) {
                        if ((i != this.startx || j != this.starty) && (i != this.targetx || j != this.targety)) {
                            this.cube_board[this.startx][this.starty].status = this.unvisited_n;
                            document.getElementById(this.cube_board[this.startx][this.starty].Id).className = this.unvisited_n;
                            this.startx = i;
                            this.starty = j;
                            this.cube_board[this.startx][this.starty].status = "start";
                            document.getElementById(this.cube_board[this.startx][this.starty].Id).className = this.start_n;
                        }
                    }

                    if (this.targetmoving) {
                        if ((i != this.targetx || j != this.targety) && (i != this.startx || j != this.starty)) {
                            this.cube_board[this.targetx][this.targety].status = this.unvisited_n;
                            document.getElementById(this.cube_board[this.targetx][this.targety].Id).className = this.unvisited_n;
                            this.targetx = i;
                            this.targety = j;
                            this.cube_board[this.targetx][this.targety].status = "target";
                            document.getElementById(this.cube_board[this.targetx][this.targety].Id).className = this.target_n;
                        }
                    }

                }
            }
    }

    init_path_finding = () => {
        document.getElementById("board").classList.remove('table_sort');
        this.CreateBoard();
        this.Add_Events_Listeners();
    }

    // LEE
    in_board = (x, y) => {
        if (x < 0 || y < 0 || x >= this.rows || y >= this.cols)
            return false;
        return true;
    }

    lee = () => {
        alg_running = true;
        this.ClearPathBlocks();

        this.cube_board[this.startx][this.starty].distance = 1;
        this.queuex.push(this.startx);
        this.queuey.push(this.starty);

        document.getElementById(this.cube_board[this.startx][this.starty].Id).className = 'start-filled';

        this.leeaux();

        this.intid = setInterval(this.leeaux, speed_board);
    }

    leeaux = () => {
        if (this.queuex.length == 0) {
            clearInterval(this.intid);
            alg_running = false;
            return;
        }

        if (take_a_break)
            return;

        var newx, newy, x, y;



        x = this.queuex[0];
        y = this.queuey[0];

        this.queuex.shift();
        this.queuey.shift();

        for (let i = 0; i < 4; i++) {
            newx = x + this.dx[i];
            newy = y + this.dy[i];

            if (this.in_board(newx, newy)
                && this.cube_board[newx][newy].distance > this.cube_board[x][y].distance + 1
                && (this.cube_board[newx][newy].status == this.unvisited_n || this.cube_board[newx][newy].status == this.target_n)) {

                this.cubes_to_animate.push([newx, newy]);
                this.cube_board[newx][newy].distance = this.cube_board[x][y].distance + 1;

                if (newx == this.targetx && newy == this.targety) {
                    this.Animate_Cubes();
                    this.rec(newx, newy);
                    this.path.push([this.targetx, this.targety]);
                    this.showpath();
                    this.ClearDistances(true);
                    clearInterval(this.intid);
                    return;
                }

                this.queuex.push(newx);
                this.queuey.push(newy);
            }
        }

        this.Animate_Cubes();
    }

    Animate_Cubes = () => {
        var x, y;
        while (this.cubes_to_animate.length > 0) {

            x = this.cubes_to_animate[this.cubes_to_animate.length - 1][0];
            y = this.cubes_to_animate[this.cubes_to_animate.length - 1][1];

            if (x == this.targetx && y == this.targety) {
                document.getElementById(this.cube_board[x][y].Id).className = this.target_filled_n;
                this.cube_board[x][y].status = this.target_filled_n;
            }
            else {
                document.getElementById(this.cube_board[x][y].Id).className = this.filled_n;
                this.cube_board[x][y].status = this.filled_n;
            }

            this.cubes_to_animate.pop();
        }
    }

    rec = (x, y) => {

        if (x == this.startx && y == this.starty) {
            this.path.push([x, y]);
            return;
        }

        for (let i = 0; i < 4; i++) {
            let newx = x + this.dx[i];
            let newy = y + this.dy[i];

            if (this.in_board(newx, newy) &&
                this.cube_board[newx][newy].distance == this.cube_board[x][y].distance - 1) {
                this.rec(newx, newy);
                this.path.push([newx, newy]);
                break;
            }
        }
    }

    showpath = () => {
        this.build_path();
        this.intid2 = setInterval(this.build_path, 100);
    }

    build_path = () => {
        if (this.path.length == 0) {
            clearInterval(this.intid2);
            alg_running = false;
            return;
        }

        if (this.cube_board[this.path[0][0]][this.path[0][1]].status == this.start_n)
            document.getElementById(this.cube_board[this.path[0][0]][this.path[0][1]].Id).className = 'start-path-filled';
        else if (this.cube_board[this.path[0][0]][this.path[0][1]].status == this.target_filled_n) {
            var elem = document.getElementById(this.cube_board[this.path[0][0]][this.path[0][1]].Id);
            elem.className = '';
            elem.className = this.target_path_filled_n;
            this.cube_board[this.path[0][0]][this.path[0][1]].status = this.target_path_filled_n;
        }
        else
            document.getElementById(this.cube_board[this.path[0][0]][this.path[0][1]].Id).className = 'pathfilled';

        this.path.shift();
    }
}

class Vector {

    init_binary_search = () => {
        var rowHTML = "<tr>";

        for (let i = 0; i < 10; i++)
            rowHTML += '<td class="array_elem" id="arr' + i + '">' + i + '</td>';

        rowHTML += "</tr><tr>";

        for (let i = 0; i < 10; i++)
            rowHTML += '<td class="arrows" id="arrow' + i + '"><img class="arrow_up" src="Images/arrow-up.png"></td>';

        rowHTML += "</tr>";
        var table = document.getElementById("board");
        table.innerHTML = rowHTML;
        table.classList.remove('table_sort');

        for (let i = 0; i < 10; i++)
            document.getElementById("arrow" + i).style.opacity = "0.0";

        table.style.marginTop = "250px";

        board.aux_number = document.getElementById('numberbox').value;

        document.getElementById('add').style.visibility = "visible";
    }

    binary_search = () => {

        alg_running = true;

        this.init_binary_search();

        var left_right_col = "#004567", normal = "#000000", found_color = "green";

        var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var st = 0, dr = 9, mid, caut = board.aux_number, found = false;
        var last_elem = [], lastarrow = [];

        fun();

        var id = setInterval(fun, speed_vector);

        function fun() {

            if (take_a_break)
                return;

            if (lastarrow.length > 0) {
                document.getElementById("arrow" + lastarrow[0]).style.opacity = "0.0";
                document.getElementById("arrow" + lastarrow[1]).style.opacity = "0.0";

                if (last_elem[0] != caut)
                    document.getElementById("arr" + last_elem[0]).style.backgroundColor = normal;
                else
                    document.getElementById("arr" + last_elem[1]).style.backgroundColor = normal;

                lastarrow.pop();
                lastarrow.pop();
            }


            if (st > dr || found) {
                alg_running = false;

                for (let i = 0; i < 10; i++)
                    if (i != caut)
                        document.getElementById("arr" + i).style.backgroundColor = normal;
                    else
                        document.getElementById("arr" + i).style.backgroundColor = found_color;

                clearInterval(id);
                return;
            }

            var elem = document.getElementById("arrow" + st).style.opacity = "1.0";
            var elem = document.getElementById("arrow" + dr).style.opacity = "1.0";

            mid = Math.floor((st + dr) / 2);

            if (last_elem.length > 0) {

                document.getElementById("arr" + last_elem[0]).style.backgroundColor = normal;
                document.getElementById("arr" + last_elem[1]).style.backgroundColor = normal;
                document.getElementById("arr" + last_elem[2]).style.backgroundColor = normal;
                last_elem.pop();
                last_elem.pop();
                last_elem.pop();
            }

            document.getElementById("arr" + st).style.backgroundColor = left_right_col;
            document.getElementById("arr" + dr).style.backgroundColor = left_right_col;

            lastarrow.push(st);
            lastarrow.push(dr);
            last_elem.push(st);
            last_elem.push(dr);

            if (array[mid] < caut)
                st = mid + 1;
            else
                dr = mid - 1;

            document.getElementById("arr" + mid).style.backgroundColor = "red";

            if (array[mid] == caut) {
                found = true;
                document.getElementById("arr" + mid).style.backgroundColor = found_color;
            }

            last_elem.push(mid);
        }

    }
}

class Sort_Elem {
    constructor(pos, num) {
        this.Id = 'sarr' + pos;
        this.num = num;
        this.height = 0;
        this.color = null;
    }
}

class Sort_Vector {

    constructor() {
        this.wp = 75;
        this.hp = 67;
        this.width = 0;
        this.height = 0;
        this.array = [];
        this.size = 40;
        this.nr_max = 670;
        this.idint5 = null;
        this.todispach = [];
    }

    resize_vector = (new_size) => {
        this.size = new_size;

        this.array = [];

        this.init_sort_vector(false);
    }

    init_sort_vector = (da = true) => {
        // 1200 <->
        // 650 ^v

        document.getElementById('slider').value = this.size;

        var rowHTML = "";

        var frecv = new Array(this.nr_max);

        for (let i = 0; i < this.nr_max; i++) {
            frecv[i] = 0;
        }

        for (let i = 0; i < this.size; i++) {
            let temp = Math.floor((Math.random() * 650) + 50);

            while (frecv[temp] != 0) {
                temp = Math.floor((Math.random() * 650) + 50);
            }

            frecv[temp] = 1;

            this.array.push(new Sort_Elem(i, temp));
            rowHTML += '<div class="sort_array" id="sarr' + i + '"></div>';
        }

        var table = document.getElementById("sarray");
        table.style.display = 'block';

        table.innerHTML = rowHTML;

        this.width = Math.floor((this.wp * window.innerWidth) / 100);
        this.height = Math.floor((this.hp * window.innerHeight) / 100);

        table.style.width = (this.width + 10) + 'px';
        table.style.height = (this.height + 10) + 'px';

        var elem_width = Math.floor(this.width / this.size);

        for (let i = 0; i < this.size; i++) {
            var elem = document.getElementById('sarr' + i);
            elem.style.width = elem_width.toString() + 'px';
            elem.style.height = (Math.floor((this.array[i].num * this.height) / 650)).toString() + 'px';
            this.array[i].height = (Math.floor((this.array[i].num * this.height) / 650));
        }

        if (da) {
            document.getElementById('sarray').classList.add('fall');
            document.getElementById('sliderinput').classList.add('fall');
        }
    }

    selection_sort = () => {
        alg_running = true;
        this.pointer1 = 0;
        this.lastpointer1 = -1;
        this.pointer2 = 1;
        this.lastpointer2 = -1;

        this.idint1 = setInterval(this.selection_sort_aux, speed_sort);
    }

    selection_sort_aux = () => {

        // if pause...
        if (take_a_break)
            return;

        // reset color of last 2 compared elements
        if (this.lastpointer1 != -1) {
            this.array[this.lastpointer1].color = "black";
            document.getElementById(this.array[this.lastpointer1].Id).style.backgroundColor = "black";
        }
        if (this.lastpointer2 != -1) {
            this.array[this.lastpointer2].color = "black";
            document.getElementById(this.array[this.lastpointer2].Id).style.backgroundColor = "black";
        }

        // if the sort has ended
        if (this.pointer2 == this.size) {
            alg_running = false;
            clearInterval(this.idint1);
            return;
        }

        // color green the elements that are compared
        if (this.array[this.pointer1].color != "green") {
            this.array[this.pointer1].color = "green";
            document.getElementById(this.array[this.pointer1].Id).style.backgroundColor = "green";
        }
        if (this.array[this.pointer2].color != "green") {
            this.array[this.pointer2].color = "green";
            document.getElementById(this.array[this.pointer2].Id).style.backgroundColor = "green";
        }

        // if the elements should swap...
        if (this.array[this.pointer1].num > this.array[this.pointer2].num) {

            // the color of blocks becomes red
            this.array[this.pointer1].color = "red";
            document.getElementById(this.array[this.pointer1].Id).style.backgroundColor = "red";

            this.array[this.pointer2].color = "red";
            document.getElementById(this.array[this.pointer2].Id).style.backgroundColor = "red";

            // swapping objects...
            let temp = this.array[this.pointer1];
            this.array[this.pointer1] = this.array[this.pointer2];
            this.array[this.pointer2] = temp;

            let temp2 = this.array[this.pointer1].Id;
            this.array[this.pointer1].Id = this.array[this.pointer2].Id;
            this.array[this.pointer2].Id = temp2;

            // setting the right height and number...
            var elem1 = document.getElementById(this.array[this.pointer1].Id);
            elem1.style.height = this.array[this.pointer1].height + 'px';

            var elem1 = document.getElementById(this.array[this.pointer2].Id);
            elem1.style.height = this.array[this.pointer2].height + 'px';
        }

        // move the pointers...
        this.lastpointer2 = this.pointer2;
        this.pointer2++;

        if (this.pointer2 == this.size) {
            this.lastpointer1 = this.pointer1;
            this.pointer1++;
            this.pointer2 = this.pointer1 + 1;
        }
    }

    insertion_sort = () => {
        alg_running = true;
        this.pointer1 = 1;
        this.lastpointer1 = -1;
        this.pointer2 = 1;
        this.lastpointer2 = -1;
        this.pointer3 = 0;
        this.lastpointer3 = -1;

        this.idint2 = setInterval(this.insertion_sort_aux, speed_sort);
    }

    insertion_sort_aux = () => {
        // if pause...
        if (take_a_break)
            return;

        // reset color of last 2 compared elements
        if (this.lastpointer1 != -1 && this.array[this.lastpointer1].color != "black") {
            this.array[this.lastpointer1].color = "black";
            document.getElementById(this.array[this.lastpointer1].Id).style.backgroundColor = "black";
        }
        if (this.lastpointer2 != -1 && this.array[this.lastpointer2].color != "black") {
            this.array[this.lastpointer2].color = "black";
            document.getElementById(this.array[this.lastpointer2].Id).style.backgroundColor = "black";
        }
        if (this.lastpointer3 != -1 && this.array[this.lastpointer3].color != "black") {
            this.array[this.lastpointer3].color = "black";
            document.getElementById(this.array[this.lastpointer3].Id).style.backgroundColor = "black";
        }

        // if the sort has ended
        if (this.pointer1 == this.size) {
            alg_running = false;
            clearInterval(this.idint2);
            return;
        }

        // color green the elements that are compared
        if (this.array[this.pointer1].color != "green") {
            this.array[this.pointer1].color = "green";
            document.getElementById(this.array[this.pointer1].Id).style.backgroundColor = "green";
        }
        if (this.array[this.pointer2].color != "red") {
            this.array[this.pointer2].color = "red";
            document.getElementById(this.array[this.pointer2].Id).style.backgroundColor = "red";
        }
        if (this.array[this.pointer3].color != "red") {
            this.array[this.pointer3].color = "red";
            document.getElementById(this.array[this.pointer3].Id).style.backgroundColor = "red";
        }

        // if the elements should swap...
        if (this.array[this.pointer3].num > this.array[this.pointer2].num) {

            // swapping objects...
            let temp = this.array[this.pointer3];
            this.array[this.pointer3] = this.array[this.pointer2];
            this.array[this.pointer2] = temp;

            let temp2 = this.array[this.pointer3].Id;
            this.array[this.pointer3].Id = this.array[this.pointer2].Id;
            this.array[this.pointer2].Id = temp2;

            temp2 = this.array[this.pointer3].color;
            this.array[this.pointer3].color = this.array[this.pointer2].color;
            this.array[this.pointer2].color = temp2;

            // setting the right height and number...
            var elem1 = document.getElementById(this.array[this.pointer3].Id);
            elem1.style.height = this.array[this.pointer3].height + 'px';

            var elem1 = document.getElementById(this.array[this.pointer2].Id);
            elem1.style.height = this.array[this.pointer2].height + 'px';
        }

        // move the pointers...
        this.lastpointer2 = this.pointer2;
        this.lastpointer3 = this.pointer3;
        this.pointer2--;
        this.pointer3--;

        if (this.pointer3 < 0) {
            this.lastpointer1 = this.pointer1;
            this.pointer1++;
            this.pointer2 = this.pointer1;
            this.pointer3 = this.pointer2 - 1;
        }
    }

    bubble_sort = () => {
        alg_running = true;
        this.pointer1 = 0;
        this.lastpointer1 = -1;
        this.pointer2 = 1;
        this.lastpointer2 = -1;
        this.swapped = false;
        this.should_stop = false;
        this.size_aux = this.size;

        this.idint3 = setInterval(this.bubble_sort_aux, speed_sort);
    }

    bubble_sort_aux = () => {
        // if pause...
        if (take_a_break)
            return;

        // reset color of last 2 compared elements
        if (this.lastpointer1 != -1) {
            this.array[this.lastpointer1].color = "black";
            document.getElementById(this.array[this.lastpointer1].Id).style.backgroundColor = "black";
        }
        if (this.lastpointer2 != -1) {
            this.array[this.lastpointer2].color = "black";
            document.getElementById(this.array[this.lastpointer2].Id).style.backgroundColor = "black";
        }

        // if the sort has ended
        if (this.should_stop) {
            alg_running = false;
            clearInterval(this.idint1);
            return;
        }

        // color green the elements that are compared
        if (this.array[this.pointer1].color != "green") {
            this.array[this.pointer1].color = "green";
            document.getElementById(this.array[this.pointer1].Id).style.backgroundColor = "green";
        }
        if (this.array[this.pointer2].color != "green") {
            this.array[this.pointer2].color = "green";
            document.getElementById(this.array[this.pointer2].Id).style.backgroundColor = "green";
        }

        // if the elements should swap...
        if (this.array[this.pointer1].num > this.array[this.pointer2].num) {

            this.swapped = true;
            // the color of blocks becomes red
            this.array[this.pointer1].color = "red";
            document.getElementById(this.array[this.pointer1].Id).style.backgroundColor = "red";

            this.array[this.pointer2].color = "red";
            document.getElementById(this.array[this.pointer2].Id).style.backgroundColor = "red";

            // swapping objects...
            let temp = this.array[this.pointer1];
            this.array[this.pointer1] = this.array[this.pointer2];
            this.array[this.pointer2] = temp;

            let temp2 = this.array[this.pointer1].Id;
            this.array[this.pointer1].Id = this.array[this.pointer2].Id;
            this.array[this.pointer2].Id = temp2;

            // setting the right height and number...
            var elem1 = document.getElementById(this.array[this.pointer1].Id);
            elem1.style.height = this.array[this.pointer1].height + 'px';

            var elem1 = document.getElementById(this.array[this.pointer2].Id);
            elem1.style.height = this.array[this.pointer2].height + 'px';
        }

        // move the pointers...
        this.lastpointer2 = this.pointer2;
        this.pointer2++;
        this.lastpointer1 = this.pointer1;
        this.pointer1++;


        if (this.pointer2 == this.size_aux) {
            this.pointer1 = 0;
            this.pointer2 = 1;
            this.size_aux--;
            if (!this.swapped) {
                this.should_stop = true;
            }
            this.swapped = false;
        }
    }

    quick_sort = () => {
        alg_running = true;
        this.quick_sort_aux(0, this.array.length - 1);
        this.dispach();
    }

    quick_sort_aux = (st, dr) => {
        if (st < dr) {
            var part = this.partition(st, dr);

            this.quick_sort_aux(st, part);
            this.quick_sort_aux(part + 1, dr);
        }
    }

    partition = (st, dr) => {
        var pivot = this.array[st].num;

        this.todispach.push([-3, st, dr]);
        st--;
        dr++;

        while (st < dr) {

            do {
                dr--;
                this.todispach.push([-1, dr]);
            }
            while (st < dr && this.array[dr].num > pivot);

            do {
                st++;
                this.todispach.push([-2, st]);
            }
            while (st < dr && this.array[st].num < pivot);

            if (st < dr) {
                let temp = this.array[st];
                this.array[st] = this.array[dr];
                this.array[dr] = temp;

                let temp2 = this.array[st].Id;
                this.array[st].Id = this.array[dr].Id;
                this.array[dr].Id = temp2;

                this.todispach.push([st, dr]);
            }
        }

        return dr;

    }

    dispach = () => {
        this.lasti = -1;
        this.lastj = -1;
        this.lastpointer1 = -1;
        this.lastpointer2 = -1;
        this.idint4 = setInterval(this.dispach_aux, (20 * speed_sort / 100));
    }

    dispach_aux = () => {

        if (take_a_break) {
            return;
        }

        if (this.lastpointer1 != -1) {
            document.getElementById(this.array[this.lastpointer2].Id).style.backgroundColor = "black";
            document.getElementById(this.array[this.lastpointer1].Id).style.backgroundColor = "black";
        }

        if (this.todispach.length <= 0) {
            alg_running = false;
            if (this.lasti != -1) {
                document.getElementById(this.array[this.lasti].Id).style.backgroundColor = "black";
                document.getElementById(this.array[this.lastj].Id).style.backgroundColor = "black";
            }
            clearInterval(this.idint4);
            return;
        }

        let i = this.todispach[0][0];
        let j = this.todispach[0][1];

        if (i == -3) {
            if (this.lasti != -1) {
                document.getElementById(this.array[this.lasti].Id).style.backgroundColor = "black";
                document.getElementById(this.array[this.lastj].Id).style.backgroundColor = "black";
            }
            i = j;
            j = this.todispach[0][2];
            this.todispach.shift();

            document.getElementById(this.array[i].Id).style.backgroundColor = "green";
            this.lasti = i;

            document.getElementById(this.array[j].Id).style.backgroundColor = "green";
            this.lastj = j;
            return;
        }

        this.todispach.shift();

        if (i == -2) {
            i = j;
            document.getElementById(this.array[this.lasti].Id).style.backgroundColor = "black";
            document.getElementById(this.array[i].Id).style.backgroundColor = "green";
            this.lasti = i;
            return;
        }

        if (i == -1) {
            document.getElementById(this.array[this.lastj].Id).style.backgroundColor = "black";
            document.getElementById(this.array[j].Id).style.backgroundColor = "green";
            this.lastj = j;
            return;
        }



        // setting the right height and number...
        var elem1 = document.getElementById(this.array[j].Id);
        elem1.style.height = this.array[j].height + 'px';
        elem1.style.backgroundColor = "red";
        this.lastpointer1 = j;

        var elem1 = document.getElementById(this.array[i].Id);
        elem1.style.height = this.array[i].height + 'px';
        elem1.style.backgroundColor = "red";
        this.lastpointer2 = j;
    }

    merge_sort = () => {
        alg_running = true;

        this.merge_sort_aux(0, this.array.length - 1);

        this.dispach2();
    }

    merge_sort_aux = (st, dr) => {
        if (st < dr) {

            this.merge_sort_aux(st, Math.floor((st + dr) / 2));
            this.merge_sort_aux(Math.floor((st + dr) / 2) + 1, dr);

            this.merge(st, dr);
        }
    }

    merge = (st, dr) => {
        var auxvect = [];
        var mid = Math.floor((st + dr) / 2);

        var i = st, j = mid + 1, aux;

        while (i <= mid && j <= dr) {
            if (this.array[i].num > this.array[j].num)
                auxvect.push([this.array[j].num, this.array[j].height]), j++;
            else
                auxvect.push([this.array[i].num, this.array[i].height]), i++;

            this.todispach.push([2, i, j]);
        }

        while (i <= mid) {
            this.todispach.push([1, i]);
            auxvect.push([this.array[i].num, this.array[i].height]);
            i++;
        }
        while (j <= dr) {
            this.todispach.push([1, j]);
            auxvect.push([this.array[j].num, this.array[j].height]);
            j++;
        }

        for (let k = st; k <= dr; k++) {
            this.todispach.push([3, k]);
            this.array[k].num = auxvect[k - st][0];
            this.array[k].height = auxvect[k - st][1];
        }
    }

    dispach2 = () => {
        this.lasti = -1;
        this.idint6 = setInterval(this.dispach2_aux, (20 * speed_sort / 100));
    }

    dispach2_aux = () => {

        if (this.lasti != -1) {
            document.getElementById(this.array[this.lasti].Id).style.backgroundColor = "black";
            document.getElementById(this.array[this.lasti].Id).style.backgroundColor = "black";
        }

        if (take_a_break) {
            return;
        }

        if (this.todispach.length <= 0) {
            alg_running = false;

            if (this.lasti != -1) {
                document.getElementById(this.array[this.lasti].Id).style.backgroundColor = "black";
            }

            clearInterval(this.idint6);
            return;
        }

        let i, j;

        i = this.todispach[0][0];
        j = this.todispach[0][1];


        if (i == 1) {
            document.getElementById(this.array[j].Id).style.backgroundColor = "red";
        }
        else if (i == 2) {
            i = j;
            j = this.todispach[0][2];
            console.log(i, j);

            document.getElementById(this.array[i].Id).style.backgroundColor = "red";
            document.getElementById(this.array[j].Id).style.backgroundColor = "red";
        }
        else if (i == 3) {
            let elemen = document.getElementById(this.array[j].Id);
            elemen.style.backgroundColor = "green";
            elemen.style.height = this.array[j].height.toString() + 'px';

            this.lasti = i;
        }
        this.todispach.shift();
    }
}

let board = new Board(no_rows, no_cols);
let vector = new Vector();
let sort_vector = new Sort_Vector();
