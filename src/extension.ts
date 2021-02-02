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
        async jsonIdentity => {
          try {
            if (jsonIdentity.payload === "provideSlnPath") {
              await (async function (jsonIdentity) {
                let solutions = await vscode.workspace.findFiles("**/*.sln");
                let paths = solutions.map((x) => x.fsPath.toString());

                let selectedSolution = await vscode.window.showQuickPick(paths);

                await fs.readFile(selectedSolution, { "encoding": "UTF-8" }, (err: any, data: any) => {
                  jsonIdentity.payload = JSON.stringify(data);
                  panel.webview.postMessage(jsonIdentity);
                });
              })(jsonIdentity);
            }
          } catch (ex) {
            console.error(ex);
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
        jsonIdentity = e.data;

        if (jsonIdentity.payload === "provideSlnPath") {
            vscode.postMessage(jsonIdentity);
        }
        else if (jsonIdentity.payload === "helloWorld") {
            console.log("Payload was helloWorld");
            jsonIdentity.payload = "Hello World! -Object Instance";

            var iFrame = document.getElementById('blazorWebassembly');
            iFrame.contentWindow.postMessage(jsonIdentity, "http://localhost:5000");
        }
        else {
          var iFrame = document.getElementById('blazorWebassembly');
          iFrame.contentWindow.postMessage(jsonIdentity, "http://localhost:5000");
        }
    }, false);
}());
  </script>
	<iframe id="blazorWebassembly" style="border: none; width: 100vw; height: 100vh;" src="http://localhost:5000" title="W3Schools Free Online Web Tutorials"></iframe>
</body>
</html>`;
}