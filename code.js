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
        this.ld = new LeafData();
    }
}

class Tree{
    constructor(treeData, x, y){
        this.treeData = treeData;
        this.x = x;
        this.y = y;
    }
}

class LeafData{
    constructor(){
        this.leafColor = [Math.random(), Math.random(), Math.random()]
        this.leafColorVary = ((Math.random()*4)**0.5)/2;
        this.leafClumpColorVary = ((Math.random()*4)**0.5)/2;
        this.leafClumpSpread = ((Math.random()*9)**0.5)/3;
        this.leafClumpAmount = Math.random()*4+1;
        this.leafClumpAngleVary = randomBetween(Math.PI/8, Math.PI/2, 0.01);
        this.leafAngleVary = randomBetween(Math.PI/8, Math.PI/2, 0.01);
        this.leafSizeVary = Math.random()*0.5;
        this.leafClumpSizeVary = Math.random()*0.5;
        this.leafPoints = randomBetween(1, 9, 1);
        this.startInnerD = randomBetween(3, 9, 0.01);
        this.startInnerDVary = randomBetween(0.5, 1.5, 0.01);
        this.innerOuterD = randomBetween(3, 9, 0.01);
        this.innerOuterDVary = randomBetween(0.5, 1.5, 0.01);
        this.innerSpreadAngle = randomBetween(Math.PI/4, Math.PI*1.5, 0.01);
        this.innerSpreadAngleVary = randomBetween(0.5, 1.5, 0.01);
        this.innerAngleVary = Math.random()*this.innerSpreadAngle/this.leafPoints/2;
        this.outerAngleVary = Math.random()*this.innerSpreadAngle/this.leafPoints/2;
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

function drawTriangle(ctx, x1, y1, x2, y2, x3, y3){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.fill();
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

function drawBranch(td, tier, angle, targetAngle, x, y, tX, tY, ctx, m, trunkY, light, waveCounter){
    let bm = 1+randomBetween(-td.branchLengthVary, td.branchLengthVary, 0.01);
    let s = td.branchSegments+randomBetween(-1*td.branchSegmentsVary, td.branchSegmentsVary, 1);
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
        bwsm = 1+Math.random()*td.branchWaveSizeVary;
        bwlm = 1+Math.random()*td.branchWaveLengthVary;
        let slm = 1+randomBetween(-td.branchSegmentLengthVary, td.branchSegmentLengthVary, 0.01);
        let r0 = (td.branchColor[0]*z*a+light[0]*b)*(1-Math.random()*td.branchColorVary);
        let g0 = td.branchColor[1]*z*a+light[1]*b*(1-Math.random()*td.branchColorVary);
        let b0 = td.branchColor[2]*z*a+light[2]*b*(1-Math.random()*td.branchColorVary);
        ctx.strokeStyle = colorString(r0, g0, b0, 1);
        ctx.lineWidth = td.branchThickness/(td.branchThicknessProportions**(tier+i*td.tierSmoothness/s));
        ctx.beginPath();
        ctx.moveTo(xCounter*m+tX+Math.sin(wave*td.branchWaveLength*oldBwlm)*td.branchWaveSize*oldBwsm, yCounter*m+tY);
        let wobble = randomBetween(-1*td.branchWobble, td.branchWobble, 0.01);
        wave ++;
        currentAngle += ((targetAngle-angle)+wobble-lastWobble)/s;
        lastWobble = wobble;
        xCounter += Math.cos(currentAngle)*slm*bm/td.tiers/s/2;
        yCounter += Math.sin(currentAngle)*slm*bm/td.tiers/s/2;
        let xExtend = xCounter+Math.cos(currentAngle)*slm*bm/td.tiers/td.segmentExtend;
        let yExtend = yCounter+Math.sin(currentAngle)*slm*bm/td.tiers/td.segmentExtend;
        ctx.lineTo(xExtend*m+tX+Math.sin(wave*td.branchWaveLength*bwlm)*td.branchWaveSize*bwsm, yExtend*m+tY);
        ctx.stroke();
        if (Math.random()*tier/td.tiers > td.ld.leafClumpSpread) {
            if (Math.random() < 1/2/td.ld.leafClumpAmount) {
                drawLeafClump(ctx, td.ld, m, xCounter, yCounter, tX, tY, trunkY, light, currentAngle);
            }
        }
    }
    if (td.tiers > tier) {
        for (let i=0; i<randomBetween(td.growth-1, td.growth+1, 1); i++) {
            let branchContinue = false;
            if (i == 0) {
                if (Math.random() > td.branchContinue) {
                    branchContinue = true;
                }
            }
            let newTargetAngle = targetAngle;
            if (!branchContinue) {
                newTargetAngle = randomBetween(currentAngle-td.angleVary, currentAngle+td.angleVary, 0.01);
            }
            let branchBend = td.branchBend+randomBetween(-1*td.branchBendVary, td.branchBendVary, 0.01);
            let startingAngle = currentAngle+(newTargetAngle-currentAngle)*branchBend;
            drawBranch(td, tier+1, startingAngle, newTargetAngle, xCounter, yCounter, tX, tY, ctx, m, trunkY, light, wave);
        }
    }
}

function drawLeafClump(ctx, ld, m, x, y, tX, tY, trunkY, light, angle){
    let clumpColor = Math.random()*ld.leafClumpColorVary;
    let clumpAngleVary = randomBetween(-1*ld.leafClumpAngleVary, ld.leafClumpAngleVary, 0.01);
    let clumpSizeVary = randomBetween(1-ld.leafClumpSizeVary, 1+ld.leafClumpSizeVary, 0.01);
    let z = (trunkY*5-1)/4;
    let a = 1.4-trunkY;
    let b = trunkY-0.4;
    for (let i=0; i<ld.leafClumpAmount; i++) {
        let am = angle+clumpAngleVary+randomBetween(-1*ld.leafAngleVary, ld.leafAngleVary, 0.01);
        let sm = clumpSizeVary+randomBetween(1-ld.leafSizeVary, 1+ld.leafSizeVary, 0.01);
        let r0 = (ld.leafColor[0]*z*a+light[0]*b)*(1-Math.random()*ld.leafColorVary*clumpColor);
        let g0 = (ld.leafColor[1]*z*a+light[1]*b)*(1-Math.random()*ld.leafColorVary*clumpColor);
        let b0 = (ld.leafColor[2]*z*a+light[2]*b)*(1-Math.random()*ld.leafColorVary*clumpColor);
        let point1 = {
            x: x*m+Math.cos(ld.innerSpreadAngle*0/(ld.leafPoints+1)-ld.innerSpreadAngle/2+am)*ld.startInnerD*sm+tX,
            y: y*m+Math.sin(ld.innerSpreadAngle*0/(ld.leafPoints+1)-ld.innerSpreadAngle/2+am)*ld.startInnerD*sm+tY,
            angle: ld.innerSpreadAngle*0/(ld.leafPoints+1)-ld.innerSpreadAngle/2+am
        };
        ctx.fillStyle = colorString(r0, g0, b0, 1);
        for (let j=0; j<ld.leafPoints; j++) {
            let point2 = {
                x: x*m+Math.cos(ld.innerSpreadAngle*(j+1)/(ld.leafPoints+1)-ld.innerSpreadAngle/2+am)*ld.startInnerD*sm+tX,
                y: y*m+Math.sin(ld.innerSpreadAngle*(j+1)/(ld.leafPoints+1)-ld.innerSpreadAngle/2+am)*ld.startInnerD*sm+tY,
                angle: ld.innerSpreadAngle*(j+1)/(ld.leafPoints+1)-ld.innerSpreadAngle/2+am
            };
            ctx.beginPath();
            ctx.moveTo(x*m+tX, y*m+tY);
            ctx.lineTo(point1.x, point1.y);
            ctx.lineTo(point2.x, point2.y);
            ctx.fill();
            toX = x*m+Math.cos((point1.angle+point2.angle)/2)*(ld.startInnerD+ld.innerOuterD)*sm+tX;
            toY = y*m+Math.sin((point1.angle+point2.angle)/2)*(ld.startInnerD+ld.innerOuterD)*sm+tY;
            ctx.beginPath();
            ctx.moveTo(toX, toY);
            ctx.lineTo(point1.x, point1.y);
            ctx.lineTo(point2.x, point2.y);
            ctx.fill();
            point1 = point2;
        }
    }
}