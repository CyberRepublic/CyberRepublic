const decompress = require('decompress')

export const unzipFile = async (opinionData: string, fileName = 'opinion') => {
  try {
    const bytes = Buffer.from(opinionData, 'hex')
    const files = await decompress(bytes)
    if (files.length > 0) {
      const file = files.find((el: any) => el.path === fileName + '.json')
      if (file && file.data && file.mtime) {
        const text = file.data.toString()
        const rs = JSON.parse(text)
        return {
          opinion: rs.content,
          date: file.mtime
        }
      }
    }
  } catch (err) {
    console.log(`unzipFile err...`, err)
  }
}
