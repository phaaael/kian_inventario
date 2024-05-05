const getHome = (req, res) => {
    const dynamicData = { 
        title: 'Kian Inventário',
        desc: 'Requerimentos de Equipamentos/Suprimentos ao TI'
    }

    res.render('main/home', { data: dynamicData })
};
  
module.exports = { getHome }