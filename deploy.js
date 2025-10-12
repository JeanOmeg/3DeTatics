import { execSync } from 'node:child_process'

try {
  console.log('🔨 Buildando projeto Quasar...')
  execSync('cross-env NODE_ENV=production yarn quasar build -m spa', { stdio: 'inherit' })

  console.log('📤 Commitando build pra main/docs...')
  execSync('git add .', { stdio: 'inherit' })
  execSync('git commit -m "update build"', { stdio: 'inherit' })
  execSync('git push', { stdio: 'inherit' })

  console.log('✅ Deploy finalizado com sucesso!')
} catch (err) {
  console.error('❌ Erro no deploy:', err.message)
  process.exit(1)
}
