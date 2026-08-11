# EME Test

Тестовые задания на **Vue 3 + TypeScript** в одном репозитории.

## Стек

- Vue 3 (Composition API, `<script setup>`)
- TypeScript
- Vite
- Pinia
- Vue Router
- SCSS
- Ant Design Vue (таблица пользователей)
- VeeValidate + Yup (форма обратной связи)
- JSONPlaceholder (`/users`, `/posts`)

## Задания

| Страница | Маршрут | Статус |
|---|---|---|
| Обзор | `/` | Готово |
| Таблица пользователей | `/users` | Готово |
| Список задач | `/todos` | Готово |
| Табы | `/tabs` | Готово |
| Форма обратной связи | `/feedback` | Готово |
| Infinite scroll | `/infinite-scroll` | Готово |
| Модальное окно | `/modal` | Готово |

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
```

## Структура

```text
src/
  api/            # запросы к JSONPlaceholder
  components/     # UI-компоненты (layout, Modal)
  composables/    # Intersection Observer и др.
  router/         # маршруты
  stores/         # Pinia stores
  styles/         # SCSS-токены и глобальные стили
  types/          # TypeScript-типы
  views/          # страницы заданий
```

## Что реализовано

### Таблица пользователей
Ant Design Table + Pinia: пагинация 10/20/50, сортировка, фильтры по роли/статусу, hover-подсветка строк. Данные с `/users`, локально расширены для демо пагинации.

### Список задач
CRUD, отметка выполненных, фильтр all/active/completed, Pinia + `localStorage`.

### Табы
Активная вкладка в URL (`?tab=`), подсветка и анимация переключения.

### Форма обратной связи
VeeValidate + Yup, realtime-валидация, состояния idle/submitting/success/error в Pinia, mock API, сохранение в `localStorage`. Для ошибки: `fail@example.com`.

### Infinite scroll
Лента `/posts`, Intersection Observer, скелетоны, индикатор «Нет больше постов».

### Модальное окно
`Teleport` в `body`, закрытие по overlay и ESC, слоты header/default/footer.
