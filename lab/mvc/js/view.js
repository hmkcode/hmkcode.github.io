import { $build, $e, $emit, $on, $s, $s_all, $text, $val, $create, $validate } from "./utils.js";

const VIEWS = {
    get TITLE(){ return $e("title")},
    get VALIDATE_BUTTON(){ return $e("validate-button")},
    get CUSTOM_TEXT(){ return $e("custom-text")},
    get USERS(){ return $e("users")},
    get HEAD_COL_TEMPLATE(){ return $e("head-col-template")},
    get BODY_COL_TEMPLATE(){ return $e("body-col-template")},
    get USER_TEMPLATE(){ return $e("user-template")},
    get TABLE(){ return $e("table")},
    get DESTINATION_LIST(){ return $e("destination-list")},
    get TABLE_SEARCH(){ return $e("table-search")},
    get TOAST(){ return $e("toast")},
    get INPUT_NAME(){ return $e("input-name")},

    set TITLE(value) {
        $text(this.TITLE, value);
    },
    set CUSTOM_TEXT(value) { 
        //$text(this.CUSTOM_TEXT.textElement, value);
        this.CUSTOM_TEXT.updateText(value);
    },
    set USERS(data) { 
        $build(this.USERS, this.USER_TEMPLATE, data, (clone, item) => {
            $text($s('.name', clone), item.name);
            $text($s('.email', clone), item.email);
            $text($s('.username', clone), item.username);
        });
    },

    set TABLE(obj) { 
        const {cols, data} = obj;       
        this.TABLE.build(cols, data);
    },

    set DESTINATION_LIST(data) {
        console.log("DESTINATION_LIST", data);
        this.DESTINATION_LIST.build(data);
    },

    set TOAST(obj) {
        this.TOAST.show(obj.message, obj.style);
    },

    EVENTS: {
        CUSTOME_TEXT_CLICK: 'VIEWS.EVENTS:CUSTOME_TEXT_CLICK',        
        VALIDATE_BUTTON_CLICK: 'VIEWS.EVENTS:VALIDATE_BUTTON_CLICK',
        TITLE_MOUSEOVER: 'VIEWS.EVENTS:TITLE_MOUSEOVER',
    }
    
};

// (() => {
//     const elements = $s_all('[id]');
//     elements.forEach(element => {
//         const id = element.id;
//         const formattedId = id.toUpperCase().replace(/-/g, '_');
//         console.log('get '+formattedId+'(){ return $e("'+id+'")},');
//         Object.defineProperty(VIEWS, formattedId, {
//             get: function() {
//                 return $e(id);
//             }
//         });
//     });
// })();





const $view =
{
    init: function()
    {
        console.log('View is ready');     
        this.$events();
    },

    // set VIEWS
    //========== 
    get tableSearch (){ return $val(VIEWS.TABLE_SEARCH); },

    set customText(value){ VIEWS.CUSTOM_TEXT = value; },
    
    set title(value){ VIEWS.TITLE = value; },

    set users(data){ VIEWS.USERS = data; },

    set table(obj){ VIEWS.TABLE = obj; },

    set destinations(data){ 
        VIEWS.DESTINATION_LIST = data.map(country => country.name); 
    },

    set toast(obj){ VIEWS.TOAST= obj; },



    // action $events
    //=============== 
    $events() {           
        $on(VIEWS.CUSTOM_TEXT.buttonElement, 'click', () => $emit(VIEWS.EVENTS.CUSTOME_TEXT_CLICK)); 
        $on(VIEWS.TITLE, 'mouseover', () => $emit(VIEWS.EVENTS.TITLE_MOUSEOVER));
        //$on(VIEWS.VALIDATE_BUTTON, 'click', () => $emit(VIEWS.EVENTS.VALIDATE_BUTTON_CLICK));
        $on(VIEWS.VALIDATE_BUTTON, 'click', () => console.log("all validation:", $validate($s_all('[validate]'))));
        $on(VIEWS.TABLE_SEARCH, 'input', () => {VIEWS.TABLE.filterRows(this.tableSearch);  });
        $on(VIEWS.TABLE_SEARCH, 'input', () => {VIEWS.TABLE.filterRows(this.tableSearch);  });
        $on(VIEWS.TABLE, 'XTABLE.EVENT:ROW_CLICK', (e) => console.log(e.detail.key));
        
    },



}

export {$view, VIEWS};


