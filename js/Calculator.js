/**
 *  * GitHub: nrhbd
 *  * This is version 2 of Calculator. Trying to fix some bugs and rewrite the whole code.
 * */
function Calculator() {
  let screenDisplayInput = document.querySelector(".screen-display");
  let digitsAll = document.querySelectorAll(".button-action");
  let calculateButton = document.querySelector(".equal-sign");
  let deleteCharButton = document.querySelector(".backspace-button");
  let storeInMemoryButton = document.querySelector(".memmory-button");
  let retrieveMemoButton = document.querySelector(".retrieve-button");
  let clearbutton = document.querySelector(".clear-button");
  let rewindbutton = document.querySelector(".rewind-button");

  //adds addEventListener to buttons
  (function init() {
    calculateButton.addEventListener("click", showResults);
    storeInMemoryButton.addEventListener("click", saveMemo);
    retrieveMemoButton.addEventListener("click", retrieveMemo);
    clearbutton.addEventListener("click", clearInput);
    rewindbutton.addEventListener("click", rewind);
    deleteCharButton.addEventListener("click", removeOneChar);
    for (var i = 0; i < digitsAll.length; i++) {
      digitsAll[i].addEventListener("click", showDigits);
    }
  })();

  function rewind() {
    if (localStorage.getItem("zwischenMemo") === null) {
      return;
    }
    setInputValue(getInputValue() + localStorage.getItem("zwischenMemo"));
    localStorage.removeItem("zwischenMemo");
  }

  function removeOneChar() {
    let str = getInputValue();
    if (str !== "") {
      str = str.slice(0, -1);
      setInputValue(str);
    }
  }

  function inputValidation(value) {
    let currentDigitOnly = "";
    let digitsString = getInputValue();
    //get the current char
    let lastChar = getInputValue().substr(getInputValue().length - 1);
    let currentChar = value;
    //no more than more than one sign
    if (
      currentChar === "/" ||
      currentChar === "*" ||
      currentChar === "+" ||
      currentChar === "-"
    ) {
      if (
        lastChar === "/" ||
        lastChar === "*" ||
        lastChar === "+" ||
        lastChar === "-"
      ) {
        removeOneChar();
        let str = getInputValue();
        str += currentChar;
        setInputValue(str);
        return;
      }
    }
    //if no "(" found... just type nothing.
    if (currentChar === ")") {
      let c = /\([0-9]+/;
      let str = getInputValue();
      if (!c.test(str)) {
        return;
      }
    }
    if (currentChar === "(") {
      let str = getInputValue();
      if (str === "" ) {
        setInputValue("(");
        return;
      }
    }
    if (currentChar === "(") {
      if (lastChar === "/" || lastChar === "*" || lastChar === "(") {
        let str = getInputValue() + "(";
        setInputValue(str);
        return;
      } else if (lastChar === "-" || lastChar === "+") {
        let str = getInputValue() + "(";
        setInputValue(str);
        return;
      } else {
        let str = getInputValue() + "*(";
        setInputValue(str);
        return;
      }
    } else if (currentChar === ")") {
      if (
        lastChar === "/" ||
        lastChar === "*" ||
        lastChar === "+" ||
        lastChar === "-"
      ) {
        removeOneChar();
        let str = getInputValue() + ")*";
        setInputValue(str);
        return;
      } else {
        let str = getInputValue() + ")*";
        setInputValue(str);
        return;
      }
    }
    //no more than 1 point at the end.
    if (currentChar === ".") {
      if (lastChar === ".") {
        return;
      }
      if (currentDigitOnly !== "") {
        //remove the . and add the dot at the end;
        let tempChar = "";
        var dot = /\./g;
        if (dot.test(currentDigitOnly)) {
          tempChar = currentDigitOnly.replace(dot, "");
          digitsString = digitsString.replace(currentDigitOnly, tempChar);
          currentDigitOnly = "";
        }
      } else {
        if (
          currentChar === "." &&
          (lastChar === "*" ||
            lastChar === "-" ||
            lastChar === "/" ||
            lastChar === "+" ||
            digitsString === "")
        ) {
          currentChar = "0.";
        }
      }
    }
    //add trailing zero
    if (
      lastChar === "." &&
      (currentChar === "+" ||
        currentChar === "/" ||
        currentChar === "-" ||
        currentChar === "*")
    ) {
      digitsString += "0";
    }
    //no more than 2 points
    if (
      !(
        currentChar === "+" ||
        currentChar === "/" ||
        currentChar === "-" ||
        currentChar === "*"
      )
    ) {
      currentDigitOnly += currentChar;
    } else {
      currentDigitOnly = "";
    }

    let validedDigits = digitsString + currentChar;
    setInputValue(validedDigits);
  }

  function clearInput() {
    localStorage.setItem("zwischenMemo", getInputValue());
    setInputValue("");
  }

  function showDigits() {
    if (
      getInputValue() === "Math Error" ||
      getInputValue() === "Syntax Error"
    ) {
      setInputValue("");
    }
    inputValidation(this.value);
  }

  function showResults() {
    let lastChar = getInputValue().substr(getInputValue().length - 1);
    if (
      lastChar === "*" ||
      lastChar === "-" ||
      lastChar === "/" ||
      lastChar === "+"
    ) {
      localStorage.setItem("zwischenMemo", getInputValue());
      removeOneChar();
    }
    try {
      if (getInputValue() === "") {
        return;
      }
      let evalRest = eval(getInputValue());
      if (evalRest == "Infinity") {
        setInputValue("Math Error");
        return;
      } else if (evalRest == "undefined") {
        return;
      } else {
        setInputValue(evalRest);
      }
    } catch (err) {
      setInputValue("Syntax Error");
    }
  }

  function saveMemo() {
    localStorage.setItem("resultMemo", getInputValue());
    setInputValue("");
  }

  function retrieveMemo() {
    if (localStorage.getItem("resultMemo") === null) {
      return;
    }
    setInputValue(getInputValue() + localStorage.getItem("resultMemo"));
    localStorage.removeItem("resultMemo");
  }

  function getInputValue() {
    return screenDisplayInput.value;
  }

  function setInputValue(value) {
    screenDisplayInput.value = value;
  }
}
var cl = new Calculator();
