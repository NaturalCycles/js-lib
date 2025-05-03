import { testDir } from './paths.cnst.js'

// ./secret/*.enc are encrypted with this. To test decryption
export const TEST_ENC_KEY =
  'MPd/30v0Zcce4I5mfwF4NSXrpTYD9OO4/fIqw6rjNiWp2b1GN9Xm8nQZqr7c9kKSsATqtwe0HkJFDUGzDSow44GDgDICgB1u1rGa5eNqtxnOVGRR+lIinCvN/1OnpjzeoJy2bStXPj1DKx8anMqgA8SoOZdlWRNSkEeZlolru8Ey0ujZo22dfwMyRIEniLcqvBm/iMiAkV82fn/TxYw05GarAoJcrfPeDBvuOXsARnMCyX18qTFL0iojxeTU8JHxr8TX3eXDq9cJJmridEKlwRIAzADwtetI4ttlP8lwJj1pmgsBIN3iqYssZYCkZ3HMV6BoEc7LTI5z/45rKrAT1A=='

export const secretsJsonPath = `${testDir}/secrets.json`
export const secrets2JsonPath = `${testDir}/secrets2.json`
export const secretsJsonEncPath = `${testDir}/secrets.json.enc`
