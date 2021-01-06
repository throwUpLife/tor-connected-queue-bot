# tor-connected-queue-bot
A bot based on minecraft-protocol connected to 2b2t over the tor network

For the tor connection you can either run a tor service on your machine or setup a tor proxy with docker

I use https://github.com/dperson/torproxy as a docker tor proxy

## How to set up tor with docker
- Start the docker service
- Open a command prompt and type in ```docker run -it -p 8118:8118 -p 9050:9050 -d dperson/torproxy```

You might have to put ```sudo``` in front of the command

You now have a tor proxy running on port 9050

