// Define the states and their positions

const r = 50;

const state1 = { id: 'state1', label: 'ε', x: 50 + r, y: 50 + r }
const state3 = { id: 'state3', label: '1', x: 200 + r, y: 50 + r, lineStyle: "double" }
const states = [state1, state3];

// Function to initialize the FSM
function initFSM() {
    const container = document.getElementById('fsa');
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '350');
    svg.setAttribute('height', '200');

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
        text.setAttribute('y', state.y + r / 4);

        // Create a tspan element which can be styled somewhat like HTML spans
        const tspan = document.createElementNS(svg.namespaceURI, "tspan");
        tspan.textContent = state.label;

        // Append the tspan to the text element
        text.appendChild(tspan);

        text.setAttribute('text-anchor', 'middle');

        svg.appendChild(circle);
        svg.appendChild(text);

        if (state.lineStyle === 'double') {
            // Create and append the inner circle
            const innerCircle = document.createElementNS(svg.namespaceURI, "circle");
            innerCircle.setAttribute('cx', state.x);
            innerCircle.setAttribute('cy', state.y);
            innerCircle.setAttribute('r', r - 4); // Smaller radius for the inner border
            innerCircle.setAttribute('fill', 'none'); // No fill to keep the outer circle's color
            innerCircle.setAttribute('stroke', 'black');
            svg.appendChild(innerCircle);
        }
    });

    // Create connections
    const createLine = (point1, point2, label = "", position = "up") => {
        const line = document.createElementNS(svg.namespaceURI, "line");
        line.setAttribute('x1', point1.x);
        line.setAttribute('y1', point1.y);
        line.setAttribute('x2', point2.x);
        line.setAttribute('y2', point2.y);
        line.setAttribute('stroke', 'black');
        line.setAttribute('marker-end', 'url(#arrowhead)');
        line.setAttribute('text-anchor', 'hehe');
        svg.appendChild(line);

        // Calculate midpoint for the text label
        const midX = (point1.x + point2.x) / 2;
        const midY = (point1.y + point2.y) / 2;

        // Create the text element
        const text = document.createElementNS(svg.namespaceURI, "text");
        text.setAttribute('x', midX);
        text.setAttribute('y', midY);
        if (position === "up")
            text.setAttribute('dy', '-10'); // Shift text up a little so it doesn't overlap the line directly
        else if (position === "down")
            text.setAttribute('dy', '30'); // Shift text up a little so it doesn't overlap the line directly

        text.setAttribute('text-anchor', 'middle'); // Center the text at its position
        text.innerHTML = label;
        svg.appendChild(text);
    };

    createLine({ x: state1.x - 2 * r, y: state1.y }, { x: state1.x - r, y: state1.y });
    createLine(right_up(state1, r), left_up(state3, r), "1", "up");
    createLine(left_down(state3, r), right_down(state1, r), "÷", "down");

    container.appendChild(svg);
}

const angle = Math.PI / 6; // 45 degrees
const dx = r * Math.cos(angle)
const dy = r * Math.sin(angle)

function right_down(state, r) {
    // console.log('right_down',
    //     state.x + r * Math.cos(angle),
    //     state.y + r * Math.sin(angle), r)

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