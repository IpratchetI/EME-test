<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { fetchPosts } from '@/api/posts'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'
import type { Post } from '@/types/post'

const posts = ref<Post[]>([])
const page = ref(1)
const loading = ref(false)
const error = ref('')
const hasMore = ref(true)
const sentinel = ref<HTMLElement | null>(null)
const PAGE_SIZE = 10
const MAX_ITEMS = 20

const { pause, resume } = useInfiniteScroll(
  sentinel,
  () => {
    void loadMore()
  },
  {
    root: null,
    rootMargin: '120px',
    threshold: 0,
  },
)

function isSentinelVisible() {
  const el = sentinel.value
  if (!el) return false
  const rect = el.getBoundingClientRect()
  return rect.top <= window.innerHeight + 120
}

async function loadMore() {
  if (loading.value || !hasMore.value) return

  loading.value = true
  error.value = ''
  pause()

  try {
    const remaining = MAX_ITEMS - posts.value.length
    const limit = Math.min(PAGE_SIZE, remaining)
    const next = await fetchPosts(page.value, limit)

    if (next.length === 0) {
      hasMore.value = false
      return
    }

    const existingIds = new Set(posts.value.map((post) => post.id))
    const unique = next.filter((post) => !existingIds.has(post.id))

    if (unique.length === 0) {
      hasMore.value = false
      return
    }

    const capped = unique.slice(0, remaining)
    posts.value.push(...capped)
    page.value += 1

    if (posts.value.length >= MAX_ITEMS || next.length < limit) {
      hasMore.value = false
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Ошибка загрузки'
  } finally {
    loading.value = false
    await nextTick()

    if (hasMore.value) {
      resume()
      if (isSentinelVisible()) {
        window.setTimeout(() => {
          void loadMore()
        }, 50)
      }
    }
  }
}

onMounted(() => {
  void loadMore()
})
</script>

<template>
  <section class="page">
    <div class="page__header">
      <h2 class="page__title">Infinite scroll лента</h2>
      <p class="page__subtitle">
        Посты с JSONPlaceholder <code>/posts</code>, подгрузка через Intersection
        Observer, скелетоны и индикатор конца ленты.
      </p>
    </div>

    <div class="feed">
      <article v-for="post in posts" :key="post.id" class="panel post-card">
        <span class="post-card__id">#{{ post.id }}</span>
        <h3>{{ post.title }}</h3>
        <p>{{ post.body }}</p>
      </article>

      <template v-if="loading">
        <div v-for="n in 3" :key="`skeleton-${n}`" class="panel skeleton" aria-hidden="true">
          <div class="skeleton__line skeleton__line--sm" />
          <div class="skeleton__line skeleton__line--lg" />
          <div class="skeleton__line" />
          <div class="skeleton__line skeleton__line--md" />
        </div>
      </template>

      <p v-if="error" class="feed__error">
        {{ error }}
        <button type="button" class="btn btn--ghost" @click="loadMore">
          Повторить
        </button>
      </p>

      <p v-if="!hasMore && posts.length" class="feed__end">Нет больше постов</p>

      <div ref="sentinel" class="feed__sentinel" aria-hidden="true" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.feed {
  display: grid;
  gap: 0.9rem;
}

.post-card {
  display: grid;
  gap: 0.55rem;
  transition:
    transform $duration-fast $ease-out,
    border-color $duration-fast $ease-out;
}

.post-card:hover {
  transform: translateY(-2px);
  border-color: rgba(15, 122, 108, 0.35);
}

.post-card__id {
  color: $color-accent;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.post-card h3 {
  font-size: 1.05rem;
}

.post-card p {
  color: $color-ink-soft;
  line-height: 1.55;
}

.skeleton {
  display: grid;
  gap: 0.65rem;
}

.skeleton__line {
  height: 0.85rem;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(213, 224, 231, 0.7),
    rgba(216, 243, 238, 0.95),
    rgba(213, 224, 231, 0.7)
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}

.skeleton__line--sm {
  width: 18%;
}

.skeleton__line--md {
  width: 62%;
}

.skeleton__line--lg {
  width: 74%;
  height: 1.1rem;
}

.feed__error {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  color: $color-danger;
}

.feed__end {
  text-align: center;
  color: $color-muted;
  padding: 0.75rem 0 0.25rem;
  font-weight: 600;
}

.feed__sentinel {
  height: 1px;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.9em;
  background: $color-accent-soft;
  padding: 0.1em 0.35em;
  border-radius: 6px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
