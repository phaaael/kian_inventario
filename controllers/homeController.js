const getHome = (req, res) => {
    const dynamicData = { message: 'Login' }

    res.render('home', { data: dynamicData })
};
  
module.exports = { getHome }