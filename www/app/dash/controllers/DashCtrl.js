angular.module('app')
    .controller('DashCtrl', function ($scope) {

        //get firebase user data from local storage
        const userKey = Object.keys(window.localStorage)
            .filter(it => it.startsWith('firebase:authUser'))[0];
        //get all the user info as an object
        const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;
        //get just the uid of the user
        $scope.user = user
        console.log($scope.user)

})