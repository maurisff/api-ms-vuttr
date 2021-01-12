import chalk from 'chalk'
import semver from 'semver'
import shell from 'shelljs'
import childProcess from 'child_process'
import { readFileSync } from 'fs'
import path from 'path'

export default class CheckVersion {
  private versionRequirements: any[];

  constructor () {
    this.versionRequirements = []
    this.requirements()
  }

  private exec (cmd: string): string {
    return childProcess.execSync(cmd).toString().trim()
  }

  public requirements (): void {
    const packageConfig: any = JSON.parse(readFileSync(path.join(__dirname, '../../package.json'), 'utf8'))
    this.versionRequirements.push({
      name: 'node',
      currentVersion: semver.clean(process.version),
      versionRequirement: packageConfig.engines.node
    })

    if (shell.which('npm')) {
      this.versionRequirements.push({
        name: 'npm',
        currentVersion: this.exec('npm --version'),
        versionRequirement: packageConfig.engines.npm
      })
    }
  }

  public execute (): void {
    const warnings = []
    for (let i = 0; i < this.versionRequirements.length; i++) {
      const mod = this.versionRequirements[i]
      if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
        warnings.push(`${mod.name}: ${
          chalk.red(mod.currentVersion)} should be ${
          chalk.green(mod.versionRequirement)}`)
      }
    }

    if (!process.env.JWT_SECRET) {
      warnings.push(`env.JWT_SECRET: ${chalk.white.bgRed.bold("Secret JWT isn't defined")}`)
    }

    if (!process.env.MONGO_DB) {
      warnings.push(`env.MONGO_DB: ${chalk.white.bgRed.bold("Database connect isn't defined")}`)
    }

    if (warnings.length) {
      console.log('')
      console.log(chalk.yellow('To use this template, you must update following to modules:'))
      console.log()
      for (let i = 0; i < warnings.length; i++) {
        const warning = warnings[i]
        console.log(`  ${warning}`)
      }
      console.log()
      throw new Error('Error Initialization...')
      // process.exit(1)
    }
  }
}
