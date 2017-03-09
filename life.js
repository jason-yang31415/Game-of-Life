
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

var drawId;
var runId;

window.onload = function(){
    c = document.getElementById("canvas");
    c.addEventListener("click", clickHandler);
}

function Cell(x, y, grid){
    
    this.x = x;
    this.y = y;
    this.grid = grid;

    this.tlx = (grid.cellWidth + grid.cellMargin) * this.x;
    this.tly = (grid.cellHeight + grid.cellMargin) * this.y;

    this.shaded = false;

    this.getX = function(){
        return this.x;
    }

    this.getY = function(){
        return this.y;
    }

    this.getTLX = function(){
        return this.tlx;
    }

    this.getTLY = function(){
        return this.tly;
    }

    this.getShaded = function(){
        return this.shaded;
    }

    this.setShaded = function(shaded){
        this.shaded = shaded;
    }

    this.calculate = function(state){
        var num = 0;
        var coords = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
        for (var i = 0; i < coords.length; i++){
            var nx = this.x + coords[i][0];
            var ny = this.y + coords[i][1];
            if (nx >= 0 && nx < this.grid.getWidth() && ny >= 0 && ny < this.grid.getHeight()){
                var c = this.grid.getCell(nx, ny);
                if (c.getShaded())
                    num++;
            }
        }
        state.getCell(this.getX(), this.getY()).setShaded(this.getShaded());
        if (this.getShaded()){
            if (num < 2 || num > 3)
                state.getCell(this.getX(), this.getY()).setShaded(false);
        }
        else {
            if (num == 3)
                state.getCell(this.getX(), this.getY()).setShaded(true);
        }
    }

    this.draw = function(ctx){
        if (this.getShaded())
            ctx.fillStyle = shadedColor;
        else
            ctx.fillStyle = unshadedColor;

        this.tlx = (grid.cellWidth + grid.cellMargin) * this.x;
        this.tly = (grid.cellHeight + grid.cellMargin) * this.y;
        ctx.fillRect(this.tlx, this.tly, this.grid.cellWidth, this.grid.cellHeight);
    }

}

function Grid(width, height){

    this.width = width;
    this.height = height;

    this.cellWidth;
    this.cellHeight;
    this.cellMargin = 1;

    this.state = new State(this);

    this.getWidth = function(){
        return this.width;
    }

    this.getHeight = function(){
        return this.height;
    }

    this.getCellWidth = function(){
        return this.cellWidth;
    }

    this.getCellHeight = function(){
        return this.cellHeight;
    }

    this.initGrid = function(){
        this.cellWidth = canvasWidth / this.width - this.cellMargin;
        this.cellHeight = canvasHeight / this.height - this.cellMargin;
    }

    this.getCell = function(x, y){
        return this.state.getCell(x, y);
    }

    this.calculate = function(){
        var newState = new State(this);
        for (var i = 0; i < this.getWidth(); i++) {
            for (var j = 0; j < this.getHeight(); j++) {
                this.getCell(i, j).calculate(newState);
            }
        }
        this.state = newState;
    }

}

function State(grid){

    this.grid = grid;

    this.array = new Array();
    for (var i = 0; i < this.grid.width; i++) {
        this.array[i] = new Array();
        for (var j = 0; j < this.grid.height; j++) {
            this.array[i][j] = new Cell(i, j, this.grid);
        }
    }

    this.getCell = function(x, y){
        return this.array[x][y];
    }
}

function init(){
    initCanvas();
    grid = new Grid(10, 10);
    grid.initGrid();

    draw();
    drawId = setInterval(draw, 33);
}

function initCanvas(){
    ctx = c.getContext("2d");
    canvasWidth = ctx.canvas.width;
    canvasHeight = ctx.canvas.height;
    canvasLeft = c.offsetLeft;
    canvasTop = c.offsetTop; 
}

function draw(){
    ctx.fillStyle = "#FFFFFF";
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    for (var i = 0; i < grid.getWidth(); i++){
        for (var j = 0; j < grid.getHeight(); j++){
            grid.getCell(i, j).draw(ctx);
        }
    }
}

function step(){
    grid.calculate();
}

function run(){
    runId = setInterval(step, 500);
}

function stop(){
    clearInterval(runId);
}

function clickHandler(event){
    if (grid != null){
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
