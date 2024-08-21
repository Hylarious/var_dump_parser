import { parser } from "./parser.js";

const app = {
  init: function () {
    const thisApp = this;
    thisApp.inputArea = document.querySelector("textarea");
    thisApp.outputArea = document.getElementById("output");
    thisApp.submitButton = document.querySelector("#submit");
    thisApp.copyButton = document.querySelector(`#copy`);
    thisApp.input = "";

    thisApp.inputArea.addEventListener("change", handleInputChange);
    thisApp.submitButton.addEventListener("click", handleSubmit);
    thisApp.copyButton.addEventListener("click", handleCopy);

    function handleInputChange(e) {
      thisApp.input = e.target.value;
    }

    function handleSubmit() {
      const parsedInput = parser(thisApp.input);
      thisApp.outputArea.innerText = parsedInput;
      thisApp.copyButton.classList.remove("hidden");
    }

    function handleCopy() {
      const storage = document.createElement("textarea");
      storage.value = thisApp.outputArea.innerText;
      thisApp.outputArea.appendChild(storage);

      storage.select();
      storage.setSelectionRange(0, 99999);
      document.execCommand("copy");
      thisApp.outputArea.removeChild(storage);
    }
  },
};

app.init();

