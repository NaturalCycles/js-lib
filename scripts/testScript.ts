/*

yarn tsn-script ./scripts/testScript.ts

*/

main().catch(err => {
  console.error(err)
  process.exit(1)
})

async function main () {
  console.log('test script')
}
