// Regular expressions used to identify operations and repeated operations
const operationRegex = /[\-\*\/\+]/;
const repeatedOperationRegex = /[\*\/]/

// Error messages
const maximumNumberLimit = "Maximum number limit reached"
const error = "Equation error"

// Main React component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "1", // Power switch: "1" is "On", "0" is "Off"
      power: "On", // Power button label
      clickedNumber: "", // The number button clicked by the user
      currentNumber: "0", // The current number in the calculator display
      displayNumber: "", // The string displayed in the calculator
      previousNumber: "0", // The previous number in the calculator
      currentOperation: "", // The current operation (+, -, /, *)
      previousNumber: "", // The previous number in the calculator
      usedOperation: "" // The operation used to evaluate the equation
    }

    // Bind methods to "this" object
    this.handlePowerClick = this.handlePowerClick.bind(this);
    this.handleClickedNumber = this.handleClickedNumber.bind(this);
  }

  // Function to handle the power button click
  handlePowerClick = () => {
    this.setState(() => {
      // If the power is currently "On"
      if (this.state.value == "1") {
        // Change the color of the slider thumb to red and set the power to "Off"
        $("<style>#slider::-webkit-slider-thumb { background: red; }</style>").appendTo("#slider")
        return { value: "0", power: "Off" }
      } else {
        // Change the color of the slider thumb to green and set the power to "On"
        $("<style>#slider::-webkit-slider-thumb { background: " + "#04AA6D; }</style>").appendTo("#slider")
        return { value: "1", power: "On" }
      }
    })
  }

  // Function to handle a number button click
  handleClickedNumber = (event) => {
    this.state.clickedNumber = event.target.textContent;
    // If the button clicked is a number
    if (!Number.isNaN(Number(this.state.clickedNumber))) {
      if (this.state.currentOperation == "=") {
        // If the previous operation was "=", start a new equation
        this.setState({
          displayNumber: this.state.clickedNumber,
          currentNumber: this.state.clickedNumber,
          currentOperation: "",
          previousNumber: ""
        })
        // If the current number is 0, update the current number to the clicked number
      } else if (this.state.currentNumber === "0") {
        this.setState({
          displayNumber: this.state.clickedNumber,
          currentNumber: this.state.clickedNumber
        })
        // If the current number is an operation, start a new number with the clicked number
      } else if (operationRegex.test(this.state.currentNumber)) {
        this.setState({
          displayNumber: this.state.displayNumber + " " + this.state.clickedNumber,
          currentNumber: this.state.clickedNumber,
          previousNumber: this.state.clickedNumber
        })
        // Otherwise, append the clicked number to the current number
      } else {
        this.setState({
          displayNumber: this.state.displayNumber + this.state.clickedNumber,
          currentNumber: this.state.currentNumber + this.state.clickedNumber,
          previousNumber: this.state.previousNumber + this.state.clickedNumber
        })
      }

      // Handle operations 
    } else if (operationRegex.test(this.state.clickedNumber)) {
      // Handle operations when previous operation was '='
      if (this.state.currentOperation == "=") {
        this.state.currentOperation = event.target.textContent;
        this.setState({
          currentNumber: this.state.clickedNumber,
          displayNumber: this.state.currentNumber + " " + this.state.currentOperation
        })
        // Handle repeated operations
      } else if (operationRegex.test(this.state.currentOperation) && repeatedOperationRegex.test(this.state.clickedNumber) && isNaN(Array.from(this.state.displayNumber)[this.state.displayNumber.length - 1])) {
        this.setState({
          displayNumber: Array.from(this.state.displayNumber).slice(0, this.state.displayNumber.length - 1).join("") + this.state.clickedNumber,
          currentNumber: this.state.clickedNumber
        })
      } else {
        this.state.currentOperation = event.target.textContent;
        this.setState({
          currentNumber: this.state.clickedNumber,
          displayNumber: this.state.displayNumber + " " + this.state.currentOperation
        })
      }
    } else if (this.state.currentOperation == "=" && this.state.clickedNumber == "=") {
      // Calculate the result of the equation and update the display
      this.setState({
        displayNumber: this.state.currentNumber + this.state.usedOperation + this.state.previousNumber,
        currentNumber: eval(this.state.currentNumber + this.state.usedOperation + this.state.previousNumber)
      })
    } else {
      // This else block handles the case when the clicked button is not a number.
      switch (this.state.clickedNumber) {
        case "AC": {
          this.setState({
            displayNumber: "",
            previousNumber: "0",
            currentNumber: "0"
          }); break;
        }
        case ".": {
          if (!this.state.currentNumber.includes(".")) {
            if (this.state.currentNumber === "0") {
              this.setState({
                displayNumber: "0" + this.state.displayNumber + this.state.clickedNumber,
                currentNumber: this.state.currentNumber + this.state.clickedNumber
              })
            } else if (this.state.currentNumber === "+" || this.state.currentNumber === "-" || this.state.currentNumber === "*" || this.state.currentNumber === "/") {
              this.setState({
                displayNumber: this.state.displayNumber + "0" + this.state.clickedNumber,
                currentNumber: "0" + this.state.clickedNumber
              })
            } else {
              this.setState({
                displayNumber: this.state.displayNumber + this.state.clickedNumber,
                currentNumber: this.state.currentNumber + this.state.clickedNumber
              })
            };
          }
        }; break;
        case "=": {
          if (this.state.displayNumber == "") {
            this.setState({
              currentOperation: this.state.clickedNumber,
              usedOperation: this.state.currentOperation,
              displayNumber: this.state.currentNumber
            });
          } else {
            this.setState({
              currentNumber: eval(this.state.displayNumber),
              currentOperation: this.state.clickedNumber,
              usedOperation: this.state.currentOperation
            });
          }
        }; break;
      }
    };
  }

  // This is a React component that renders a calculator.
  // The component has two states: "on" and "off".
  // The calculator has various buttons for performing math operations and inputting numbers.
  render() {
    if (this.state.value == "1") {
      return (
        <div class="d-flex flex-column justify-content-center align-items-center" id="content">
          <div class="p-3" id="main-calc">
            <div id="control">
              <div> Power switch </div>
              <ul id="power-button">
                <li>{this.state.power}</li>
                <li> <input id="slider" type="range" min="0" max="1" value={this.state.value} onClick={this.handlePowerClick} ></input> </li>
              </ul>
            </div>
            <div class="ps-2" id="display">
              <span style={{ color: "orange" }}>{this.state.displayNumber}</span>
              <br></br>
              <span style={{ fontSize: "1.5rem" }}>{this.state.currentNumber}</span>
            </div>
            <div class="grid-pointer" id="clear" onClick={this.handleClickedNumber}>
              AC
            </div>
            <div class="math grid-pointer" id="divide" onClick={this.handleClickedNumber}>
              /
            </div>
            {console.log(this.state.usedOperation)}
            <div class="math grid-pointer" id="multiply" onClick={this.handleClickedNumber}>
              *
            </div>
            <div onClick={this.handleClickedNumber} class="number grid-pointer" id="seven">
              7
            </div>
            <div onClick={this.handleClickedNumber} class="number grid-pointer" id="eight">
              8
            </div>
            <div onClick={this.handleClickedNumber} class="number grid-pointer" id="nine">
              9
            </div>
            <div class="math grid-pointer" id="subtract" onClick={this.handleClickedNumber}>
              -
            </div>
            <div onClick={this.handleClickedNumber} class="number grid-pointer" id="four">
              4
            </div>
            <div onClick={this.handleClickedNumber} class="number grid-pointer" id="five">
              5
            </div>
            <div onClick={this.handleClickedNumber} class="number grid-pointer" id="six">
              6
            </div>
            <div class="math grid-pointer" id="add" onClick={this.handleClickedNumber}>
              +
            </div>
            <div onClick={this.handleClickedNumber} class="number grid-pointer" id="one">
              1
            </div>
            <div onClick={this.handleClickedNumber} class="number grid-pointer" id="two">
              2
            </div>
            <div onClick={this.handleClickedNumber} class="number grid-pointer" id="three">
              3
            </div>
            <div class="grid-pointer" id="equals" onClick={this.handleClickedNumber}>
              =
            </div>
            <div onClick={this.handleClickedNumber} class="number grid-pointer" id="zero">
              0
            </div>
            <div class="number grid-pointer" id="decimal" onClick={this.handleClickedNumber}>
              .
            </div>
          </div>
          <h4 class="h4 mt-2" id="developer">Developed By <a href="https://sirajsaleem.com" target="_blank">Siraj</a>.</h4>
          <h5 class="h5" id="developer">GitHub: <a href="https://github.com/sirajms5/Calculator-React.js" target="_blank"><i class="fab fa-github"></i></a></h5>
        </div>
      )
    } else {
      return (
        <div class="d-flex flex-column justify-content-center align-items-center" id="content">
          <div class="p-3" id="main-calc-off">
            <div id="control">
              <div> Power switch </div>
              <ul id="power-button">
                <li>{this.state.power}</li>
                <li> <input id="slider" type="range" min="0" max="1" value={this.state.value} onClick={this.handlePowerClick} ></input> </li>
              </ul>
            </div>
            <div id="display"></div>
            <div id="clear">AC</div>
            <div class="math" id="divide">/</div>
            <div class="math" id="multiply">*</div>
            <div class="number" id="seven">7</div>
            <div class="number" id="eight">8</div>
            <div class="number" id="nine">9</div>
            <div class="math" id="subtract">-</div>
            <div class="number" id="four">4</div>
            <div class="number" id="five">5</div>
            <div class="number" id="six">6</div>
            <div class="math" id="add">+</div>
            <div class="number" id="one">1</div>
            <div class="number" id="two">2</div>
            <div class="number" id="three">3</div>
            <div class="" id="equals">=</div>
            <div class="number" id="zero">0</div>
            <div class="number" id="decimal">.</div>
          </div>
          <h4 class="h4 mt-2" id="developer">Developed By <a href="https://sirajsaleem.com" target="_blank">Siraj</a>.</h4>
          <h5 class="h5" id="developer">GitHub: <a href="https://github.com/sirajms5/Calculator-React.js" target="_blank"><i class="fab fa-github"></i></a></h5>
        </div>
      )
    }
  }
}

ReactDOM.render(<App />, document.getElementById("my-calculator"));