const getHome = (req, res) => {
    const dynamicData = { 
        title: 'Kian Inventário',
        desc: 'Solicitações de Equipamentos/Suprimentos ao TI'
    }

    res.render('home', { data: dynamicData })
};
  
module.exports = { getHome }