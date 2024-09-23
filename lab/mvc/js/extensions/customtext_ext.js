CustomText.prototype.text = function(newText) {
    if (this.buttonElement) {
        this.buttonElement.textContent = newText;
    }
};