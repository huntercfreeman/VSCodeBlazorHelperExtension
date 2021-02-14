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
        else if (vscodeInteropEvent.command === "cut") {
            if (vscodeInteropEvent.result === undefined ||
                vscodeInteropEvent.result === null) {
                vscode.postMessage(vscodeInteropEvent);
                return;
            }
        }
        else if (vscodeInteropEvent.command === "copy") {
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

        iFrame.contentWindow.postMessage(vscodeInteropEvent, "*");
    }, false);

    return;
}());