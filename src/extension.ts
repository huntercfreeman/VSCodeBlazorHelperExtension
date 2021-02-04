import { fstat } from 'fs';
import * as vscode from 'vscode';
const fs = require('fs');
const path = require("path");

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vscodeblazorhelper.helloWorld', () => {
      // Create and show panel
      const panel = vscode.window.createWebviewPanel(
        'vscodeBlazorHelper',
        'VSCodeBlazorHelper',
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(
        async (vscodeInteropEvent: any) => {

          if (vscodeInteropEvent.command !== undefined &&
            vscodeInteropEvent.command !== null) {

            switch (vscodeInteropEvent.command) {
              case "provideSlnPath": {
                await (async function (vscodeInteropEvent) {
                  let solutions = await vscode.workspace.findFiles("**/*.sln");
                  let paths = solutions.map((x) => x.fsPath.toString());

                  let selectedSolution = await vscode.window.showQuickPick(paths);
                  await (async function (selectedSolution) {
                    await fs.readFile(selectedSolution, { "encoding": "UTF-8" }, (err: any, data: any) => {
                      vscodeInteropEvent.targetOne = selectedSolution;
                      vscodeInteropEvent.result = JSON.stringify(data);
                      panel.webview.postMessage(vscodeInteropEvent);
                    });
                  })(selectedSolution);
                })(vscodeInteropEvent);
                break;
              }
              case "getCsproj": {
                // Comments are not all the same object
                // path they're to showcase the ending slash
                // for when the paths are joined together

                //DM2BD.DTK.DALTests\\DM2BD.DTK.DALTests.csproj\
                let relativeCsprojPath: string = vscodeInteropEvent.targetOne; 

                //c:\Users\hunter.freeman\source\repos\DTK\Prototype\DM2BD.DTK.Solution\DM2BD.DTK.Solution.sln
                let absoluteSlnPath: string = vscodeInteropEvent.targetTwo; 

                //c:\Users\hunter.freeman\source\repos\DTK\Prototype\DM2BD.DTK.Solution
                let directoryOfSln = path.dirname(absoluteSlnPath);

                //c:\Users\hunter.freeman\source\repos\DTK\Prototype\DM2BD.DTK.Solution\DM2BD.DTK.DAL\DM2BD.DTK.DAL.csproj\
                let absoluteCsprojPath = path.join(directoryOfSln, relativeCsprojPath);

                //c:\Users\hunter.freeman\source\repos\DTK\Prototype\DM2BD.DTK.Solution\DM2BD.DTK.DAL
                let directoryOfCsproj = path.dirname(absoluteCsprojPath);

                await fs.readdir(directoryOfCsproj, (err: any, files: any) => {
                  // update vscodeInteropEvent.targetOne to be
                  // the absolute path of the csproj
                  // the result is the list of files
                  let csvOfFiles = "";

                  for(let i = 0; i < files.length; i++) {
                    csvOfFiles += files[i];
                    
                    if(i < files.length - 1) {
                      csvOfFiles += ',';
                    }
                  }

                  vscodeInteropEvent.result = csvOfFiles;

                  panel.webview.postMessage(vscodeInteropEvent);
                });
                break;
              }
            }
          }
          return;
        },
        undefined,
        context.subscriptions
      );
    })
  );
}

function getWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>	
<body>
  <script>
  (function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener("message", (e) => {
        let vscodeInteropEvent = e.data;

        if (vscodeInteropEvent.command !== undefined &&
            vscodeInteropEvent.command !== null) {

            switch (vscodeInteropEvent.command) {
                case "helloWorld": {
                    vscodeInteropEvent.result = "Hello World! -Vscode";

                    var iFrame = document.getElementById('blazorWebassembly');
                    iFrame.contentWindow.postMessage(vscodeInteropEvent, "http://localhost:5000");
                    break;
                }
                case "provideSlnPath": {
                    if(vscodeInteropEvent.result === undefined ||
                        vscodeInteropEvent.result === null) {
                        vscode.postMessage(vscodeInteropEvent);
                    }
                    else {
                        var iFrame = document.getElementById('blazorWebassembly');
                        iFrame.contentWindow.postMessage(vscodeInteropEvent, "http://localhost:5000");
                    }
                    break;
                }
                case "getCsproj": {
                    if(vscodeInteropEvent.result === undefined ||
                      vscodeInteropEvent.result === null) {
                        vscode.postMessage(vscodeInteropEvent);
                    }
                    else {
                        var iFrame = document.getElementById('blazorWebassembly');
                        iFrame.contentWindow.postMessage(vscodeInteropEvent, "http://localhost:5000");
                    }
                    break;
                }
            }
        }
    }, false);
}());
  </script>
	<iframe id="blazorWebassembly" style="border: none; width: 100vw; height: 100vh;" src="http://localhost:5000" title="W3Schools Free Online Web Tutorials"></iframe>
</body>
</html>`;
}