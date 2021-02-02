(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener("message", (e) => {
        switch (e.command) {
            case 'action':
                if (e.text === "promptSelectSolutionExplorer") {
                    vscode.postMessage({
                        command: 'action',
                        text: 'promptSelectSolutionExplorer'
                    });
                }
            case 'result':
                if (e.text === "promptSelectSolutionExplorer") {
                    var iFrame = document.getElementById('blazorWebassembly');
                    iFrame.contentWindow.postMessage({
                        command: "action",
                        text: 'promptSelectSolutionExplorer',
                        data: e.data
                    }, "http://localhost:5000");
                }
        }
    }, false);
}());