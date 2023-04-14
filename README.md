Hello, my name is Steph Beneschan and this is my submission for the first challenge of Lighthall's 2023 Software Engineering Super League.

## Resources Used
* In order to set up the application quickly, I used the official Create React App command, as described here:
https://github.com/facebook/create-react-app#readme.
* To obtain the name of the user's city from their device location, I programmed the application to use the Geoapify Reverse Geocoding API, described here:
https://www.geoapify.com/reverse-geocoding-api
* Click data for different cities is stored using a Firebase Realtime Database, as described here:
https://firebase.google.com/docs/database

## Notes
* The application is currently unable to distinguish between different cities with the same name (for instance, Paris, France and Paris, Texas are treated as being the same city)
* The application's integration with Firebase and Geoapify relies on data in the src/api-keys.json file. For your convenience, 
* 