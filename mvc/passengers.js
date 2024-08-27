class Passengers extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Initialize passengers array
        this.passengers = ['John Doe','Jane Smith', 'Alice Johnson' ];
        

        // Create structure
        this.shadowRoot.innerHTML = `
            <div>
                <p>Passengers of Point</p>
                <button id="add_passenger">Add Passenger</button>
                <div id="passengers"></div>
            </div>

             <template id="passenger-template">
                <h3></h3>
            </template>
        `;

        this.passengerContainer = this.shadowRoot.getElementById('passengers');
        this.addPassengerButton = this.shadowRoot.getElementById('add_passenger');

        $add_event(this.addPassengerButton, 'click', () => this.addPassenger(), 'registered click listener for add passenger button');
    }

    connectedCallback() {
        this.renderPassengers();
    }

    renderPassengers() {
        $log('Rendering passengers');
        $build($e('passengers', this.shadowRoot), $e('passenger-template', this.shadowRoot), this.passengers, fillPassengerClone, 'kilo');
    }

    addPassenger() {
        $log('Add passenger');
        $build($e('passengers', this.shadowRoot), $e('passenger-template', this.shadowRoot), ['OLABOLA'], 
            fillPassengerClone, 'kilo 2');

    }
}

// Define the custom element
customElements.define('passenger-list', Passengers);
