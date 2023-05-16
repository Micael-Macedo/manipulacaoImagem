const photoFile = document.getElementById("photo-file")
let photoPreview = document.getElementById("photo-preview")
let photoName;
let image;
document.getElementById("select-image").onclick = function () {
    photoFile.click()

}
window.addEventListener('DOMContentLoaded', () => {
    photoFile.addEventListener('change', () => {
        let file = photoFile.files.item(0)
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            image = new Image();
            photoName = file.name
            image.src = event.target.result
            image.onload = onLoadImage
        }
    })
})
let startX, startY, relativeStartX, relativeStartY, endX, endY, relativeEndX, relativeEndY
let startSelection = false
// Selection tool
const selection = document.getElementById("selection-tool")
const events = {
    mouseover() {
        this.style.cursor = 'crosshair'
    },
    mousedown() {
        const { clientX, clientY, offsetX, offsetY } = event;
        // console.table({
        //   mouse em relaçao a tela do cliente
        //  'cliente': [clientX, clientY],
        //  mouse em relaçao a imagem
        //  'offset': [offsetX, offsetY]
        // })

            startX = clientX
            startY = clientY

            relativeStartX = offsetX
            relativeStartY = offsetY

            startSelection = true
    },
    mousemove() { 
        endX = event.clientX
        endY = event.clientY
        if(startSelection) {

            selection.style.display = 'initial';
            selection.style.top = startY + 'px';
            selection.style.left = startX + 'px';
            
            selection.style.width = (endX - startX) + 'px';
            selection.style.height = (endY - startY) + 'px';
        }


    },
    mouseup() {
        startSelection = false;
        relativeEndX = event.layerX
        relativeEndY = event.layerY
        cropButton.style.display = "initial"
    }
}

Object.keys(events).forEach(eventName => {
    photoPreview.addEventListener(eventName, events[eventName])
})

let canvas = document.createElement("canvas")
let ctx = canvas.getContext('2d');

function onLoadImage(){
    const {width, height} = image
    canvas.width = width
    canvas.height = height

    ctx.clearRect(0,0, width, height)
    ctx.drawImage(image, 0 , 0)
    photoPreview.src = canvas.toDataURL()
}

const cropButton = document.getElementById("crop-image")
cropButton.onclick = () =>{
    const {width: imgW, height: imgH} = image
    const {width: previewW, height: previewH} = photoPreview

    const [widthFactor, heightFactor] = [+(imgW / previewW), +(imgH / previewH)]
    const [selectionWidth, selectionHeight] = 
    [
        +selection.style.width.replace('px', ''), 
        +selection.style.height.replace('px', '')
    ]
    const [croppedWidth, croppedHeight] = [
        +(selectionWidth * widthFactor),
        +(selectionHeight * heightFactor)
    ]

    const [actualX, actualY] = [
        +(relativeStartX * widthFactor),
        +(relativeStartY * heightFactor),
    ]
    // pegar do ctx a imagem cortada
    const croppedImage = ctx.getImageData(actualX, actualY, croppedWidth, croppedHeight);

    //limpar o ctx do canvas
    ctx.clearRect(0,0,ctx.width, ctx.height)
    image.width = canvas.width = croppedWidth
    image.height = canvas.height = croppedHeight

    //adicionar a imagem cortada ao contexto
    ctx.putImageData(croppedImage, 0, 0)

    // esconder a ferramenta de seleção
    selection.style.display = "none"

    //atualizar o preview 
    photoPreview.src = canvas.toDataURL()
    downloadButton.style.display = 'initial'
}
const downloadButton = document.getElementById("download")

downloadButton.onclick = () =>{
    const a = document.createElement("a");
    a.href = canvas.toDataURL()
    a.download = photoName + "-cropped.png";
    a.click()
}

