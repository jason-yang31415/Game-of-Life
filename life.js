
//canvas stuff
var ctx;
var canvasWidth;
var canvasHeight;

//backend vars
var grid;

function Cell(x, y){
    
    this.x = x;
    this.y = y;

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

}

function Grid(width, height){
    this.width = width;
    this.height = height;

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
              grid[i][j] = new Cell(i, j);
          }
       }
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
}

function initCanvas(){
    var c = document.getElementById("canvas");
    canvasWidth = c.width;
    canvasHeight = c.height;

    ctx = c.getContext("2d");
}

function step(){
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "#000000";
    for (var i = 0; i < grid.getWidth(); i++){
        for (var j = 0; j < grid.getHeight(); j++){
            alert("cell");
            if (!grid.getCell(i, j).getShaded()){
                ctx.fillRect(10 * i, 10 * j, 10 * i + 10, 10 * j + 10);
            }
        }
    }
}