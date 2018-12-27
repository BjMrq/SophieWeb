// -- GO! -- //

// selecting elements to manipulate

var numOfSquares = 6;

var colors = generateAllColors(numOfSquares);

var squares = document.querySelectorAll(".square");

var header = document.querySelector(".header");

var mainNavbar = document.querySelector("#mainNavbar");

var colorDisplay = document.getElementById("colorDisplay");

var reset = document.getElementById("reset");

var easyBTN = document.getElementById("easyBTN");

var hardBTN = document.getElementById("hardBTN");

var messageToPlayer = document.getElementById("messageToPlayer");

var gameColor = setColor ();

colorDisplay.innerHTML = gameColor;


easyBTN.addEventListener("click", function() {
  numOfSquares = 3;
  colors = generateAllColors(numOfSquares);
  gameColor = setColor ();
  colorDisplay.innerHTML = gameColor;
  for(var i = 0; i < squares.length; i++){
    if (i < 3){
      squares[i].style.background = colors[i];
    } else {
      squares[i].style.background = "none";
    }

  }
});

hardBTN.addEventListener("click", function() {
  numOfSquares = 6;
  colors = generateAllColors(numOfSquares);
  gameColor = setColor ();
  colorDisplay.innerHTML = gameColor;
  for(var i = 0; i < squares.length; i++){
  	squares[i].style.background = colors[i];
  }
});

// And Game

for(var i = 0; i < squares.length; i++){
	// add initial colors to squares
	squares[i].style.background = colors[i];

  //add click listener
  squares[i].addEventListener("click", function(){
    //grab color of clicked square
    var pickedColor = this.style.backgroundColor;
    //compare color to pickedcolor
    if (pickedColor === gameColor ){
        messageToPlayer.innerHTML = "Yeaaa you got it !";
        changeColors(pickedColor);
        header.style.backgroundColor = pickedColor;
        reset.innerHTML = "PLAY AGAIN?";
        mainNavbar.style.backgroundColor = gameColor;
        reset.style.color = gameColor;
        easyBTN.style.color = gameColor;
        hardBTN.style.color = gameColor;
        messageToPlayer.style.color = gameColor;
      } else {
      this.style.backgroundColor = "rgba(194, 147, 85, 0.0)";
    }
  });
}

reset.addEventListener("click", function(){
  messageToPlayer.innerHTML = " ";
  reset.innerHTML = "NEW COLORS";
  colors = generateAllColors(numOfSquares);
  gameColor = setColor ();
  colorDisplay.innerHTML = gameColor;
  for(var i = 0; i < squares.length; i++){
  	// add initial colors to squares
  	squares[i].style.background = colors[i];
  }
  displaySquares();
});



function changeColors(color){
  for (var i = 0; i < squares.length; i++){
    squares[i].style.backgroundColor = color;
 }
}


function setColor () {
  var random = Math.floor(Math.random() * colors.length);
  return colors[random];
}

function generateAllColors(num){
  var arr = [];
  for (var i = 0; i < num ;i++){
    arr.push(randomColor());
  }
  return arr;

}

function randomColor(){
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  return "rgb(" + r + ", " + g + ", " + b +")";
}
