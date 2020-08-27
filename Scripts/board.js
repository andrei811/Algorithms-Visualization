
const no_rows = 30;
const no_cols = 70;

var speed_board = 100;
var speed_vector = 4000;

// fast - 0
// medium - 50
// slow - 100

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

        this.current_algorithm = null;
        this.running = false;
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
        this.cube_board[this.startx][this.starty].status = "start";
        document.getElementById(this.cube_board[this.startx][this.starty].Id).className = this.start_n;

        // setting target cube
        this.cube_board[this.targetx][this.targety].status = "target";
        document.getElementById(this.cube_board[this.targetx][this.targety].Id).className = this.target_n;

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
                    if (this.running)
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
                    if (this.running)
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
        this.CreateBoard();
        this.Add_Events_Listeners();
    }

    in_board = (x, y) => {
        if (x < 0 || y < 0 || x >= this.rows || y >= this.cols)
            return false;
        return true;
    }

    // LEE

    lee = () => {
        this.running = true;
        this.ClearPathBlocks();

        this.cube_board[this.startx][this.starty].distance = 1;
        this.queuex.push(this.startx);
        this.queuey.push(this.starty);

        document.getElementById(this.cube_board[this.startx][this.starty].Id).className = 'start-filled';

        this.leeaux();

        this.intid = setInterval(this.leeaux, speed_board);
    }

    leeaux = () => {
        var newx, newy, x, y;

        if (this.queuex.length == 0) {
            clearInterval(this.intid);
            this.running = false;
            return;
        }

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
            this.running = false;
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

        for (let i = 0; i < 10; i++)
            document.getElementById("arrow" + i).style.opacity = "0.0";

        table.style.marginTop = "250px";

        board.aux_number = document.getElementById('numberbox').value;

        document.getElementById('add').style.visibility = "visible";
    }

    binary_search = () => {

        this.running = true;

        this.init_binary_search();

        var left_right_col = "#004567", normal = "#000000", found_color = "green";

        var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var st = 0, dr = 9, mid, caut = board.aux_number, found = false;
        var last_elem = [], lastarrow = [];

        fun();

        var id = setInterval(fun, speed_vector);

        function fun() {
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
                board.running = false;

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

let board = new Board(no_rows, no_cols);
let vector = new Vector();
