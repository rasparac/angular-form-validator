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
                '   <div class="parent-element"><input required validation name="username" ng-model="data.username"></div>',
                '   <div class="parent-element"><input required ng-minlength="5" ng-maxlength="10" validation name="email" ng-model="data.email"></div>',
                '   <div class="parent-element"><input ng-pattern="/testPattern/" validation name="pattern" ng-model="data.pattern"></div>',
                '</from>'
            ].join('\n');
            $scope = $rootScope.$new();
            form = angular.element(fromTemplate);
            form = $compile(form)($scope);
            inputFileds = ['username', 'email', 'pattern'];
            $scope.data = {};
            $scope.$apply();
        }));

        function inputFieldsExpectedValue(value) {
            inputFileds.forEach(function(input) {
                expect($scope.testForm[input].$valid).toBe(value);
            });
        }

        it('it should show valid form and 0 error messages', function () {
            $scope.testForm.username.$setViewValue('test username');
            $scope.testForm.email.$setViewValue('email');
            $scope.testForm.pattern.$setViewValue('testPattern');

            inputFieldsExpectedValue(true)
            expect($scope.testForm.$valid).toBe(true);
            expect(form.hasClass('ng-valid-required')).toBe(true);
            expect(form.hasClass('ng-valid-minlength')).toBe(true);
            expect(form.hasClass('ng-valid-maxlength')).toBe(true);
            expect(form.hasClass('ng-valid-pattern')).toBe(true);
            expect(form[0].querySelectorAll('.with-errors').length).toEqual(0);
            expect(form[0].querySelectorAll('.has-error').length).toEqual(0);
        });

        it('it should show invalid form and error message', function() {
            $scope.testForm.username.$setViewValue('test username');
            $scope.testForm.email.$setViewValue('email');
            $scope.testForm.pattern.$setViewValue('test');
            $scope.testForm.username.$setViewValue('');
            $scope.testForm.email.$setViewValue('');
            inputFieldsExpectedValue(false);
        });
    });

});