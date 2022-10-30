'use strict'

const STORAGE_KEY = 'memeDB'

let gCurrLine = 0
let gFonts = []
let gPositions = []
let gMemes =[]
let gElCanvas = document.getElementById('img-to-meme')
let gCtx
let gMeme ={ 
    selectedImgId: 1, 
    selectedLineIdx: 0, 
    lines: 
    [ { txt: 'I sometimes eat Falafel', 
        size: 40, align: 'right', 
        color: '#FFFFFF'},
        { txt: 'I always eat Nuggets', 
        size: 30, align: 'center', 
        color: '#FFFFFF'} ] 
    }
    
let gCurrAlign = '.text-' + gMeme.lines[gMeme.selectedLineIdx].align
    
let gBorderPosition = []
document.querySelector('.txt-change').placeholder = gMeme.lines[gMeme.selectedLineIdx].txt
document.querySelector(gCurrAlign).style.backgroundColor = "var(--clr-4)"
// resizeCanvas()

function getMeme(){
    return gMeme
}

function getElCanvas(){
    return gElCanvas
}


function drawImg(canvas = gElCanvas,meme = gMeme, isBorder = false,elLink='done'){
    gBorderPosition = []
    let position
    let imgs = getImgs()
    let objWithIdIndex = imgs.findIndex(ele => ele.id === meme.selectedImgId)
    gCtx = canvas.getContext('2d')
    const img = new Image()
    if(gFonts.length === 0){
        for(var i = 0; i < meme.lines.length; i++){
            gFonts.push('Impact')
        }
    }else if(gFonts.length != meme.lines.length){
        gFonts.push('Impact')
    }
    meme.selectedLineIdx = 0
    img.src = imgs[objWithIdIndex].url
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, canvas.width, canvas.height)
        meme.lines.forEach(line => {
            if(gPositions.length != meme.lines.length){
                if(gPositions.length === 0) gPositions.push(40)
                else if(gPositions.length === 1) gPositions.push(canvas.height)
                else if(gPositions.length > 1) gPositions.push(canvas.height/2)
            }
            if(gPositions[meme.selectedLineIdx] <= 40){
                gPositions[meme.selectedLineIdx] = 40
            }
            else if(gPositions[meme.selectedLineIdx] >= canvas.height){
                gPositions[meme.selectedLineIdx] = canvas.height
            }
            gCtx.font = line.size + 'px '+gFonts[meme.selectedLineIdx]
            gCtx.fillStyle = line.color
            gCtx.textAlign = line.align;
            let xPosition = gCtx.measureText(line.txt) 
            switch (line.align) {
                case 'right':
                    position = {x:xPosition.width,y:gPositions[meme.selectedLineIdx],start:0,end:xPosition.width}
                    break;
            
                case 'center': 
                    position = {x:canvas.width/2,y:gPositions[meme.selectedLineIdx],start:canvas.width/2-xPosition.width/2,end:xPosition.width}
                    break;

                case 'left':
                    position = {x:canvas.width - xPosition.width,y:gPositions[meme.selectedLineIdx],start:canvas.width - xPosition.width,end:xPosition.width}
                    break
            }
            gBorderPosition.push(position)
            gCtx.strokeStyle= 'black'
            gCtx.lineWidth = 1;
            gCtx.fillText(line.txt,position.x,position.y)
            gCtx.strokeText(line.txt,position.x,position.y)

            meme.selectedLineIdx++
        })
        meme.selectedLineIdx = gCurrLine
        if(!isBorder)drawBoard()
        else if(elLink != 'done'){
            downloadCanvas(elLink)
            drawBoard()
        }
        changeLineUsed()
    }
    
}



function setLineTxt(){
    gMeme.lines[gMeme.selectedLineIdx].txt = document.querySelector('.txt-change').value
}

function setTxtColor(){
    gMeme.lines[gMeme.selectedLineIdx].color = document.querySelector('.colors').value
}

function switchLines(){
    document.querySelector('.txt-change').value = ''
    gCurrLine++
    if(gCurrLine >= gMeme.lines.length) gCurrLine = 0
    gMeme.selectedLineIdx =gCurrLine
}

function _savMemesToStorage(key = STORAGE_KEY, val = gMemes){
    saveToStorage(key, val)
}

function fontSize(size){
    size === 'plus'? gMeme.lines[gMeme.selectedLineIdx].size +=1 : gMeme.lines[gMeme.selectedLineIdx].size -=1
}

function alignText(align){
    gMeme.lines[gMeme.selectedLineIdx].align = align
}

function addLine(){
    gMeme.lines.push(
        { 
        txt: 'New line', 
        size: 30, align: 'center', 
        color: '#FFFFFF'
        }
    )
    gCurrLine = gMeme.lines.length -1
    gMeme.selectedLineIdx = gCurrLine
}

function changeLineUsed(){
    if(gMeme.lines.length > 0){
        document.querySelector('.txt-change').placeholder = gMeme.lines[gMeme.selectedLineIdx].txt
        document.querySelector(gCurrAlign).style.backgroundColor = "var(--clr3)"
        gCurrAlign = '.text-' + gMeme.lines[gMeme.selectedLineIdx].align
        document.querySelector(gCurrAlign).style.backgroundColor = "var(--clr2)"
        document.querySelector('.fonts').value = gFonts[gMeme.selectedLineIdx]
    }else{
        document.querySelector('.txt-change').value = ''
        document.querySelector('.txt-change').placeholder = 'No line found' 
        document.querySelector(gCurrAlign).style.backgroundColor = "var(--clr3)"
        document.querySelector('.fonts').value = 'Impact'
    }

}

function deleteLine(){
    gMeme.lines.splice(gCurrLine,1)
    gFonts.splice(gCurrLine,1)
    gPositions.splice(gCurrLine,1)
    gCurrLine = 0
    gMeme.selectedLineIdx =gCurrLine
}

function changeFont(font){
    gFonts[gMeme.selectedLineIdx] = font
}

function moveText(diraction){
    gPositions[gMeme.selectedLineIdx] += diraction
}

function addEmoji(emoji){
    gMeme.lines.push(
        { 
        txt: emoji, 
        size: 30, align: 'center', 
        color: '#FFFFFF'
        }
    )
    gCurrLine = gMeme.lines.length -1
    gMeme.selectedLineIdx = gCurrLine
}

function resizeCanvas() {
    const elContainer = document.querySelector('.meme-canvas')
    // Note: changing the canvas dimension this way clears the canvas
    gElCanvas.width = elContainer.offsetWidth -10
    // Unless needed, better keep height fixed.
    // gElCanvas.height = elContainer.offsetHeight
}

function drawBoard(){
    const gradient = gCtx.createLinearGradient(0, 0, gElCanvas.width, gElCanvas.height)
    gradient.addColorStop('0', '#eee')
    gradient.addColorStop('.5', '#999')
    gradient.addColorStop('1', '#333')
        
    gCtx.lineWidth = 5
    gCtx.strokeStyle = gradient
    gCtx.strokeRect(gBorderPosition[gMeme.selectedLineIdx].start, 
        (gBorderPosition[gMeme.selectedLineIdx].y + 10), 
        gBorderPosition[gMeme.selectedLineIdx].end, 
        (-gMeme.lines[gMeme.selectedLineIdx].size - 10))
}

function onDownloadCanvas(elLink){
    drawImg(gElCanvas,gMeme,true,elLink)
}

function downloadCanvas(elLink) {
    // Gets the canvas content and convert it to base64 data URL that can be save as an image
    const data = gElCanvas.toDataURL("image/png") // Method returns a data URL containing a representation of the image in the format specified by the type parameter.
    elLink.href = data // Put it on the link
}

function saveMeme(){
    gMemes.push(gMeme)
}

function renderSaves(){
    document.querySelector('.saved-container').innerHTML = ''
    gMemes.forEach(meme =>{
        const strHtml =`<canvas class="meme-saved" 
        id="meme${i}"
        height="500"
        width="500"
        onclick="addEditor()"
        ></canvas>`
       document.querySelector('.saved-container').innerHTML += strHtml
       const canvas = document.getElementById(`meme${i}`)
       drawImg(canvas,meme,true) 
    })
}

