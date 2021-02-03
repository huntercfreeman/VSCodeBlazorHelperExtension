(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener("message", (e) => {
        let vscodeInteropEvent = e.data;

        if(vscodeInteropEvent.command !== undefined &&
            vscodeInteropEvent.command !== null) {

            switch(vscodeInteropEvent.command) {
                case helloWorld: {
                    // TODO: fill in
                    break;
                }
                case provideSlnPath: {
                    // TODO: fill in
                    break;
                }
                case getCsproj: {
                    // TODO: fill in
                    break;
                }
            }
        }



        if (jsonIdentity.payload === "provideSlnPath") {
            vscode.postMessage(jsonIdentity);
        }
        else if (jsonIdentity.payload === "helloWorld") {
            console.log("Payload was helloWorld");
            jsonIdentity.payload = "Hello World! -Object Instance";

            var iFrame = document.getElementById('blazorWebassembly');
            iFrame.contentWindow.postMessage(jsonIdentity, "http://localhost:5000");
        }
        else if (jsonIdentity.payload === "getProjectFiles") {
            vscode.postMessage(jsonIdentity);
        }
        else {
            var iFrame = document.getElementById('blazorWebassembly');
            iFrame.contentWindow.postMessage(jsonIdentity, "http://localhost:5000");
        }
    }, false);
}());