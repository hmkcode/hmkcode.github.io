import { $build, $e, $emit, $on, $s, $s_all, $text, $val } from "./utils.js";

const VIEWS = {
    // get ADD_BUTTON() {return $e('add-button')},
    // get TITLE() { return $e('title') } ,
    // get USERS() { return $e('e-users') } ,
    // get TEST() { return $e('test') },
    // get CUSTOME_TEXT() { return $e('custom-text') } ,
    // get TOAST() { return $e('toast') },
    // get COUNTRY_LIST(){ return $e("country-list")},


    EVENTS: {
        CUSTOME_TEXT_CLICK: 'VIEWS.EVENTS:CUSTOME_TEXT_CLICK',        
        ADD_BUTTON_CLICK: 'VIEWS.EVENTS:ADD_BUTTON_CLICK',
        TITLE_MOUSEOVER: 'VIEWS.EVENTS:TITLE_MOUSEOVER',
    }
    
};

(() => {
    const elements = $s_all('[id]');
    elements.forEach(element => {
        const id = element.id;
        const formattedId = id.toUpperCase().replace(/-/g, '_');
        console.log('get '+formattedId+'(){ return $e("'+id+'")},');
        Object.defineProperty(VIEWS, formattedId, {
            get: function() {
                return $e(id);
            }
        });
    });
})();





const $view =
{
    init: function()
    {
        console.log('View is ready');     
        this.$events();
    },

    // set VIEWS
    //========== 
    set customText(value) {VIEWS.CUSTOM_TEXT.text(value);},
    
    set title(value) { $text(VIEWS.TITLE, value);},

    set users(data) {        
        $build(VIEWS.USERS, VIEWS.USER_TEMPLATE, data, (clone, item) => {
            $text($s('.name', clone), item.name);
            $text($s('.email', clone), item.email);
        });
    },

    set countries(data) {

        console.log('countries', data);
            $build(VIEWS.COUNTRY_LIST, VIEWS.COUNTRY_TEMPLATE, data, (clone, item) => {
            $val($s('.country-option', clone), item.name);
        });
    },

    set toast(obj){ 
        VIEWS.TOAST.show(obj.message, obj.style);
    },



    // action $events
    //=============== 
    $events() {           
        $on(VIEWS.CUSTOM_TEXT.buttonElement, 'click', () => $emit(VIEWS.EVENTS.CUSTOME_TEXT_CLICK)); 
        $on(VIEWS.TITLE, 'mouseover', () => $emit(VIEWS.EVENTS.TITLE_MOUSEOVER));
        $on(VIEWS.ADD_BUTTON, 'click', () => $emit(VIEWS.EVENTS.ADD_BUTTON_CLICK));
    },



}

export {$view, VIEWS};


