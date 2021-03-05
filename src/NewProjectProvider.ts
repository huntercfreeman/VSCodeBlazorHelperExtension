import * as vscode from "vscode";
import { fstat } from 'fs';
const fs = require('fs');

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) { }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this.getWebviewContent();

    // let selectedSlnAbsolutePath: string = "";

    webviewView.webview.onDidReceiveMessage(
      async (vscodeInteropEvent: any) => {
        if (vscodeInteropEvent.command !== undefined &&
          vscodeInteropEvent.command !== null) {

          switch (vscodeInteropEvent.command) {
            case "getFilesLike": {
              await (async function (vscodeInteropEvent) {
                let solutions = await vscode.workspace.findFiles(vscodeInteropEvent.targetOne);
                let paths = solutions.map((x) => x.fsPath.toString());
                vscodeInteropEvent.result = paths.join(',');

                webviewView.webview.postMessage(vscodeInteropEvent);
              })(vscodeInteropEvent);
              break;
            }
          }
        }
        return;
      });
  }

  public revive(webviewView: vscode.WebviewView) {
    this._view = webviewView;
  }

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
          else if (vscodeInteropEvent.command === "getWorkspaceAbsolutePath") {
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
          else if (vscodeInteropEvent.command === "readDirectory") {
              if (vscodeInteropEvent.result === undefined ||
                  vscodeInteropEvent.result === null) {
                  vscode.postMessage(vscodeInteropEvent);
                  return;
              }
          }
          else if (vscodeInteropEvent.command === "open") {
              if (vscodeInteropEvent.result === undefined ||
                  vscodeInteropEvent.result === null) {
                  vscode.postMessage(vscodeInteropEvent);
                  return;
              }
          }
          else if (vscodeInteropEvent.command === "delete") {
              if (vscodeInteropEvent.result === undefined ||
                  vscodeInteropEvent.result === null) {
                  vscode.postMessage(vscodeInteropEvent);
                  return;
              }
          }
          else if (vscodeInteropEvent.command === "paste") {
            if (vscodeInteropEvent.result === undefined ||
                vscodeInteropEvent.result === null) {
                vscode.postMessage(vscodeInteropEvent);
                return;
            }
        }
          else if (vscodeInteropEvent.command === "rename") {
              if (vscodeInteropEvent.result === undefined ||
                  vscodeInteropEvent.result === null) {
                  vscode.postMessage(vscodeInteropEvent);
                  return;
              }
          }
          else if (vscodeInteropEvent.command === "addDirectory") {
              if (vscodeInteropEvent.result === undefined ||
                  vscodeInteropEvent.result === null) {
                  vscode.postMessage(vscodeInteropEvent);
                  return;
              }
          }
          else if (vscodeInteropEvent.command === "addFile") {
              if (vscodeInteropEvent.result === undefined ||
                  vscodeInteropEvent.result === null) {
                  vscode.postMessage(vscodeInteropEvent);
                  return;
              }
          }
          else if (vscodeInteropEvent.command === "overwriteSolutionFile") {
            if (vscodeInteropEvent.result === undefined ||
                vscodeInteropEvent.result === null) {
                vscode.postMessage(vscodeInteropEvent);
                return;
            }
        }
          else if (vscodeInteropEvent.command === "removeProject") {
              if (vscodeInteropEvent.result === undefined ||
                  vscodeInteropEvent.result === null) {
                  vscode.postMessage(vscodeInteropEvent);
                  return;
              }
          }
          else if (vscodeInteropEvent.command === "newProject") {
              if (vscodeInteropEvent.result === undefined ||
                  vscodeInteropEvent.result === null) {
                  vscode.postMessage(vscodeInteropEvent);
                  return;
              }
          }
          else if (vscodeInteropEvent.command === "saveSelectedSlnAbsolutePath") {
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

  private getNewProjectHtml() {
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