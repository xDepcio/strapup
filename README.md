### Instalation
`npm i strapup -g` - install globally to be able to paste and save your templates anywhere.

### Basic use
`strapup` - Opens up interactive CLI. Follow on-screen informations to save/paste templates and more.

At the first use you must specify path where strapup will create its directory and store your templates and scripts. When you update or re-install strapup. Path to this directory may be lost, but directory itself is not deleted, you will just need to specify path to it again.

### Create your scripts
To create you own scripts, open in text editor `scripts.mjs` created by strapup on inital setup. Path to it is displayed on top every time you run strapup.
Each script is a JS function returing list of string (shell commands) and taking any number of arguments. User will be automatically prompted to provide values to these arguments, before script executes.
For more details follow examples provided in `scripts.mjs` file.


### Keep in mind
This package still is in early development and some features may not work as expected.
If you encountered any issues please reach me out on github or discord - xDepcio#3372

### Road map
- General funcionality improvement
- Add more built-in templates and scripts
- Add option to store templates in cloud
