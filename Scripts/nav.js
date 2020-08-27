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
const pause_button = document.getElementById('pause_button');
const apause_button = document.getElementById('pause-resume');

var algorithms = ["Binary Search", "Merge", "Selection Sort", "Bubble Sort", "Insertion Sort",
    "Merge Sort", "Quick Sort", "Heap Sort", "Lee Algorithm (BFS)"];

var selected = null;

binarysearch.onclick = () => {
    if (alg_running)
        return;

    selected = 'Binary Search';
    // Disable other elements from other visualizations
    Disable_other(selected);

    if (board.current_algorithm != "Binary Search") {
        board.current_algorithm = "Binary Search";
        // Add pop-up animation
        var board_elem = document.getElementsByClassName("board");
        removeClass(board_elem, "board_slide");
        addClass(board_elem, "board_anim");

        // Adding elements for visualization
        var add_elem = document.getElementById('add');
        add_elem.style.display = "block";
        add_elem.classList.add('add_anim');
    }
    // Adding algorithm's description
    document.getElementById('text_description').innerHTML = '<strong>Binary Search,</strong> is a search algorithm that finds the position of a target value within a sorted array.'



    // Initialize board
    vector.init_binary_search();
}

lee.onclick = () => {
    if (alg_running)
        return;

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
    if (alg_running)
        return;

    take_a_break = false;
    apause_button.innerHTML = "Pause";

    if (selected == "Lee Algorithm (BFS)")
        board.lee();
    else if (selected == "Binary Search")
        vector.binary_search();
    else if (selected == "DFS")
        board.dfs();
}

clearbtn.onclick = () => {
    if (alg_running)
        return;

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

pause_button.onclick = () => {
    if (!alg_running)
        return;

    if (apause_button.innerHTML == "Pause") {
        take_a_break = true;
        apause_button.innerHTML = "Resume";
    }
    else {
        take_a_break = false;
        apause_button.innerHTML = "Pause";
    }

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
    if (algorithms[0] != alg_name) {
        var add_elem = document.getElementById('add');
        add_elem.style.display = "none";
        add_elem.classList.remove('add_anim');
    }
    if (algorithms[1] != alg_name) { }
    if (algorithms[2] != alg_name) { }
    if (algorithms[3] != alg_name) { }
    if (algorithms[4] != alg_name) { }
    if (algorithms[5] != alg_name) { }
    if (algorithms[6] != alg_name) { }
    if (algorithms[7] != alg_name) { }
    if (algorithms[8] != alg_name) {
        document.getElementById('clear_board').style.display = 'none';
    }
}

