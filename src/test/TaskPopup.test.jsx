import {fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import {userEvent} from "@testing-library/user-event/dist/cjs/setup/index.js";
import dayjs from 'dayjs'
import {http, HttpResponse} from 'msw'
import TaskPopup from '../components/task_popup/TaskPopup.jsx'
import {ActiveTabProvider} from '../contexts/ActiveTabProvider.jsx'
import {ErrorMessagesProvider} from '../contexts/ErrorMessagesProvider.jsx'
import {TaskChangedMessageProvider} from '../contexts/TaskChangedMessageProvider.jsx'
import {TasksProvider} from '../contexts/TasksProvider.jsx'
import {UsersProvider} from '../contexts/UsersProvider.jsx'
import {server} from './msw/server.js'

const TASK_GET_RESPONSE_ALL_DATES_ANY_ASSIGNEE = {
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

test('create-task-all-fields-dates-any-assignee', async () => {
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

  const textboxes = await screen.findAllByRole('textbox')
  await user.clear(textboxes[0])
  await user.type(textboxes[0], 'New Task Title')
  await user.clear(textboxes[1])
  await user.type(textboxes[1], 'Task description')
  await user.click(screen.getByRole('combobox', {name: /without label/i}))
  await user.click(screen.getByRole('option', {name: 'P2'}))
  await user.tripleClick(textboxes[2])
  await user.keyboard('01/15/2026')
  await user.tripleClick(textboxes[3])
  await user.keyboard('01/20/2026')
  await user.tripleClick(textboxes[4])
  await user.keyboard('02/01/2026')

  await user.click(screen.getByRole('button', {name: /save/i}))

  await waitFor(() => {
    expect(createBody).not.toBeNull()
  })

  expect(createBody.title).toBe('New Task Title')
  expect(createBody.description).toBe('Task description')
  expect(createBody.priority).toBe('P2')
  expect(createBody.start).toBe('2026-01-15')
  expect(createBody.deadline).toBe('2026-01-20')
  expect(createBody.repeat).toBe('2026-02-01')
  expect(createBody.repeatPeriod).toBeNull()
  expect(createBody.assignees).toEqual([])
  expect(createBody.parentTaskId ?? null).toBeNull()
  expect(requestCount).toBe(3)
})

test('create-task-all-fields-periods-selected-assignees', async () => {
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

  const textboxes = await screen.findAllByRole('textbox')
  await user.clear(textboxes[0])
  await user.type(textboxes[0], 'New Task Title')
  await user.clear(textboxes[1])
  await user.type(textboxes[1], 'Task description')
  await user.click(screen.getByRole('combobox', {name: /without label/i}))
  await user.click(screen.getByRole('option', {name: 'P2'}))

  const periodSwitches = screen.getAllByRole('checkbox', {name: /period date/i})
  await user.click(periodSwitches[0])
  await user.click(periodSwitches[1])
  await user.click(periodSwitches[2])

  const startSection =
    screen.getByRole('heading', {name: /start time/i}).closest('[class*="MuiGrid"]')?.parentElement ?? document
  const startInputs = within(startSection).getAllByRole('spinbutton')
  fireEvent.change(startInputs[0], {target: {value: '1'}})
  fireEvent.change(startInputs[1], {target: {value: '0'}})
  fireEvent.change(startInputs[2], {target: {value: '0'}})

  const deadlineSection =
    screen.getByRole('heading', {name: 'Deadline'}).closest('[class*="MuiGrid"]')?.parentElement ?? document
  const deadlineInputs = within(deadlineSection).getAllByRole('spinbutton')
  fireEvent.change(deadlineInputs[0], {target: {value: '2'}})
  fireEvent.change(deadlineInputs[1], {target: {value: '0'}})
  fireEvent.change(deadlineInputs[2], {target: {value: '0'}})

  const repeatSection = screen.getByRole('heading', {name: 'Repeat'})
    .closest('[class*="MuiGrid"]')?.parentElement ?? document
  const repeatInputs = within(repeatSection).getAllByRole('spinbutton')
  expect(repeatInputs.length).toBeGreaterThanOrEqual(3)
  fireEvent.change(repeatInputs[1], {target: {value: '1'}})

  const aliceRow = screen.getByText('Alice').closest('li')
  await user.click(within(aliceRow).getByRole('checkbox'))

  await user.click(screen.getByRole('button', {name: /save/i}))

  await waitFor(() => {
    expect(createBody).not.toBeNull()
  })

  expect(createBody.title).toBe('New Task Title')
  expect(createBody.description).toBe('Task description')
  expect(createBody.priority).toBe('P2')
  const expectedStart = dayjs().add(1, 'day').format('YYYY-MM-DD')
  const expectedDeadline = dayjs().add(2, 'days').format('YYYY-MM-DD')
  expect(createBody.start).toBe(expectedStart)
  expect(createBody.deadline).toBe(expectedDeadline)
  expect(createBody.repeat).toBe('')
  expect(createBody.repeatPeriod).not.toBeNull()
  expect(Number(createBody.repeatPeriod.years ?? createBody.repeatPeriod.year)).toBe(0)
  expect(Number(createBody.repeatPeriod.months ?? createBody.repeatPeriod.month)).toBe(1)
  expect(Number(createBody.repeatPeriod.days ?? createBody.repeatPeriod.day)).toBe(0)
  expect(createBody.assignees).toEqual(['Alice'])
  expect(createBody.parentTaskId ?? null).toBeNull()
  expect(requestCount).toBe(3)
})

test('close-add-task-popup-button', async () => {
  const user = userEvent.setup()
  let requestCount = 0
  const setOpen = vi.fn()

  server.use(
    http.get('/users/get', () => {
      requestCount++
      return HttpResponse.json(USERS_GET_RESPONSE)
    })
  )

  render(
    <TestWrapper>
      <TaskPopup open={true} setOpen={setOpen} />
    </TestWrapper>
  )

  await screen.findAllByRole('textbox')
  await user.click(screen.getByRole('button', {name: /close/i}))

  expect(setOpen).toHaveBeenCalledWith(false)
  expect(requestCount).toBe(1)
})

test('close-add-task-popup-escape', async () => {
  const user = userEvent.setup()
  let requestCount = 0
  const setOpen = vi.fn()

  server.use(
    http.get('/users/get', () => {
      requestCount++
      return HttpResponse.json(USERS_GET_RESPONSE)
    })
  )

  render(
    <TestWrapper>
      <TaskPopup open={true} setOpen={setOpen} />
    </TestWrapper>
  )

  await screen.findAllByRole('textbox')
  await user.keyboard('{Escape}')

  expect(setOpen).toHaveBeenCalledWith(false)
  expect(requestCount).toBe(1)
})

test('view-task', async () => {
  let requestCount = 0

  server.use(
    http.get('/users/get', () => {
      requestCount++
      return HttpResponse.json(USERS_GET_RESPONSE)
    }),
    http.get('/tasks/:id', ({params}) => {
      requestCount++
      expect(params.id).toBe('task-1')
      return HttpResponse.json(TASK_GET_RESPONSE_ALL_DATES_ANY_ASSIGNEE)
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

  // Validate all populated fields: title, description, priority, start, deadline, repeat, assignees
  const titleInput = await screen.findByDisplayValue('Parent Task 1')
  expect(titleInput).toBeDisabled()
  expect(screen.getByDisplayValue('Parent description')).toBeInTheDocument()
  expect(screen.getByText('P2')).toBeInTheDocument()
  expect(screen.getByText('Start time')).toBeInTheDocument()
  expect(screen.getByText('Deadline')).toBeInTheDocument()
  expect(screen.getByText('Repeat')).toBeInTheDocument()
  expect(screen.getByText('Any')).toBeInTheDocument()
  expect(screen.getByRole('button', {name: /complete/i})).toBeInTheDocument()
  expect(screen.getByRole('button', {name: /edit/i})).toBeInTheDocument()
  expect(requestCount).toBe(2)
})

test('edit-task-update-all-fields', async () => {
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
      return HttpResponse.json(TASK_GET_RESPONSE_ALL_DATES_ANY_ASSIGNEE)
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

  // Update title
  const textboxes = screen.getAllByRole('textbox')
  const titleBox = textboxes[0]
  await user.clear(titleBox)
  await user.type(titleBox, 'Updated Parent Task')

  // Update description
  const descBox = textboxes[1]
  await user.clear(descBox)
  await user.type(descBox, 'Updated description')

  // Update priority to P0
  await user.click(screen.getByRole('combobox', {name: /without label/i}))
  await user.click(screen.getByRole('option', {name: 'P0'}))

  // Set assignees to Alice: find the row with "Alice" and click its checkbox
  const aliceRow = screen.getByText('Alice').closest('li')
  await user.click(within(aliceRow).getByRole('checkbox'))

  await user.click(screen.getByRole('button', {name: /save/i}))

  await waitFor(() => {
    expect(updateBody).not.toBeNull()
  })

  expect(updateBody.title).toBe('Updated Parent Task')
  expect(updateBody.description).toBe('Updated description')
  expect(updateBody.priority).toBe('P0')
  expect(updateBody.assignees).toEqual(['Alice'])
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
      return HttpResponse.json(TASK_GET_RESPONSE_ALL_DATES_ANY_ASSIGNEE)
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

