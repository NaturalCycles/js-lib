export class StringSharedUtil {
  capitalizeFirstLetter (s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  lowercaseFirstLetter (s: string): string {
    return s.charAt(0).toLowerCase() + s.slice(1)
  }

  removeWhitespace (s: string): string {
    return s.replace(/\s/g, '')
  }
}

export const stringSharedUtil = new StringSharedUtil()
