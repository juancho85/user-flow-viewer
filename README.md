# Experiment with angularJS using angular-seed as a base

This project aims to create a readable display to user flow logs

Before using it:
==============

**Firefox**
--------------
- Open index.html in your browser. you can find it under /app folder

**Chrome**
--------------
- Install node.js (http://nodejs.org/download/)
- Add nodejs to your path (for example PATH=C:\Program Files\nodejs\).
- Running startServerAndLaunch.bat creates a local web server and opens the log viewer on the default browser
- Running startServer.bat creates a local web server. You can then use http://localhost:8000/app/index.html to open the log viewer in the browser of your choice

**Other browsers**
--------------
- Not tested yet

How To use:
==============
- Drag and drop a user flow file into the red rectangle
- Two tables are presented with the input and statistic fields
- The input and statistic chunks are recognised recognised by the string input/statistic followed by a line feed
- Use the left menu to choose your display preferences and filter the fields displayed
- You can store your preferences for filters (browser local storage)
