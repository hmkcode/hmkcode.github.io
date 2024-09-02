

// validation array element, regdex, error message
const VALIDATION_RULES = { 
    validationRules:[
        ['required', /^.+$/, 'This field is required.'],
        ['postTitleMatching', /^[a-zA-Z0-9 ]{3,50}$/, 'Title must be 3-50 characters long and can include letters, numbers, and spaces.'],
        ['postAuthorRegEx', /^[a-zA-Z ]{3,30}$/, 'Author name must be 3-30 characters long and can include only letters and spaces.']
    ],
    find: function(name){
        return this.validationRules.find(rule => rule[0] == name);
    }
}


function validator(input, error, rule) {
      
    console.log('input', input, 'error', error, 'rule', rule);
    const validate = (value, regex) =>{
        return regex.test(value);
    }    
    
    const showError = (input, error ,message) => {
        input.style.borderColor = 'red';
        // check if error is null
        if(!error) return;
        error.style.display = 'block';
        error.textContent = message;
    }
    
    const hideError = (input, error) => {
        input.style.borderColor = '';
        if(!error) return;
            error.style.display = 'none';
    }

    if(input == null) throw new Error('Input is null');

    const [name, regex, message] = VALIDATION_RULES.find(rule);

   if (!validate(input.value, regex)) {
        showError(input, error, message);
        return false;

    } else {
        hideError(input, error);
        return true;
    }
}

   


function validateInput(inputs, errors = []) {
    var isValid = true;

    inputs.forEach( input => {

        var isValidInput = true;

        input.getAttribute('validate').split(',').map(item => item.trim()).forEach( rule => {

            // if item is empty, set it to required
            rule = rule == ""?'required': rule;

            if(isValidInput)
                isValidInput = validator(input, errors.find(error => error.id == (input.id+'Error')), rule);
           
        });
        isValid = isValid && isValidInput;
    });
    return isValid;
}

