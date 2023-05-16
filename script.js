const photoFile = document.getElementById("photo-file")
let image = document.getElementById("photo-preview")

document.getElementById("select-image").onclick = function () {
    photoFile.click()

}
window.addEventListener('DOMContentLoaded', () => {
    photoFile.addEventListener('change', () => {
        let file = photoFile.files.item(0)
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {

            image.src = event.target.result
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
    }
}

Object.keys(events).forEach(eventName => {
    image.addEventListener(eventName, events[eventName])
})


