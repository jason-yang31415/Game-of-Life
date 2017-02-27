
//canvas stuff
var ctx;
var canvasWidth;
var canvasHeight;

var backgroundColor = "#FFFFFF";
var unshadedColor = "#B0B0B0";
var shadedColor = "#808080";

//backend vars
var grid;

function Cell(x, y, grid){
    
    this.x = x;
    this.y = y;
    this.grid = grid;

    this.shaded = false;

    this.getX = function(){
        return this.x;
    }

    this.getY = function(){
        return this.y;
    }

    this.getShaded = function(){
        return this.shaded;
    }

    this.draw = function(ctx){
        if (this.getShaded())
            ctx.fillStyle = shadedColor;
        else
            ctx.fillStyle = unshadedColor;
        
        var tlx = (grid.cellWidth + grid.cellMargin) * this.x;
        var tly = (grid.cellHeight + grid.cellMargin) * this.y;
        ctx.fillRect(tlx, tly, grid.cellWidth, grid.cellHeight);
    }

}

function Grid(width, height){

    this.width = width;
    this.height = height;

    this.cellWidth;
    this.cellHeight;
    this.cellMargin = 1;

    this.grid = new Array();

    this.getWidth = function(){
        return this.width;
    }

    this.getHeight = function(){
        return this.height;
    }

    this.initGrid = function(){
       for (var i = 0; i < this.width; i++){
          grid[i] = new Array();
          for (var j = 0; j < this.height; j++){
              grid[i][j] = new Cell(i, j, this);
          }
       }

       this.cellWidth = canvasWidth / this.width - this.cellMargin;
       this.cellHeight = canvasHeight / this.height - this.cellMargin;
    }

    this.getCell = function(x, y){
        return grid[x][y];
    }

}

function init(){
    initCanvas();
    grid = new Grid(10, 10);
    grid.initGrid();

    step();
    setInterval(step, 33);
}

function initCanvas(){
    var c = document.getElementById("canvas");

    ctx = c.getContext("2d");
    canvasWidth = ctx.canvas.width;
    canvasHeight = ctx.canvas.height;
}

function step(){
    ctx.fillStyle = "#FFFFFF";
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    for (var i = 0; i < grid.getWidth(); i++){
        for (var j = 0; j < grid.getHeight(); j++){
            grid.getCell(i, j).draw(ctx);
        }
    }
}