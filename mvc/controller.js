fill = (data) => {
    
    $val($e('rqst_by'), data.request.rqst_by);
    $text($e('rqst_by_r'), data.request.rqst_by);
    $val($e('vehicle_types'), data.request.vihecle_type);
    $val($e('vehicle_number'), data.request.vihecle_number);
   
    
}

collect = (data) => {
    data.rqst_by = $val('rqst_by');
}

fillTripline = (data) => {
    $e('tripline').setPoints(data);
}

fillVehicleTypes = (data) => {
    $build($e('vehicle_types'), $e('vihecle-type-template'), data, fillVehicleTypesClone);
}

fillPassengers = (data) => {
    $build($e('passengers'), $e('passenger-template'), data, fillPassengerClone);
}

addPassenger = (data) => {
    $build($e('passengers'), $e('passenger-template'), data, fillPassengerClone);
}

// ======================

fillRolesClone = (clone, data) => {
    clone.querySelector('li').innerText = data;
}

fillVehicleTypesClone = (clone, data) => {
    $text($s('option', clone), data.description);
    $val($s('option', clone), data.code);    
}

fillPassengerClone = (clone, data) => {
    $text($s('h3', clone), data);
}
