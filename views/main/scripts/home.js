document.querySelector('.login').addEventListener('submit', function(event) {
    event.preventDefault()

    let formData = new FormData(this)
    let object = {}
    formData.forEach((value, key) => { object[key] = value; })
    let json = JSON.stringify(object)

    fetch('/login/submit', {
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
            window.location.href = '/inventory/menu'
        } else {
            swal({ 
                title: "Erro",
                text: data.message || "Credenciais Inválidas",  
                icon: "error",
            })
        }
    })
    .catch(error => {
        swal({ 
            title: "Erro",
            text: "Falha ao acessar a aplicação",
            icon: "error",
        })
    })
})
