$e = $element = (elementId, container = document) => container.getElementById(elementId);

$s = $sel = $select_one = (elementSelector, container = document) => container.querySelector(elementSelector);

$s_all = $select_all = (elementSelector, container = document) => Array.from(container.querySelectorAll(elementSelector));

$onEvent = addEventListeners = (elements, events, callback, info = null) => {

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


$remove_event = removeEventListeners = (elements, events, callback, info = null) => {
    
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

$val = (element, value, info = null) => {

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

$text = (element, text, info = null) => {
    $log(info);
    //element = $select_one(element)

    if (!element) return null; // Return null if the element doesn't exist

    // Set text if provided
    if (text !== undefined) {
        element.innerText = text;
    }

    return element.innerText;
}

$build = (container, template, data, fillClone, info = null) => {  
    $log(info);
    if (!container || !template || !data) return null; // Return null if the element doesn't exist
    data.forEach((item) => {
        const clone = template.content.cloneNode(true);
        fillClone(clone, item);
        container.appendChild(clone);
    });  
}

$log = (msg) => {
    if(msg)console.log(msg);
}

$debug = (msg) => {
    console.debug(msg);
}

// can take one on array of elements
$show = (elements, info = null) => {
    
    $log(info);

    if (!elements) return;

    if (!Array.isArray(elements)) 
        elements = [elements];
    
    elements?.forEach(element => {
        if(element)
            element.style.display = 'block';
    });
}

$hide = (elements, info = null) => {

    $log(info);

    if (!elements) return;

    if (!Array.isArray(elements)) 
        elements = [elements];
    
    elements?.forEach(element => {
        if(element)
            element.style.display = 'none';
    });
}

$fadeOut = (elements, duration = 500, callback, info = null) => {

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

$fadeIn = (elements, duration = 500, callback, info = null) => {

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