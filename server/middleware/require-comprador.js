const httpError = require('http-errors');
const passport = require('passport');

const requireComprador = function (req, res, next) {

    passport.authenticate('jwt', function(err, user) {
      if(req.query.rfc != undefined || req.params.rfc != undefined){
        next();
      }
      else {
      if (user){
        if (user.rol === 'admin' || user.rol === 'comprador' ){
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
    }

    })(req, res, next);
  }

module.exports = requireComprador;
