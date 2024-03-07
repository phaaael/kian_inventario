document.querySelector('.registration').addEventListener('submit', function(event) {
    event.preventDefault()

    let formData = new FormData(this)
    let object = {}
    formData.forEach((value, key) => { object[key] = value; })
    let json = JSON.stringify(object)

    fetch('/inventory/registration/submit', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: json
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Houve um problema com a resposta da rede')
        }
        return response.json()
    })
    .then(data => {
        if (data.success) {
            swal({
                title: "Sucesso",
                text: data.message,
                icon: "success",
            }).then(() => {
                location.reload()
            })
        } else {
            swal({ 
                title: "Erro",
                text: data.message || "Não foi possível concluir a solicitação",
                icon: "error",
            })
        }
    })
    .catch(error => {
        swal({ 
            title: "Erro",
            text: "Não foi possível concluir a solicitação",
            icon: "error",
        })
    })
})

