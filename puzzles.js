let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

function checkPuzzle() {
    let tableSegments = Array.from(document.querySelectorAll(".tableSegment"));
    for (let i = 0; i < 16; i++) {
        puzzle = tableSegments[i].firstChild;
        if (puzzle == null || puzzle.id != i) return false;
    }
    return true;
}

function dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

function dropHandler(ev) {
    ev.preventDefault();
    const target = ev.target.className == "tableSegment" ? ev.target : ev.target.parentNode;

    const data = ev.dataTransfer.getData("text");
    const item = document.getElementById(data);
    if (target.children.length > 0) {
        const exItem = target.children[0];
        item.parentNode.replaceChild(exItem, item);
        target.appendChild(item);
    } else {
        target.appendChild(item);
    }
    if (checkPuzzle()) {
        console.log("You've completed the puzzle!");
        new Notification('Congratulation!', {
            body: 'You have completed the puzzle!',
        });
    } else {
        console.log("You haven't completed the puzzle yet.");
    }
}

function dragstartHandler(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

table = document.getElementById("table");
for (let i = 0; i < 16; i++) {
    tableSegment = document.createElement("div");
    tableSegment.setAttribute("class", "tableSegment");
    tableSegment.setAttribute("data-index", i);
    tableSegment.addEventListener("dragover", dragoverHandler);
    tableSegment.addEventListener("drop", dropHandler);
    table.appendChild(tableSegment);
}

document.getElementById("saveButton").addEventListener("click", function() {
    Notification.requestPermission()

    Array.from(document.querySelectorAll('.puzzle')).forEach(element => {
        element.remove();
    });

    puzzleBox = document.getElementById("puzzleBox");
    for (let i = 0; i < 16; ++i) {
        puzzle = document.createElement("canvas");
        puzzle.setAttribute("class", "puzzle");
        puzzle.setAttribute("draggable", "true");
        puzzle.setAttribute("width", "200");
        puzzle.setAttribute("height", "100");
        puzzle.addEventListener("dragstart", dragstartHandler);
        puzzleBox.appendChild(puzzle);
    }
    leafletImage(map, function(err, canvas) {
        let puzzles = Array.from(document.querySelectorAll(".puzzle"))
        for (let i = 0; i < 16; i++) {
            // get random puzzle
            let randomPuzzleIndex = Math.floor(Math.random() * puzzles.length);
            let randomPuzzle = puzzles[randomPuzzleIndex];
            puzzles.splice(randomPuzzleIndex, 1);
            randomPuzzle.setAttribute("id", i);
            let puzzleContext = randomPuzzle.getContext("2d");
            puzzleContext.drawImage(
                canvas,
                200 * (i % 4),
                100 * Math.floor(i / 4),
                200, 100,
                0, 0,
                200, 100
            );
        }
    });
});

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});