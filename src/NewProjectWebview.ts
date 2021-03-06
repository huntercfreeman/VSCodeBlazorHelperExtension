import * as vscode from "vscode";
import { fstat } from 'fs';
const fs = require('fs');

export class NewProjectWebview {
  _panel?: vscode.WebviewPanel;

  constructor(private readonly _extensionUri: vscode.Uri,
              private readonly _selectedSlnAbsolutePath: string) { }

  public resolveWebviewView(webviewView: vscode.WebviewPanel) {
    this._panel = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.onDidReceiveMessage(
      async (vscodeInteropEvent: any) => {
        if (vscodeInteropEvent.command !== undefined &&
          vscodeInteropEvent.command !== null) {

          switch (vscodeInteropEvent.command) {
            case "sendTextToSidePanel": {
              vscodeInteropEvent.result = "pass along";
              webviewView.webview.postMessage(vscodeInteropEvent);
            }
            case "getSelectedSlnAbsolutePath": {
              vscodeInteropEvent.result = this._selectedSlnAbsolutePath;
              webviewView.webview.postMessage(vscodeInteropEvent);
            }
          }
        }
      }
    );

    webviewView.webview.html = this.getWebviewContent();
  }

  // public revive(webviewView: vscode.WebviewView) {
  //   this._panel = webviewView;
  // }

  private getWebviewContent() {
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
          else if (vscodeInteropEvent.command === "sendTextToSidePanel") {
            if (vscodeInteropEvent.result === undefined ||
                vscodeInteropEvent.result === null) {
                vscode.postMessage(vscodeInteropEvent);
                return;
            }
        }
          else if (vscodeInteropEvent.command === "getWorkspaceAbsolutePath") {
            if (vscodeInteropEvent.result === undefined ||
                vscodeInteropEvent.result === null) {
                vscode.postMessage(vscodeInteropEvent);
                return;
            }
        }
        else if (vscodeInteropEvent.command === "getSelectedSlnAbsolutePath") {
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
    <iframe id="blazorWebassembly" style="border: none; width: 95vw; height: 95vh; max-width: 95vw; max-height: 95vh;" src="http://localhost:5000/newProjectForm" title="W3Schools Free Online Web Tutorials"></iframe>
  </body>
  </html>`;
  }
}