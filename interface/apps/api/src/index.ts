import { Hono } from 'hono'
import {cors} from "hono/cors"
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.use(cors())

export default app
