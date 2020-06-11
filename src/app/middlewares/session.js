function onlyUsers(req, res, next) {
    if (!req.session.userId) 
        return res.redirect('/session/login')
    next()
}
  
function loggedRedirectToProfile(req, res, next) {
    if (req.session.userId) 
        return res.redirect('/admin/users')
    next()
}
  
function isAdmin(req, res, next) {
    if (req.session.is_admin != true) 
        return res.redirect('/admin/recipes')
    next()
}
  
  
module.exports = {
    onlyUsers,
    loggedRedirectToProfile,
    isAdmin
}