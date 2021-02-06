(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener("message", (e) => {
        let vscodeInteropEvent = e.data;
        var iFrame = document.getElementById('blazorWebassembly');

        if (vscodeInteropEvent.command === "getSlns") {
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
            else {
                var iFrame = document.getElementById('blazorWebassembly');
                iFrame.contentWindow.postMessage(vscodeInteropEvent, "http://localhost:5000");
            }
        }

        iFrame.contentWindow.postMessage(vscodeInteropEvent, "*");
    }, false);
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