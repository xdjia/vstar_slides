Slides for [V-Star](https://github.com/xdjia/vstar). 
View them [here](https://xdjia.github.io/vstar_slides).

### How to Use

First, clone this repository.

```shell
git clone git@github.com:xdjia/vstar_slides.git
cd vstar_slides
```

#### Option 1: Using VSCode

1. Open `slides.md` in VSCode and install the [VSCode Marp extension](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode). 
2. Open settings and search for "marp themes".
3. In the "Markdown > Marp:Themes" clause, click "Add Item", type "themes/academic.css", then click "OK".
4. Open the preview of `slides.md` in VSCode to preview the slides.
5. To export the slides as PDF or HTML, press `F1` then search for "Marp: Export Slide Deck...".  
   Press enter and choose a file type (PDF or HTML) and then save the file.

#### Option 2: Using Commandline

After installing [marp-cli](https://github.com/marp-team/marp-cli), make sure `marp` is a available in shell. 
Generate the "index.pdf" and "index.html" files by running

```shell
zsh build.sh
```
