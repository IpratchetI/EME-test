import { onBeforeUnmount, watch, type Ref } from 'vue'

export function useInfiniteScroll(
  target: Ref<HTMLElement | null>,
  onIntersect: () => void,
  options?: IntersectionObserverInit,
) {
  const isSupported = typeof IntersectionObserver !== 'undefined'
  let observer: IntersectionObserver | null = null
  let observed: HTMLElement | null = null

  function teardown() {
    observer?.disconnect()
    observer = null
    observed = null
  }

  function setup(element: HTMLElement) {
    if (!isSupported) return

    observed = element
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting) {
        onIntersect()
      }
    }, options)

    observer.observe(element)
  }

  function pause() {
    if (observer && observed) {
      observer.unobserve(observed)
    }
  }

  function resume() {
    if (observer && observed) {
      observer.observe(observed)
    }
  }

  watch(
    target,
    (element) => {
      teardown()
      if (element) {
        setup(element)
      }
    },
    { flush: 'post', immediate: true },
  )

  onBeforeUnmount(() => {
    teardown()
  })

  return { isSupported, pause, resume }
}
