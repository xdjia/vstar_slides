document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', function () {
        button.classList.add('active');
        setInterval(() => { button.classList.remove('active') }, 300);

        const display = document.getElementById('display_screen');
        const value = this.textContent;
        switch (value) {
            case 'AC':
                display.textContent = '0';
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
        '+': 'add', '-': 'substract', '×': 'multiply', '÷': 'divide', '%': 'percent', '.': 'dot', '=': 'equal', 'C': 'AC'
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

    let myID = (isAnimating + 1) % 10;  // reset the counter
    isAnimating = myID;

    let exprList = [
        "1+=",
        "C1+1=",
        "C1+1+1=",
        "C1+1+1+1=",
        "C1+1+1+1+1=",
    ]
    
    let buttonList = exprList.map((expr => expressionToWords(expr)));

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
