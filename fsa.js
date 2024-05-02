// Define the states and their positions

const r = 50;

const state1 = { id: 'state1', label: 'ε', x: 50 + r, y: 50 + r }
const state3 = { id: 'state3', label: '1', x: 50 + r, y: 200 + r }
const state2 = {
    id: 'state2', label: '1÷',
    x: state1.x + 1.732 * (state3.y - state1.y) / 2,
    y: (state1.y + state3.y) / 2
}
const states = [state1, state2, state3];

// Function to initialize the FSM
function initFSM() {
    const container = document.getElementById('fsa');
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '500');
    svg.setAttribute('height', '500');

    // Add arrowhead definition
    const defs = document.createElementNS(svg.namespaceURI, "defs");
    const marker = document.createElementNS(svg.namespaceURI, "marker");
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '10');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    const polygon = document.createElementNS(svg.namespaceURI, "polygon");
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', 'black');
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Create states
    states.forEach(state => {
        const circle = document.createElementNS(svg.namespaceURI, "circle");
        circle.setAttribute('cx', state.x);  // Center the circle
        circle.setAttribute('cy', state.y);  // Center the circle
        circle.setAttribute('r', r);
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', 'black');

        circle.classList.add('state')

        const text = document.createElementNS(svg.namespaceURI, "text");
        text.setAttribute('x', state.x);
        text.setAttribute('y', state.y);
        text.textContent = state.label;
        text.setAttribute('text-anchor', 'middle');

        svg.appendChild(circle);
        svg.appendChild(text);
    });

    // Create connections
    const createLine = (point1, point2) => {
        const line = document.createElementNS(svg.namespaceURI, "line");
        console.log(point1)
        console.log(point2)
        line.setAttribute('x1', point1.x);
        line.setAttribute('y1', point1.y);
        line.setAttribute('x2', point2.x);
        line.setAttribute('y2', point2.y);
        line.setAttribute('stroke', 'black');
        line.setAttribute('marker-end', 'url(#arrowhead)');
        line.setAttribute('text-anchor', 'hehe');
        svg.appendChild(line);
    };

    createLine(right_down(state1, r), left_up(state2, r));    // State 1 to State 2
    createLine(down(state1, r), up(state3, r));  // State 2 to State 3
    createLine(right_up(state3, r), left_down(state2, r));  // State 2 to State 3

    container.appendChild(svg);
}

const angle = Math.PI / 6; // 45 degrees
const dx = r * Math.cos(angle)
const dy = r * Math.sin(angle)

function right_down(state, r) {
    console.log('right_down',
        state.x + r * Math.cos(angle),
        state.y + r * Math.sin(angle), r)

    return {
        x: state.x + dx,
        y: state.y + dy
    };
}

function right_up(state, r) {
    return {
        x: state.x + dx,
        y: state.y - dy
    };
}

function left_up(state, r) {
    return {
        x: state.x - dx,
        y: state.y - dy
    };
}

function left_down(state, r) {
    return {
        x: state.x - dx,
        y: state.y + dy
    };
}

function up(state, r) {
    return {
        x: state.x,
        y: state.y - r
    };
}

function down(state, r) {
    return {
        x: state.x,
        y: state.y + r
    };
}

window.onload = initFSM;