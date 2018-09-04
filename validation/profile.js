const Validator = require('validator');
const isEmpty = require('./checkEmpty');

module.exports = function validateProfileInput (data) {
    let errors = {}

    data.handle = !isEmpty(data.handle) ? data.handle : ''
    data.occupation = !isEmpty(data.occupation) ? data.occupation : ''
    data.interests = !isEmpty(data.interests) ? data.interests : ''

    if(!Validator.isLength(data.handle, {min: 2, max: 20})) {
      errors.handle = 'Handle needs to be between 2 and 20 characters';
    }

    if(Validator.isEmpty(data.handle)) {
        errors.handle = 'Handle must be submitted'
    }

    if(Validator.isEmpty(data.occupation)) {
        errors.occupation = 'Occupation is required'
    }

    if(Validator.isEmpty(data.interests)) {
        errors.interests = 'Interests are required'
    }
    
   /*  if(!Validator.isEmpty(data.facebook)) {
        if(!Validator.isURL(data.facebook)) {
            errors.facebook = "Not a real facebook adress"
        }
    }

    if(!Validator.isEmpty(data.twitter)) {
        if(!Validator.isURL(data.twitter)) {
            errors.twitter = "Not a real twitter adress"
        }
    }
    
    if(!Validator.isEmpty(data.instagram)) {
        if(!Validator.isURL(data.instagram)) {
            errors.instagram = "Not a real instagram adress"
        }
    } */

    return {
        errors,
        isValid: isEmpty(errors)
    }
}