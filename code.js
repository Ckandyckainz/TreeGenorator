let mainCanvas = document.getElementById("maincanvas");
let mainCTX = mainCanvas.getContext("2d");
let generateButton = document.getElementById("generatebutton");
mainCanvas.width = window.innerWidth*0.9;
mainCanvas.height = window.innerHeight*0.9;

class TreeData{
    constructor(){
        this.branchColor = colorString(Math.random(), Math.random(), Math.random(), 1);
        this.leafColor = colorString(Math.random(), Math.random(), Math.random(), 1);
        this.tiers = randomBetween(3, 8, 1);
        this.growth = randomBetween(1, 4, 1);
        this.angleVary = randomBetween(Math.PI/8, Math.PI/2, 0.01);
        this.branchThickness = randomBetween(3, 12, 1);
        this.branchThicknessProportions = randomBetween(1, 2, 0.01);
    }
}

function randomBetween(min, max, precision){
    return Math.floor((Math.random()*(max-min)+min)/precision)*precision;
}

function colorString(r, g, b, a){
    r = Math.floor(r*255)*256*256*256;
    g = Math.floor(g*255)*256*256;
    b = Math.floor(b*255)*256;
    a = Math.floor(a*255);
    return "#"+(r+g+b+a).toString(16).padStart(8, "0");
}

function generateButtonClicked(){
    mainCTX.fillStyle = "#000000FF";
    mainCTX.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    let treeData = new TreeData();
    drawTree(treeData, mainCTX, mainCanvas.width, mainCanvas.height);
}
generateButton.addEventListener("click", generateButtonClicked);

function drawTree(treeData, ctx, w, h){
    drawBranch(treeData, 0, Math.PI/-2, 0.5, 0.7, ctx, w, h);
}

function drawBranch(treeData, tier, angle, x, y, ctx, w, h){
    ctx.strokeStyle = treeData.branchColor;
    ctx.lineWidth = treeData.branchThickness/(treeData.branchThicknessProportions**tier);
    ctx.beginPath();
    ctx.moveTo(x*w, y*h);
    ctx.lineTo((x+Math.cos(angle)/treeData.tiers/2)*w, (y+Math.sin(angle)/treeData.tiers/2)*h);
    ctx.stroke();
    if (treeData.tiers > tier) {
        for (let i=0; i<randomBetween(treeData.growth-1, treeData.growth+1, 1); i++) {
            drawBranch(treeData, tier+1, randomBetween(angle-treeData.angleVary, angle+treeData.angleVary, 0.01), x+Math.cos(angle)/treeData.tiers/2, y+Math.sin(angle)/treeData.tiers/2, ctx, w, h);
        }
    }
}