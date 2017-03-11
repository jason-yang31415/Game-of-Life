
//canvas stuff
var c;
var ctx;
var canvasWidth;
var canvasHeight;
var canvasLeft;
var canvasTop;

var backgroundColor = "#FFFFFF";
var unshadedColor = "#B0B0B0";
var shadedColor = "#808080";

//backend vars
var grid;
var tempGrid;
var counter = 0;

var drawId;
var runId;

/*
 * PAGE INITIALIZATION
 */

window.onload = function () {
	c = document.getElementById("canvas");
	c.addEventListener("click", clickHandler);
	
	initCanvas();
}

function initCanvas() {
	ctx = c.getContext("2d");
	canvasWidth = ctx.canvas.width;
	canvasHeight = ctx.canvas.height;
	canvasLeft = c.offsetLeft;
	canvasTop = c.offsetTop;
}

/* 
 * PROTOTYPES
 */

function Cell(x, y, grid) {

	this.x = x;
	this.y = y;
	this.grid = grid;

	this.tlx = (grid.cellWidth + grid.cellMargin) * this.x;
	this.tly = (grid.cellHeight + grid.cellMargin) * this.y;

	this.shaded = false;

	this.getX = function () {
		return this.x;
	}

	this.getY = function () {
		return this.y;
	}

	this.getTLX = function () {
		return this.tlx;
	}

	this.getTLY = function () {
		return this.tly;
	}

	this.getShaded = function () {
		return this.shaded;
	}

	this.setShaded = function (shaded) {
		this.shaded = shaded;
	}

	this.calculate = function (state) {
		var num = 0;
		var coords = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
		for (var i = 0; i < coords.length; i++) {
			var nx = this.x + coords[i][0];
			var ny = this.y + coords[i][1];
			if (nx >= 0 && nx < this.grid.getWidth() && ny >= 0 && ny < this.grid.getHeight()) {
				var c = this.grid.getCell(nx, ny);
				if (c.getShaded())
					num++;
			}
		}
		state.getCell(this.getX(), this.getY()).setShaded(this.getShaded());
		if (this.getShaded()) {
			if (num < 2 || num > 3)
				state.getCell(this.getX(), this.getY()).setShaded(false);
		}
		else {
			if (num == 3)
				state.getCell(this.getX(), this.getY()).setShaded(true);
		}
	}

	this.draw = function (ctx) {
		if (this.getShaded())
			ctx.fillStyle = shadedColor;
		else
			ctx.fillStyle = unshadedColor;

		ctx.fillRect(this.tlx, this.tly, this.grid.cellWidth, this.grid.cellHeight);
	}

}

function Grid(width, height) {

	this.width = width;
	this.height = height;

	this.cellWidth;
	this.cellHeight;
	this.cellMargin = 1;

	this.cellWidth = canvasWidth / this.width - this.cellMargin;
	this.cellHeight = canvasHeight / this.height - this.cellMargin;

	this.state = new State(this);

	this.getWidth = function () {
		return this.width;
	}

	this.getHeight = function () {
		return this.height;
	}

	this.getCellWidth = function () {
		return this.cellWidth;
	}

	this.getCellHeight = function () {
		return this.cellHeight;
	}

	this.getCell = function (x, y) {
		return this.state.getCell(x, y);
	}

	this.getState = function(){
		return this.state;
	}

	this.calculate = function () {
		var newState = new State(this);
		for (var i = 0; i < this.getWidth(); i++) {
			for (var j = 0; j < this.getHeight(); j++) {
				this.getCell(i, j).calculate(newState);
			}
		}
		this.state = newState;
	}

}

function State(grid) {

	this.grid = grid;

	this.array = new Array();
	for (var i = 0; i < this.grid.width; i++) {
		this.array[i] = new Array();
		for (var j = 0; j < this.grid.height; j++) {
			this.array[i][j] = new Cell(i, j, this.grid);
		}
	}

	this.getCell = function (x, y) {
		return this.array[x][y];
	}

	this.getArray = function(){
		return this.array;
	}
}

/*
 * INITIALIZATION
 */

function init(g) {
	if (g == null){
		grid = null;
		var x = parseInt(document.getElementById("widthBox").value);
		var y = parseInt(document.getElementById("heightBox").value);

		if (x > 100 || y > 100)
			alert("Don't you think this is getting a bit excessive?");
		
		grid = new Grid(x, y);
	}
	else {
		document.getElementById("widthBox").value = g.getWidth();
		document.getElementById("heightBox").value = g.getHeight();
		grid = g;
	}
	if (drawId == null)
		drawId = setInterval(draw, 33);
}

function draw() {
	ctx.fillStyle = "#FFFFFF";
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	for (var i = 0; i < grid.getWidth(); i++) {
		for (var j = 0; j < grid.getHeight(); j++) {
			grid.getCell(i, j).draw(ctx);
		}
	}
}

/*
 * BUTTON INPUT
 */

function clearGrid(){
	counter = 0;
	document.getElementById("stepCounter").innerText = counter;

	for (var i = 0; i < grid.getWidth(); i++){
		for (var j = 0; j < grid.getHeight(); j++){
			grid.getCell(i, j).setShaded(false);
		}
	}
}

function step() {
	counter++;
	document.getElementById("stepCounter").innerText = counter;
	grid.calculate();
}

function run() {
	tempGrid = serialize();
	var interval = 1000 / parseInt(document.getElementById("runSpeed").value);
	runId = setInterval(step, interval);
}

function stop() {
	clearInterval(runId);
}

function reset(){
	counter = 0;
	document.getElementById("stepCounter").innerText = counter;
	if (tempGrid != null)
		parse(tempGrid);
}

/*
 * MOUSE INPUT
 */

function clickHandler(event) {
	if (grid != null) {
		var pos = getMousePos(c, event);
		var x = pos.x;
		var y = pos.y;

		for (var i = 0; i < grid.getWidth(); i++) {
			for (var j = 0; j < grid.getHeight(); j++) {
				var cell = grid.getCell(i, j);
				if (x >= cell.getTLX() && x <= cell.getTLX() + grid.getCellWidth() && y >= cell.getTLY() && y <= cell.getTLY() + grid.getCellHeight()) {
					cell.setShaded(!cell.getShaded());
				}
			}
		}
	}
};

function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: (event.pageX - canvasLeft) * canvas.width / canvas.clientWidth,
		y: (event.pageY - canvasTop) * canvas.height / canvas.clientHeight
	};
}

/*
 * SAVE/LOAD 
 */

function save(){
	var dlbtn = document.getElementById("save");
	var file = new Blob([serialize()], { type: "application/JSON" });
	dlbtn.href = URL.createObjectURL(file);
	dlbtn.download = "save.json";
}

function serialize(){
	var cache = [];
	return JSON.stringify(grid, function(key, value){
		if (typeof value === "object" && value !== null){
			if (cache.indexOf(value) !== -1)
				return;
			cache.push(value);
		}
		return value;
	}, 4);
}

function load(files){
	if (window.File && window.FileReader && window.FileList && window.Blob){
		var file = files[0];
		var reader = new FileReader();
		reader.onload = (function(f){
			return function(e){
				parse(e.target.result);
			};
		})(file);
		reader.readAsText(file);
	}
	else {
		alert("CHIT SERIES!!!!! Your browser doesn't support the required HTML5 APIs.");
	}
}

function parse(s) {
	var g = JSON.parse(s);
	var array = g.state.array;

	var width = g.state.array.length;
	var height = g.state.array[0].length;
	var grid = new Grid(width, height);
	for (var i = 0; i < array.length; i++) {
		for (var j = 0; j < array[i].length; j++) {
			var cell = array[i][j];
			grid.getCell(i, j).setShaded(cell.shaded);
		}
	}
	init(grid);
	document.getElementById("loadButton").value = null;
}
