## artMAP
A multi-user photograph geomapping iPhone app.

## Motivation
Have you ever wanted to see where all the best street art and graffiti was located in your city?  Now you can with artMAP!

Whenever I moved to a new city, I love discovering where all the great art is located.

## Screenshots
Include logo/demo screenshot etc.

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


## Code Example
Show what the library does as concisely as possible, developers should be able to figure out **how** your project solves their problem by looking at the code example. Make sure the API you are showing off is obvious, and that your code is short and concise.

## Installation
Provide step by step series of examples and explanations about how to get a development env running.

## How to use?
If people like your project they’ll want to learn how they can use it. To do so include step by step guide to use your project.

## Contribute

Let people know how they can contribute into your project. A [contributing guideline](https://github.com/zulip/zulip-electron/blob/master/CONTRIBUTING.md) will be a big plus.

## Credits
Give proper credits. This could be a link to any repo which inspired you to build this project, any blogposts or links to people who contrbuted in this project.

## Future Plans
- Add the ability for users to comment on posts, with a possible upvote and downvote system.
- Facebook authentication and user profile images.
- Ability to plan an art trip which will navigate you along a path connecting the art pieces that you select.

## License
MIT © [Max Wolf]()