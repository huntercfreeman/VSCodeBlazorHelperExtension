import * as vscode from "vscode";
import { fstat } from 'fs';
import { AddProjectWebview } from "./AddProjectWebview";
import { AddFileWebview } from "./AddFileWebview";
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

    let selectedSlnAbsolutePath: string = "";

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
            case "getWorkspaceAbsolutePath": {
              let workspaceFolderFsPath = vscode.workspace.workspaceFolders?.map(folder => folder.uri.fsPath);

              if (workspaceFolderFsPath === null ||
                workspaceFolderFsPath === undefined ||
                workspaceFolderFsPath.length === 0) {

                vscodeInteropEvent.result = "null";
                vscodeInteropEvent.targetOne = "null";
                vscodeInteropEvent.targetTwo = "null";
              }
              else {
                vscodeInteropEvent.result = workspaceFolderFsPath[0];
              }

              webviewView.webview.postMessage(vscodeInteropEvent);
              break;
            }
            case "read": {
              await fs.readFile(vscodeInteropEvent.targetOne, { "encoding": "UTF-8" }, (err: any, data: any) => {
                vscodeInteropEvent.result = JSON.stringify(data);
                webviewView.webview.postMessage(vscodeInteropEvent);
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

                webviewView.webview.postMessage(vscodeInteropEvent);
              });
              break;
            }
            case "open": {
              vscode.workspace.openTextDocument(vscodeInteropEvent.targetOne).then((a: vscode.TextDocument) => {
                vscode.window.showTextDocument(a, 1, false).then(e => {
                  e.edit(edit => {
                    edit.insert(new vscode.Position(0, 0), "Your advertisement here");
                  });
                });
              }, (error: any) => {
                console.error(error);
                debugger;
              });

              vscodeInteropEvent.result = "success";
              webviewView.webview.postMessage(vscodeInteropEvent);
              break;
            }
            case "delete": {
              const edit = new vscode.WorkspaceEdit();

              let fileUri = vscode.Uri.file(vscodeInteropEvent.targetOne);

              edit.deleteFile(fileUri, { recursive: true, ignoreIfNotExists: true });

              await vscode.workspace.applyEdit(edit);

              vscodeInteropEvent.result = "success";

              webviewView.webview.postMessage(vscodeInteropEvent);
              break;
            }
            case "paste": {
              await fs.readFile(vscodeInteropEvent.targetOne, { "encoding": "UTF-8" }, async (err: any, data: any) => {
                await fs.writeFile(vscodeInteropEvent.targetTwo, data, (err: any) => {
                  if (err) {
                    console.error(err);
                    return vscode.window.showErrorMessage("Failed to create " + vscodeInteropEvent.targetOne);
                  }

                  vscode.window.showInformationMessage("Created " + vscodeInteropEvent.targetOne);
                });
              });

              if (vscodeInteropEvent.message === "wasCut") {
                const edit = new vscode.WorkspaceEdit();

                let fileUri = vscode.Uri.file(vscodeInteropEvent.targetOne);

                edit.deleteFile(fileUri, { recursive: true, ignoreIfNotExists: true });

                await vscode.workspace.applyEdit(edit);
              }

              vscodeInteropEvent.result = "success";

              webviewView.webview.postMessage(vscodeInteropEvent);

              break;
            }
            case "rename": {
              await fs.rename(vscodeInteropEvent.targetOne, vscodeInteropEvent.targetTwo, () => {
                vscodeInteropEvent.result = "success";
                webviewView.webview.postMessage(vscodeInteropEvent);
              });

              break;
            }
            case "addDirectory": {
              fs.mkdir(vscodeInteropEvent.targetOne, (err: any) => {
                if (err && err.code != 'EEXIST') throw 'up'
                //
              });

              vscodeInteropEvent.result = "success";
              webviewView.webview.postMessage(vscodeInteropEvent);
              break;
            }
            case "addFile": {
              await fs.writeFile(vscodeInteropEvent.targetOne, vscodeInteropEvent.targetTwo, (err: any) => {
                if (err) {
                  console.error(err);
                  return vscode.window.showErrorMessage("Failed to create " + vscodeInteropEvent.targetOne);
                }

                vscode.window.showInformationMessage("Created " + vscodeInteropEvent.targetOne);
              });

              vscodeInteropEvent.result = "success";
              webviewView.webview.postMessage(vscodeInteropEvent);
              break;
            }
            case "openAddFileForm": {
              const addFileWebview = new AddFileWebview(this._extensionUri, 
                vscodeInteropEvent.targetOne,
                vscodeInteropEvent.targetTwo);

              const panel = vscode.window.createWebviewPanel(
                'newFile',
                'New File',
                vscode.ViewColumn.One,
                { enableScripts: true }
              );

              addFileWebview.resolveWebviewView(panel);
              break;
            }
            case "overwriteSolutionFile": {
              await fs.writeFile(vscodeInteropEvent.targetOne, '\ufeff' + vscodeInteropEvent.targetTwo, (err: any) => {
                if (err) {
                  console.error(err);
                  return vscode.window.showErrorMessage("Failed to create " + vscodeInteropEvent.targetOne);
                }

                vscode.window.showInformationMessage("Created " + vscodeInteropEvent.targetOne);
              });

              vscodeInteropEvent.result = "success";
              webviewView.webview.postMessage(vscodeInteropEvent);
              break;
            }
            case "removeProject": {
              vscodeInteropEvent.result = "unimplemented";
              webviewView.webview.postMessage(vscodeInteropEvent);
              break;
            }
            case "newProject": {
              const addProjectWebview = new AddProjectWebview(this._extensionUri, selectedSlnAbsolutePath);

              const panel = vscode.window.createWebviewPanel(
                'newProject',
                'New Project',
                vscode.ViewColumn.One,
                { enableScripts: true }
              );

              addProjectWebview.resolveWebviewView(panel);
              break;
            }
            case "saveSelectedSlnAbsolutePath": {
              selectedSlnAbsolutePath = vscodeInteropEvent.targetOne;

              vscodeInteropEvent.result = "success";
              webviewView.webview.postMessage(vscodeInteropEvent);
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
        else if (vscodeInteropEvent.command === "openAddFileForm") {
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
}