const { execSync } = require('child_process')

try {
  console.log('Buildando...')
  execSync('cross-env NODE_ENV=prod yarn quasar build -m spa', { stdio: 'inherit' })

  console.log('Commitando build pra master')
  execSync('git add .', { stdio: 'inherit' })
  execSync('git commit -m "update build"', { stdio: 'inherit' })
  execSync('git push', { stdio: 'inherit' })

  console.log('Deploy finalizado!')
} catch (err) {
  console.error('Erro no deploy:', err.message)
  process.exit(1)
}
