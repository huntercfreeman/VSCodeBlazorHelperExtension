(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener("message", (e) => {
        let vscodeInteropEvent = e.data;
        var iFrame = document.getElementById('blazorWebassembly');

        if (vscodeInteropEvent.command === "getFilesLike") {
            if (vscodeInteropEvent.result === undefined ||
                vscodeInteropEvent.result === null) {
                vscode.postMessage(vscodeInteropEvent);
            }
        }
        else if (vscodeInteropEvent.command === "read") {
            if (vscodeInteropEvent.result === undefined ||
                vscodeInteropEvent.result === null) {
                vscode.postMessage(vscodeInteropEvent);
            }
        }
        else if (vscodeInteropEvent.command === "getSiblings") {
            if (vscodeInteropEvent.result === undefined ||
                vscodeInteropEvent.result === null) {
                vscode.postMessage(vscodeInteropEvent);
            }
        }

        iFrame.contentWindow.postMessage(vscodeInteropEvent, "*");
    }, false);

    return;
}());

// let slnContent = GetSlnContent();

            // let partialResult = "";
            // let length = slnContent.length;
            // let index = 0;

            // while (index < length) {
            //     partialResult += slnContent[index++];

            //     if (partialResult.length > 15999) {
            //         vscodeInteropEvent.result = partialResult;
            //         iFrame.contentWindow.postMessage(vscodeInteropEvent, "*");
            //         partialResult = "";
            //     }
            // }