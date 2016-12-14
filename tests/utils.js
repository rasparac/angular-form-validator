var Utils = function() {

    this.checkValidatioElementCount = function(form, count, cssClass) {
        expect(form[0].querySelectorAll('.with-errors').length).toEqual(count);
        expect(form[0].querySelectorAll('.has-error').length).toEqual(count);
    }

     this.checkInputFieldsValidation = function(formObject, inputFileds, value) {
        inputFileds.forEach(function(input) {
            expect(formObject[input].$valid).toBe(value);
        });
    }

    this.form = function(form) {
        var formObject = form;

        this.fillForm = function(data) {
            _.forEach(data, function(value, key) {
                if (formObject[key] === undefined) {
                    throw Error("There is no element with " + key + " field!");
                }
                formObject[key].$setViewValue(value);
            });
        }

        this.fillOutInputs = function(keys) {
            _.forEach(keys, function(key) {
                formObject[key].$setViewValue('');
            });
        }

        this.checkInputFieldsValidation = function(fileds, isValid) {
            _.forEach(fileds, function(field) {
                if (formObject[field] === undefined) {
                    throw Error("There is no element with " + field + " field!");
                }
                expect(formObject[field].$valid).toBe(isValid);
            });
        }

        this.getForm = function() {
            return form;
        }

        return this;
    }
}

var utils = new Utils();