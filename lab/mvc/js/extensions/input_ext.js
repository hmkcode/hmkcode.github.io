// validate rules are set of fuctions that takes input value and returns true or false

HTMLInputElement.prototype.validate =  function() {
    const value = this.value ? this.value.trim() : '';
    const rules = this.getAttribute('validate').split(',').map(rule => rule.trim());

    if(this.offsetParent === null)
        return true;

    if(!document.VALIDATION_RULES){
        document.VALIDATION_RULES = { 
            validationRules:[],
            find: function(name){
                const rule =  this.validationRules.find(rule => rule[0] == name);
                return rule ? rule : ['na', () => true, ''];
            }
        }
    }

    var isValid = true;
    var errorMessage = '';
    
    rules.forEach(rule => {       

        const [name, fn, message] = document.VALIDATION_RULES.find(rule);
        //console.log(name, fn, message);
        if (!fn(this)) {
            isValid = false;
            errorMessage = message;
        }          
     
    });

    if (!isValid) 
        this.showErrorMessage(errorMessage);

    return isValid;

};



HTMLSelectElement.prototype.validate = HTMLInputElement.prototype.validate;

HTMLInputElement.prototype.showErrorMessage = function(errorMessage) {
    this.style.borderColor = 'red';
    const errorElement = document.querySelector('[errmsg="' + this.id + '"]');

    if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.textContent = errorMessage;
    }

    this.addEventListener('input', function() {
        if (this.value) {
            this.style.borderColor = '';
            if (errorElement) {
                errorElement.style.display = 'none';
                errorElement.textContent = '';
            }
            this.removeEventListener('input', arguments.callee);
        }
    });
};

HTMLSelectElement.prototype.showErrorMessage = HTMLInputElement.prototype.showErrorMessage;

HTMLDataListElement.prototype.build = function(optionsArray) {
    // Clear existing options
    this.innerHTML = '';

    // Create and append new options
    optionsArray.forEach(value => {
        const optionElement = document.createElement('option');
        optionElement.value = value;
        this.appendChild(optionElement);
    });
};