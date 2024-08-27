// #JIR-001
document.addEventListener("load", onload);



// #JIR-001
onload = async() => {   
    $log("loaded");

    // servics
    const user = await getUser();
    const vehicleTypes = await getVehicleTypes();

    // fill view with data
    fillVehicleTypes(vehicleTypes);
    fillTripline(models.jir.points);
    fillPassengers(models.jir.points[0].passengers);
    fill(models.jir);   

    // add event listeners
    addEventListeners($e("submit"), "click" , onsubmit, "registered 'onsubmit' listener for submit button");

    addEventListeners($s(".one"), "click" , onsubmit, "registered 'click' listener for .one");
    $add_event($e("add_passenger"), "click", onAddPassenger, "registered 'click' listener for passenger button");

}

onsubmit = () => {
    $log('Form submitted');
    collect(models.jir);
}

onAddPassenger = () => {
    $log('Add passenger');
    addPassenger(['MAXIMUS']);
}
