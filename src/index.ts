#!/usr/bin/env node

import { build } from 'gluegun'

const cli = build('roz')
  .src(__dirname)
  .help()
  .version()
  // .checkForUpdates(100)
  .create()

cli.run().catch(console.error)
