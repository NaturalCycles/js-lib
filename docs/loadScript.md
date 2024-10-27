# loadScript, loadCSS

```typescript
await loadScript('https://gtm.com/script.js')
// know that your script is loaded by now
```

Works in old-school (and reliable) way by injecting a `<script>` tag into dom and attaching onload
event that resolves the promise. `onerror` rejects the promise.

See console output, but it will also do `alert(_stringify(err))`.

<script setup>
import LoadScriptDemo from './components/LoadScriptDemo.vue'
</script>

<LoadScriptDemo />
