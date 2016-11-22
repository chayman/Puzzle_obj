var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.wchusbserial1420'; // fill in your serial port name here
var options = {
  baudrate: 9600
}; // change the data rate to whatever you wish
var locH;
var locV;
var circleColor = 255;
var inString;
var sensors = [];
var mouse;
var p1;
var p2;
var p3;
var p4;

function setup() {
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing
  serial.list(); // list the serial ports
  serial.open(portName, options); // open a serial port

  createCanvas(500, 500);
  p1 = new PuzzlePiece(img1, 100, 100, 100, 100);
  p2 = new PuzzlePiece(img2, 300, 200, 100, 100);
  p3 = new PuzzlePiece(img3, 200, 400, 100, 100);
  p4 = new PuzzlePiece(img4, 400, 300, 100, 100);

  mouse = new MakeMouse();
}

function draw() {
  background(200, 230, 255); // black background
  fill(255);
  text("sensor value: " + inString, 30, 30);


  mouse.RenderMouse();


  p1.display();
  p2.display();
  p3.display();
  p4.display();

p1.move();
p2.move();
p3.move();
p4.move();


}




function printList(portList) {

  for (var i = 0; i < portList.length; i++) {

    println(i + " " + portList[i]);
  }
}

function serverConnected() {
  println('connected to server.');
}

function portOpen() {
  println('the serial port opened.')
}

function serialEvent() {
  inString = serial.readStringUntil('\r\n');
  if (inString.length > 0) {
    sensors = split(inString, ','); // split the string on the commas
    if (sensors.length > 2) { // if there are three elements
      locH = map(sensors[0], 0, 1023, 0, 500); // element 0 is the locH
      locV = map(sensors[1], 0, 1023, 0, 500); // element 1 is the locV
      circleColor = 255 - (sensors[2] * 255); // element 2 is the button

    }
  }
}

function serialError(err) {
  println('Something went wrong with the serial port. ' + err);
}

function portClose() {
  println('The serial port closed.');
}

function preload() {
  img1 = loadImage("assets/topleft.jpg");
  img2 = loadImage("assets/topright.jpg");
  img3 = loadImage("assets/bottomleft.jpg");
  img4 = loadImage("assets/bottomright.jpg");
}


function PuzzlePiece(img, x, y, w, h) {
  this.img = img;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;



  this.display = function() {
    image(img, x, y, w, h);
  }

    this.move = function() {
    var d = dist(locH, locV, this.x, this.y);
      if(d<70 && sensors[2]==0){
        fill(0);
     text("hello", 200,100);
     
     this.x=mouse.x;
     this.y=mouse.y;
    
     
    }
   
  }
}

function MakeMouse(x, y, click) {
  this.x = locH;
  this.y = locV;
  this.click = sensors[2];


  this.RenderMouse = function() {
    noStroke();
    fill(circleColor);
    ellipse(locH, locV, 20, 20);
  }
}

