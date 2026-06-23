sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Javascript fetches updated data.json and updates the webpage
    deactivate server

    Note left of server: The server code pushes the note into data.json and Javascript code dynamically updates the website, preventing any URL redirects

