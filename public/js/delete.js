const formDelete = document.querySelectorAll('#form-delete')

for (form of formDelete) {
    form.addEventListener('submit', event => {
        const confirmation = confirm('Tem certeza que deseja deletar este usuário?')
        if(!confirmation) {
            event.preventDefault()
        }
    })
}