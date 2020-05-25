# Azurbooru

Azurbooru is an image board inspired by Danbooru and Gelbooru with Azur Lane related content in mind.

## Features

- Currently only basic functionality such as image posting, tag and commenting is available

## Installation

- Create Google Cloud bucket
- Download the app:

  ```
  git clone https://github.com/Naylepsh/Azur-Booru
  cd Azur-Booru
  ```

- Configure .env

  ```
  cp example.env .env
  edit .env
  ```

- Change command seperators in package.json script if using other OS than Windows
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
