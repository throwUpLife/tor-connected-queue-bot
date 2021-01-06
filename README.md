# tor-connected-queue-bot
A bot based on minecraft-protocol connected to 2b2t over the tor network

## For the tor connection you ether have to have tor running or you can setup a tor proxy with docker

I use https://github.com/dperson/torproxy as docker tor proxy

## How to setup tor with docker
- Start the docker service
- Open a command promt and type in ```docker run -it -p 8118:8118 -p 9050:9050 -d dperson/torproxy```

You might have to put ```sudo``` infront of the command

You now have a tor proxy running on port 9050

## How to run the bot:
- git clone the repository
- run ```npm i```
- put your credentials in a file named ```secrets.json```
like this:

```json
{
  "username": "your username",
  "password": "your passowrd"
}
```

- run ```node index.js``` and the bot connects to 2b2t.org over the tor proxy
