// document.addEventListener("DOMContentLoaded", function () {
//     function createLoopingEffect(containerId, initialExpression, updateFunction, maxDepth) {
//         var baseExpression = initialExpression;
//         var container = document.getElementById(containerId);
//         var depth = 1;

//         function updateExpression() {
//             if (depth > maxDepth) {
//                 depth = 1;
//                 baseExpression = initialExpression;
//             } else {
//                 baseExpression = updateFunction(baseExpression);
//                 depth++;
//             }

//             container.textContent = baseExpression;
//             setTimeout(updateExpression, 1000); // Update every second
//         }

//         setTimeout(updateExpression, 1000);
//     }

//     // Example updates for different types of expressions
//     createLoopingEffect('nesting_arith', '(1÷1÷1)', (expr) => `(1÷${expr}÷1)`, 4);
//     createLoopingEffect('nesting_lisp', '(x . (y z))', (expr) => `(x . ${expr})`, 4);
//     createLoopingEffect('nesting_json', '{"a": [true]}', (expr) => `{"a": ${expr}}`, 4);
//     createLoopingEffect('nesting_while', 'if x then z else w', (expr) => `if x then ${expr} else w`, 2);
//     createLoopingEffect('nesting_xml', '<p>hello</p>', (expr) => `<p>${expr}</p>`, 2);
// });

document.addEventListener("DOMContentLoaded", function () {
    function createLoopingEffect(containerId, initialExpression, updateFunction, maxDepth) {
        var baseExpression = initialExpression;
        var container = document.getElementById(containerId);
        var depth = 1;

        function updateExpression() {
            if (depth > maxDepth) {
                depth = 1;
                baseExpression = initialExpression;
            } else {
                baseExpression = updateFunction(baseExpression);
                depth++;
            }

            container.innerHTML = baseExpression; // Use innerHTML to parse HTML tags
            setTimeout(updateExpression, 1000); // Update every second
        }

        setTimeout(updateExpression, 1000);
    }

    // Update function for HTML-rich expressions
    createLoopingEffect(
        'reg_nesting_arith',
        '<r-p>1÷</r-p> 1',
        (expr) => `<r-p>1÷</r-p> ${expr}`,
        4
    );

    // Update function for HTML-rich expressions
    createLoopingEffect(
        'nesting_arith',
        '<n-p>(1÷</n-p> 1 <n-p>÷1)</n-p>',
        (expr) => `<n-p>(1÷</n-p> ${expr} <n-p>÷1)</n-p>`,
        4
    );

    // Lisp with HTML tags
    createLoopingEffect(
        'nesting_lisp',
        '<n-p>(x .</n-p> (y z)<n-p>)</n-p>',
        (expr) => `<n-p>(x .</n-p> ${expr} <n-p>)</n-p>`,
        4
    );

    // JSON with HTML tags
    createLoopingEffect(
        'nesting_json',
        '<n-p>{"a":</n-p> [true]<n-p>}</n-p>',
        (expr) => `<n-p>{"a":</n-p> ${expr} <n-p>}</n-p>`,
        4
    );

    // While-style conditional with HTML tags
    createLoopingEffect(
        'nesting_while',
        '<n-p>if x then</n-p> z <n-p>else w</n-p>',
        (expr) => `<n-p>if x then</n-p> ${expr} <n-p>else w</n-p>`,
        2
    );

    // XML with HTML tags
    createLoopingEffect(
        'nesting_xml',
        '<n-p>&lt;p&gt;</n-p> hello <n-p>&lt;/p&gt;</n-p>',
        (expr) => `<n-p>&lt;p&gt;</n-p> ${expr} <n-p>&lt;/p&gt;</n-p>`,
        2
    );
});
