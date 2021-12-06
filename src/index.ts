import { downloadMedia, getChildStories } from './api'
import pLimit from 'p-limit'

const mediaThrottle = pLimit(10)

const start = async () => {
  const stories = await getChildStories()
  const allMedia = stories.map(story => story.media).flat()

  let progress = 0
  await Promise.all(
    allMedia.map(async media => mediaThrottle(async () => {
      await downloadMedia(media)
      console.log(`${++progress}/${allMedia.length} Image downloaded`, { url: media.original_url })
    }))
  )
}

start().catch(console.error)
