import * as vscode from 'vscode';

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

              if (message.text === "selectSolutionExplorer") {
                let solutions = await vscode.workspace.findFiles("**/*.sln");
                let paths = solutions.map((x) => x.fsPath.toString());

                let x = vscode.window.showQuickPick(paths);
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
        (function() {
			const vscode = acquireVsCodeApi();
			
            window.addEventListener("message", (event) => {
				if (event.origin !== "http://localhost:5000")
				return;
			
				vscode.postMessage({
					command: 'action',
					text: 'selectSolutionExplorer'
				})
			}, false);
        }())
    </script>
	<iframe style="border: none; width: 100vw; height: 100vh;" src="http://localhost:5000" title="W3Schools Free Online Web Tutorials"></iframe>
</body>
</html>`;
}