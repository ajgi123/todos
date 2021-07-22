# Todo App

An application used to organize todos, built with React, Typescript and Firebase.

Used technologies:
- axios
- firebase 
- formik
- material-ui
- react error boundary
- react router
- react query 
- yup


## About the app

The application has all four basic operations of persistent storage (CRUD). You can create, read, update and delete your todos.
The app is using Firebase Rest API to interact with the database. To keep content from frontend and backend in sync I used react query to manage state, and Axios to fetch data.
App also has authorization, so each user has their todos. The authorization is implemented with Firebase Auth REST API. You can either login in, or sign up if you do not have an account already.
On login, the user can choose to make the app remember the user. The remember function to store the refresh token in local storage. 
Since storing the token in local storage can be dangerous, the user is notified of this danger in the tooltip. The better solution will be storing the token in an HTTP-only cookie, but firebase does not support this.
The app is using Axios interceptors. The interceptors for the request are making sure each request has the needed credentials (auth token).
The interceptors for response are looking for failed responses with 401 status (unauthorized). When the unauthorized response
is intercepted, the app refreshes the token and then makes the request with refreshed token so the user does not have login in again.

## Demo

<img src="https://media.giphy.com/media/UegEray7GgLKGJEo5Y/giphy.gif" title="Demo gif" width=100%/>

dummy accounts:

- email: dummy12345@mail.com password: 12345678
- email: dummy@mail.com password: 12345678

https://ajgi123.github.io/todos/

## Run Locally

Clone the project

```bash
  git clone https://github.com/ajgi123/todos
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


