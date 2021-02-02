(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener("message", (e) => {
        serializedJavascriptDto = e.data;

        try {
            var dtoDeserialized = JSON.parse(serializedJavascriptDto);

            if (dtoDeserialized.Command === "provideSlnPath") {
                vscode.postMessage(serializedJavascriptDto);
            }
            else if (e.data === "") {
    
            }
            else {
                var iFrame = document.getElementById('blazorWebassembly');
                iFrame.contentWindow.postMessage(e.data, "http://localhost:5000");
            }
        } catch (ex) {
            console.error(ex);
            return;
        }
    }, false);
}());