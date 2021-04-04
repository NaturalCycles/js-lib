# Units

## \_kb, \_mb, \_gb, \_hb

Human-prints byte number into kilobytes, megabytes, gigabutes and "human-bytes" (`_hb`):

```ts
_hb(0) // '0 byte(s)'
_hb(500) // '500 byte(s)'
_hb(1000) // '1 Kb'
_hb(1024 ** 2) // '1 Mb'
_hb(1024 ** 3) // '1 Gb'
_kb(1000) // 1
_mb(1024 ** 2) // 1
_gb(1024 ** 3) // 1
```
