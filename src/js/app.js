
import parser from "./parser.js";

const app = {
  init: function () {
    const thisApp = this;
    thisApp.inputArea = document.querySelector("textarea");
    thisApp.outputArea = document.getElementById("output");
    thisApp.submitButton = document.querySelector("#submit");
    thisApp.input = "";

    thisApp.inputArea.addEventListener("change", handleInputChange);
    thisApp.submitButton.addEventListener("click", handleSubmit);

    function handleInputChange(e) {
      thisApp.input = e.target.value;
    
    }

    function handleSubmit() {
      const parsedInput = parser(thisApp.input);
      thisApp.outputArea.innerText = parsedInput
    }
  },
};

app.init();
