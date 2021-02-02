(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener("message", (e) => {
        if (e.data === "provideSlnPath") {
            vscode.postMessage("provideSlnPath");
        }
        else {
            var iFrame = document.getElementById('blazorWebassembly');
            iFrame.contentWindow.postMessage("Hello from parent", "http://localhost:5000");
        }
    }, false);
}());