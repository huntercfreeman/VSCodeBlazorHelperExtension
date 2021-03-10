import * as vscode from "vscode";
import { fstat } from 'fs';
const fs = require('fs');

export class AddFileWebview {
  _panel?: vscode.WebviewPanel;

  constructor(private readonly _extensionUri: vscode.Uri,
              private readonly _toBeParentFolder: string,
              private readonly _templateKey: string,
              private readonly _namespace: string,
              private readonly _eventId: string,
              private readonly _sidePanelWebView: vscode.WebviewView) { }

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
            // case "sendTextToSidePanel": {
            //   vscodeInteropEvent.result = "pass along";
            //   webviewView.webview.postMessage(vscodeInteropEvent);
            // }
            case "getPageData": {
              vscodeInteropEvent.targetOne = this._toBeParentFolder;
              vscodeInteropEvent.targetTwo = this._templateKey;
              vscodeInteropEvent.message = this._namespace;
              vscodeInteropEvent.result = this._eventId;

              webviewView.webview.postMessage(vscodeInteropEvent);
            }
            case "openAddFileForm": {
              this._sidePanelWebView.webview.postMessage(vscodeInteropEvent);
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
      else if (vscodeInteropEvent.command === "getPageData") {
        if (vscodeInteropEvent.result === undefined ||
            vscodeInteropEvent.result === null) {
              vscode.postMessage(vscodeInteropEvent);
              return;
        }
    }
    else if (vscodeInteropEvent.command === "openAddFileForm") {
      if (vscodeInteropEvent.result !== undefined ||
          vscodeInteropEvent.result !== null) {
          vscode.postMessage(vscodeInteropEvent);
          return;
      }
  }
  
          iFrame.contentWindow.postMessage(vscodeInteropEvent, "*");
      }, false);
  
      return;
  }());
    </script>
    <iframe id="blazorWebassembly" style="border: none; width: 95vw; height: 95vh; max-width: 95vw; max-height: 95vh;" src="http://localhost:5000/addFile" title="W3Schools Free Online Web Tutorials"></iframe>
  </body>
  </html>`;
  }
}