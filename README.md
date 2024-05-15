Slides for [V-Star](https://github.com/xdjia/vstar). 
View it [here](https://xdjia.github.io/vstar_slides).

### How to Use

#### Option 1: Using VSCode

1. Open `slides.md` in VSCode and install the [VSCode Marp extension](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode). 
2. Open settings and search for "marp themes".
3. In the "Markdown > Marp:Themes" clause, click "add item", type "themes/academic.css", then click "OK".
4. Open the preview of the `slides.md` to preview the slides.
5. To export PDF or HTML files, press `F1` then search for "Marp: Export Slide Deck...".  
   Press enter and choose the file types (PDF or HTML) and then save the file.

#### Option 2: Using Commandline

After install [marp-cli](https://github.com/marp-team/marp-cli), 
to generate the "index.pdf" and "index.html" files, make sure `marp` is a available in shell, then run

```shell
zsh build.sh
```
