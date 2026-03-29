## DevTinder APIs
authRouters
- POST /signup
- POST /login
- POST /logout

## profileRouters
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouters
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST //request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET /user/connections
- GET /user/request
- GET /user/feed gets you the profile of other users on platform
