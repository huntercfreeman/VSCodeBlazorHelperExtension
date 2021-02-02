(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener("message", (e) => {
        if (e.data === "provideSlnPath") {
            vscode.postMessage("provideSlnPath");
        }
        else if(e.data === "") {

        }
        else {
            var iFrame = document.getElementById('blazorWebassembly');
            iFrame.contentWindow.postMessage(e.data, "http://localhost:5000");
        }
    }, false);
}());