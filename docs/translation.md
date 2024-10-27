# TranslationService <Badge text="experimental" type="warning"/>

## Demo

```ts
const translationService = new TranslationService({
  defaultLocale: 'en',
  supportedLocales: ['en', 'ru'],
  translationLoader: new FetchTranslationLoader({
    prefixUrl: 'lang',
  }),
})

translationService.translate('key1')
// value 1 en
```

<script setup>
import TranslationDemo from './components/TranslationDemo.vue'
</script>

<TranslationDemo/>
