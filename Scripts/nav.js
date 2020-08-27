const binarysearch = document.getElementById('binarysearch');
const merge = document.getElementById('merge');
const ssort = document.getElementById('binarysearch');
const bsort = document.getElementById('bsort');
const isort = document.getElementById('isort');
const msort = document.getElementById('msort');
const qsort = document.getElementById('qsort');
const hsort = document.getElementById('hsort');
const lee = document.getElementById('lee');
const start = document.getElementById('start-link');
const clearbtn = document.getElementById('clear_board');
const slow_btn = document.getElementById('slow_btn');
const medium_btn = document.getElementById('medium_btn');
const fast_btn = document.getElementById('fast_btn');

var algorithms = ["Binary Search", "Merge", "Selection Sort", "Bubble Sort", "Insertion Sort",
    "Merge Sort", "Quick Sort", "Heap Sort", "Lee Algorithm (BFS)"];

var selected = null;

binarysearch.onclick = () => {
    selected = 'Binary Search';
    // Disable other elements from other visualizations
    Disable_other(selected);

    if (board.current_algorithm != "Binary Search") {
        board.current_algorithm = "Binary Search";
        // Add pop-up animation
        var board_elem = document.getElementsByClassName("board");
        removeClass(board_elem, "board_slide");
        addClass(board_elem, "board_anim");
    }
    // Adding algorithm's description
    document.getElementById('text_description').innerHTML = '<strong>Binary Search,</strong> is a search algorithm that finds the position of a target value within a sorted array.'

    // Adding elements for visualization
    document.getElementById('add').style.display = "block";

    // Initialize board
    vector.init_binary_search();
}

lee.onclick = () => {
    selected = "Lee Algorithm (BFS)";

    document.getElementById('text_description').innerHTML = "The Lee algorithm is one possible solution for maze routing problems based on Breadth-first search.";

    // Disable other elements from other visualizations
    Disable_other(selected);

    // Remove pop-up trnsition and add Slide-in transition
    if (board.current_algorithm != selected) {
        board.current_algorithm = selected;
        var board_elem = document.getElementsByClassName("board");
        removeClass(board_elem, "board_anim");
        addClass(board_elem, "board_slide");
    }

    document.getElementById("board").style.marginTop = "0px";

    board.init_path_finding();
    document.getElementById('clear_board').style.display = 'inline-block';
}


start.onclick = () => {
    if (board.running)
        return;

    if (selected == "Lee Algorithm (BFS)")
        board.lee();
    else if (selected == "Binary Search")
        vector.binary_search();
    else if (selected == "DFS")
        board.dfs();
}

clearbtn.onclick = () => {
    board.ClearBoard();
}

slow_btn.onclick = () => {
    speed_board = 100;
    speed_vector = 4000;
}

medium_btn.onclick = () => {
    speed_board = 50;
    speed_vector = 2500;
}

fast_btn.onclick = () => {
    speed_board = 0;
    speed_vector = 800;
}

function removeClass(elem, class_name) {
    for (let i = 0; i < elem.length; i++) {
        elem[i].classList.remove(class_name);
    }
}

function addClass(elem, class_name) {
    for (let i = 0; i < elem.length; i++) {
        elem[i].classList.add(class_name);
    }
}

function Disable_other(alg_name) {
    for (let i = 0; i < algorithms.length; i++) {
        if (algorithms[i] != alg_name) {
            if (algorithms[i] === "Binary Search") {
                document.getElementById('add').style.display = "none";
            }
            else if (algorithms[i] === "Merge") { }
            else if (algorithms[i] === "Selection Sort") { }
            else if (algorithms[i] === "Bubble Sort") { }
            else if (algorithms[i] === "Insertion Sort") { }
            else if (algorithms[i] === "Merge Sort") { }
            else if (algorithms[i] === "Quick Sort") { }
            else if (algorithms[i] === "Heap Sort") { }
            else if (algorithms[i] === "Lee Algorithm (BFS)") {
                document.getElementById('clear_board').style.display = 'none';
                console.log('aici');
            }
            else if (algorithms[i] === "DFS") { }
        }
    }
}

