angular
.module("app")
.factory("CameraFactory", function ($http) {
    return Object.create(null, {
        "cache": {
            value: null,
            writable: true
        },
        "addImg": {
            value: function (employee) {
                return $http({
                    method: "POST",
                    url: "https://angular-employees-6727b.firebaseio.com/employees/.json",
                    data: {
                        "firstName": employee.firstName,
                        "lastName": employee.lastName,
                        "employmentStart": Date.now(),
                        "employmentEnd": 0
                    }
                })
            }
        },
        "remove": {
            value: function (key) {
                return $http({
                    method: "DELETE",
                    url: `https://angular-employees-6727b.firebaseio.com/employees/${key}/.json`
                })
            }
        },
        "replace": {
            value: function (employee, key) {
                employee.employmentEnd = Date.now()

                return $http({
                    method: "PUT",
                    url: `https://angular-employees-6727b.firebaseio.com/employees/${key}/.json`,
                    data: employee
                })
            }
        }
    })
})