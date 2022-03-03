// MAKE SURE YOU RUN BUILD BEFORE THIS
// this should be run from the parent back-end folder, not scripts
// this is what sets the process.env
require('../dist/src/config')
;(async () => {
  const db = await require('../dist/src/db').default
  const DB = await db.create()
  const db_cvote = DB.getModel('CVote')
  try {
    const query = {
      vid: 56,
      old: { $exists: false }
    }
    const proposal = await db_cvote.findOne(query)
    const oldHistory = proposal.withdrawalHistory
    const newHistory = oldHistory.filter((el) => el.messageHash !== 'xxx')
    console.log('newHistory', newHistory)
    await db_cvote.getDBInstance().updateOne(
      {
        vid: 56,
        old: { $exists: false }
      },
      { $set: { withdrawalHistory: newHistory } }
    )
  } catch (err) {
    console.error(err)
  }
  process.exit(1)
})()
