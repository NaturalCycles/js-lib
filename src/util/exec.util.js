const { spawn, exec, execSync } = require('child_process')

module.exports.execCommand = async (cmd, exitOnError = true) => {
  return new Promise((resolve, reject) => {
    const cp = spawn(cmd, {shell: true, stdio: 'inherit'})
    // cp.stdout.on('data', data => console.log(data.toString()))
    // cp.stderr.on('data', data => console.log(data.toString()))
    cp.once('error', err => reject(err))
    cp.once('close', code => {
      // console.log('close: ' + code)
      if (code) {
        if (exitOnError) {
          process.exit(code)
        } else {
          reject(new Error(`${cmd} exitCode: ${code}`))
        }
      } else {
        resolve(code)
      }
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
