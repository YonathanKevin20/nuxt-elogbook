import protectApi from '../protectApi'

export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event)

  const guestPaths = ['']
  if (!pathname.startsWith('/api') && guestPaths.some((path) => pathname.includes(path))) {
    return
  }

  await protectApi(event)
})
