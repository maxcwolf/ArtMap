'use strict';
angular.module('app')
    .service('FileService', function ($log, $q) {

        // Public

        this.convertFileUriToInternalURL = convertFileUriToInternalURL;

        // Private

        // Converts File URI to proper Internal URL that will be used
        // to display local device images while being in LiveReload mode
        function convertFileUriToInternalURL(fileUri) {

            var deferred = $q.defer();

            // Here we use cordova file plugin that resolves fileEntry from fileUri
            window.resolveLocalFileSystemURL(fileUri, onFileResolved, onFileResolveError);

            // This callback used in conjunction with window.resolveLocalFileSystemURL (see above)
            function onFileResolved(fileEntry) {

                deferred.resolve(fileEntry.toInternalURL());
            }

            // This callback used in conjunction with window.resolveLocalFileSystemURL (see above)
            function onFileResolveError() {

                deferred.reject();
            }

            return deferred.promise;
        }

    });