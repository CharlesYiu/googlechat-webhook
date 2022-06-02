# [Google Chat](https://chat.google.com) webhook experiment
This node [script](https://github.com/charlesyiu/googlechat-webhook/blob/main/webhook.js) reads json files (like [this](https://github.com/charlesyiu/googlechat-webhook/blob/main/messages.json)) and executes the contents.

# Script
## Run
The script can be ran with node with arguments of the files you want to execute with.
```
$ node webhook.js messages.json
```
## Automatically find files
The script can automatically find json files to execute.  
(note that it will execute the first one it finds without "-all" included)
```
$ node webhook.js -all <--optional
```
# JSON
## People
The json files are designed to be readable by assigning names to webhooks and referencing it in messages.
```JSON
{
    "people": {
        "charles": "<charles's webhook url>"
    }
    "messages": [
        {
            "person": "charles"
            ...
        }
        ...
    ]
}
```
## Messages
To send messages, you will have to append an object with at least a person and text to send included.
```JSON
{
    ...
    "messages": [
        {
            "person": "charles",
            "text": "hello"
            ...
        }
        ...
    ]
}
```
## Timing
This script supports delaying when the messages are sent in seconds.  
(The wait starts when the previous message's request was finished)
```JSON
{
    ...
    "messages": [
        {
            ...
            "wait": 1
        }
        ...
    ]
}
```