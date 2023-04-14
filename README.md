Hello, my name is Steph Beneschan and this is my submission for the first challenge of Lighthall's 2023 Software Engineering Super League.

## How to Use
* Please click on the large button labeled, "Click me!." The number of times that you have clicked during the current session will be displayed below the button.
* The application is connected to a database which tracks how many times a user in a given city has clicked the button. By default, the application will not ask for your location, and thus your clicks will not be registered in this database. To enable the system to log your clicks, please press the button labeled, "Share your click data."
* To view a table showing the number of clicks registered from each different city, please click on the "Retrieve world click data" button. The table is not updated in real time, so to refresh
the table, please press the "Update world click data" button.

## Resources Used
* In order to set up the application quickly, I used the official Create React App command, as described here:
https://github.com/facebook/create-react-app#readme.
* To obtain the name of the user's city from their device location, I programmed the application to use the Geoapify Reverse Geocoding API, described here:
https://www.geoapify.com/reverse-geocoding-api
* Click data for different cities is stored using a Firebase Realtime Database, as described here:
https://firebase.google.com/docs/database
