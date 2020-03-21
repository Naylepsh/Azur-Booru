# Scuffed clone of classic booru imageboards for Azur Lane related images

## Setup
### MongoDB Replica Sets Setup (for Windows)
* Move to this repository's main directory
* Create 3 subdirectories for mongoDB replica sets ```mkdir data/rs1 data/rs2 data/rs3```
* Run ```./db-setup.ps1``` to start up replica sets
### AzurBooru Setup:
* Copy [a relative link](.env.example) to ```.env``` within this directory
* Download dependencies with ```npm i```
* Change commands in package.json scripts to those suitable for your operating system
* Run ```npm start```

## Currently Supported Features
* Image posting / searching
* Comments
* Image / Comment rating