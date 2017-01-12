# angular-form-validator
AngularJS form validation directive
Inspired by https://github.com/turinggroup/angular-validator.

Live example: https://rasparac.github.io/angular-form-validator/
# Install
* Using bower and running `bower install angularjs-form-validator`

#TODO
- [ ] add more validation rules
- [ ] tests
- [ ] add on blur validation
- [x] minify

#How to add to the project
````html
	<script type="text/javascript" src="../bower_components/dist/angular-form-validator.js"></script>
````

````javascript
	angular.module('app', ['formValidator']);
````

#Code examples
Each input field must have [name] attribute. To use angularjs form validator just include formValidator into your project.
Attach a [validation] attribute to input.

##Simple form without options
In this example validator is going to check if the input field is filled.

````html
	<form ng-submit="demo.noOptionsFormSubmit()" novalidate name="noOptionsForm">
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
        <div class="form-group">
            <button
                ng-disabled="noOptionsForm.$invalid"
                class="btn btn-default btn-md btn-block">
                Submit
            </button>
        </div>
    </form>
````

##Validation options
You can set validation options via [validation-options] attribute. You just need to pass a JSON object with the options.

````javascript
    {
        above: true,
        customMessages: {
            pattern: 'You must enter \'username\'',
            required: 'Custom required message!',
            minlength: 'Custom to short message!',
            maxlength: 'Custom to long message',
            max: 'Custom max message',
            min: 'Custom min message'
        },
        parentElement: 'custom-parent-element',
        parentValidationClass: 'parent-element-custom-class'
        errorElementClass: 'error-element-custom-class',
        errorElement: 'custom-error-element'
    }
````

###HTML

````html
    <form ng-submit="demo.customOptionsFromSubmit()" novalidate name="customOptionsFrom">
        <div class="custom-parent-element">
            <div class="form-group">
                <label for="username">Username</label>
                <input
                    name="username"
                    validation
                    validation-options="{ 'parentElement: 'custom-parent-element', 'above': true, customMessages: { pattern: 'You must enter \'username\'', required: 'Custom required message!' }}"
                    required
                    ng-minlength="5"
                    ng-maxlength="10"
                    ng-pattern="/username/"
                    ng-model="demo.customOptionsFromData.username"
                    type="text"
                    class="form-control"
                    id="username"
                    placeholder="Username">
            </div>
        </div>
        <div class="form-group">
            <button
                ng-disabled="customOptionsFrom.$invalid"
                class="btn btn-default btn-md btn-block">
                Submit
            </button>
        </div>
    </form>
````

##Custom validation function
You can also pass a custom validation to the validator.
In the example below you can see how to add a custom validation to the validator.
Custom validation function must return an object with two params, isValid and message;
Example:

````javascript
    {
        isValid: true,
        message: 'Custom message!'
    }
````
### Javascript code
````javascript

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

##Async validation function
You can pass a async validation function to the validator.
Async function must return a promise. Documentation (https://docs.angularjs.org/guide/forms).
If you use async validation you should also use [async-message] attribute in which you can save the message.

### Javascript code

````javascript

    vm.asyncValidation = function() {
        return function(modelView, viewValue) {
            return users
                    .checkUsername(viewValue)
                    .then(success, error)
        }

        function success(response) {
            return true;
        }

        function error(error) {
            vm.asyncMessage = error;
            return $q.reject();
        }
    }

````

###HTML

````html

    <form ng-submit="demo.asyncFormValidationSubmit()" novalidate name="asyncForm">
        <div class="form-group">
            <label for="username">Username</label>
            <input
                name="username"
                validation
                async-validation="demo.asyncValidation()"
                async-message="demo.asyncMessage"
                required
                ng-model="demo.asyncFormFormData.username"
                type="text"
                class="form-control"
                id="username"
                placeholder="Username">
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