document.querySelectorAll('#calc_body > .row_button > .button').forEach(button => {
    button.addEventListener('click', function () {
        button.classList.add('active');
        setInterval(() => { button.classList.remove('active') }, 300);

        const display = document.getElementById('display_screen');
        const value = this.textContent;
        switch (value) {
            case 'AC':
                display.textContent = '';
                break;
            case '±':
                display.textContent = -parseFloat(display.textContent);
                break;
            case '%':
                display.textContent = parseFloat(display.textContent) / 100;
                break;
            case '=':
                try {
                    display.textContent = eval(display.textContent.replace(/÷/g, '/').replace(/×/g, '*'));
                } catch (error) {
                    display.textContent = 'Error';
                }
                break;
            case '÷':
            case '×':
            case '-':
            case '+':
            case '.':
                if (!['+', '-', '×', '÷', '.'].includes(display.textContent.slice(-1))) {
                    display.textContent += value;
                }
                break;
            default:
                if (display.textContent === '0' || display.textContent === 'Error' || display.textContent === 'Infinity' || display.textContent === 'NaN') {
                    display.textContent = value;
                } else {
                    display.textContent += value;
                }
                break;
        }
    });
});


var isAnimating = 0; // Flag to track if the current animation is ongoing; 10 slots

function expressionToWords(expr) {
    const digitWords = {
        '0': 'zero', '1': 'one', '2': 'two', '3': 'three',
        '4': 'four', '5': 'five', '6': 'six', '7': 'seven',
        '8': 'eight', '9': 'nine'
    };
    const operatorWords = {
        '+': 'add', '-': 'substract', '×': 'multiply', '/': 'divide', '%': 'percent', '.': 'dot', '=': 'equal', 'C': 'AC'
    };

    let words = [];
    for (let i = 0; i < expr.length; i++) {
        let ch = expr[i];
        if (digitWords[ch] !== undefined) {
            words.push(digitWords[ch]);
        } else if (operatorWords[ch] !== undefined) {
            words.push(operatorWords[ch]);
        } else {
            // If the character is not recognized, you could throw an error or handle it
            console.error("Unrecognized character in expression: " + ch);
        }
    }

    return words;
}

function simulate_click() {

    const display = document.getElementById('display_screen');

    let myID = (isAnimating + 1) % 10;  // reset the counter
    isAnimating = myID;

    let exprList = [
        "C1/0=",
        "C1/=",
        "C1/1=",
        "C1/1/1=",
        "C1/1/1/1=",
    ]

    let buttonList = exprList.map((expr => expressionToWords(expr)));

    let result_table = document.querySelector("#result_table > tbody");
    result_table.remove()

    function clickButton(ilist, i) {
        let blist = buttonList[ilist]
        // console.log(ilist, blist, i)

        if (isAnimating !== myID) return;

        if (i < blist.length) {
            let event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            });

            document.getElementById(blist[i]).dispatchEvent(event); // Dispatch the mousedown event

            setTimeout(() => clickButton(ilist, i + 1), 500); // Schedule the next click after 1 second

            // Update Result Table
            if (i < blist.length - 1)
                update_my_table_body("result_table", ilist, 0, display.textContent)
            else
                update_my_table_body("result_table", ilist, 1, display.textContent)

        } else {
            if (ilist + 1 < buttonList.length)
                setTimeout(() => { clickButton(ilist + 1, 0) }, 1000)
        }
    }

    let display_screen = document.getElementById('display_screen');
    display_screen.textContent = '0';
    setTimeout(() => {
        clickButton(0, 0)
    }, 1000)

}

function update_my_table_body(table_id, row, col, value) {
    let table = document.getElementById(table_id); // Get the table element
    // console.log(table)
    let tbody = table.getElementsByTagName("tbody")[0]; // Get the tbody

    // Ensure the tbody exists
    if (!tbody) {
        tbody = document.createElement("tbody");
        table.appendChild(tbody);
    }

    // Check if the specified row exists
    while (tbody.rows.length <= row) {
        let newRow = tbody.insertRow(); // Create new row at the end of the table
        // Initialize new cells for existing columns
        for (let i = 0; i < table.rows[0].cells.length; i++) {
            newRow.insertCell(i).innerHTML = ""; // Create empty cells
        }
    }

    // Check if the specified column exists
    let existingRow = tbody.rows[row];
    while (existingRow.cells.length <= col) {
        existingRow.insertCell(); // Create new cell at the end of the row
    }

    // Update the specified cell
    existingRow.cells[col].innerHTML = value;
}


function init_pre_suf_table() {

    let rows = ["ϵ", "1", "1 ÷ ", "2 ÷ 2", "3 ÷ 3 ÷ 3"]
    let cols = ["", "1", " ÷ 1"]

    for (let i = 0; i < rows.length; i++) {
        update_my_table_body('pre_suf_table', i, 0, '$' + rows[i] + '$')
        update_my_table_body('pre_suf_table2', i, 0, '$' + rows[i] + '$')
    }

    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < cols.length; j++) {
            let expr = rows[i] + cols[j];

            if (rows[i] === 'ϵ')
                if (cols[j] === '') {
                    expr = 'ϵ';
                } else {
                    expr = cols[j];
                }

            let result = expr;

            try {
                eval(expr.replace(/÷/g, '/').replace(/×/g, '*'));
                result = '<valid-in>$' + result + '$</valid-in>'
                result2 = '<valid-in>$' + "+++" + '$</valid-in>'
            } catch (error) {
                result = '<invalid-in>$' + result + '$</invalid-in>'
                result2 = '<invalid-in>$' + "+++" + '$</invalid-in>'
            }

            update_my_table_body('pre_suf_table', i, j + 1, '<span class="fragment">' + result + '<span/>')
            update_my_table_body('pre_suf_table2', i, j + 1, result2)
        }
    }
    let table1 = document.getElementById("pre_suf_table1")
    let table2 = document.getElementById("pre_suf_table2")
    let table3 = document.getElementById("pre_suf_table3")
    let table4 = document.getElementById("pre_suf_table4")

    table3.innerHTML = table2.innerHTML

    for (let k of [3, 5, 6]) {
        table3.rows[k].style.visibility = "hidden";
    }

    table4.innerHTML = table2.innerHTML

    for (let k of [2, 4]) {
        table4.rows[k].style.visibility = "hidden";
    }
}

function init_vtable() {
    let table1 = document.getElementById("vtable");

    let rows = ["ϵ", "(1", "((1", "(((1"]
    let cols = ["ϵ", " ÷ 1)", " ÷ 1) ÷ 1)", " ÷ 1) ÷ 1) ÷ 1)"]

    update_my_table_body('vtable', 0, 0, "$\\epsilon$")
    for (let i of [1, 2, 3]) {
        update_my_table_body('vtable', i, 0, '$' + rows[i] + '$')

        // table1.rows[k].style.visibility = "hidden";
    }

    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < cols.length; j++) {

            let expr = rows[i] + cols[j];

            if (rows[i] === 'ϵ' && cols[j] === 'ϵ')
                expr = 'ϵ';
            else if (cols[j] === 'ϵ')
                expr = rows[i];
            else if (rows[i] === 'ϵ')
                expr = cols[j];

            let result = expr;

            try {
                eval(expr.replace(/÷/g, '/').replace(/×/g, '*'));
                result = '<valid-in>$' + result + '$</valid-in>'
                result2 = '<valid-in>$' + "+++" + '$</valid-in>'
            } catch (error) {
                result = '<invalid-in>$' + result + '$</invalid-in>'
                result2 = '<invalid-in>$' + "+++" + '$</invalid-in>'
            }

            if (rows[i] === 'ϵ')
                if (cols[j] === '') {
                    expr = 'ϵ';
                } else {
                    expr = cols[j];
                }

            update_my_table_body('vtable', i, j + 1, result)
        }
    }
}

function init_vtable2() {
    let table1 = document.getElementById("vtable");

    table_id = 'vtable2'

    let rows = ["", "1", "1 ÷", "(1 ÷ 1)"]
    let cols = [["", ""], ["", " ÷ 1"], ["(", " ÷ 1)"]]

    update_my_table_body(table_id, 0, 0, "$\\epsilon$")
    for (let i of [1, 2, 3]) {
        vrow =  '$' + rows[i] + '$'
        update_my_table_body(table_id, i, 0, vrow)

        // table1.rows[k].style.visibility = "hidden";
    }

    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < cols.length; j++) {

            let expr = cols[j][0] + rows[i] + cols[j][1];

            let result = expr;

            if (result === "")
                result = "ϵ"

            try {
                eval(result.replace(/÷/g, '/').replace(/×/g, '*'));
                result = '<valid-in>$' + result + '$</valid-in>'
                result2 = '<valid-in>$' + "+++" + '$</valid-in>'
            } catch (error) {
                result = '<invalid-in>$' + result + '$</invalid-in>'
                result2 = '<invalid-in>$' + "+++" + '$</invalid-in>'
            }

            if (rows[i] === 'ϵ')
                if (cols[j] === '') {
                    expr = 'ϵ';
                } else {
                    expr = cols[j];
                }

            update_my_table_body(table_id, i, j + 1, result)
        }
    }
}

init_pre_suf_table();
init_vtable();
init_vtable2();