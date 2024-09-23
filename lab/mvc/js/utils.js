
const $e = (elementId) => document.getElementById(elementId);

const $s = (elementSelector, container = document) => container.querySelector(elementSelector);

const $s_all =(elementSelector, container = document) => Array.from(container.querySelectorAll(elementSelector));

const $on = (elements, events, callback, info = null) => {

    $log(info);

    if(!elements || !events || !callback) return;

    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    
    if (!Array.isArray(events)) {
        events = [events];
    }


    elements?.forEach(element => {
        events?.forEach(event => {
            element?.addEventListener(event, callback);
        });
    });
   
};


const $remove_event = (elements, events, callback, info = null) => {
    
    $log(info);

    if(!elements || !events || !callback) return;


    if (!Array.isArray(elements)) {
        elements = [elements];
    }
    
    if (!Array.isArray(events)) {
        events = [events];
    }

    elements?.forEach(element => {
        events?.forEach(event => {
            element?.removeEventListener(event, callback);
        });
    });

};

const $val = (element, value, info = null) => {

    $log(info);
    //element = $select_one(element)


    if (!element) return null; // Return null if the element doesn't exist

    // Set value if provided
    if (value !== undefined) {
        if (element.tagName === 'INPUT') {
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = value;
            } else {
                element.value = value;
            }
        } else if (element.tagName === 'SELECT' || element.tagName === 'TEXTAREA' || element.tagName === 'OPTION') {
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
    } else if (element.tagName === 'SELECT' || element.tagName === 'TEXTAREA' || element.tagName === 'OPTION') {
        return element.value;
    }
    
    return null; // Return null if the element is not supported
};

const $text = (element, text, info = null) => {
    $log(info);
    //element = $select_one(element)

    if (!element) return null; // Return null if the element doesn't exist

    // Set text if provided
    if (text !== undefined) {
        element.innerText = text;
    }

    return element.innerText;
}

const $build = (container, template, data, fillClone, info = null) => {  
    $log(info);
    if (!container || !template || !data) return null; // Return null if the element doesn't exist
    
    const fragment = document.createDocumentFragment(); // Create a document fragment
    
    data.forEach((item) => {
        const clone = template.content.cloneNode(true);
        fillClone(clone, item);
        fragment.appendChild(clone); 
    });  

     container.appendChild(fragment);
     return container;

}

const $create = (tag) => document.createElement(tag);

const $log = (msg) => {
    if(msg)console.log(msg);
}

const $debug = (msg) => {
    console.debug(msg);
}

// can take one on array of elements
const $show = (elements, info = null) => {
    
    $log(info);

    if (!elements) return;

    if (!Array.isArray(elements)) 
        elements = [elements];
    
    elements?.forEach(element => {
        if(element)
            element.style.display = 'block';
    });
}

const $hide = (elements, info = null) => {

    $log(info);

    if (!elements) return;

    if (!Array.isArray(elements)) 
        elements = [elements];
    
    elements?.forEach(element => {
        if(element)
            element.style.display = 'none';
    });
}

const $fadeOut = (elements, duration = 500, callback, info = null) => {

    $log(info);

    if (!elements) return;

    if (!Array.isArray(elements)) 
        elements = [elements];
    
    elements?.forEach(element => {
        if(element){
            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = 0;
        }
    });

    setTimeout(() => {
        callback();
    }, duration);
}

const $fadeIn = (elements, duration = 500, callback, info = null) => {

    $log(info);

    if (!elements) return;

    if (!Array.isArray(elements)) 
        elements = [elements];
    
    elements?.forEach(element => {
        if(element){
            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = 1;
        }
    });

    setTimeout(() => {
        callback();
    }, duration);
}

const $emit  = (eventName, detail = null) => {
    console.log('Event: ', eventName, detail);
    const event = new CustomEvent(eventName,  {detail});
    document.dispatchEvent(event);
}

const $validate = (inputs) =>{
    const visibleInputs = Array.from(inputs).filter(input => {
        return input.offsetParent !== null;
    });

    var areAllValid = true;
    visibleInputs.forEach(input => {
        const isValid = input.validate();
        console.log(input.id, isValid); 
        if(!isValid) 
            areAllValid = false;
    });
    return areAllValid;
}

// export all const 
export {$e, $s, $s_all, $on, $remove_event, $val, $text, 
    $build, $log, $debug, $show, $hide, $fadeOut, $fadeIn, $emit, $create, $validate};

