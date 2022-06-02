import fetch from "node-fetch"
import files from "fs"

function handleJSONFile(file) {
    files.readFile(file, function(err, data) {
        if (err !== null) throw err

        const messageFile = JSON.parse(data.toString())

        function processMessage(index) {
            const message = messageFile.messages[index]

            if (!Object.keys(messageFile.people).includes(message.person)) throw Error(`${index + 1} | ${file}: the person '${message.person}' is undefined`)
            if (message.text === "") throw Error(`${index + 1} | ${file}: the text is undefined`)

            function sendMessage() {
                fetch(messageFile.people[message.person], {
                    body: JSON.stringify({"text": message.text}),
                    method: "POST",
                    headers: {"Content-Type": "application/json; charset=UTF-8"}
                })
                    .then(response => {
                        console.log(`${index + 1} | ${file} - ${message.person}: ${message.text}`)

                        if (messageFile.messages.length > index + 1) processMessage(index + 1)
                        else console.log(`${file}: done`)
                    })
            }

            if ((typeof message.wait) !== "undefined") {
                console.log(`${index + 1} | ${file}: waiting for ${message.wait} seconds`)
                setTimeout(() => {
                    console.log(`${index + 1} | ${file}: finished waiting for ${message.wait} seconds`)
                    sendMessage()
                }, message.wait * 1000)
            } else sendMessage()
        }

        console.log(`${file}: starting`)
        if (messageFile.messages.length > 0) processMessage(0)
        else console.log(`${file}: done`)
    })
}

const messageFiles = process.argv.slice(2)
if (messageFiles.length === 0 || messageFiles.includes("-all")) {
    files.readdir("./", function(err, files) {
        if (err !== null) throw err
    
        const _messageFiles = files.filter(file => file.endsWith(".json"))
        if (_messageFiles.length === 0) throw Error("script: no json files in ./ and no json file is provided")
        
        if (!_messageFiles.includes("-all")) handleJSONFile(_messageFiles[0])
        else _messageFiles.forEach((_messageFile) => handleJSONFile(_messageFile))
    })
} else messageFiles.forEach(function(messageFile) {
    if (!messageFile.endsWith(".json")) throw Error(`script: ${messageFile} is not a json file`)

    handleJSONFile(messageFile)
})
