import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// Scrolls the window to the top on every route change, so navigating to a
// new page doesn't keep the previous page's scroll position.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
