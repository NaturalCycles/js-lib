import { _truncateMiddle } from '../string/string.util'
import { AppError } from './app.error'
import { ErrorData } from './error.model'

export interface JsonParseErrorData extends ErrorData {
  /**
   * Original text that failed to get parsed.
   */
  text?: string
}

export class JsonParseError extends AppError<JsonParseErrorData> {
  constructor(data: JsonParseErrorData) {
    const message = ['Failed to parse', data.text && _truncateMiddle(data.text, 200)]
      .filter(Boolean)
      .join(': ')

    super(message, data, { name: 'JsonParseError' })
  }
}
