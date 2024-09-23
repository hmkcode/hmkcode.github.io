import { $services } from "./services.js";

const VALIDATION_RULES = { 
    validationRules:[
        ['required', (input) => /^.+$/.test(input.value), 'This field is required.'],
        ['indatalist', (input) => checkValueInDatalist(input) , 'Please select a valid option.'],
        ['isUser', (input) => isUser(input), 'User not found.'],
    ],
    find: function(name){
        const rule =  this.validationRules.find(rule => rule[0] == name);
        return rule ? rule : ['na', () => true, ''];
    }
}


const checkValueInDatalist = function(input) {
    const value = input.value.trim();
    const listId = input.getAttribute('list');
    if (!listId) return false;

    const dataList = document.getElementById(listId);
    if (!dataList) return false;

    const options = Array.from(dataList.options);
    return options.some(option => option.value === value);
};

const isUser =  function(input){
    const users =  $services.users;
    const user = users.find(user => user.username === input.value);
    return user ? true : false;
   
}


Document.prototype.VALIDATION_RULES = VALIDATION_RULES;
