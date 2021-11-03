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
        this.branchBend = (Math.random()*3-1.5)+1;
        this.branchBendVary = Math.random();
        this.branchWobble = Math.random()*8;
        this.tierSmoothness = Math.random();
        this.segmentExtend = randomBetween(5, 101, 1);
        this.branchColorVary = Math.random()*0.8;
        this.branchSegments = randomBetween(3, 21, 1);
        this.branchSegmentsVary = randomBetween(0, this.branchSegments/2, 1);
        this.branchSegmentLengthVary = Math.random()*0.7;
        this.branchLengthVary = Math.random()*0.7;
        this.branchContinue = Math.random();
        this.branchWaveSize = Math.random()*4;
        this.branchWaveLength = Math.random()*1.5;
        this.branchWaveSizeVary = Math.random()/2;
        this.branchWaveLengthVary = Math.random()/2;
    }
}

class Tree{
    constructor(treeData, x, y){
        this.treeData = treeData;
        this.x = x;
        this.y = y;
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
    let m = 0;
    let mp = 0;
    if (mainCanvas.width > mainCanvas.height) {
        m = mainCanvas.height;
        mp = mainCanvas.width/m;
    } else {
        m = mainCanvas.width;
        mp = mainCanvas.height/m;
    }
    let light = [randomBetween(0.7, 1, 0.01), randomBetween(0.7, 1, 0.01), randomBetween(0.7, 1, 0.01)];
    let treeDatas = [];
    for (let i=0; i<randomBetween(2, 6, 1); i++) {
        treeDatas.push(new TreeData());
    }
    let trees = [];
    for (let i=0; i<randomBetween(6*mp, 18*mp, 1); i++) {
        let tree = new Tree(treeDatas[randomBetween(0, treeDatas.length, 1)], randomBetween(0, mainCanvas.width, 0.01), randomBetween(0.4*mainCanvas.height, mainCanvas.height, 0.01));
        let counter = 0;
        let finding = true;
        while (finding) {
            if (trees.length == counter) {
                finding = false;
            } else {
                if (trees[counter].y > tree.y) {
                    finding = false;
                } else {
                    counter ++;
                }
            }
        }
        trees.splice(counter, 0, tree);
    }
    mainCTX.fillStyle = "#000000FF";
    mainCTX.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
     trees.forEach((tree)=>{
         drawTree(tree.treeData, mainCTX, m, 0, 0, tree.x, tree.y, tree.y/mainCanvas.height, light);
    });
}
generateButton.addEventListener("click", generateButtonClicked);

function drawTree(treeData, ctx, m, x, y, tX, tY, trunkY, light){
    drawBranch(treeData, 0, Math.PI/-2, Math.PI/-2, x, y, tX, tY, ctx, m, trunkY, light, 0);
}

function drawBranch(treeData, tier, angle, targetAngle, x, y, tX, tY, ctx, m, trunkY, light, waveCounter){
    let bm = 1+randomBetween(-treeData.branchLengthVary, treeData.branchLengthVary, 0.01);
    let s = treeData.branchSegments+randomBetween(-1*treeData.branchSegmentsVary, treeData.branchSegmentsVary, 1);
    let z = (trunkY*5-1)/4;
    let a = 1.4-trunkY;
    let b = trunkY-0.4;
    let xCounter = x;
    let yCounter = y;
    let currentAngle = angle;
    let lastWobble = 0;
    let wave = waveCounter;
    let bwsm = 0;
    let bwlm = 0;
    let oldBwsm = 0;
    let oldBwlm = 0;
    for (let i=0; i<s; i++) {
        oldBwsm = bwsm;
        oldBwlm = bwlm;
        bwsm = 1+Math.random()*treeData.branchWaveSizeVary;
        bwlm = 1+Math.random()*treeData.branchWaveLengthVary;
        let slm = 1+randomBetween(-treeData.branchSegmentLengthVary, treeData.branchSegmentLengthVary, 0.01);
        let r0 = (treeData.branchColor[0]*z*a+light[0]*b)*(1-Math.random()*treeData.branchColorVary);
        let g0 = treeData.branchColor[1]*z*a+light[1]*b*(1-Math.random()*treeData.branchColorVary);
        let b0 = treeData.branchColor[2]*z*a+light[2]*b*(1-Math.random()*treeData.branchColorVary);
        ctx.strokeStyle = colorString(r0, g0, b0, 1);
        ctx.lineWidth = treeData.branchThickness/(treeData.branchThicknessProportions**(tier+i*treeData.tierSmoothness/s));
        ctx.beginPath();
        ctx.moveTo(xCounter*m+tX+Math.sin(wave*treeData.branchWaveLength*oldBwlm)*treeData.branchWaveSize*oldBwsm, yCounter*m+tY);
        let wobble = randomBetween(-1*treeData.branchWobble, treeData.branchWobble, 0.01);
        wave ++;
        currentAngle += ((targetAngle-angle)+wobble-lastWobble)/s;
        lastWobble = wobble;
        xCounter += Math.cos(currentAngle)*slm*bm/treeData.tiers/s/2;
        yCounter += Math.sin(currentAngle)*slm*bm/treeData.tiers/s/2;
        let xExtend = xCounter+Math.cos(currentAngle)*slm*bm/treeData.tiers/treeData.segmentExtend;
        let yExtend = yCounter+Math.sin(currentAngle)*slm*bm/treeData.tiers/treeData.segmentExtend;
        ctx.lineTo(xExtend*m+tX+Math.sin(wave*treeData.branchWaveLength*bwlm)*treeData.branchWaveSize*bwsm, yExtend*m+tY);
        ctx.stroke();
    }
    if (treeData.tiers > tier) {
        for (let i=0; i<randomBetween(treeData.growth-1, treeData.growth+1, 1); i++) {
            let branchContinue = false;
            if (i == 0) {
                if (Math.random() > treeData.branchContinue) {
                    branchContinue = true;
                }
            }
            let newTargetAngle = targetAngle;
            if (!branchContinue) {
                newTargetAngle = randomBetween(currentAngle-treeData.angleVary, currentAngle+treeData.angleVary, 0.01);
            }
            let branchBend = treeData.branchBend+randomBetween(-1*treeData.branchBendVary, treeData.branchBendVary, 0.01);
            let startingAngle = currentAngle+(newTargetAngle-currentAngle)*branchBend;
            drawBranch(treeData, tier+1, startingAngle, newTargetAngle, xCounter, yCounter, tX, tY, ctx, m, trunkY, light, wave);
        }
    }
}