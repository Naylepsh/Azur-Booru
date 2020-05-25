# Azurbooru

Azurbooru is an image board inspired by Danbooru and Gelbooru with Azur Lane related content in mind.

## Features

- Currently only basic functionality such as image posting, tagging and commenting is available

## Installation

- Create Google Cloud bucket and download auth file
- Download the app:

  ```
  git clone https://github.com/Naylepsh/Azur-Booru
  cd Azur-Booru
  ```

- Set up server

  - `cd server`

  - Configure .env (remember to link your google cloud auth file)

    ```
    cp example.env .env
    edit .env
    ```

  - Change command seperators in package.json script if using other OS than Windows
  - Install packages
    `npm install`
  - Run the app
    `npm start`

- Set up client side
  - `cd client`
  - Install packages
    `npm install`
  - Run the app
    `npm start`

## Screenshots

Post list:
![](https://i.imgur.com/uSQj1jp.jpg)

Post view:
![](https://i.imgur.com/PoVGNbr.jpg)

Post comments:
![](https://i.imgur.com/YITnEmC.png)
