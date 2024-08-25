fill = (data) => {
    
    $val('username', data.username);
    $val('firstName', data.profile.firstName);
    $val('lastName', data.profile.lastName);
    $val('roles', data.profile.roles[0]);
}

collect = () => {
    
    const data = {};
    data.username = $val('username');
    data.profile = {};
    data.profile.firstName = $val('firstName');
    data.profile.lastName = $val('lastName');
    data.profile.roles = [$val('roles')];

}


fillRolesClone = (clone, data) => {
    clone.querySelector('li').innerText = data;
}
