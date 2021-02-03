(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener("message", (e) => {
        console.log("Got to Vscode");
        let vscodeInteropEvent = e.data;

        if (vscodeInteropEvent.command !== undefined &&
            vscodeInteropEvent.command !== null) {

            switch (vscodeInteropEvent.command) {
                case "helloWorld": {
                    vscodeInteropEvent.result = "Hello World! -Vscode";

                    var iFrame = document.getElementById('blazorWebassembly');
                    iFrame.contentWindow.postMessage(vscodeInteropEvent, "http://localhost:5000");
                    break;
                }
                case "provideSlnPath": {
                    console.log("Command:provideSlnPath");
                    if(vscodeInteropEvent.result === undefined ||
                        vscodeInteropEvent.result === null) {
                        vscode.postMessage(vscodeInteropEvent);
                    }
                    else {
                        var iFrame = document.getElementById('blazorWebassembly');
                        iFrame.contentWindow.postMessage(vscodeInteropEvent, "http://localhost:5000");
                    }
                    break;
                }
                case "getCsproj": {
                    if(vscodeInteropEvent.result === undefined) {
                        vscode.postMessage(vscodeInteropEvent);
                    }
                    else {
                        var iFrame = document.getElementById('blazorWebassembly');
                        iFrame.contentWindow.postMessage(vscodeInteropEvent, "http://localhost:5000");
                    }
                    break;
                }
            }
        }
    }, false);
}());