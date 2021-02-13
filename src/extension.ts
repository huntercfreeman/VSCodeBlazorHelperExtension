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
              case "getFilesLike": {
                await (async function (vscodeInteropEvent) {
                  let solutions = await vscode.workspace.findFiles("**/*.sln");
                  let paths = solutions.map((x) => x.fsPath.toString());
                  vscodeInteropEvent.result = paths.join(',');

                  panel.webview.postMessage(vscodeInteropEvent);
                })(vscodeInteropEvent);
                break;
              }
              case "read": {
                await fs.readFile(vscodeInteropEvent.targetOne, { "encoding": "UTF-8" }, (err: any, data: any) => {
                  selectedSolutionAbsolutePath = vscodeInteropEvent.targetOne;
                  vscodeInteropEvent.result = JSON.stringify(data);
                  panel.webview.postMessage(vscodeInteropEvent);
                });
                break;              
              }
              case "getSiblings": {
                let relativedirectoryOfCsproj = path.dirname(vscodeInteropEvent.targetOne);
                let absoluteDirectoryOfSln = path.dirname(selectedSolutionAbsolutePath);

                let absoluteDirectoryOfCsproj = path.join(absoluteDirectoryOfSln, relativedirectoryOfCsproj);

                await fs.readdir(absoluteDirectoryOfCsproj, (err: any, files: any) => {
                  // update vscodeInteropEvent.targetOne to be
                  // the absolute path of the csproj
                  // the result is the list of files
                  let csvOfFiles = "";

                  for (let i = 0; i < files.length; i++) {
                    csvOfFiles += files[i];

                    if (i < files.length - 1) {
                      csvOfFiles += ',';
                    }
                  }

                  vscodeInteropEvent.result = csvOfFiles;

                  panel.webview.postMessage(vscodeInteropEvent);
                });
                break;
              }
              case "readDirectory": {
                await fs.readdir(vscodeInteropEvent.targetOne, (err: any, files: any) => {
                  // update vscodeInteropEvent.targetOne to be
                  // the absolute path of the csproj
                  // the result is the list of files
                  let csvOfFiles = "";

                  for (let i = 0; i < files.length; i++) {
                    csvOfFiles += files[i];

                    if (i < files.length - 1) {
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

let selectedSolutionAbsolutePath : string = "";

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
        var iFrame = document.getElementById('blazorWebassembly');

        if (vscodeInteropEvent.command === "getFilesLike") {
            if (vscodeInteropEvent.result === undefined ||
                vscodeInteropEvent.result === null) {
                vscode.postMessage(vscodeInteropEvent);
                return;
            }
        }
        else if (vscodeInteropEvent.command === "read") {
            if (vscodeInteropEvent.result === undefined ||
                vscodeInteropEvent.result === null) {
                vscode.postMessage(vscodeInteropEvent);
                return;
            }
        }
        else if (vscodeInteropEvent.command === "getSiblings") {
            if (vscodeInteropEvent.result === undefined ||
                vscodeInteropEvent.result === null) {
                vscode.postMessage(vscodeInteropEvent);
                return;
            }
        }
        else if (vscodeInteropEvent.command === "readDirectory") {
            if (vscodeInteropEvent.result === undefined ||
                vscodeInteropEvent.result === null) {
                vscode.postMessage(vscodeInteropEvent);
                return;
            }
        }

        iFrame.contentWindow.postMessage(vscodeInteropEvent, "*");
    }, false);

    return;
}());
  </script>
	<iframe id="blazorWebassembly" style="border: none; width: 95vw; height: 95vh; max-width: 95vw; max-height: 95vh;" src="http://localhost:5000" title="W3Schools Free Online Web Tutorials"></iframe>
</body>
</html>`;
}