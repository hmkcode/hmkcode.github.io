
// Define the custom element
class MyCustomElement extends HTMLElement {
    constructor() {
        super();
        // Attach a shadow DOM to the element
        const shadow = this.attachShadow({ mode: 'open' });

        // Set the inner HTML of the shadow DOM
        shadow.innerHTML = `
            <div>Hello, I am a custom component!</div>
        `;
    }

    doSomething(greet) {
        console.log(greet('foo')); // Output: Hello, World!
        console.log(farewell('foo')); // Output: Goodbye, World!
    }
}

// Register the custom element
customElements.define('my-custom-element', MyCustomElement);