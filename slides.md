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

**Xiaodong Jia** and **Gang Tan**  
Penn State University
PLDI 2024

---

<!-- _header: Overview -->
<!-- paginate: true -->

- Background
- Key Contributions of V-Star
- Running Example
- Evaluation
- Future Work

---

<!-- _header: Background -->

<!-- Divide the slide into two columns -->
<div style="display:flex">

<!-- Left column for text -->
<div class="column" style="width:70%;">

### Program Input Learning

Learn formal grammars of inputs from 
**black-box programs** and **sample valid inputs**.
* **Oracle**: The black-box program
  * A calculator
  * JSON/XML parser binaries
  * Web server that accepts HTTP requests
* **Seed Strings**: Given valid inputs

<div>
  
</div>

</div>

<!-- Right column for the image -->
<div class="column" style="width:30%;">


<!-- For PDF export -->
<!-- ![w:350](./figures/calculator.png) -->

<!-- For HTML export -->
<video controls autoplay width="300" height="400" poster="./figures/fallback-image.png">
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
<!-- <div class="column" style="width:30%;">

<video controls autoplay width="300" height="400">
  <source src="./figures/calculator.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

</div> -->

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
* **Limitations**
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
Program input :  <p>        Hello    </p>        World!
Tokenization  :  OPEN_TAG   TEXT     CLOSE_TAG   TEXT
```

<div data-marpit-fragment="1">

Recursion is delimited by special paired symbols, namely 
*call symbols* and *return symbols*.

</div>

<div data-marpit-fragment="2">

```
     Recursion     
 ┌───────────────┐ 
XML -> OPEN_TAG XML CLOSE_TAG XML | TEXT | ε
           ↑             ↑              
          Call         Return        
```

</div>

---

<!-- _header: Background -->

### Nesting Structures

```
Program input :  <p>        Hello    </p>        World!
Tokenization  :  OPEN_TAG   TEXT     CLOSE_TAG   TEXT
```

Recursion is delimited by special paired symbols, namely 
*call symbols* and *return symbols*.

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


### Denote Sentences of VPGs

- Sentences in VPGs are normal strings with explicitly denoted call and return symbols, known as *tagging*.

<center style="font-size: xx-large;">

<code><call-sym>&lt;p&gt;</call-sym>Hello<ret-sym>&lt;/p&gt;</ret-sym>World!</code>

</center>

- **V-Star** learns which substrings need to be colorized, also known as the *tagging function* for program inputs.


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
|                       |              Regular              |    VPG     |       CFG        |
| --------------------- | :-------------------------------: | :--------: | :--------------: |
| Positive Examples     |            Impossible             |            |                  |
| Positive + Negative   |            NP-complete            |            |                  |
| Membership Queries    |          Very Likely NP           |            |                  |
| **MQ + Seed Strings** |          Very Likely NP           |  (V-Star)  | (Glade & Arvada) |
| **MAT (MQ + EQ)**     | Polynomial <br> (Angluin's $L^*$) | Polynomial |  Very Likely NP  |

</center>

##### V-Star's Contribution

- Learns how to model program inputs as VPGs.
- Learns VPGs using active learning methods.

---

<!-- _header: Key Contributions of V-Star -->

### V-Star Workflow

1. **Identify Call and Return Symbols**: 
   - Use oracle and seed strings to infer nesting structures.
   - Develop a *tagging function* to recognize call and return symbols.

2. **Learn VPA and Convert to VPG**:
   - Use an L*-like algorithm to learn a Visibly Pushdown Automaton (VPA).
   - Convert the VPA into a Visibly Pushdown Grammar (VPG).


---

<!-- _header: V-Star Example: Arithmetic Formula -->

#### Seed String:

<center> <code>(1+(2×3)/4)</code> </center>

#### What are the Call and Return Symbols?

* Hypothesize recursion as:
  <center> <code>expr -> "(" expr ")" expr | number | ...</code> </center>
* Therefore, `(` and `)` are the call and return symbols.
  <center>
  <code><call-sym>(</call-sym>1+<call-sym>(</call-sym>2×3<ret-sym>)</ret-sym>/4<ret-sym>)</ret-sym></code>
  </center>

---

<!-- _header: V-Star Example: Arithmetic Formula -->

#### Seed String (Encrypted):
<center><code>◻︎▼●◻︎▼●▼△●▼△</code></center>

#### What are the Call and Return Symbols?

<div data-marpit-fragment="1">

- **Nesting Patterns**: Two substrings $(x, y)$ that can be repeated at the same time, and must be repeated at the same time.
  <center><code>◻︎▼●◻︎▼●▼△●▼△</code> <center>
  <center><code>◻▼●◻︎◻︎▼●▼△△●▼△</code> <center>
  <center><code>◻▼●◻︎◻︎◻︎▼●▼△△△●▼△</code> <center>
  ...

  `◻︎▼●`(`◻︎`)$^k$`▼●▼`(`△`)$^k$`●▼△`

</div>

---

<!-- _header: V-Star Example: Arithmetic Formula -->


- From valid strings `◻︎▼●`(`◻︎`)$^k$`▼●▼`(`△`)$^k$`●▼△`, the nesting pattern is $(u,x,z,y,v)=$ (`◻︎▼●`, `◻︎`, `▼●▼`, `△`, `●▼△`), or simply 
  $$(x,y)=(◻, △)$$
* **Lemma (V-Star)**: each nesting pattern $(x,y)$ must contain a call symbol in $x$, and a return symbol in $y$.
* Therefore, `◻︎` and `△` are the call and return symbols.
  <center>
  <code><call-sym>◻︎</call-sym>▼●<call-sym>◻︎</call-sym>▼●▼<ret-sym>△</ret-sym>●▼<ret-sym>△</ret-sym></code>
  </center>
* **The tagging function**: For any program input, tags `◻︎` as call, and `△` as return symbols.
  <center>
  <code><call-sym>◻︎</call-sym>▼●▼●▼<ret-sym>△</ret-sym>●▼</code>,
  <code><call-sym>◻︎</call-sym>▼●▼</code>, ...
  </center>

---

<!-- _header: Learn Finite State Automata and Visibly Pushdown Automata -->

<center>

| Input                        |
| ---------------------------- |
| <valid-in>1</valid-in>       |
| <invalid-in>1×</invalid-in>  |
| <valid-in>1×1</valid-in>     |
| <valid-in>1×1×1</valid-in>   |
| <valid-in>1×1×1×1</valid-in> |

</center>

* Conjecture: regular expression $($`1×`$)^*$`1` specifies valid inputs.
* You have learned a formal grammar $🎉$

---

<!-- _header: Learn Finite State Automata and Visibly Pushdown Automata -->

* Learn regular expression
  * Regular expression is equivalent to Finite State Automata (FSA).
* $\to$ Learn FSA
  * Each state in the automata is an equivalence class.
* $\to$ Learn Equivalence Classes
  * $\to$ Angluin's $L^*$ (1987): There is a table-based method!

---

<!-- _header: Learn Finite State Automata and Visibly Pushdown Automata -->

#### Fill the Prefix-Suffix Table

<center>

<table id="pre_suf_table" class="pre_suf_table">
    <thead>
        <tr>
            <th scope="rowgroup" rowspan="2">Prefix</th>
            <th scope="rowgroup" colspan="3">Suffix</th>
        </tr>
        <tr>
            <th scope="col">ϵ</th>
            <th scope="col">1</th>
            <th scope="col">× 1</th>
        </tr>
    </thead>
    <tbody data-auto-animate="" data-id="box">
        <tr>
            <td>ϵ</td>
            <td><invalid-in>ϵ</invalid-in></td>
            <td><valid-in>1</valid-in></td>
            <td><invalid-in>× 1</invalid-in></td>
        </tr>
        <tr>
            <td>1</td>
            <td><valid-in>1</valid-in></td>
            <td><valid-in>11</valid-in></td>
            <td><valid-in>1 × 1</valid-in></td>
        </tr>
        <tr>
            <td>1 ×</td>
            <td><invalid-in>1 ×</invalid-in></td>
            <td><valid-in>1 × 1</valid-in></td>
            <td><invalid-in>1 × × 1</invalid-in></td>
        </tr>
        <tr>
            <td>1 × 1</td>
            <td><valid-in>1 × 1</valid-in></td>
            <td><valid-in>1 × 11</valid-in></td>
            <td><valid-in>1 × 1 × 1</valid-in></td>
        </tr>
        <tr>
            <td>1 × 1 × 1</td>
            <td><valid-in>1 × 1 × 1</valid-in></td>
            <td><valid-in>1 × 1 × 11</valid-in></td>
            <td><valid-in>1 × 1 × 1 × 1</valid-in></td>
        </tr>
    </tbody>
</table>

</center>

---

<!-- _header: Learn Finite State Automata and Visibly Pushdown Automata -->

#### Fill the Prefix-Suffix Table

<center>

<table id="pre_suf_table2" class="pre_suf_table">
    <thead>
        <tr>
            <th scope="rowgroup" rowspan="2">Prefix</th>
            <th scope="rowgroup" colspan="3">Suffix</th>
        </tr>
        <tr>
            <th scope="col">ϵ</th>
            <th scope="col">1</th>
            <th scope="col">× 1</th>
        </tr>
    </thead>
    <tbody data-auto-animate="" data-id="box">
        <tr>
            <td>ϵ</td>
            <td><invalid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</invalid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><invalid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</invalid-in></td>
        </tr>
        <tr>
            <td>1</td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
        </tr>
        <tr>
            <td>1 ×</td>
            <td><invalid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</invalid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><invalid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</invalid-in></td>
        </tr>
        <tr>
            <td>1 × 1</td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
        </tr>
        <tr>
            <td>1 × 1 × 1</td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
        </tr>
    </tbody>
</table>

</center>

* Each color sequence represents an equivalence class.

---

<!-- _header: Learn Finite State Automata and Visibly Pushdown Automata -->

#### Fill the Prefix-Suffix Table

<center>

<table id="pre_suf_table2" class="pre_suf_table">
    <thead>
        <tr>
            <th scope="rowgroup" rowspan="2">Prefix</th>
            <th scope="rowgroup" colspan="3">Suffix</th>
        </tr>
        <tr>
            <th scope="col">ϵ</th>
            <th scope="col">1</th>
            <th scope="col">× 1</th>
        </tr>
    </thead>
    <tbody data-auto-animate="" data-id="box">
        <tr>
            <td>ϵ</td>
            <td><invalid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</invalid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><invalid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</invalid-in></td>
        </tr>
        <tr>
            <td>1</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>1 ×</td>
            <td><invalid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</invalid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><invalid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</invalid-in></td>
        </tr>
        <tr>
            <td>1 × 1</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>1 × 1 × 1</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
    </tbody>
</table>

</center>

- `ε` is equivalent to `1 ×`.

---

<!-- _header: Learn Finite State Automata and Visibly Pushdown Automata -->

#### Fill the Prefix-Suffix Table

<center>

<table id="pre_suf_table2" class="pre_suf_table">
    <thead>
        <tr>
            <th scope="rowgroup" rowspan="2">Prefix</th>
            <th scope="rowgroup" colspan="3">Suffix</th>
        </tr>
        <tr>
            <th scope="col">ϵ</th>
            <th scope="col">1</th>
            <th scope="col">× 1</th>
        </tr>
    </thead>
    <tbody data-auto-animate="" data-id="box">
          <tr>
            <td>ϵ</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>1</td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
        </tr>
        </tr>
        <tr>
            <td>1 ×</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td>1 × 1</td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
        </tr>
        <tr>
            <td>1 × 1 × 1</td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
            <td><valid-in>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</valid-in></td>
        </tr>
    </tbody>
</table>

</center>

- `1` is equivalent to `1 × 1` and `1 × 1 × 1`.

---

<!-- _header: Learn Finite State Automata and Visibly Pushdown Automata -->

#### Build an FSA

- The equivalence classes can be converted to an FSA directly.

<div id="fsa" style="text-align:center;">
    <svg width="350" height="200"><defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="black"></polygon></marker></defs><circle cx="100" cy="100" r="50" fill="white" stroke="black" class="state"></circle><text x="100" y="112.5" text-anchor="middle"><tspan>ε</tspan></text><circle cx="250" cy="100" r="50" fill="white" stroke="black" class="state"></circle><text x="250" y="112.5" text-anchor="middle"><tspan>1</tspan></text><circle cx="250" cy="100" r="46" fill="none" stroke="black"></circle><line x1="0" y1="100" x2="50" y2="100" stroke="black" marker-end="url(#arrowhead)" text-anchor="hehe"></line><text x="25" y="100" dy="-10" text-anchor="middle"></text><line x1="143.30127018922195" y1="75" x2="206.69872981077805" y2="75" stroke="black" marker-end="url(#arrowhead)" text-anchor="hehe"></line><text x="175" y="75" dy="-10" text-anchor="middle">1</text><line x1="206.69872981077805" y1="125" x2="143.30127018922195" y2="125" stroke="black" marker-end="url(#arrowhead)" text-anchor="hehe"></line><text x="175" y="125" dy="30" text-anchor="middle">×</text></svg></div>

- The FSA above is equivalent to regular expression $($`1×`$)^*$`1`.

---

#### Doesn't work for VPG

<!-- _header: Learn Finite State Automata and Visibly Pushdown Automata -->

<center>

<table id="vtable" class="vtable" style="font-size:xx-large">
    <thead>
        <tr>
            <th scope="rowgroup" rowspan="2">Prefix</th>
            <th scope="rowgroup" colspan="6">Suffix</th>
        </tr>
        <tr>
            <th scope="col">ϵ</th>
            <th scope="col">×1)</th>
            <th scope="col">×1)×1)</th>
            <th scope="col">...</th>
            <th scope="col">×1)...×1)</th>
            <th scope="col">...</th>
        </tr>
    </thead>
    <tbody data-auto-animate="" data-id="box">
        <tr>
            <td>ϵ</td>
            <td><invalid-in>ϵ</invalid-in></td>
            <td><invalid-in>×1)</invalid-in></td>
            <td><invalid-in>×1) ×1)</invalid-in></td>
            <td>...</td>
            <td><invalid-in>×1) ×1) ×1)</invalid-in></td>
            <td>...</td>
        </tr>
        <tr>
            <td>(1</td>
            <td><invalid-in>(1</invalid-in></td>
            <td><valid-in>(1 ×1)</valid-in></td>
            <td><invalid-in>(1 ×1) ×1)</invalid-in></td>
            <td>...</td>
            <td><invalid-in>(1 ×1) ×1) ×1)</invalid-in></td>
            <td>...</td>
        </tr>
        <tr>
            <td>((1</td>
            <td><invalid-in>((1</invalid-in></td>
            <td><invalid-in>((1 ×1)</invalid-in></td>
            <td><valid-in>((1 ×1) ×1)</valid-in></td>
            <td>...</td>
            <td><invalid-in>((1 ×1) ×1) ×1)</invalid-in></td>
            <td>...</td>
        </tr>
        <tr>
            <td>...</td>
            <td> ... </td>
            <td> ... </td>
            <td> ... </td>
            <td> ... </td>
            <td> ... </td>
            <td>...</td>
        </tr>
        <tr>
            <td>(...(1</td>
            <td><invalid-in>(((1</invalid-in></td>
            <td><invalid-in>(((1 ×1)</invalid-in></td>
            <td><invalid-in>(((1 ×1) ×1)</invalid-in></td>
            <td>...</td>
            <td><valid-in>(...(1 ×1) ... ×1)</valid-in></td>
            <td>...</td>
        </tr>
                <tr>
            <td>...</td>
            <td> ... </td>
            <td> ... </td>
            <td> ... </td>
            <td> ... </td>
            <td> ... </td>
            <td>...</td>
        </tr>
    </tbody>
</table>

</center>

- Infinite number of equivalence classes.

---

<!-- _header: Learn Finite State Automata and Visibly Pushdown Automata -->

<center>

<table id="vtable2" class="vtable">
    <thead>
        <tr>
            <th scope="rowgroup" rowspan="2">Infix</th>
            <th scope="rowgroup" colspan="4">Left Context, Right Context</th>
        </tr>
        <tr>
            <th scope="col">ϵ, ϵ</th>
            <th scope="col">ϵ, × 1</th>
            <th scope="col">(, × 1)</th>
        </tr>
    </thead>
    <tbody data-auto-animate="" data-id="box">
        <tr>
            <td>ϵ</td>
            <td><invalid-in>ϵ</invalid-in></td>
            <td><invalid-in>× 1</invalid-in></td>
            <td><invalid-in>( × 1)</invalid-in></td>
        </tr>
        <tr>
            <td>1</td>
            <td><valid-in>1</valid-in></td>
            <td><valid-in>1 × 1</valid-in></td>
            <td><valid-in>(1 × 1)</valid-in></td>
        </tr>
        <tr>
            <td>1 ×</td>
            <td><invalid-in>1 ×</invalid-in></td>
            <td><invalid-in>1 × × 1</invalid-in></td>
            <td><invalid-in>(1 × × 1)</invalid-in></td>
        </tr>
        <tr>
            <td>(1 × 1)</td>
            <td><valid-in>(1 × 1)</valid-in></td>
            <td><valid-in>(1 × 1) × 1</valid-in></td>
            <td><valid-in>((1 × 1) × 1)</valid-in></td>
        </tr>
    </tbody>
</table>

</center>

- Each infix must be well-matched.
- The number of equivalence classes becomes finite.

---

<!-- _header: More Info in the Paper -->

- **Hierarchy**:
  - Regular Grammar < VPGs < CFGs
- **Formal Definition of VPGs and VPA**
- **Conversions and Learning**:
  - From Finite State Automata (FSA) to Visibly Pushdown Automata (VPA)
  - How to identify nesting structures using nesting patterns
  - How to learn Visibly Pushdown Automata (VPA)
- **Partial Tokenizer**:
  - What is it?
  - How does it help?

---

<!-- _header: Evaluation Overview -->

- **Evaluation Methodology**
  - Replicated the artifact of Arvada (ASE '22).
  - Includes oracle grammars, evaluation datasets, and seed strings.

- **Selected Grammars**
  - Five Grammars: JSON, LISP, XML, While, MathExpr
  - Chosen because they are VPGs

> Further exploration of additional program inputs is reserved for future research.

---

<!-- _header: Evaluation: Accuracy -->

<div style="font-size:x-large">

- **Recall** $\frac{|L\cap L_\mathcal{O}|}{|L|}$: Probability that a string of the oracle is accepted by the learned grammar $G$.
- **Precision** $\frac{|L\cap L_\mathcal{O}|}{|L_\mathcal{O}|}$: Probability that a string in $G$ is accepted by the oracle.
- **F-1 Score** $\frac{2}{1/\text{recall}+1/\text{prec}}$: Harmonic mean of precision and recall, indicating overall accuracy.

</div>

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

<div style="font-size:x-large">

- **#Queries**: The number of unique membership queries made during the learning process.
- **Time**: The overall running time for each tool.
- **#Seeds**: The number of seed strings (i.e., valid strings) shared by all tools.

</div>

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

<div style="font-size:x-large">

- **%Queries(Token)**: Percentage of membership queries made for token inference.
- **%Queries(VPA)**: Percentage of membership queries made for VPA learning.
- **#TestString**: The number of test strings sampled from the seed strings by V-Star.

</div>

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

<div style="font-size:xx-large">

Most time is spent on VPA learning, not token inference, as short seed strings lead to shorter nesting patterns and a smaller search space.
</div>

---

<!-- _header: Conclusion and Future Work -->

- **Conclusion**: V-Star is more accurate compared to other tools but requires more time due to VPA learning.

- **Future Work**:
  - **Performance**: Improve V-Star's efficiency to reduce VPA learning time.
  - **Evaluation**: Test V-Star on more practical grammars.
  - **Alternative Algorithms**: Explore other VPA learning methods.
  - **Readability**: Enhance the readability of the learned grammar.
  - **CFG Learning**: Use V-Star as a starting point for learning Context-Free Grammars.

