# Dev Tinder APIs

## authRouter
POST /signup
POST /login
POST /logout

## profileRouter
GET /profile/view
PATCH /profile/edit
PATCH /profile/password


## userRouter
GET /user/connections
GET /user/requests
GET /user/feed

## connectionRequestRouter
POST /request//interested/:requestId
POST /request/ignored/:requestId
POST /request/accepted/:requestId
POST /request/rejected/:requestId