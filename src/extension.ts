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
          switch (message) {
            case 'provideSlnPath':
              vscode.window.showInformationMessage("message was " + message);

              if (message === "provideSlnPath") {
                let solutions = await vscode.workspace.findFiles("**/*.sln");
                let paths = solutions.map((x) => x.fsPath.toString());

                let selectedSolution = await vscode.window.showQuickPick(paths);

                await fs.readFile(selectedSolution, { "encoding": "UTF-8" }, (err: any, data: any) => {
                  panel.webview.postMessage(data);
                });
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
        if (e === "provideSlnPath") {
            vscode.postMessage("provideSlnPath");
        }
        else {
            var iFrame = document.getElementById('blazorWebassembly');
            iFrame.contentWindow.postMessage(e, "http://localhost:5000");
        }
    }, false);
}());
  </script>
	<iframe id="blazorWebassembly" style="border: none; width: 100vw; height: 100vh;" src="http://localhost:5000" title="W3Schools Free Online Web Tutorials"></iframe>
</body>
</html>`;
}