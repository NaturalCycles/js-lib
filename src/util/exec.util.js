const { spawn, exec, execSync } = require('child_process')

module.exports.execCommand = async (cmd, exitOnError = true) => {
  return new Promise(resolve => {
    const cp = spawn(cmd, {shell: true})
    cp.stdout.on('data', data => console.log(data.toString()))
    cp.stderr.on('data', data => console.log(data.toString()))
    cp.on('close', code => {
      // console.log('close: ' + code)
      if (code && exitOnError) process.exit(code)
      resolve(code)
    })
  })


  /*
  const h = exec(cmd, (err, stdout, stderr) => {
    if (err) {
      process.exit(1)
    }
  })
  h.stdout.pipe(process.stdout)
  h.stderr.pipe(process.stderr)
  */
}
