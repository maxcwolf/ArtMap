## artMAP
A multi-user photograph geomapping iPhone app.

## Motivation
Have you ever wanted to see where all the best street art and graffiti was located in your city?  Now you can with artMAP!

Whenever I move to a new city, I love discovering where all the great art is located. Now you can share your discoveries, and if you're the artist, share your own creations with other art lovers.

## Screenshots
Will include logo/demo screenshot etc.

## Tech/framework used

<b>Built with</b>
- [Ionic v1](https://ionicframework.com/docs/v1/)
- [AngularJS](https://angularjs.org/)
- [Cordova](https://cordova.apache.org/)
- [Firebase](https://firebase.google.com/)
- [Sass](https://sass-lang.com/)
- [Gulp](https://gulpjs.com/)

## Features
- User authentication with Google's Firebase
- Use your phone's camera to take pictures of street art (Cordova native camera plugin)
- Geolocation of your phone (Cordova native geolocation plugin) at the time of the picture is uploaded to Firebase realtime database
- User inputed artist name and art title are uploaded to Firebase realtime database
- The photo is uploaded to Firebase storage
- Users can view a map of all the art uploaded by all users of the app. Pins are placed based on the stored geolocation of each picture. When clicked each pin shows a thumbnail of the photo with the title and artist, which when clicked navigate to a modal with a more detailed image.
- On the detailed image screen, users can upvote or downvote user postings (still working out some bugs).
- Users can see an instagram style list of their posts and delete each post.


## Installation


## How to use?
- Once you have the app running on your iPhone, register a new account by clicking the 'register' button on the home screen.
- Take new photos on the 'Camera' screen. Enter the artist's name and the name of the artwork and click 'Upload'. Your post will now be visible to all artMAP users.
- To look at all art posted to artMAP, go to the 'Map' screen. Touch on map markers to view each post. Tap on each pop up window to view the post in a full screen modal.
- To view the album of your posts, navigate to the 'Album' screen. There you can delete each of your posts.

## Future Plans
- Rewrite the app using React Native.
- Add the ability for users to comment on posts, with a possible upvote and downvote system.
- Facebook authentication and user profile images.
- Ability to plan an art trip which will navigate you along a path connecting the art pieces that you select.