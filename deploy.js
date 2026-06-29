const { execSync } = require('child_process')

try {
  console.log('Buildando...')
  execSync('yarn quasar build', { stdio: 'inherit' })

  console.log('Commitando build pra master')
  execSync('git add .', { stdio: 'inherit' })
  execSync('git commit -m "update build"', { stdio: 'inherit' })
  execSync('git push', { stdio: 'inherit' })

  console.log('Deploy finalizado!')
} catch (err) {
  console.error('Erro no deploy:', err.message)
  process.exit(1)
}
