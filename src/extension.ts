import { fstat } from 'fs';
import * as vscode from 'vscode';
const fs = require('fs');

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

      // And set its HTML content
      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(
        async message => {
          switch (message.command) {
            case 'action':
              vscode.window.showInformationMessage(message.text);

              if (message.text === "promptSelectSolutionExplorer") {
                await promptSelectSolutionExplorer(panel);
              }

              return;
          }
        },
        undefined,
        context.subscriptions
      );
    })
  );
}

async function promptSelectSolutionExplorer(panel: vscode.WebviewPanel) {
  let solutions = await vscode.workspace.findFiles("**/*.sln");
  let paths = solutions.map((x) => x.fsPath.toString());

  let selectedSolution = await vscode.window.showQuickPick(paths);

  // generate an object that represents
  // the state of the file system and
  // pass it to Blazor

  // OR

  // pass selectedSolution and let
  // Blazor ask for information
  // as is needed? possibly slow

  var x = await fs.readFile(selectedSolution, { "encoding": "UTF-8" }, (err: any, data: any) => {
    panel.webview.postMessage({ command: 'result', text: 'promptSelectSolutionExplorer', data: data });
  });
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
        switch (e.command) {
            case 'action':
                if (e.text === "promptSelectSolutionExplorer") {
                    vscode.postMessage({
                        command: 'action',
                        text: 'promptSelectSolutionExplorer'
                    });
                }
            case 'result':
                if (e.text === "promptSelectSolutionExplorer") {
                    var iFrame = document.getElementById('blazorWebassembly');
                    iFrame.contentWindow.postMessage({
                        command: "result",
                        text: 'promptSelectSolutionExplorer',
                        data: e.data
                    }, "http://localhost:5000");
                }
        }
    }, false);
}());
  </script>
	<iframe id="blazorWebassembly" style="border: none; width: 100vw; height: 100vh;" src="http://localhost:5000" title="W3Schools Free Online Web Tutorials"></iframe>
</body>
</html>`;
}