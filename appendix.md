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