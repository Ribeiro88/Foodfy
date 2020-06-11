const PhotosUpload = {
    input: "",
    preview: document.querySelector("#photos-preview"),
    uploadLimit: 5,
    files: [],

    handleFileInput(event){
        const { files: fileList } = event.target
        PhotosUpload.input = event.target
        
        if(PhotosUpload.hasLimit(event)) return 

        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file)
            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const container = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(container)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event){
        const { uploadLimit, input, preview  } = PhotosUpload

        const { files: fileList } = input
        if(fileList.length > uploadLimit){
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const container = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                container.push(item)
        })

        const totalPhotos = fileList.length + container.length
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles(){
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
        return dataTransfer.files
    },
    getContainer(image){
        const container = document.createElement('div')
        container.classList.add('photo')
        container.onclick = PhotosUpload.removePhoto

        container.appendChild(image)
        container.appendChild(PhotosUpload.getRemoveButton())

        return container
    },
    getRemoveButton(){
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event){
        const container = event.target.parentNode 
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(container)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        container.remove()

    },
    removeOldPhoto(event) {
        const container = event.target.parentNode

        if(container.id) {
            const removedFiles = document.querySelector('input[name="removed_files"')
            if (removedFiles) {
                removedFiles.value += `${container.id},`
            }
        }

        container.remove()
    }
}

const ImageGallery = {

    highlight: document.querySelector('.destaque-receitas-image > img'),
    previews: document.querySelectorAll('.edit-gallery-preview > img'),

    setImage(e) {
        const selected = e.target

        for (image of ImageGallery.previews) {
            image.classList.remove("selected");
        }

        selected.classList.add("selected");

        ImageGallery.highlight.src = selected.src;
        ImageGallery.highlight.alt = selected.alt;
    }
}