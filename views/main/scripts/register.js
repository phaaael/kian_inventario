document.querySelector('.register').addEventListener('submit', function(event) {
    event.preventDefault()

    let formData = new FormData(this)
    let object = {}
    formData.forEach((value, key) => { object[key] = value; })
    let json = JSON.stringify(object)

    fetch('/register/submit', {
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
                text: "Registro Concluído com Sucesso",
                icon: "success",
                button: "OK",
            }).then((value) => {
                window.location.href = '/'
            })
        } else {
            swal({
                title: "Erro",
                text: data.message || "Não foi possível concluir o registro",
                icon: "error",
                button: "OK",
            })
        }
    })
    .catch(error => {
        swal({
            title: "Erro",
            text: "Não foi possível concluir o requerimento",
            icon: "error",
            button: "OK",
        })
    })
})
