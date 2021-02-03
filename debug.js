(function () {
    const vscode = acquireVsCodeApi();

    window.addEventListener("message", (e) => {
        let jsonIdentity = e.data;
        let payload = jsonIdentity.payload;
        let position = 0;
        let command = "";
        let message = "";

        while (position < payload.length) {
            if (payload[position] === ":") {
                position++;
                message = command.replace(command + ":", "");
                break;
            }

            command += payload[position];
        }

        console.log("Command: " + command);
        console.log("Message: " + message);

        // if (jsonIdentity.payload === "provideSlnPath") {
        //     vscode.postMessage(jsonIdentity);
        // }
        // else if (jsonIdentity.payload === "helloWorld") {
        //     console.log("Payload was helloWorld");
        //     jsonIdentity.payload = "Hello World! -Object Instance";

        //     var iFrame = document.getElementById('blazorWebassembly');
        //     iFrame.contentWindow.postMessage(jsonIdentity, "http://localhost:5000");
        // }
        // else if () {

        // }
        // else {
        //     var iFrame = document.getElementById('blazorWebassembly');
        //     iFrame.contentWindow.postMessage(jsonIdentity, "http://localhost:5000");
        // }
    }, false);
}());