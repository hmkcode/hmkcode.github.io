// #JIR-001
document.addEventListener("DOMContentLoaded", onload);


// #JIR-001
onload = () => {   
    fill(models.formData);   
    addEventListeners("submit", "click" , onsubmit, "registered 'onsubmit' listener for submit button");

}

onsubmit = () => {
    console.log('Form submitted');
    collectedData = collect();
}
