import { GluegunCommand } from 'gluegun'
import path from 'path'
import { required } from '../utils/validation'

const command: GluegunCommand = {
  name: 'vercel-api',
  run: async (toolbox) => {
    const template = path.join(__dirname, '..', 'templates', 'vercel-api')

    const props = await toolbox.prompt.ask([
      {
        type: 'input',
        name: 'name',
        message: 'Project name (npm compatible)',
        initial: toolbox.parameters.first,
        validate: required
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description',
        validate: required
      },
      {
        type: 'input',
        name: 'githubUsername',
        message: 'GitHub username',
        validate: required
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'Author Name',
        initial: await toolbox.system.run('git config user.name', { trim: true }),
        validate: required
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'Author email',
        initial: await toolbox.system.run('git config user.email', { trim: true }),
        validate: required
      },
      {
        type: 'input',
        name: 'keywords',
        message: 'Comma separated keyword list'
      }
    ])

    const finalProps = {
      ...props,
      keywords: props.keywords?.split(',').map(k => k.trim()).filter(Boolean) ?? []
    }

    let spinner = toolbox.print.spin({
      text: 'Copying files'
    })

    toolbox.filesystem.copy(template, (toolbox.parameters.first || props.name) ?? 'vercel-api', {
      matching: ['!*.ejs'],
      overwrite: true
    })

    spinner.succeed()

    spinner = toolbox.print.spin('Creating package.json')

    toolbox.template.generate({
      template: 'vercel-api/package.json.ejs',
      target: `${props.name}/package.json`,
      props: finalProps
    })

    spinner.succeed()

    spinner = toolbox.print.spin('Installing packages')
    // spinner.stopAndPersist()
    
    console.log(await toolbox.system.run(`cd ${props.name} && npm i`))

    spinner.succeed()
  }
}

export default command
