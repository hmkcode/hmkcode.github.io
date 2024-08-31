$e = (elementId) => document.getElementById(elementId);

$log = (info) => {
    console.log(info);
}

// Define the $fadeOut function
$fadeOut = (elements, duration = 500, callback, info = null) => {
    if (!elements) return;

    if (!Array.isArray(elements)) 
        elements = [elements];

    elements?.forEach(element => {
        if (element) {
            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = 0;

            element.addEventListener('transitionend', function onTransitionEnd(event) {
                if (event.propertyName === 'opacity' && event.target === element) {
                    console.log('fadeOut', info);
                    element.style.display = 'none';
                    element.removeEventListener('transitionend', onTransitionEnd);
                    element.style.transition = ''
                    callback?.call();
                }
            });
        }
    });
};

// Define the $fadeIn function
$fadeIn = (elements, duration = 500, callback, info = null) => {
    if (!elements) return;

    if (!Array.isArray(elements)) 
        elements = [elements];

    elements?.forEach(element => {
        if (element) {
            element.style.display = 'block';
            element.style.opacity = 0; // Set initial opacity to 0

            element.offsetHeight;

            element.style.transition = `opacity ${duration}ms`;
            element.style.opacity = 1; // Set opacity to 1 to start the transition

            element.addEventListener('transitionend', function onTransitionEnd(event) {
                if (event.propertyName === 'opacity' && event.target === element) {
                    element.removeEventListener('transitionend', onTransitionEnd);
                    console.log('fadeIn', info);
                    element.style.transition = '';
                    callback?.call();
                }
            });
            //element.style.transition = '';
          
        }
    });
};

