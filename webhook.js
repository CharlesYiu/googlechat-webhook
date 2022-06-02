import fetch from "node-fetch"
import files from "fs"

function handleJSONFile(file) {
    files.readFile(file, function(err, data) {
        if (err !== null) throw err

        const messageFile = JSON.parse(data.toString())
        
        function processWebhook(index, person, text) {
            if (!Object.keys(messageFile.people).includes(person)) throw Error(`the person '${person}' is undefined`)

            fetch(messageFile.people[person], {
                body: JSON.stringify({"text": text}),
                method: "POST",
                headers: {"Content-Type": "application/json; charset=UTF-8"}
            })
                .then(response => { if (messageFile.messages.length > index + 1) processMessage(index + 1) })
        }
        function processMessage(index) {
            const message = messageFile.messages[index]

            if ((typeof message.timeout) === "undefined") processWebhook(index, message.person, message.text)
            else setTimeout(() => processWebhook(index, message.person, message.text), message.wait * 1000)
        }

        if (messageFile.messages.length > 0) processMessage(0)
    })
}

const messageFiles = process.argv.slice(2)
if (messageFiles.length === 0 || messageFiles.includes("-all")) {
    files.readdir("./", function(err, files) {
        if (err !== null) throw err
    
        const _messageFiles = files.filter(file => file.endsWith(".json"))
        if (_messageFiles.length === 0) throw Error("no json files in ./ and no json file is provided")
        
        if (!_messageFiles.includes("-all")) handleJSONFile(_messageFiles[0])
        else _messageFiles.forEach((_messageFile) => handleJSONFile(_messageFile))
    })
} else messageFiles.forEach(function(messageFile) {
    if (!messageFile.endsWith(".json")) throw Error(`${messageFile} is not a json file`)

    handleJSONFile(messageFile)
})