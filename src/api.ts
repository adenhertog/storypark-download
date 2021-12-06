import axios from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { getConfiguration } from './configuration'
import fs from 'fs'
import path from 'path'
import mimeTypes from 'mime-types'
import { promisify } from 'util'

const mkdirp = promisify(fs.mkdir)

const config = getConfiguration()
const jar = new CookieJar()
const axiosClient = wrapper(axios.create({ jar }))

interface Media {
  file_name: string,
  original_url: string,
  content_type: string
}

export interface ChildStory {
  id: string,
  display_subtitle: string,
  title: string,
  media: Media[]
}

interface ChildStoriesResponse {
  stories: ChildStory[],
  next_page_token: string
}

export const getChildStories = async (continuationToken?: string): Promise<ChildStory[]> => {
  const stories: ChildStory[] = []
  const response = await axiosClient.get(
    `https://app.storypark.com/api/v3/children/${config.childId}/stories?sort_by=updated_at&story_type=all&page_token=${continuationToken ?? ''}`,
    {
      headers: {
        Cookie: config.cookie
      }
    }
  )

  const childStoryResponse = response.data as ChildStoriesResponse
  stories.push(...childStoryResponse.stories)
  console.log('Found new stories', { count: stories.length, pageToken: continuationToken })

  if (childStoryResponse.next_page_token) {
    const nextPageStories = await getChildStories(childStoryResponse.next_page_token)
    stories.push(...nextPageStories)
  }

  return stories
}

export const downloadMedia = async (media: Media) => {
  const response = await axiosClient.get(
    media.original_url,
    {
      responseType: 'stream',
      headers: {
        Cookie: config.cookie
      }
    }
  )

  const extension = mimeTypes.extension(media.content_type)
  const folder = path.join(__dirname, 'images')
  await mkdirp(folder, { recursive: true })
  const filepath = path.join(folder, `${media.file_name}.${extension}`)
  const writer = fs.createWriteStream(filepath)

  await new Promise<void>((resolve, reject) => {
    response.data.pipe(writer)
    let error: unknown = undefined
    writer.on('error', e => {
      error = e
      writer.close()
      reject(error)
    })
    writer.on('close', () => {
      if (!error) {
        resolve()
      }
    })
  })
}
