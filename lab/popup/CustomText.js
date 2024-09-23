class CustomText extends HTMLElement {

    constructor() {
        super();
        const shadow =  this.attachShadow({mode: 'open'});   
    }

    connectedCallback() {
        this.render();
    }

    render() {

        this.shadowRoot.innerHTML = `
        <input type="text" id="input-customtext" validate="required"/>
        <button>Change Text</button>
        <span>Initial Text</span>
        `;

      // Get the button and text elements after they have been rendered
      this.buttonElement = this.shadowRoot.querySelector('button');
      this.textElement = this.shadowRoot.querySelector('span');
      this.inputElement = this.shadowRoot.querySelector('input');

    //   this.buttonElement.addEventListener('click', () => {
    //     console.log("button clicked", "validated", this.inputElement.validate());
    //     this.dispatchEvent(new CustomEvent('custom-text-click'));

    //   });
    }


    // Method to update the text
    updateText(newText) {
        this.textElement.textContent = newText;
    }
}

// Define the new custom element
customElements.define('custom-text', CustomText);
