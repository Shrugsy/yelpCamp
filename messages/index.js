let msg = {
    mustLogIn: 'You must be logged in to perform this action.',
    badPermission: 'You do not have permission to perform this action.',
    pleaseLogIn: 'Please log in again to continue.',
    logInSuccess: (usr)=> `You have successfully signed in as ${usr}!`,
    signOutSuccess: 'You have successfully been signed out.',
    alreadySignedOut: 'You are already signed out.',
    editProfileSuccess: 'Details successfully updated.',
    passwordsDoNotMatch: 'New password does not match. Other details have been saved',
    requiredFieldMissing: 'A required field is missing',
    newCampgroundSuccess: 'Campground successfully created.',
    editCampgroundSucces: 'Campground successfully edited.',
    deleteCampgroundSuccess: 'Campground successfully deleted.',
    newCommentSuccess: 'Comment successfully created.',
    editCommentSuccess: 'Comment successfully edited.',
    deleteCommentSuccess: 'Comment successfully deleted.',
    newUserSuccess: (usr)=> `Account successfully created. Welcome ${usr}!`
}

module.exports = msg;