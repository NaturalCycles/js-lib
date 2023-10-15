# LocalDate, LocalTime

## Why?

Serves as an alternative / replacement of [Moment.js](https://momentjs.com/) /
[Day.js](https://github.com/iamkun/dayjs/).

It tries to address the shortcomings of Day.js and
[time-lib](https://github.com/NaturalCycles/time-lib).

`time-lib` was created as a wrapper around Day.js, due to following limitations:

- Day.js doesn't provide all features that we need without plugins. This creates an "import
  problem": you cannot just import `dayjs`, you need to import it from a place that had plugins
  properly installed and initialized. It immediately creates an "import ambiguity": should I import
  from `dayjs` or from `my_code/dayjs.ts`?
- Day.js is created as CommonJS module, all plugins has to be explicitly `require`d. There are
  issues around TypeScript `esModuleInterop`. Result of it is that we needed to completely fork
  Day.js types and put it into `time-lib`.
- There are more/deeper ESM issues when it's used in ESM context (e.g with Vite).

Next level of reasoning is that we needed our own opinionated API that would use standards that we
use, for example:

- We always use classic Unixtime (in seconds, not milliseconds)
- We always use classic ISO8601 date without timezone, e.g `1984-06-21`

Just the second/millisecond confusion can create serious bugs.

Mixup between similarly-called `.toISOString` and `.toISODate` can create very subtle bugs.

So, after multiple issues being accumulated and inability to properly fork Day.js, it was decided to
try and simply **rewrite** Day.js functionality into `LocalDate` and `LocalTime`.

Reasons:

- No milliseconds in the API (not needed)
- Classic UnixTime, never "millisecond unixtime"
- No timezone support/confusion, all dates/times are always treated as "local" (inspired by Java
  LocalDate/LocalDateTime)
- Ability to parse "timezone-aware ISO8601 string", e.g `1984-06-21T17:15:02+02` into a LocalDate of
  just `1984-06-21` or LocalTime of `1984-06-21T17:15:02` (try achieving it with Moment.js or
  Day.js!)
- `.toJSON` automatically formats LocalTime as unixtimestamp, LocalDate as ISO8601 date-only string
- Prevents `dayjs(undefined)` being `dayjs.now()`
- Strict parsing/validation by default. Will validate all input upon creation and will throw parse
  error on any invalid input. We believe it allows to catch errors sooner.
- Optimized for performance and code maintenance, not on code size (as Day.js is, which results in
  its poorer performance in certain cases, and/or in less code maintainability)
- No arbitrary `.format` by design. List of well-known format outputs instead.
- Separate `LocalDate` class for simplified (and more performant) dealing with "just Dates without
  time information". Similar to Java's `LocalDate`. It allows **much more** simple and robust
  implementation, compared to dealing with js `Date` object intricacies (mostly around timezones).

## API

API is designed to be closely (but not 100%) compatible with Day.js/Moment.js.

Examples:

|                                     | day.js (via time-lib)                | LocalTime                      | LocalDate                      |
| ----------------------------------- | ------------------------------------ | ------------------------------ | ------------------------------ |
| now                                 | dayjs()                              | localTime()                    |                                |
| today                               | dayjs().startOf('day')               |                                | localDate()                    |
| create from unixtimestamp           | dayjs.unix(ts)                       | localTime(ts)                  |                                |
| parse from ISO8601 date string      | dayjs(str)                           |                                | localDate(str)                 |
| parse from ISO8601 date+time string | dayjs(str)                           | localTime(str)                 |                                |
| now plus 1 hour                     | dayjs().add(1, 'hour')               | localTime().plus(1, 'hour')    |                                |
| today plus 1 day                    | dayjs().startOf('day').add(1, 'day') |                                | localDate().plus(1, 'day')     |
| toISODate (just date)               | dayjs().toISODate()                  | localTime().toISODate()        | localDate().toISODate()        |
| toISODate with time                 | dayjs().format()                     | localTime().toISODateTime()    |                                |
| diff in days                        | dayjs().diff(other, 'day')           | localTime().diff(other, 'day') | localDate().diff(other, 'day') |
| to unixtimestamp                    | dayjs().unix()                       | localTime().unix()             | localDate().unix()             |
| isBefore                            | dayjs().isBefore(other)              | localTime().isBefore(other)    | localDate().isBefore(other)    |

As you can see above - API is kept very similar.

## DateInterval

Useful to describe an interval of Dates, e.g [inclusive] interval between `1984-06-21` and
`1984-07-11` can be described as `1984-06-21/1984-07-11` (as per
[ISO8601](https://en.wikipedia.org/wiki/ISO_8601#Time_intervals)).

`.toJSON` automatically stringifies DateInterval into a string.

Create DateInterval: `DateInterval.parse('1984-06-21/1984-07-11')` or
`DateInterval.of('1984-06-21', '1984-07-11')`.
