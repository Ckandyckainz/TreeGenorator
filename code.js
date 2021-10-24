let mainCanvas = document.getElementById("maincanvas");
let mainCTX = mainCanvas.getContext("2d");
let generateButton = document.getElementById("generatebutton");
mainCanvas.width = window.innerWidth*0.9;
mainCanvas.height = window.innerHeight*0.9;

class TreeData{
    constructor(){
        this.branchColor = [Math.random(), Math.random(), Math.random()];
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
        this.branchColorVary = Math.random()*0.8;
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
    let light = [Math.random()/2+0.5, Math.random()/2+0.5, Math.random()/2+0.5];
    mainCTX.fillStyle = "#000000FF";
    mainCTX.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    let treeData0 = new TreeData();
    let treeData1 = new TreeData();
    let treeData2 = new TreeData();
    let y = 0.4;
    for (let i=0; i<randomBetween(3, 6, 1); i++) {
        y += randomBetween(0, (1-y)/2.5, 0.01);
        drawTree(treeData0, mainCTX, mainCanvas.width, mainCanvas.height, randomBetween(0, 1, 0.01), y, light);
        y += randomBetween(0, (1-y)/2.5, 0.01);
        drawTree(treeData1, mainCTX, mainCanvas.width, mainCanvas.height, randomBetween(0, 1, 0.01), y, light);
        y += randomBetween(0, (1-y)/2.5, 0.01);
        drawTree(treeData2, mainCTX, mainCanvas.width, mainCanvas.height, randomBetween(0, 1, 0.01), y, light);
    }
}
generateButton.addEventListener("click", generateButtonClicked);

function drawTree(treeData, ctx, w, h, x, y, light){
    drawBranch(treeData, 0, Math.PI/-2, Math.PI/-2, x, y, ctx, w, h, y, light);
}

function drawBranch(treeData, tier, angle, targetAngle, x, y, ctx, w, h, trunkY, light){
    let z = (trunkY*5-1)/4;
    let a = 1.4-trunkY;
    let b = trunkY-0.4;
    let xCounter = x;
    let yCounter = y;
    let currentAngle = angle;
    let lastWobble = 0;
    for (let i=0; i<10; i++) {
        let r0 = (treeData.branchColor[0]*z*a+light[0]*b)*(1-Math.random()*treeData.branchColorVary);
        let g0 = treeData.branchColor[1]*z*a+light[1]*b*(1-Math.random()*treeData.branchColorVary);
        let b0 = treeData.branchColor[2]*z*a+light[2]*b*(1-Math.random()*treeData.branchColorVary);
        ctx.strokeStyle = colorString(r0, g0, b0, 1);
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
            drawBranch(treeData, tier+1, startingAngle, newTargetAngle, xCounter, yCounter, ctx, w, h, trunkY, light);
        }
    }
}