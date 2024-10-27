# AdminService <Badge text="experimental" type="warning"/>

## Admin Mode

Admin mode is activated by a combination of keys on a keyboard (no mobile support), visualized with
the RedDot™ on the page.

Function `startListening()` enables listening for a key combination (Ctrl+Shift+L by default).

Example:

```ts
const admin = new AdminService({
  onEnter: () => console.log('Entered Admin mode'),
  onExit: () => console.log('Exited Admin mode'),
  onRedDotClick: () => alert('RedDot clicked'),
})

admin.startListening()
```

Try pressing `Ctrl+Shift+L` on the keyboard to see the RedDot™ in action.

<script setup>
import AdminModeDemo from './components/AdminModeDemo.vue'
</script>

<AdminModeDemo/>
