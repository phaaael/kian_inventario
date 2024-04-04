const getHome = (req, res) => {
    const dynamicData = { 
        title: 'Kian Inventário',
        desc: 'Solicitações de Equipamentos ao TI'
    }

    res.render('home', { data: dynamicData })
};
  
module.exports = { getHome }