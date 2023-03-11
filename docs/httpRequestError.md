```
Backend makes a Fetch call to some API
API returns error1 with 500 and a message1
Fetcher wraps error1 with error2 which is a FetcherError
method
url
baseUrl?
statusCode
millis
message: 500 GET /someUrl
causedBy error1

genericErrorHandler needs to return error2
it wraps error2 (FetchError) with error3: HttpError
Maybe there's just no need to do that wrapping?! Return ErrorObject as is
Requester (Fetcher) would always know httpStatusCode of the error they just received

Why is HttpError needed?
For the Backend to set the right httpStatusCode
Maybe it's enough to just have it as AppError with httpStatusCode?

Rename HttpError to HttpRequestError, which is the same as FetchError
HttpErrorResponse becomes BackendErrorResponseObject (detected by name and message)
```
