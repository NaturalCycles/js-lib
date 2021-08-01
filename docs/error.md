# Error

## \_tryCatch

Wraps/decorates a passed function with "try/catch", so it never throws, but logs the error (if
occured).

```ts
const someDangerousFunction = () => { ... }

const fn = _tryCatch(someDangerousFunction)

fn()
// will log on error, but never throw
```

Allows to pass `onError()` function hook, that will be called on error.

## ErrorObject

Standartized "Error object" that contains arbitrary `data` object that can hold additional data.

This `data` object is defined as a Generic type to `ErrorObject`, so, e.g. `HttpError` has
`HttpErrorData`, which has a mandatory `httpStatusCode: number` property.

Usage example of that:

```ts
.catch((err: HttpErrorObject) => {
  console.log(err.data.httpStatusCode)
})
```

## AppError

The most basic implementation of an `Error` that complies with `ErrorObject` specification.
Difference is that `ErrorObject` is purely a TypeScript interface (around any JS `object`), but
`AppError` is a sub-class of `Error`. So, with `AppError` you can do
`if (err instanceof AppError) ...`.

Because `AppError` implements `ErrorObject`, it guarantees an `err.data` object.

This basic contract allows to establish a standartized interface between the Frontend (in
`frontend-lib`) and Backend (in `backend-lib`) and implement error-handling more efficiently.

## HttpError

Subclass of `AppError` that has some additional properties inside `data`, namely:
`httpStatusCode: number`.

## HttpErrorResponse

This is a standartized "Error response from the Backend" (as implemented in `backend-lib`). You can
check/assert it with [\_isHttpErrorResponse](#ishttperrorresponse), and then have all the guarantees
and types about the containing `error` object.

Handling these type of errors is done "automatically" in `getKy` of the `frontend-lib`, and in
`getGot` of the `backend-lib`.

## \_anyToErrorMessage

Convenience function to cast `any` (whatever type or shape was thrown!) to a human error message.

Takes advantage of `ErrorObject` specification (if detected) to properly log the contained `data`
object.

Pass `false` to the second parameter (`includeData`) to avoid logging `data` object.

## \_anyToAppError

Cast `any` to `AppError`.

## \_anyToErrorObject

Cast `any` to `ErrorObject`.

## \_errorToErrorObject

Cast `Error` to `ErrorObject`.

## \_errorObjectToAppError

Cast `ErrorObject` to `AppError`.

## \_errorObjectToHttpError

Cast `ErrorObject` to `HttpError`.

## \_appErrorToErrorObject

Cast `AppError` to `ErrorObject`.

## \_appErrorToHttpError

Cast `AppError` to `HttpError`.

## \_isHttpErrorResponse

Assert if provided `value: any` is a [HttpErrorResponse](#httperrorresponse).

## \_isHttpErrorObject

Assert if provided `value: any` is a `HttpErrorObject` (an `HttpError`, same as
`AppError<HttpErrorData>`).

## \_isErrorObject

Assert if provided `value: any` is an [ErrorObject](#errorobject).

## \_assert

Asserts that a boolean condition is `truthy`, otherwise throws an Error.

Evaluates the `condition` (casts it to Boolean). Expects it to be truthy, otherwise throws AppError.

Should be used NOT for "expected" / user-facing errors, but vice-versa - for completely unexpected
and 100% buggy "should never happen" cases.

It'll result in http 500 on the server (cause that's the right code for "unexpected" errors). Pass {
httpStatusCode: x } at errorData argument to override the http code (will be picked up by
backend-lib).

API is similar to Node's assert(), except:

1. Throws js-lib's AppError
2. Has a default message, if not provided
3. Sets `userFriendly` flag to true, cause it's always better to have at least SOME clue, rather
   than fully generic "Oops" error.

```ts
function run(err: any) {
  _assert(err instanceof AppError)
  // from here TypeScript will know that `err instanceof AppError === true`, or `err: AppError`

  // Example with custom error message:
  _assert(err instanceof AppError, 'error should be of type AppError')
}
```

## \_assertEquals

Similar to [\_assert](#assert), but allows to provide 2 values (first 2 arguments) and throws if
they are NOT equal.

Does a shallow equality check (`!==`), use [\_assertDeepEquals](#assertdeepequals) if you need a
deep-check.

## \_assertDeepEquals

Similar to [\_assertEquals](#assertequals), but does a deep assertion (using
[\_deepEquals](./object.md#deepequals)).

## AggregatedError

Subclass of `Error` that contains `.errors: Error[]` - array of errors from some batch operation.

May also contain `.results: RESULT[]` - results from some batch operation (if needed).

## \_try

Calls a function, returns a Tuple of `[error, value]`. Allows to write shorter code that avoids
try/catch. Useful e.g. in unit tests.

Similar to [pTuple](./promise.md/#ptuple), but for sync functions.

```ts
const [err, v] = _try(() => someFunction())
```
