
# User APIs


## SIGN UP
#### DESCRIPTION
Creates an account with the given username and password
#### REQUEST
`POST /signup/`
- body: object
  - username: (string)
  - password: (string)
  - name: (string)
#### RESPONSE
- Error 409 if the user already exists
- Error 500 for other errors
```
curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt https://pic-share.me/signup/
```


## SIGN IN
#### DESCRIPTION
Creates session with the correct username and signs user in
#### REQUEST
`POST /signin/`
- body: object
  - username: (string)
  - password: (string)
#### RESPONSE
- Error 401 if the user does not exist or the password is incorrect
- Error 500 for any other database errors
```
curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt https://pic-share.me/signin/
```


## SIGN OUT
#### DESCRIPTION
Signs the user out. Session is destroyed, no error anticipated.
#### REQUEST
`GET /signout/`
#### RETURN
- 200
  - the user has been signed out
```
curl -b cookie.txt -c cookie.txt https://pic-share.me/signout/
```


## GET CURRENT USERNAME
#### DESCRIPTION
Used by the front end to get the username as a security improvement.
This is so that the front end does not need to rely on any cookies to access current username.
```
curl -b cookie.txt https://pic-share.me/username/
```


## GET ALL CANVAS IMAGES  
#### DESCRIPTION
Get the ids of all images stored for each user.
#### REQUEST
`GET /images/`
#### RESPONSE
- 200
    - returns a list of image ids
- 401
    - If the user is not currently logged in
```
curl -b cookie.txt  https://pic-share.me/images/
```


## CREATE A NEW CANVAS IMAGE
#### DESCRIPTION
This method uploads an image into mongodb. This is called when the user wants to save a new canvas into their account.
#### REQUEST
`POST /api/images/`
    - content-type: `multipart/form-data`
    - body: object
      - title: (string) The title of the image
      - author: (string) The author who uploaded the image
      - picture: (file) The image to be uploaded  
#### RESPONSE
- 200
    - Returns the id of the image
- 401
    - If the user is not currently logged in or they don't own the image
- 500
    - Other internal database error
```
$ curl -X POST -F title=titlename -b cookie.txt -F author=authorname -F picture=@image.png  https://pic-share.me/api/images/
```


## SAVE TO AN EXISTING CANVAS IMAGE
#### DESCRIPTION
This method is called when the user wants to write over an existing image. This is called when the user opens a canvas from their account and wants to save the new changes.
#### REQUEST
`POST /api/images/:id`
    - content-type: `multipart/form-data`
    - body: object
      - title: (string) The title of the image
      - author: (string) The author who uploaded the image
      - picture: (file) The image to be uploaded  
#### RESPONSE
- 200
    - Returns the id of the image
- 401
    - If the user is not currently logged in or they don't own the image
- 500
    - Other internal database error
To run the below curl request you need to upload an image first to get its id
```
$ curl -F title=titlename -b cookie.txt -F author=authorname -F picture=@image.png  https://pic-share.me/api/images/60710fcd59f06200045705de
```


## DELETE CANVAS IMAGE
#### DESCRIPTION
Delete a canvas image
#### REQUEST
`DELETE /api/images/:id/`
#### RESPONSE
- 200
  - content-type: `application/json`
  - body: returns the image object being deleted
- 404
  - body: image :id does not exist
- 401
  - body: You are not the owner of this image

```
$ curl -X DELETE  https://pic-share.me/api/images/6JrFaykl4BT0jYtK/
```
