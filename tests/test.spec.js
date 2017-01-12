describe('validator', function () {

    beforeEach(module('formValidator'));
    var $compile;
    var $rootScope;

    beforeEach(inject(function(_$rootScope_, _$compile_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    describe('simple validation without options', function () {
        var form;
        var $scope;
        var inputFileds;
        beforeEach(inject(function() {
            var fromTemplate = [
                '<form name="testForm">',
                '   <div class="parent-element"><input type="text" required validation name="fullname" ng-model="data.fullname"></div>',
                '   <div class="parent-element"><input ng-minlength="5" ng-maxlength="15" validation name="username" ng-model="data.username"></div>',
                '   <div class="parent-element"><input type="email" validation name="email" ng-model="data.email"></div>',
                '   <div class="parent-element"><input ng-pattern="/testPattern/" validation name="pattern" ng-model="data.pattern"></div>',
                '   <div class="parent-element"><input type="number" max="18" min="5" validation name="age" ng-model="data.age"></div>',
                '   <button ng-disabled="testForm.$invalid">Submit</button>',
                '</from>'
            ].join('\n');
            $scope = $rootScope.$new();
            form = angular.element(fromTemplate);
            form = $compile(form)($scope);
            inputFileds = ['fullname', 'username', 'email', 'pattern', 'age'];
            $scope.data = {};
            $scope.$apply();
        }));

        it('it should show valid form and 0 error messages', function () {
            var fillData = {
                'fullname': 'igor borovica',
                'username': 'test name',
                'email': 'test@net.hr',
                'pattern': 'testPattern',
                'age': 15
            }
            expect(utils.getElementBySelector(form, 'button').disabled).toBe(true);
            var formObject = utils.form($scope.testForm);
            formObject.fillForm(fillData);
            formObject.checkInputFieldsValidation(inputFileds, true)
            expect($scope.testForm.$valid).toBe(true);
            utils.checkValidatioElementCount(form, 0);
            expect(utils.getElementBySelector(form, 'button').disabled).toBe(false);
        });

        it('it should show invalid form and 5 error messages', function() {
            var fillData = {
                'fullname': 'igor borovica',
                'username': 'test',
                'email': 'test',
                'pattern': 'test',
                'age': 4
            }
            var formObject = utils.form($scope.testForm);
            formObject.fillForm(fillData);
            formObject.fillOutInputs(['fullname']);
            
            formObject.checkInputFieldsValidation(inputFileds, false);
            utils.checkValidatioElementCount(form, 5);
            expect(utils.getElementBySelector(form, 'button').disabled).toBe(true);
        });

        it('should show valid error text messages', function() {
            var fillData = {
                'fullname': 'test',
                'username': 'igor validator borovica',
                'age': 99,
                'email': 'test',
                'pattern': 'test'
            }
            var formObject = utils.form($scope.testForm);
            formObject.fillForm(fillData);
            formObject.fillOutInputs(['fullname']);
            var errorDivs = utils.getElementsBySelector(form, '.with-errors');
            expect(errorDivs[0].innerHTML).toEqual('This field is required!');
            expect(errorDivs[1].innerHTML).toEqual('This field cannot be longer 15 than characters!');
            expect(errorDivs[2].innerHTML).toEqual('This filed should be email!');
            expect(errorDivs[3].innerHTML).toEqual('Wrong pattern! Please enter /testPattern/.');
            expect(errorDivs[4].innerHTML).toEqual('Please enter a value less than or equal to 18.');
            expect(utils.getElementBySelector(form, 'button').disabled).toBe(true);
            formObject.fillOutInputs(['username', 'age']);
            fillData.username = 'igor';
            fillData.age = 4;
            formObject.fillForm(fillData);

            var errorDivs = utils.getElementsBySelector(form, '.with-errors');
            expect(errorDivs[0].innerHTML).toEqual('This field must have at least 5 characters!');
            expect(errorDivs[3].innerHTML).toEqual('Please enter a value greater than or equal to 5.');
        });
    });

    describe('simple validation with options', function() {
        var form;
        var $scope;
        var inputFileds;

        beforeEach(inject(function() {
            var fromTemplate = [
                '<form name="testForm">',
                '   <div class="test-custom-parent">',
                '       <div class="parent-element">',
                '           <input validation-options="validationOptions.customParentElement" type="text" required validation name="fullname" ng-model="data.fullname">',
                '       </div>',
                '   </div>',
                '   <div class="parent-element">',
                '       <input ng-minlength="5" ng-maxlength="15" validation-options="validationOptions.customLengthMessages" validation name="username" ng-model="data.username">',
                '   </div>',
                '   <div class="parent-element"><input validation-options="validationOptions.customEmailMessage" type="email" validation name="email" ng-model="data.email"></div>',
                '   <div class="parent-element"><input  validation-options="validationOptions.customErrorElement" ng-pattern="/testPattern/" validation name="pattern" ng-model="data.pattern"></div>',
                '   <div class="parent-element"><input type="number" validation-options="validationOptions.errorMessageAbove" max="18" min="5" validation name="age" ng-model="data.age"></div>',
                '   <button ng-disabled="testForm.$invalid">Submit</button>',
                '</from>'
            ].join('\n');
            $scope = $rootScope.$new();
            $scope.validationOptions = {
                customParentElement: {
                    parentElement: 'test-custom-parent',
                    parentValidationClass: 'parent-element-custom-class',
                    customMessages: {
                        required: 'Custom required message.'
                    }
                },
                customLengthMessages : {
                    customMessages: {
                        minlength: "Custom minlength message.",
                        maxlength: "Custom maxlength message."
                    }
                },
                customEmailMessage: {
                    customMessages: {
                        email: "Custom email message."
                    }
                },
                customErrorElement: {
                    errorElementClass: "error-element-custom-class",
                    errorElement: "p"
                },
                errorMessageAbove: {
                    above: true
                }
            }
            form = angular.element(fromTemplate);
            form = $compile(form)($scope);
            inputFileds = ['fullname', 'username', 'email', 'pattern', 'age'];
            $scope.data = {};
            $scope.$apply();
        }));

        it('should test parent element, parent element custom class and required custom message', function() {
            var fillData = {
                'fullname': 'igor borovica',
            }
            var formObject = utils.form($scope.testForm);
            formObject.fillForm(fillData);
            formObject.fillOutInputs(['fullname']);
            var customParent = utils.getElementBySelector(form, '.test-custom-parent');
            var errorDiv = utils.getElementBySelector(form, '.with-errors');
            expect(customParent.className).toEqual('test-custom-parent parent-element-custom-class');
            expect(errorDiv.innerHTML).toEqual('Custom required message.');
            expect(utils.getElementBySelector(form, 'button').disabled).toBe(true);
        });

        it('should test custom length messages', function() {
            var fillData = {
                'username': 'testing maxlength message',
            }
            var formObject = utils.form($scope.testForm);
            formObject.fillForm(fillData);
            var errorMaxLengthDiv = utils.getElementBySelector(form, '.with-errors');
            expect(errorMaxLengthDiv.innerHTML).toEqual('Custom maxlength message.');
            expect(utils.getElementBySelector(form, 'button').disabled).toBe(true);

            formObject.fillOutInputs(['username']);
            fillData.username = "min";
            formObject.fillForm(fillData);
            var errorMinLengthDiv = utils.getElementBySelector(form, '.with-errors');
            expect(errorMinLengthDiv.innerHTML).toEqual('Custom minlength message.');
            expect(utils.getElementBySelector(form, 'button').disabled).toBe(true);
        });

        it('should test custom email message', function() {
            var fillData = {
                'email': "test email"
            }
            var formObject = utils.form($scope.testForm);
            formObject.fillForm(fillData);
            var errorEmailDiv = utils.getElementBySelector(form, '.with-errors');
            expect(errorEmailDiv.innerHTML).toEqual('Custom email message.');
            expect(utils.getElementBySelector(form, 'button').disabled).toBe(true);
        });

        it('should test custom error element and class', function() {
            var fillData = {
                'pattern': "test"
            }
            var formObject = utils.form($scope.testForm);
            formObject.fillForm(fillData);
            var errorParagraph = utils.getElementBySelector(form, 'p');
            expect(angular.element(errorParagraph).length).toBe(1);
            expect(errorParagraph.className).toEqual('error-element-custom-class');
            expect(utils.getElementBySelector(form, 'button').disabled).toBe(true);
        });

        it('should test error message position (above input element)', function() {
            var fillData = {
                age: 4
            }
            var formObject = utils.form($scope.testForm);
            formObject.fillForm(fillData);
            var divErrorElement = utils.getElementBySelector(form, '.has-error');
            expect(divErrorElement.children[0].innerHTML).toEqual('Please enter a value greater than or equal to 5.');
            expect(divErrorElement.children[1].tagName).toEqual('INPUT');
            expect(utils.getElementBySelector(form, 'button').disabled).toBe(true);
        });

    });

});