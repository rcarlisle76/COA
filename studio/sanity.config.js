import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import post from './schemas/post'
import author from './schemas/author'
import category from './schemas/category'

export default defineConfig({
  name: 'default',
  title: 'COA Auditing Blog',
  projectId: 'pbgk36lr',
  dataset: 'production',
  basePath: '/studio',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: [post, author, category],
  },
})
