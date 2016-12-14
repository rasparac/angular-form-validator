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

        it('it should show valid form and 0 error messages', function () {
            var fillData = {
                'username': 'test username',
                'email': 'email',
                'pattern': 'testPattern'
            }
            var formObject = utils.form($scope.testForm);
            formObject.fillForm(fillData);
            formObject.checkInputFieldsValidation(inputFileds, true)
            expect($scope.testForm.$valid).toBe(true);
            utils.checkValidatioElementCount(form, 0);
        });

        it('it should show invalid form and error message', function() {
            var fillData = {
                'username': 'test username',
                'email': 'email',
                'pattern': 'test'
            }
            var formObject = utils.form($scope.testForm);
            formObject.fillForm(fillData);
            formObject.fillOutInputs(['username', 'email']);
            formObject.checkInputFieldsValidation(inputFileds, false);
            utils.checkValidatioElementCount(form, 3);
        });
    });

});