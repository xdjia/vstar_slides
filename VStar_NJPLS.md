---
marp: true
theme: academic
math: mathjax
---

<style>
    section::after {
        font-size: x-large;
            opacity: 30%;
    }
</style>

<!-- _class: lead -->
<!-- paginate: skip -->

# V-Star: Learning Visibly Pushdown Grammars from Program Inputs
<br>

**Xiaodong Jia*** and **Gang Tan**  
Penn State University  
Accepted by PLDI 2024
Presented at NJPLS **2024**

---

<!-- _header: Overview -->
<!-- paginate: true -->

- Background
- Key Contributions of V-Star
- Further Information
- Evaluation
- Future Work

---

<!-- _header: Background -->

<!-- Divide the slide into two columns -->
<div style="display:flex">

<!-- Left column for text -->
<div class="column" style="width:70%;">

### Program Input Learning

Infer grammars of input from **black-box programs** and **sample inputs**, such as:
  * Valid formulas of a calculator
  * JSON/XML from JSON/XML parser binaries
  * HTTP requests from a web server

<div>

* **Oracle**: The black-box program
* **Seed Strings**: The sample inputs
  
</div>

</div>

<!-- Right column for the image -->
<div class="column" style="width:30%;">

<video controls autoplay width="300" height="400">
  <source src="./figures/calculator.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

</div>

</div>

---

<!-- _header: Background -->

<!-- Divide the slide into two columns -->
<div style="display:flex">

<!-- Left column for text -->
<div class="column" style="width:70%;">

#### Importance

- Widely applicable
- Improves security and robustness

#### Application

- Grammar-based fuzzing
- Program validation
- Program comprehension
- Reverse engineering

</div>

<!-- Right column for the image -->
<div class="column" style="width:30%;">

<video controls autoplay width="300" height="400">
  <source src="./figures/calculator.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

</div>

</div>

---

<!-- _header: Background -->

<div style="display:flex">

<!-- Left column for related work -->
<div class="column" style="width:50%;">

### Related Work
* **Existing Tools**
  - Glade (PLDI '17)
  - Arvada (ASE '22)
  - Learn context-free grammars
* **Limitations:**
  - Limited accuracy for many practical grammars
  - Do not fully utilize the *nesting structures* in program inputs

</div>

<!-- Right column for V-Star -->
<div data-marpit-fragment="1" class="column" style="width:50%;">

### V-Star (PLDI '24)
- **Observation**: Using nesting structures can significantly increase model accuracy.
* **Approach**: Exploits *nesting structures* in program inputs to improve accuracy.

</div>

</div>

---

<!-- _header: Background -->

### Nesting Structures

```
program input:       <p>        Hello    </p>        World!
tokenization :       OPEN_TAG   TEXT     CLOSE_TAG   TEXT
```

Recursion is delimited by special paired symbols, namely 
*call symbols* and *return symbols*

```
     Recursion               Tail recursion does not count
 ┌───────────────┐ ─ ─ ─ ─ ─ ──┐ 
XML -> OPEN_TAG XML CLOSE_TAG XML | TEXT | ε
           ↑             ↑              
          Call         Return        
```

---

<!-- _header: Background -->

### Nesting Structures

```
     Recursion               Tail recursion does not count
 ┌───────────────┐ ─ ─ ─ ─ ─ ──┐ 
XML -> OPEN_TAG XML CLOSE_TAG XML | TEXT | ε
           ↑             ↑              
          Call         Return        
```

Visibly Pushdown Grammars (VPGs) = 
<center> Regular Grammars + Nesting Structures </center>

$$
\begin{aligned}
L & \to \epsilon\\
L & \to c A
 & \quad \text{Regular Grammar}\\
L & \to a A b B & \quad \text{Models Nesting Structures}
\end{aligned}
$$

---

<!-- _header: Background -->

#### From Program Input Learning to Active Learning

* **Oracle**: Answers *membership queries*
  $$\mathcal{O}: \text{string } s \mapsto \{\text{true}, \text{false}\}$$
* **Challenges**: With finite queries, exact learning is not guaranteed.
* **Minimally Adequate Teacher (MAT)**: Answers *equivalence queries*
  $$\mathcal{E}: \text{grammar } G \mapsto \{\text{exact 🎉 }, \text{counterexample string } s\}$$
* **Active Learning**: learn grammar from a MAT.

---

<!-- _header: Background -->


<center style="font-size:x-large">

## Exact Learning: Achievable?
|                    |              Regular              |    VPG     |       CFG        |
| ------------------ | :-------------------------------: | :--------: | :--------------: |
| Positive Examples  |            Impossible             |            |                  |
| Positive + Negative  |            NP-complete            |            |                  |
| Membership Queries |          Very Likely NP           |            |                  |
| **MQ + Seed Strings**  |    Very Likely NP                               |  (V-Star)  | (Glade & Arvada) |
| **MAT (MQ + EQ)**               | Polynomial <br> (Angluin's $L^*$) | Polynomial |  Very Likely NP  |

</center>

##### V-Star's Contribution

- Learns how to model program inputs as VPGs.
- Learns VPGs using active learning methods.

---

<!-- _header: Key Contributions of V-Star -->

- Infer lexical rules of call/return tokens based on *nesting patterns*.
  - **Nesting Patterns**: Given a valid string $s=uxvyz$, where $u,x,v,y,z$ are substrings of $s$. Tuple $(u,x,v,y,z)$ (denoted as $(x,y)$ when $s$ is clear) is called a nesting pattern, iff
    1. For each number $k>0$, string $ux^kvy^kz$ is also valid.
    2. For numbers $k\neq j$ (both $\geq 0$), string $ux^kvy^jz$ is invalid.
  - Examples
    - ✔ `<p>Hello</p>World!` $\Longrightarrow$ $($`<p>`$)^k$`Hello`$($`</p>`$)^k$`World!`
    - ✔ `{"a":1}` $\Longrightarrow$ $($`{"a":`$)^k$`1`$($`}`$)^k$
    - ✘ `{"a":"b"}` $\Longrightarrow$ `{"`$($`a`$)^k$ `":"`$($`b`$)^j$`"}`

---

<!-- _header: V-Star: Methodology -->

- Infer lexical rules of call/return tokens based on nesting patterns.
  1. Seed string: `<p id="a">Hello</p>World!` 
  2. Enumerate nesting patterns: (`<p id="a">`, `</p>`) 
  3. Infer rules of call/return tokens: (`<p`$($`id="`$[$`a-z`$]^+$`"`$)^*$`>`, `</p>`) 
  4. Partially tokenize all seed strings: 
      `<p id="a">`, `H`,`e`,`l`,`l`,`o`, `</p>`, `W`,`o`,`r`,`l`,`d`,`!`
  5. If the tokenization is *in-compatible* (e.g., not well-matched): 
      Backtrack and enumerate other candidate call/return tokens.
  6. If the tokenization is compatible: proceed and learn a VPA.
- Now, the learned partial tokenizer converts the character-based sentences into token-based sentences, which form a VPL.

---

<!-- _header: V-Star: Methodology -->

- Simulate the MAT.
  - Membership queries are just running programs on given strings.
  - Equivalence queries are seldom available in practice. 
    - We simulate equivalence queries by sampling *test strings* based on seed strings.
    - In particular, we construct a set of strings by combining prefixes, infixes, and suffixes of the seed strings; for each such string $s$, if the token list of $s$ is well-matched, we add it to a set of test strings.
    - Each test string $s$ is then treated as a "counterexample" returned by equivalence queries; we compare the results of parsing the test string using the learned grammar and the membership queries; discrepency in results means $s$ is a true counterexample.

---

<!-- _header: V-Star: Methodology -->

- Learning the VPA based on the tokens.
  - Each symbol of the VPA is either a character, meaning a plain symbol, or a call or return token.
      `<p id="a">`, `H`,`e`,`l`,`l`,`o`, `</p>`, `W`,`o`,`r`,`l`,`d`,`!`
  - Details on the VPA learning algorithm can be found in the paper.
- Convert the VPA into a VPG.
  - While standard conversion algorithm exists, the resulted VPG is not quite readable, because
    - The forms of VPG rules are rigid.
    - The grammar consists of lexical rules.
    - The automatically named nonterminals lack semantic meaning.
  - Future work: Improve the readablility.

---

<!-- _header: Evaluation Overview -->

- **Evaluation Methodology**
  - Replicated the artifact of Arvada (ASE '22).
  - Includes oracle grammars, evaluation datasets, and seed strings.

- **Selected Grammars**
  - Five Grammars: JSON, LISP, XML, While, MathExpr
  - Chosen for their distinct characteristics as Visibly Pushdown Grammars (VPGs).

> Further exploration of additional program inputs is reserved for future research.

---

<!-- paginate: false -->
<!-- _header: Evaluation: Accuracy -->

<table class="metrics-table" id="metricsTable" style="font-size:x-large">
  <thead>
    <tr>
      <th>Metric</th>
      <th>Definition</th>
      <th>Explanation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Recall</strong></td>
      <td><math display="block" class="tml-display" style="display:block math;">
  <mfrac>
    <mrow>
      <mi>|</mi>
      <msub>
        <mi>L</mi>
        <mi class="mathcal">𝒪</mi>
      </msub>
      <mo>∩</mo>
      <msub>
        <mi>L</mi>
        <mi>G</mi>
      </msub>
      <mi>|</mi>
    </mrow>
    <mrow>
      <mi>|</mi>
      <msub>
        <mi>L</mi>
        <mi class="mathcal">𝒪</mi>
      </msub>
      <mi>|</mi>
    </mrow>
  </mfrac>
</math></td>
      <td>Probability that a string of the oracle is in the learned grammar <math><mi>G</mi></math>.</td>
    </tr>
    <tr>
      <td><strong>Precision</strong></td>
      <td><math display="block" class="tml-display" style="display:block math;">
  <mfrac>
    <mrow>
      <mi>|</mi>
      <msub>
        <mi>L</mi>
        <mi class="mathcal">𝒪</mi>
      </msub>
      <mo>∩</mo>
      <msub>
        <mi>L</mi>
        <mi>G</mi>
      </msub>
      <mi>|</mi>
    </mrow>
    <mrow>
      <mi>|</mi>
      <msub>
        <mi>L</mi>
        <mi>G</mi>
      </msub>
      <mi>|</mi>
    </mrow>
  </mfrac>
</math></td>
      <td>Probability that a string in <math><mi>G</mi></math> is accepted by the oracle.</td>
    </tr>
    <tr>
      <td><strong>F-1 Score</strong></td>
      <td><math display="block" class="tml-display" style="display:block math;">
  <mfrac>
    <mn>2</mn>
    <mrow>
      <mfrac>
        <mn>1</mn>
        <mi>R</mi>
      </mfrac>
      <mo>+</mo>
      <mfrac>
        <mn>1</mn>
        <mi>P</mi>
      </mfrac>
    </mrow>
  </mfrac>
</math></td>
      <td>Harmonic mean of precision and recall, indicating overall accuracy.</td>
    </tr>
  </tbody>
</table>

<table class="performance-table" id="performanceTable" style="font-size:x-large">
  <!-- <caption>Accuracy Comparison</caption> -->
  <thead>
    <tr>
      <th rowspan="2">Grammar</th>
      <th colspan="3">GLADE</th>
      <th colspan="3">Arvada</th>
      <th colspan="3">V-Star</th>
    </tr>
    <tr>
      <th>Recall</th>
      <th>Prec</th>
      <th>F-1</th>
      <th>Recall</th>
      <th>Prec</th>
      <th>F-1</th>
      <th>Recall</th>
      <th>Prec</th>
      <th>F-1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>JSON</td>
      <td>0.42</td>
      <td>0.98</td>
      <td>0.59</td>
      <td>0.97 ± 0.09</td>
      <td>0.92 ± 0.08</td>
      <td>0.94 ± 0.05</td>
      <td>1.00</td>
      <td>1.00</td>
      <td>1.00</td>
    </tr>
    <tr>
      <td>Lisp</td>
      <td>0.23</td>
      <td>1.00</td>
      <td>0.38</td>
      <td>0.38 ± 0.26</td>
      <td>0.95 ± 0.08</td>
      <td>0.50 ± 0.18</td>
      <td>1.00</td>
      <td>1.00</td>
      <td>1.00</td>
    </tr>
    <tr>
      <td>XML</td>
      <td>0.26</td>
      <td>1.00</td>
      <td>0.42</td>
      <td>0.99 ± 0.02</td>
      <td>1.00 ± 0.00</td>
      <td>1.00 ± 0.01</td>
      <td>1.00</td>
      <td>1.00</td>
      <td>1.00</td>
    </tr>
    <tr>
      <td>While</td>
      <td>0.01</td>
      <td>1.00</td>
      <td>0.02</td>
      <td>0.91 ± 0.20</td>
      <td>1.00 ± 0.00</td>
      <td>0.94 ± 0.14</td>
      <td>1.00</td>
      <td>1.00</td>
      <td>1.00</td>
    </tr>
    <tr>
      <td>MathExpr</td>
      <td>0.18</td>
      <td>0.98</td>
      <td>0.31</td>
      <td>0.72 ± 0.24</td>
      <td>0.96 ± 0.03</td>
      <td>0.80 ± 0.16</td>
      <td>1.00</td>
      <td>1.00</td>
      <td>1.00</td>
    </tr>
  </tbody>
</table>

---

<!-- _header: Evaluation: Efficiency -->

<table class="metrics-table" id="metricsTable" style="font-size:x-large">
  <thead>
    <tr>
      <th>Metric</th>
      <th>Explanation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>#Queries</strong></td>
      <td>The number of unique membership queries made during the learning process. <br> When the same string is queried for multiple times, we use the cached results.</td>
    </tr>
    <tr> <td><strong>Time</strong></td> <td>The overall running time for each tool.</td> </tr> 
    <tr> <td><strong>#Seeds</strong></td> <td>The number of seed strings (i.e., valid strings) shared by all tools.</td> </tr> 
  </tbody>
</table>

<table class="evaluation-table" id="evaluationTable" style="font-size:x-large">
  <!-- <caption>Efficiency Comparison</caption> -->
  <thead>
    <tr>
      <th rowspan="2">Grammar</th>
      <th rowspan="1"></th>
      <th colspan="2">GLADE</th>
      <th colspan="2">Arvada</th>
      <th colspan="2">V-Star</th>
    </tr>
    <tr>
      <th class="right-aligned">#Seeds</th>
      <th class="right-aligned">#Queries</th>
      <th class="right-aligned">Time</th>
      <th class="right-aligned">#Queries</th>
      <th class="right-aligned">Time</th>
      <th class="right-aligned">#Queries</th>
      <th class="right-aligned">Time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>JSON</td>
      <td class="right-aligned">71</td>
      <td class="right-aligned">11 K</td>
      <td class="right-aligned">21 s</td>
      <td class="right-aligned">6.8 K ± 394</td>
      <td class="right-aligned">25 s ± 2 s</td>
      <td class="right-aligned">541 K</td>
      <td class="right-aligned">33 min</td>
    </tr>
    <tr>
      <td>Lisp</td>
      <td class="right-aligned">26</td>
      <td class="right-aligned">3.8 K</td>
      <td class="right-aligned">7 s</td>
      <td class="right-aligned">2.2 K ± 307</td>
      <td class="right-aligned">8 s ± 2 s</td>
      <td class="right-aligned">16 K</td>
      <td class="right-aligned">77 s</td>
    </tr>
    <tr>
      <td>XML</td>
      <td class="right-aligned">62</td>
      <td class="right-aligned">15 K</td>
      <td class="right-aligned">21 s</td>
      <td class="right-aligned">12 K ±  1 K </td>
      <td class="right-aligned">61 s ± 5 s</td>
      <td class="right-aligned">208 K</td>
      <td class="right-aligned">16 min</td>
    </tr>
    <tr>
      <td>While</td>
      <td class="right-aligned">10</td>
      <td class="right-aligned">9.2 K</td>
      <td class="right-aligned">13 s</td>
      <td class="right-aligned">5.4 K ± 563</td>
      <td class="right-aligned">15 s ± 1 s</td>
      <td class="right-aligned">1440 K</td>
      <td class="right-aligned">1.5 h</td>
    </tr>
    <tr>
      <td>MathExpr</td>
      <td class="right-aligned">40</td>
      <td class="right-aligned">19 K</td>
      <td class="right-aligned">42 s</td>
      <td class="right-aligned">6.6 K ± 421</td>
      <td class="right-aligned">24 s ± 2 s</td>
      <td class="right-aligned">4738 K</td>
      <td class="right-aligned">6 h</td>
    </tr>
  </tbody>
</table>

---

<!-- _header: Evaluation: More Statistics of V-Star -->

<table class="metrics-table" id="metricsTable" style="font-size:x-large">
  <thead>
    <tr>
      <th>Metric</th>
      <th>Explanation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>%Queries(Token)</strong></td>
      <td>Percentage of membership queries made for token inference.</td>
    </tr>
    <tr>
      <td><strong>%Queries(VPA)</strong></td>
      <td>Percentage of membership queries made for VPA learning.</td>
    </tr>
    <tr> <td><strong>#TestString</strong></td> <td>The number of test strings sampled from the seed strings by V-Star.</td> </tr> 
  </tbody>
</table>

<table class="performance-table" id="performanceTable" style="font-size:x-large" style="font-size:x-large">
  <thead>
    <tr>
      <th>Grammar</th>
      <th class="right-aligned">#Queries</th>
      <th class="right-aligned">%Q(Token)</th>
      <th class="right-aligned">%Q(VPA)</th>
      <th class="right-aligned">#TestString</th>
      <th class="right-aligned">Time</th>
    </tr>
  </thead>
  <tbody >
    <tr>
      <td>JSON</td>
      <td class="right-aligned">541 K</td>
      <td class="right-aligned">2.71%</td>
      <td class="right-aligned">97.29%</td>
      <td class="right-aligned">8043</td>
      <td class="right-aligned">33 min</td>
    </tr>
    <tr>
      <td>Lisp</td>
      <td class="right-aligned">16 K</td>
      <td class="right-aligned">1.37%</td>
      <td class="right-aligned">98.63%</td>
      <td class="right-aligned">693</td>
      <td class="right-aligned">77 s</td>
    </tr>
    <tr>
      <td>XML</td>
      <td class="right-aligned">208 K</td>
      <td class="right-aligned">94.93%</td>
      <td class="right-aligned">5.07%</td>
      <td class="right-aligned">682</td>
      <td class="right-aligned">16 min</td>
    </tr>
    <tr>
      <td>While</td>
      <td class="right-aligned">1440 K</td>
      <td class="right-aligned">9.40%</td>
      <td class="right-aligned">90.60%</td>
      <td class="right-aligned">119</td>
      <td class="right-aligned">1.5 h</td>
    </tr>
    <tr>
      <td>MathExpr</td>
      <td class="right-aligned">4738 K</td>
      <td class="right-aligned">0.11%</td>
      <td class="right-aligned">99.89%</td>
      <td class="right-aligned">2602</td>
      <td class="right-aligned">6 h</td>
    </tr>
  </tbody>
</table>

Most queries and time are cost by VPA Learning, except for XML.

---

<!-- paginate: true -->

<!-- _header: Conclusion and Future Work -->

- V-Star is quite accurate compared with other tools, but costs much more time. Most time is cost in VPA learning, not token inference, mainly because the seed strings tend to be short, leading to shorter nesting patterns and less search space. 
- Future research directions
  - Improve the performance of V-Star.
  - Evalute on more practical grammars.
  - Explore other VPA learning algorithm (e.g., discrimination trees).
  - Improve the readablility of the learned grammar.
  - Use V-Star as a starting point of CFG learning.

---

<!-- paginate: False -->

<!-- _header: Appendix -->

- What's not a VPG:
  - $L\to cLcL\mid c$: symbol $c$ is call, plain, and return at the same time.
- A VPG derives a *Visibly Pushdown Language* (VPL).
- A VPG is accepted by a *Visibly Pushdown Automaton* (VPA).
- Expressiveness of VPGs:
  <center>
    Regular Grammar < VPGs < CFGs
  </center>
- Still, VPGs can model many useful practical grammars.
