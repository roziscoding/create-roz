#!/usr/bin/env node

import { build, GluegunToolbox } from 'gluegun'

const cli = build('roz')
  .src(__dirname)
  .help()
  .version()
  .defaultCommand((t: GluegunToolbox) => {
    t.print.error('You must choose a project type.')
  })
  .checkForUpdates(100)
  .create()

cli.run().catch(console.error)
