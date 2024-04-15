import protectRoute from '../protectRoute'

export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event)

  const guestPaths = ['']
  if (!pathname.startsWith('/api') || guestPaths.includes(pathname)) {
    return
  }

  await protectRoute(event)
})
