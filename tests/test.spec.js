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
            var formObject = utils.form($scope.testForm);
            formObject.fillForm(fillData);
            formObject.checkInputFieldsValidation(inputFileds, true)
            expect($scope.testForm.$valid).toBe(true);
            utils.checkValidatioElementCount(form, 0);
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
            formObject.fillOutInputs(['username', 'age']);
            fillData.username = 'igor';
            fillData.age = 4;
            formObject.fillForm(fillData);

            var errorDivs = utils.getElementsBySelector(form, '.with-errors');
            expect(errorDivs[0].innerHTML).toEqual('This field must have at least 5 characters!');
            expect(errorDivs[3].innerHTML).toEqual('Please enter a value greater than or equal to 5.');
        });
    });

});