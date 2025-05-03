import { AppError, jsonSchema } from '@naturalcycles/js-lib'
import { objectSchema, stringSchema } from '@naturalcycles/nodejs-lib'
import { getDefaultRouter } from '../server/getDefaultRouter.js'
import { validateBody } from '../server/validation/validateMiddleware.js'
import { validateRequest } from '../server/validation/validateRequest.js'

const router = getDefaultRouter()
export const debugResource = router

router.get('/', async (_req, res) => {
  res.json({ ok: 1 })
})

interface PwInput {
  pw: string
}

router.put('/changePasswordFn', async (req, res) => {
  const _input = validateRequest.body(
    req,
    objectSchema<PwInput>({
      pw: stringSchema.min(8),
    }),
    { redactPaths: ['pw'] },
  )

  res.json({ ok: 1 })
})

router.put(
  '/changePassword2',
  validateBody(
    jsonSchema.object<PwInput>({
      pw: jsonSchema.string().min(8),
    }),
    { redactPaths: ['pw'] },
  ),
  async (_req, res) => {
    res.json({ ok: 1 })
  },
)

router.get('/asyncError', async () => {
  throw new AppError('debug_async_error', { backendResponseStatusCode: 501, dirtySecret: '51' })
})
