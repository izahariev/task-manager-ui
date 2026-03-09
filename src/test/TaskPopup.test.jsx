import {render, screen, waitFor} from '@testing-library/react'
import {userEvent} from "@testing-library/user-event/dist/cjs/setup/index.js";
import {http, HttpResponse} from 'msw'
import TaskPopup from '../components/task_popup/TaskPopup.jsx'
import {ActiveTabProvider} from '../contexts/ActiveTabProvider.jsx'
import {ErrorMessagesProvider} from '../contexts/ErrorMessagesProvider.jsx'
import {TaskChangedMessageProvider} from '../contexts/TaskChangedMessageProvider.jsx'
import {TasksProvider} from '../contexts/TasksProvider.jsx'
import {UsersProvider} from '../contexts/UsersProvider.jsx'
import {server} from './msw/server.js'

const TASK_GET_RESPONSE = {
  content: {
    id: 'task-1',
    parentTaskId: null,
    title: 'Parent Task 1',
    description: 'Parent description',
    priority: 'P2',
    start: '2026-01-01',
    deadline: '2026-01-10',
    repeat: '2026-02-01',
    repeatPeriod: null,
    assignees: []
  },
  errors: []
}

const TASKS_LIST_RESPONSE = {
  content: {
    elements: [],
    totalPageCount: 0,
    totalElementsCount: 0
  },
  errors: []
}

const USERS_GET_RESPONSE = {
  content: {
    elements: [
      {id: 'user-1', name: 'Alice'},
      {id: 'user-2', name: 'Bob'}
    ],
    totalPageCount: 1,
    totalElementsCount: 2
  },
  errors: []
}

function TestWrapper({children}) {
  return (
    <ErrorMessagesProvider>
      <TaskChangedMessageProvider>
        <ActiveTabProvider>
          <UsersProvider>
            <TasksProvider>
              {children}
            </TasksProvider>
          </UsersProvider>
        </ActiveTabProvider>
      </TaskChangedMessageProvider>
    </ErrorMessagesProvider>
  )
}

test('create-task-title-only', async () => {
  const user = userEvent.setup()
  let requestCount = 0
  let createBody = null

  server.use(
    http.get('/users/get', () => {
      requestCount++
      return HttpResponse.json(USERS_GET_RESPONSE)
    }),
    http.get('/tasks/list', () => {
      requestCount++
      return HttpResponse.json(TASKS_LIST_RESPONSE)
    }),
    http.post('/tasks/create', async ({request}) => {
      requestCount++
      createBody = await request.json()
      return HttpResponse.json({content: {}, errors: []})
    })
  )

  render(
    <TestWrapper>
      <TaskPopup open={true} setOpen={() => {}} />
    </TestWrapper>
  )

  // Fill in title and description
  const textboxes = await screen.findAllByRole('textbox')
  const titleInput = textboxes[0]

  await user.type(titleInput, 'New Parent Task')

  await user.click(screen.getByRole('button', {name: /save/i}))

  await waitFor(() => {
    expect(createBody).not.toBeNull()
  })

  expect(createBody.title).toBe('New Parent Task')
  // parentTaskId is omitted or null for parent tasks
  expect(createBody.parentTaskId ?? null).toBeNull()
  // users + create + refresh tasks
  expect(requestCount).toBe(3)
})

test('create-task-missing-title', async () => {
  const user = userEvent.setup()
  let requestCount = 0

  server.use(
    http.get('/users/get', () => {
      requestCount++
      return HttpResponse.json(USERS_GET_RESPONSE)
    })
  )

  render(
    <TestWrapper>
      <TaskPopup open={true} setOpen={() => {}} />
    </TestWrapper>
  )

  // Leave title empty and try to save
  await screen.findAllByRole('textbox') // wait for render
  await user.click(screen.getByRole('button', {name: /save/i}))

  expect(screen.getByText('Missing title')).toBeInTheDocument()
  expect(requestCount).toBe(1)
})

test('view-task-readonly', async () => {
  let requestCount = 0

  server.use(
    http.get('/users/get', () => {
      requestCount++
      return HttpResponse.json(USERS_GET_RESPONSE)
    }),
    http.get('/tasks/:id', ({params}) => {
      requestCount++
      expect(params.id).toBe('task-1')
      return HttpResponse.json(TASK_GET_RESPONSE)
    })
  )

  render(
    <TestWrapper>
      <TaskPopup
        open={true}
        setOpen={() => {}}
        taskId="task-1"
        customReadOnly={true}
      />
    </TestWrapper>
  )

  const titleInput = await screen.findByDisplayValue('Parent Task 1')
  expect(titleInput).toBeDisabled()
  expect(screen.getByText('Parent description')).toBeInTheDocument()
  expect(screen.getByRole('button', {name: /complete/i})).toBeInTheDocument()
  expect(screen.getByRole('button', {name: /edit/i})).toBeInTheDocument()
  expect(requestCount).toBe(2)
})

test('edit-task', async () => {
  const user = userEvent.setup()
  let requestCount = 0
  let updateBody = null

  server.use(
    http.get('/users/get', () => {
      requestCount++
      return HttpResponse.json(USERS_GET_RESPONSE)
    }),
    http.get('/tasks/list', () => {
      requestCount++
      return HttpResponse.json(TASKS_LIST_RESPONSE)
    }),
    http.get('/tasks/:id', () => {
      requestCount++
      return HttpResponse.json(TASK_GET_RESPONSE)
    }),
    http.patch('/tasks/:id', async ({request}) => {
      requestCount++
      updateBody = await request.json()
      return HttpResponse.json({content: {}, errors: []})
    })
  )

  render(
    <TestWrapper>
      <TaskPopup
        open={true}
        setOpen={() => {}}
        taskId="task-1"
        customReadOnly={true}
      />
    </TestWrapper>
  )

  const titleInput = await screen.findByDisplayValue('Parent Task 1')
  expect(titleInput).toBeDisabled()

  await user.click(screen.getByRole('button', {name: /edit/i}))

  const editableTitle = screen.getAllByRole('textbox')[0]
  expect(editableTitle).not.toBeDisabled()
  await user.clear(editableTitle)
  await user.type(editableTitle, 'Updated Parent Task')

  await user.click(screen.getByRole('button', {name: /save/i}))

  await waitFor(() => {
    expect(updateBody).not.toBeNull()
  })

  expect(updateBody.title).toBe('Updated Parent Task')
  expect(requestCount).toBe(4)
})

test('complete-task-from-popup', async () => {
  const user = userEvent.setup()
  let requestCount = 0
  let completeUrl = null

  server.use(
    http.get('/users/get', () => {
      requestCount++
      return HttpResponse.json(USERS_GET_RESPONSE)
    }),
    http.get('/tasks/list', () => {
      requestCount++
      return HttpResponse.json(TASKS_LIST_RESPONSE)
    }),
    http.get('/tasks/:id', () => {
      requestCount++
      return HttpResponse.json(TASK_GET_RESPONSE)
    }),
    http.patch('/tasks/:id/complete', ({request}) => {
      requestCount++
      completeUrl = request.url
      return HttpResponse.json({content: {}, errors: []})
    })
  )

  render(
    <TestWrapper>
      <TaskPopup
        open={true}
        setOpen={() => {}}
        taskId="task-1"
        customReadOnly={true}
      />
    </TestWrapper>
  )

  await screen.findByDisplayValue('Parent Task 1')

  // Open confirmation dialog
  await user.click(screen.getByRole('button', {name: /complete/i}))
  // Confirm in dialog (second complete button)
  const completeButtons = screen.getAllByRole('button', {name: /complete/i})
  await user.click(completeButtons[completeButtons.length - 1])

  await waitFor(() => {
    expect(completeUrl).not.toBeNull()
  })

  const url = new URL(completeUrl)
  expect(url.searchParams.get('disableRepeat')).toBeNull()
  expect(requestCount).toBe(4)
})

