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
        this.growth = randomBetween(2, 4, 1);
        this.angleVary = randomBetween(Math.PI/8, Math.PI/2, 0.01);
        this.branchThickness = randomBetween(6, 19, 1);
        this.branchThicknessProportions = randomBetween(1.5, 2, 0.01);
        this.branchBend = Math.random()*3-1.5;
        this.branchBendVary = Math.random();
        this.branchWobble = Math.random()*8;
        this.tierSmoothness = Math.random();
        this.segmentExtend = randomBetween(5, 101, 1);
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
    drawBranch(treeData, 0, Math.PI/-2, Math.PI/-2, 0.5, 0.7, ctx, w, h);
}

function drawBranch(treeData, tier, angle, targetAngle, x, y, ctx, w, h){
    ctx.strokeStyle = treeData.branchColor;
    let xCounter = x;
    let yCounter = y;
    let currentAngle = angle;
    let lastWobble = 0;
    for (let i=0; i<10; i++) {
        ctx.lineWidth = treeData.branchThickness/(treeData.branchThicknessProportions**(tier+i*treeData.tierSmoothness/10));
        ctx.beginPath();
        ctx.moveTo(xCounter*w, yCounter*h);
        let wobble = randomBetween(-1*treeData.branchWobble, treeData.branchWobble, 0.01);
        currentAngle += ((targetAngle-angle)+wobble-lastWobble)/10;
        lastWobble = wobble;
        xCounter += Math.cos(currentAngle)/treeData.tiers/20;
        yCounter += Math.sin(currentAngle)/treeData.tiers/20;
        let xExtend = xCounter+Math.cos(currentAngle)/treeData.tiers/treeData.segmentExtend;
        let yExtend = yCounter+Math.sin(currentAngle)/treeData.tiers/treeData.segmentExtend;
        ctx.lineTo(xExtend*w, yExtend*h);
        ctx.stroke();
    }
    if (treeData.tiers > tier) {
        for (let i=0; i<randomBetween(treeData.growth-1, treeData.growth+1, 1); i++) {
            let newTargetAngle = randomBetween(currentAngle-treeData.angleVary, currentAngle+treeData.angleVary, 0.01);
            let branchBend = treeData.branchBend+randomBetween(-1*treeData.branchBendVary, treeData.branchBendVary, 0.01);
            let startingAngle = currentAngle+(newTargetAngle-currentAngle)*branchBend;
            drawBranch(treeData, tier+1, startingAngle, newTargetAngle, xCounter, yCounter, ctx, w, h);
        }
    }
}