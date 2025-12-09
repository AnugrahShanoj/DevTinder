# Dev Tinder APIs

## authRouter
POST /signup
POST /login
POST /logout

## profileRouter
GET /profile/view
PATCH /profile/edit


## userRouter
GET /user/connections
GET /user/requests
GET /feed

## connectionRequestRouter
POST /request/send/:status/:toUserId  (statuses: interested or ignored)


POST /request/review/:status/:requestId (statuses: accepted or rejected)