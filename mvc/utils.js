addEventListeners = (elements, events, callback, info = null) => {

    if(info) console.log(info);

    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    
    if (!Array.isArray(events)) {
        events = [events];
    }

    elements.forEach(element => {
        events.forEach(event => {
            e = document.getElementById(element);
            e.addEventListener(event, callback);
        });
    });
   
};


removeEventListeners = (elements, events, callback, info = null) => {
    
    if(info) console.log(info);

    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    
    if (!Array.isArray(events)) {
        events = [events];
    }

    elements.forEach(element => {
        events.forEach(event => {
            e = document.getElementById(element);
            e.removeEventListener(event, callback);
        });
    });

};

$val = (elementName, value, info = null) => {

    if(info) 
        console.log(info);

    const element = document.getElementById(elementName);
    if (!element) return null; // Return null if the element doesn't exist

    // Set value if provided
    if (value !== undefined) {
        if (element.tagName === 'INPUT') {
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = value;
            } else {
                element.value = value;
            }
        } else if (element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
            element.value = value;
        }
    }

    // Get value based on element type
    if (element.tagName === 'INPUT') {
        if (element.type === 'checkbox' || element.type === 'radio') {
            return element.checked;
        } else {
            return element.value;
        }
    } else if (element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
        return element.value;
    }
    
    return null; // Return null if the element is not supported
};

$build = (elementName, templateName, data, fillClone, info = null) => {  
    if(info) console.log(info);

    const element = document.getElementById(elementName);
    const template = document.getElementById(templateName);
    if (!element || !template) return null; // Return null if the element doesn't exist

    data.forEach((item) => {
        const clone = template.content.cloneNode(true);
        fillClone(clone, item);
        element.appendChild(clone);
    });  
}
