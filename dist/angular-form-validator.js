(function() {
    'use strict';

    angular
        .module('formValidator', [])
        .directive('validation', validation);

    validation.$inject = ['validation'];

    function validation(validationProvider) {
        var directive = {
            restrict: 'A',
            require: '^form',
            link: link
        };

        return directive;

        function link(scope, elem, attr, formCtrl) {
            var customValidation;
            var asyncValidation;
            var element = elem[0];
            var attributeName = element.getAttribute('name');
            var elementCtrl = formCtrl[attributeName];
            var parentElement = elem.parent();
            var options = angular.extend({ 
                above: false,
                parentValidationClass: 'has-error',
                parentElement: false,
                errorElement: 'div',
                errorElementClass: 'help-block with-errors'
                }, scope.$eval(attr.validationOptions))

            scope.$watch(checkActiveElement, handleValidations)

            function checkActiveElement() {
                return elementCtrl.$valid + element.value + checkCustomValidation();
            }

            function handleValidations(newVal, oldVal) {
                if (options.parentElement) {
                    parentElement = angular.element(findParentElement(element, options.parentElement));

                    if (parentElement.length == 0) {
                        throw Error("There is no parent element for " + attributeName + " input with the " + options.parentElement + " class.");
                    }
                }

                checkIsThereValidationMessage(parentElement);
                checkCustomValidation();
                checkAsyncValidation();

                if (elementCtrl.$dirty && elementCtrl.$valid === false) {
                    if (options.above) {
                        angular.element(parentElement).prepend(getError());
                    } else {
                        angular.element(parentElement).append(getError());
                    }
                    parentElement.addClass(options.parentValidationClass);
                } else {
                    parentElement.removeClass(options.parentValidationClass);
                }
            }
            
            function checkCustomValidation() {
                if ('custom-validation' in element.attributes) {
                    customValidation = scope.$eval(attr.customValidation);
                    elementCtrl.$setValidity('customValidation', customValidation.isValid);
                    return customValidation.isValid;
                }
            }

            function checkAsyncValidation(test) {
                if ('async-validation' in element.attributes) {
                    asyncValidation = scope.$eval(attr.asyncValidation);
                    elementCtrl.$asyncValidators[attributeName + "_async"] = asyncValidation;
                }
            }

            function getError() {
                var message = validationProvider.defaultMessages[getCurrentError()];

                if (options.customMessages && options.customMessages[getCurrentError()]) {
                    message = options.customMessages[getCurrentError()];
                }

                if (typeof message == 'function') {
                    message = message(attr[getCurrentError()]);
                }

                if (getCurrentError() === 'customValidation') {
                    message = customValidation.message;
                }

                if (getCurrentError() === attributeName + '_async') {
                    message = scope.$eval(attr.asyncMessage);
                }

                return createMessageElement(message);
            }

            function createMessageElement(message) {
                var errorElement = document.createElement(options.errorElement);
                errorElement.setAttribute('class', options.errorElementClass);
                errorElement.innerHTML = message;
                return errorElement;
            }

            function getCurrentError() {
                return Object.keys(elementCtrl.$error)[0];
            }

            function checkIsThereValidationMessage(element) {
                var childs = element.children();    
                for (var i = 0; i < childs.length; i++) {
                    if (angular.element(childs[i]).hasClass(options.errorElementClass)) {
                        angular.element(childs[i]).remove();
                    }
                }
            }
        }

        function findParentElement(elem, elementClass) {
            while ((elem = elem.parentElement) && !elem.classList.contains(elementClass));
            return elem;
        }
    }

    angular
        .module('formValidator')
        .provider('validation', validationProvider);

    function validationProvider() {
        var self = this;

        self.email = 'This filed should be email!';
        self.required = 'This field is required!';
        self.minlength = 'This field must have at least $value characters!';
        self.maxlength = 'This field cannot be longer $value than characters!';
        self.pattern = 'Wrong pattern! Please enter $value.';
        self.max = 'Please enter a value less than or equal to $value.';
        self.min = 'Please enter a value greater than or equal to $value.';

        self.replaceVariable = '$value';

        self.defaultMessages = {
            required: required,
            minlength: minlength,
            maxlength: maxlength,
            pattern: pattern,
            email: email,
            max: max,
            min:min
        }

        self.setDefaultMessages = function(messages) {
            if (!isObject(messages)) {
                console.error("Please provide key:value object. Example: { 'required': 'required text' }");
            }
            for (var message in messages) {
                self[message] = messages[message];
            }
        }

        function isObject(obj) {
            return Object.prototype.toString.call(obj) === '[object Object]' && typeof obj === 'object';
        }

        function required() {
            return self.required;
        }

        function email() {
            return self.email;
        }

        function minlength(length) {
            return self.minlength.replace(self.replaceVariable, length);
        }

        function maxlength(length) {
            return self.maxlength.replace(self.replaceVariable, length);
        }

        function pattern(regex) {
            return self.pattern.replace(self.replaceVariable, regex);
        }

        function max(max) {
            return self.max.replace(self.replaceVariable, max);
        }

        function min(min) {
            return self.min.replace(self.replaceVariable, min);
        }

        self.$get = function() {
            return self;
        }
    }
})();