const title = document.getElementById('title');
const binarysearch = document.getElementById('binarysearch');
const merge = document.getElementById('merge');
const ssort = document.getElementById('ssort');
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
const slider = document.getElementById('slider');
const sliderinput = document.getElementById('sliderinput');
const new_array = document.getElementById('new_array');

var algorithms = ["Binary Search", "Merge", "Selection Sort", "Bubble Sort", "Insertion Sort",
    "Merge Sort", "Quick Sort", "Heap Sort", "Lee Algorithm (BFS)"];

var selected = null;

title.onclick = () => {
    window.location.reload(true);
}

binarysearch.onclick = () => {
    if (alg_running)
        return;

    document.getElementById('board').style.removeProperty("display");

    // Disable other elements from other visualizations


    if (selected != "Binary Search") {
        // Add pop-up animation
        var board_elem = document.getElementsByClassName("board");
        removeClass(board_elem, "board_slide");
        addClass(board_elem, "board_anim");

        // Adding elements for visualization
        var add_elem = document.getElementById('inpunnumber');
        add_elem.style.display = "block";
        add_elem.classList.add('add_anim');
    }

    selected = 'Binary Search';
    Disable_other(selected);

    // Adding algorithm's description
    document.getElementById('text_description').innerHTML = '<strong>Binary Search,</strong> is a search algorithm that finds the position of a target value within a sorted array.'

    // Initialize board
    vector.init_binary_search();
}

lee.onclick = () => {
    if (alg_running)
        return;

    document.getElementById('board').style.removeProperty("display");

    document.getElementById('text_description').innerHTML = "The Lee algorithm is one possible solution for maze routing problems based on Breadth-first search.";

    // Remove pop-up trnsition and add Slide-in transition
    if (selected != "Lee Algorithm (BFS)") {
        var board_elem = document.getElementsByClassName("board");
        removeClass(board_elem, "board_anim");
        addClass(board_elem, "board_slide");
    }

    selected = "Lee Algorithm (BFS)";
    Disable_other(selected);

    document.getElementById("board").style.marginTop = "0px";

    board.init_path_finding();
    document.getElementById('clear_board').style.display = 'inline-block';
}

ssort.onclick = () => {
    if (alg_running)
        return;

    document.getElementById('board').style.display = "none";

    selected = 'Selection Sort';
    // Disable other elements from other visualizations
    Disable_other(selected);

    // Adding algorithm's description
    document.getElementById('text_description').innerHTML
        = '<strong>The Selection Sort Algorithm</strong> sorts an array by repeatedly finding the minimum element from unsorted part and putting it at the beginning.'

    // add slider for number of elements

    document.getElementById('sliderinput').style.display = "block";
    document.getElementById('new_array').style.display = "inline";

    // Initialize board
    sort_vector.init_sort_vector();
}

bsort.onclick = () => {
    if (alg_running)
        return;

    document.getElementById('board').style.display = "none";

    selected = 'Bubble Sort';
    // Disable other elements from other visualizations
    Disable_other(selected);

    // Adding algorithm's description
    document.getElementById('text_description').innerHTML
        = '<strong>Bubble Sort</strong> is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in wrong order.'

    // add slider for number of elements

    document.getElementById('sliderinput').style.display = "block";
    document.getElementById('new_array').style.display = "inline";

    // Initialize board
    sort_vector.init_sort_vector();
}

isort.onclick = () => {
    if (alg_running)
        return;

    document.getElementById('board').style.display = "none";

    selected = 'Insertion Sort';
    // Disable other elements from other visualizations
    Disable_other(selected);

    // Adding algorithm's description
    document.getElementById('text_description').innerHTML
        = '<strong>Insertion sort</strong> is a simple sorting algorithm that builds the final sorted array (or list) one item at a time.'

    // add slider for number of elements

    document.getElementById('sliderinput').style.display = "block";
    document.getElementById('new_array').style.display = "inline";

    // Initialize board
    sort_vector.init_sort_vector();
}

qsort.onclick = () => {
    if (alg_running)
        return;

    document.getElementById('board').style.display = "none";

    selected = 'Quick Sort';
    // Disable other elements from other visualizations
    Disable_other(selected);

    // Adding algorithm's description
    document.getElementById('text_description').innerHTML
        = '<strong>Quick sort</strong> is a simple sorting algorithm that builds the final sorted array (or list) one item at a time.'

    // add slider for number of elements

    document.getElementById('sliderinput').style.display = "block";
    document.getElementById('new_array').style.display = "inline";

    // Initialize board
    sort_vector.init_sort_vector();
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
    else if (selected == "Selection Sort")
        sort_vector.selection_sort();
    else if (selected == "Insertion Sort")
        sort_vector.insertion_sort();
    else if (selected == "Bubble Sort")
        sort_vector.bubble_sort();
    else if (selected == "Quick Sort") {
        sort_vector.quick_sort();
    }

}

new_array.onclick = () => {
    if (alg_running)
        return;
    sort_vector.resize_vector(sort_vector.size);
}

slider.oninput = () => {
    if (alg_running)
        return;

    sort_vector.resize_vector(slider.value);
}

clearbtn.onclick = () => {
    if (alg_running)
        return;

    board.ClearBoard();
}

slow_btn.onclick = () => {
    speed_board = 100;
    speed_vector = 4000;
    speed_sort = 500;
}

medium_btn.onclick = () => {
    speed_board = 50;
    speed_vector = 2500;
    speed_sort = 200;
}

fast_btn.onclick = () => {
    speed_board = 0;
    speed_vector = 800;
    speed_sort = 50;
}

pause_button.onclick = () => {
    console.log(alg_running);
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
        var add_elem = document.getElementById('inpunnumber');
        add_elem.style.display = "none";
        add_elem.classList.remove('add_anim');
    }
    if (algorithms[1] != alg_name) { }
    if (algorithms[2] != alg_name) {
        document.getElementById("sarray").style.display = 'none';
        document.getElementById('sliderinput').style.display = 'none';
        document.getElementById('new_array').style.display = "none";
        ssort.classList.remove('fall');
        sliderinput.classList.remove('fall');
    }
    if (algorithms[3] != alg_name) {
        document.getElementById("sarray").style.display = 'none';
        document.getElementById('sliderinput').style.display = 'none';
        document.getElementById('new_array').style.display = "none";
        bsort.classList.remove('fall');
        sliderinput.classList.remove('fall');
    }
    if (algorithms[4] != alg_name) {
        document.getElementById("sarray").style.display = 'none';
        document.getElementById('sliderinput').style.display = 'none';
        document.getElementById('new_array').style.display = "none";
        isort.classList.remove('fall');
        sliderinput.classList.remove('fall');
    }
    if (algorithms[5] != alg_name) { }
    if (algorithms[6] != alg_name) {
        document.getElementById("sarray").style.display = 'none';
        document.getElementById('sliderinput').style.display = 'none';
        document.getElementById('new_array').style.display = "none";
        isort.classList.remove('fall');
        sliderinput.classList.remove('fall');
    }
    if (algorithms[7] != alg_name) { }
    if (algorithms[8] != alg_name) {
        document.getElementById('clear_board').style.display = 'none';
    }
}

