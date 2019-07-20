const httpError = require('http-errors');
const passport = require('passport');

const requireAdmin = function (req, res, next) {
  if ((req.body.rol) != "") {
    passport.authenticate('jwt', function(err, user) {
      if (user){
        if (user.rol === 'admin'){
        next();
        }else{
          return res.send(403,{
            'message': 'Not enough privilegies',
          });
        }
      }else{
        return res.send(401,{
          'message': 'Unauthorized',
        });
      }
    })(req, res, next);
  }
  else {
    next();
  }
}

module.exports = requireAdmin;
