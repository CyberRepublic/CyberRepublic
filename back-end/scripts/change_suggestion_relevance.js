// MAKE SURE YOU RUN BUILD BEFORE THIS
// this should be run from the parent back-end folder, not scripts
// this is what sets the process.env
require('../dist/src/config')
;(async () => {
  const db = await require('../dist/src/db').default
  const DB = await db.create()
  const db_sugg = DB.getModel('Suggestion')
  const mongoose = require('mongoose')
  const ObjectId = mongoose.Types.ObjectId
  try {
    // const sugg = await db_sugg.getDBInstance().findOne({
    //   displayId: 133,
    //   old: { $exists: false },
    //   'relevance.proposal': ObjectId('xxx')
    // })
    await db_sugg.getDBInstance().update(
      {
        displayId: 133,
        old: { $exists: false },
        'relevance.proposal': ObjectId('xxx')
      },
      {
        $set: {
          'relevance.$.proposalHash': `xxx`
        }
      }
    )
  } catch (err) {
    console.error(err)
  }
  process.exit(1)
})()
