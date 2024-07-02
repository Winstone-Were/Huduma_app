# HUDUMA: A Service Delivery Mobile Application
## Introduction
Huduma is a centralized service provision mobile application that connects users with verified local service providers, such as electricians,maids and plumbers. Traditional methods of finding service providers often lack credibility and traceability, leading to issues like theft, poor service, and property damage. Huduma addresses these challenges by requiring service providers to submit credentials and proof of identity for verification, ensuring that users are matched with qualified and trustworthy professionals. Additionally, the app features a rating system where users can rate their experience, helping to maintain high standards of service quality. Designed with simplicity and ease of use in mind, Huduma aims to cater to the diverse needs of the local community, enhancing service delivery and reliability in the local service industry.


## Installation
### Dependencies and Libraries 
* Node.js
* React Native
* Vite
* Firebase
* Google Maps API
* React Native Paper
* Expo 



## Installation steps
1. **Clone the repository:**
    ```bash
    git clone https://github.com/TijaniTatu/Huduma_app.git
    cd Huduma_app
    ```
2. **Install dependencies:**
    For the mobile app:

    ```bash
    cd ServicesApplicationFrontend
    npx expo install
    npm i
    ```

    For the server:

    ```bash
    cd Server
    npm i
    ```
    For the admin:

    ```bash
    cd Admin
    npm i
    ```

3. **Configure firebase:**
    * Create a firebase project through the console
    * Add the firebase config to the firebase.js file in the ServicesApplicationFrontend folder
  [Sample Firebase configuration found in project settings](https://github.com/TijaniTatu/huduma/assets/131201362/f1bdc2fc-8295-42d8-b246-025d85b87ccf)


## Usage Instructions
### How to Run the application:
* For the mobile app:
    ```bash
    cd ServicesApplicationFrontend
    npm start
    ```
* For the server:
    ```bash
    cd Server
    cd src
    node index.js
    ```
* For the admin:
    ```bash
    cd Admin
    npm start
    ````
### Usage Examples
Finding a Worker:
* Open the mobile app and login.
* go to the job screen.
* Pick the type of worker you need (e.g., electrician).
* Browse through the list of available workers.
* Click on the worker you want to hire.

Managing Users (Admin Panel):
* Open the admin panel in your browser.
* Use the sidebar to navigate to the "Users" tab.
*  Perform CRUD operations on user data.

### Input/Output
* Input: User details, job requests, worker profiles.
* Output: Matched workers, job confirmations, user management data

## Project Structure
```
huduma
├─ .git
│  ├─ description
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ logs
│  │  ├─ HEAD
│  │  └─ refs
│  │     ├─ heads
│  │     │  └─ main
│  │     └─ remotes
│  ├─ objects
│  │  
│  │   
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  └─ main
│     └─ tags
├─ .gitignore
├─ .vscode
│  └─ settings.json
├─ AdminFrontend
│  ├─ .gitignore
│  ├─ public
│  │  |_index.html
|  |  
│  ├─ README.md
│  └─ src
│     ├─ App.css
│     ├─ App.js
│     ├─ App.jsx
│     ├─ assets
│     ├─ components
│     ├─ index.css
│     ├─ index.js
│     ├─ main.jsx
│     └─ tabs
│        ├─ Complaints.js
│        ├─ Dashboard
│        ├─ JobsHistory.js
│        ├─ Settings.js
│        └─ Users
│           ├─ Users.js
│           └─ Workers.js
├─ package-lock.json
├─ README.md
├─ Server
│  ├─ .gitignore
│  ├─ middleware
│  │  └─ index.js
│  ├─ package-lock.json
│  ├─ package.json
│  └─ src
│     ├─ index.js
│     └─ manage_users.js
└─ ServicesApplicationFrontend
   ├─ .expo
   │  ├─ devices.json
   │  └─ README.md
   ├─ .gitignore
   ├─ Actions
   │  ├─ auth.js
   │  └─ type.js
   ├─ App.js
   ├─ app.json
   ├─ assets
   │  ├─ adaptive-icon.png
   │  ├─ animations
   ├─ components
   │  └─ CustomHeader.js
   ├─ eas.json
   ├─ firebaseConfig.js
   ├─ Index.js
   ├─ Navigation
   │  └─ AuthStack.js
   ├─ notifications
   │  ├─ expoPushToken.js
   │  ├─ LocalNotifications.js
   │  ├─ Messages.js
   │  └─ pushNotification.js
   ├─ package-lock.json
   ├─ package.json
   ├─ Reducers
   │  └─ auth.js
   ├─ Screens
   │  ├─ BuildProfile.js
   │  ├─ CustomerScreens
   │  │  ├─ Activity.js
   │  │  ├─ AskServiceScreen.js
   │  ├─ ForgotPassword.js
   │  ├─ Home.js
   │  ├─ Login.js
   │  ├─ NotificationScreen.js
   │  ├─ Register.js
   │  ├─ SettingScreens
   │  │  ├─ ChangeEmail.js
   │  │  ├─ ChangePassword.js
   │  │  └─ Settings.js
   │  ├─ SplashScreen.js
   │  ├─ VerifyPhone.js
   │  └─ WorkerScreens
   │     ├─ Activity.js
   │     ├─ JobRequests.js
   ├─ Services
   │  ├─ authService.js
   │  └─ stateService.js
   └─ Store
      └─ index.js

```

### Key Files
* ServicesApplicationFrontend/Navigation/AuthStack.js:   #Main entry point for the mobile application.
* admin/src/App.jsx: Main entry point for the admin panel.
* Server/src/index.js: Firebase cloud functions for backend logic.

## Known Issues
Some UI components may not render correctly on older devices.<br>
Firebase authentication may require additional configuration for certain providers.

## Acknowledgent
* [React Native Documentation](https://reactnative.dev/docs/getting-started)
* [Firebase Documentation](https://firebase.google.com/docs)
* [React Documentation](https://legacy.reactjs.org/docs/getting-started.html)
* [React Native Paper](https://reactnativepaper.com/)

## Contact Us
For questions or feedback, please open an issue on the GitHub repository or contact us at [HudumaApp@gmail.com].

