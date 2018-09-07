// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig:{
    apiKey: 'AIzaSyDuI-HO0b6l9sGWxGd2F2rwm8QY7HPXGzY',
   authDomain: 'qagradchat.firebaseapp.com',
   databaseURL: 'https://qagradchat.firebaseio.com',
   projectId: 'qagradchat',
   storageBucket: 'gs://qagradchat.appspot.com',
   messagingSenderId: '516171894511'
  }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
