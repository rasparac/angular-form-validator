(function() {
    'use strict';

    angular
        .module('demo', ['formValidator'])

    angular
        .module('demo')
        .controller('DemoCtrl', DemoCtrl);

    DemoCtrl.$inject = ['users', '$q'];

    function DemoCtrl(users, $q) {
        var vm = this;
        
        vm.noOptionsFormData = {};
        vm.customValidationFromData = {};
        vm.asyncFormFormData = {};

        vm.noOptionsFormSubmit = function() {
            alert(JSON.stringify(vm.noOptionsFormData));
        }

        vm.customValidationFromSubmit = function() {
            alert(JSON.stringify(vm.customValidationFromData));
        }

        vm.asyncFormValidationSubmit = function() {
            alert(JSON.stringify(vm.asyncFormFormData));
        }

        vm.customValidation = function(confirmPassword) {
            var customValidationObj = {
                isValid: true,
                message: ''
            };

            if (!confirmPassword) return customValidationObj;

            if (vm.customValidationFromData.password != confirmPassword) {
                customValidationObj.isValid = false;
                customValidationObj.message = 'Passwords must match!';
            }

            return customValidationObj;
        }

        vm.asyncValidation = function() {
            return function(modelView, viewValue) {
                return users.checkUsername(viewValue).then(function(resp) {
                    return true;
                }, function(error) {
                    vm.asyncMessage = error;
                    return $q.reject();
                })
            }
        }
    }

    angular
        .module('demo')
        .factory('users', users);

    users.$inject = ['$q']

    function users($q) {
        var service = {
            checkUsername: checkUsername
        }
        var users = [
            {
                "username": "igor"
            },
            {
                "username": "john"
            },
            {
                "username": "steven"
            },
            {
                "username": "mark"
            },
        ];

        return service;

        function checkUsername(name) {
            var deferred = $q.defer();
            setTimeout(function() {
                users.forEach(function(u) {
                    if (u.username === name) {
                        deferred.reject("User name already taken!");
                    }
                })
                deferred.resolve();
            }, 0)
            return deferred.promise; 
        }
    }

})();