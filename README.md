# angular-form-validator
AngularJS form validation directive

# Install
* Using bower and running `bower install angular-form-validator`

#How to add to the project
````html
	<script type="text/javascript" src="../bower_components/ib-submit/ib-submit.js"></script>
````

````javascript
	angular.module('app', ['formValidator']);
````

#Code example
Each input field must have [name] attribute

#HTML

##Simple form without options

````html
	<form ng-submit="demo.noOptionsFormSubmit()" novalidate name="noOptionsForm">
        <div class="test-parent">
            <div class="form-group">
                <label for="username">Username</label>
                <input
                    name="username"
                    validation
                    required
                    ng-model="demo.noOptionsFormData.username"
                    type="text"
                    class="form-control"
                    id="username"
                    placeholder="Username">
            </div>
        </div>
        <div class="form-group">
            <label for="email">Email address</label>
            <input
                validation
                required
                name="email"
                ng-model="demo.noOptionsFormData.email"
                type="email"
                class="form-control"
                id="email"
                placeholder="Email">
            </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input
                validation
                required
                name="password"
                ng-model="demo.noOptionsFormData.password"
                type="password"
                class="form-control"
                id="password"
                placeholder="Password">
            </div>
        <div class="form-group">
            <button
                ng-disabled="noOptionsForm.$invalid"
                class="btn btn-default btn-md btn-block">
                Submit
            </button>
        </div>
    </form>
````

##Custom validation and options
Custom validation function must return object: 
````javascript
    {
        isValid: true or false
        message: ''
    }
````

## Javascript code
````javascript

    'use strict';

    angular
        .module('demo', ['formValidator'])

    angular
        .module('demo')
        .controller('DemoCtrl', DemoCtrl);

    function DemoCtrl(users, $q) {
        var vm = this;

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
    }
````

##HTML

````html
    <form ng-submit="demo.customValidationFromSubmit()" novalidate name="customValidationFrom">
        <div class="test-parent">
            <div class="form-group">
                <label for="username">Username</label>
                <input
                    name="username"
                    validation
                    validation-options="{ 'over': true, customMessages: { pattern: 'You must enter \'username\'', required: 'Custom required message!' }}"
                    required
                    ng-pattern="/username/"
                    ng-model="demo.customValidationFromData.username"
                    type="text"
                    class="form-control"
                    id="username"
                    placeholder="Username">
            </div>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input
                validation
                required
                ng-minlength="5"
                ng-maxlength="10"
                name="password"
                validation-options="{ 'over': true }"
                ng-model="demo.customValidationFromData.password"
                type="password"
                class="form-control"
                id="password"
                placeholder="Password">
        </div>
        <div class="form-group">
            <label for="password">Confirm Password</label>
            <input
                validation
                required
                name="confirmPassword"
                ng-minlength="5"
                ng-maxlength="10"
                validation-options="{ 'over': true, 'customMessages': { 'maxlength': 'Custom maxlength message!'} }"
                custom-validation="demo.customValidation(demo.customValidationFromData.confirmPassword)"
                ng-model="demo.customValidationFromData.confirmPassword"
                type="password"
                class="form-control"
                id="password"
                placeholder="Confirm Password">
        </div>
        <div class="form-group">
            <button
                ng-disabled="customValidationFrom.$invalid"
                class="btn btn-default btn-md btn-block">
                Submit
            </button>
        </div>
    </form>
````

##Async validation and parent element

## Javascript code
````javascript

    'use strict';

    angular
        .module('demo', ['formValidator'])

    angular
        .module('demo')
        .controller('DemoCtrl', DemoCtrl);

    function DemoCtrl(users, $q) {
        var vm = this;

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
````
````html
	<form ng-submit="demo.asyncFormValidationSubmit()" novalidate name="asyncForm">
        <div class="test-parent">
            <div class="form-group">
                <label for="username">Username</label>
                <input
                    name="username"
                    validation
                    validation-options="{ parentElement: 'test-parent' }"
                    async-validation="demo.asyncValidation()"
                    async-message="demo.asyncMessage"
                    required
                    ng-model="demo.asyncFormFormData.username"
                    type="text"
                    class="form-control"
                    id="username"
                    placeholder="Username">
            </div>
        </div>
        <div class="form-group">
            <button
                ng-disabled="asyncForm.$invalid"
                class="btn btn-default btn-block">
            Submit
            </button>
        </div>
    </form>
````