(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener("message", (e) => {
        let vscodeInteropEvent = e.data;

        if (vscodeInteropEvent.command !== undefined &&
            vscodeInteropEvent.command !== null) {

            switch (vscodeInteropEvent.command) {
                case helloWorld: {
                    console.log("Payload was helloWorld");
                    jsonIdentity.payload = "Hello World! -Object Instance";

                    var iFrame = document.getElementById('blazorWebassembly');
                    iFrame.contentWindow.postMessage(jsonIdentity, "http://localhost:5000");
                    break;
                }
                case provideSlnPath: {
                    if(vscodeInteropEvent.result === undefined) {
                        vscode.postMessage(vscodeInteropEvent);
                    }
                    else {
                        var iFrame = document.getElementById('blazorWebassembly');
                        iFrame.contentWindow.postMessage(jsonIdentity, "http://localhost:5000");
                    }
                    break;
                }
                case getCsproj: {
                    if(vscodeInteropEvent.result === undefined) {
                        vscode.postMessage(vscodeInteropEvent);
                    }
                    else {
                        var iFrame = document.getElementById('blazorWebassembly');
                        iFrame.contentWindow.postMessage(jsonIdentity, "http://localhost:5000");
                    }
                    break;
                }
            }
        }
    }, false);
}());