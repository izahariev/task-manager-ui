import {render, screen, waitFor, within} from '@testing-library/react'
import {userEvent} from "@testing-library/user-event/dist/cjs/setup/index.js";
import {http, HttpResponse} from 'msw'
import UsersPopup from '../components/users_popup/UsersPopup.jsx'
import {ActiveTabProvider} from '../contexts/ActiveTabProvider.jsx'
import {ErrorMessagesProvider} from '../contexts/ErrorMessagesProvider.jsx'
import {TasksProvider} from '../contexts/TasksProvider.jsx'
import {UsersProvider} from '../contexts/UsersProvider.jsx'
import {server} from './msw/server.js'

const USERS_GET_RESPONSE = {
    content: {
        elements: [
            {id: '6b9dd93e-2da3-40c2-a144-2e3a236d63e3', name: 'TU1'},
            {id: '571b46b0-8cbc-4829-8eb1-cdff89df5998', name: 'TU2'}
        ],
        totalPageCount: 1,
        totalElementsCount: 2
    },
    errors: []
}

function TestWrapper({children}) {
    return (
      <ErrorMessagesProvider>
          <ActiveTabProvider>
              <UsersProvider>
                  <TasksProvider>
                      {children}
                  </TasksProvider>
              </UsersProvider>
          </ActiveTabProvider>
      </ErrorMessagesProvider>
    )
}

test('load-users', async () => {
    let requestCount = 0

    server.use(
      http.get('/users/get', ({request}) => {
          requestCount++
          const url = new URL(request.url)
          expect(url.searchParams.get('page')).toBe('1')
          expect(url.searchParams.get('size')).toBe('25')

          return HttpResponse.json(USERS_GET_RESPONSE)
      })
    )

    render(
      <TestWrapper>
          <UsersPopup open={true} onClose={() => {
          }}/>
      </TestWrapper>
    )

    expect(await screen.findByText('TU1')).toBeInTheDocument()
    expect(await screen.findByText('TU2')).toBeInTheDocument()
    expect(requestCount).toBe(1)
})

test('load-max-users', async () => {
    let requestCount = 0
    const totalUsers = 25
    const users = Array.from({length: totalUsers}, (_, i) => ({
        id: `user-${i + 1}`,
        name: `User ${i + 1}`
    }))

    server.use(
      http.get('/users/get', () => {
          requestCount++
          return HttpResponse.json({
              content: {
                  elements: users,
                  totalPageCount: 1,
                  totalElementsCount: 2
              },
              errors: []
          })
      }),
    )

    render(
      <TestWrapper>
          <UsersPopup open={true} onClose={() => {}} />
      </TestWrapper>
    )

    await screen.findByText('User 25')

    for (let i = 1; i <= totalUsers; i++) {
        expect(screen.getByText(`User ${i}`)).toBeInTheDocument()
    }
    expect(requestCount).toBe(1)
})

test('add-user', async () => {
    const user = userEvent.setup()
    let createRequestUrl = null
    let requestCount = 0

    server.use(
      http.get('/users/get', () => {
          requestCount++
          return HttpResponse.json(USERS_GET_RESPONSE)
      }),
      http.post('/users/create', ({request}) => {
          requestCount++
          createRequestUrl = request.url
          return HttpResponse.json({errors: []})
      })
    )

    render(
      <TestWrapper>
          <UsersPopup open={true} onClose={() => {
          }}/>
      </TestWrapper>
    )

    await screen.findByText('TU1')

    const usernameInput = screen.getByLabelText('Username')
    await user.clear(usernameInput)
    await user.type(usernameInput, 'NewUser')

    const addButton = screen.getByRole('button', {name: /add user/i})
    await user.click(addButton)

    expect(new URL(createRequestUrl).searchParams.get('name')).toBe('NewUser')
    expect(requestCount).toBe(3)
})

test('add-user-existing-username', async () => {
    const user = userEvent.setup()
    let createRequestUrl = null
    let requestCount = 0

    server.use(
      http.get('/users/get', () => {
          requestCount++
          return HttpResponse.json(USERS_GET_RESPONSE)
      }),
      http.post('/users/create', ({request}) => {
          requestCount++
          createRequestUrl = request.url
          return HttpResponse.json(
            {errors: [{description: 'User \'TU1\' is taken.'}]},
            {status: 400}
          )
      })
    )

    render(
      <TestWrapper>
          <UsersPopup open={true} onClose={() => {
          }}/>
      </TestWrapper>
    )

    await screen.findByText('TU1')

    const usernameInput = screen.getByLabelText('Username')
    await user.clear(usernameInput)
    await user.type(usernameInput, 'TU1')
    await user.click(screen.getByRole('button', {name: /add user/i}))

    expect(new URL(createRequestUrl).searchParams.get('name')).toBe('TU1')
    expect(await screen.findByText('User \'TU1\' is taken.')).toBeInTheDocument()
    expect(requestCount).toBe(2)
})

test('edit-user', async () => {
    const user = userEvent.setup()
    let updateRequestUrl = null
    let requestCount = 0

    server.use(
      http.get('/users/get', () => {
          requestCount++
          return HttpResponse.json(USERS_GET_RESPONSE)
      }),
      http.patch('/users/update', ({request}) => {
          requestCount++
          updateRequestUrl = request.url
          return HttpResponse.json({errors: []})
      })
    )

    render(
      <TestWrapper>
          <UsersPopup open={true} onClose={() => {
          }}/>
      </TestWrapper>
    )

    await screen.findByText('TU1')

    const editButton = screen.getByRole('button', {name: 'Edit TU1'})
    await user.click(editButton)

    const nameInput = screen.getByDisplayValue('TU1')
    await user.clear(nameInput)
    await user.type(nameInput, 'TU1-Edited')

    const saveButton = screen.getByRole('button', {name: 'Save edit'})
    await user.click(saveButton)

    expect(updateRequestUrl).not.toBeNull()
    const url = new URL(updateRequestUrl)
    expect(url.searchParams.get('originalName')).toBe('TU1')
    expect(url.searchParams.get('newName')).toBe('TU1-Edited')
    expect(requestCount).toBe(3)
})

test('edit-user-existing-username', async () => {
    const user = userEvent.setup()
    let updateRequestUrl = null
    let requestCount = 0

    server.use(
      http.get('/users/get', () => {
          requestCount++
          return HttpResponse.json(USERS_GET_RESPONSE)
      }),
      http.patch('/users/update', ({request}) => {
          requestCount++
          updateRequestUrl = request.url
          return HttpResponse.json(
            {errors: [{description: 'User \'TU2\' is taken.'}]},
            {status: 400}
          )
      })
    )

    render(
      <TestWrapper>
          <UsersPopup open={true} onClose={() => {
          }}/>
      </TestWrapper>
    )

    await screen.findByText('TU1')

    await user.click(screen.getByRole('button', {name: 'Edit TU1'}))
    const nameInput = screen.getByDisplayValue('TU1')
    await user.clear(nameInput)
    await user.type(nameInput, 'TU2')
    await user.click(screen.getByRole('button', {name: 'Save edit'}))

    const url = new URL(updateRequestUrl)
    expect(url.searchParams.get('originalName')).toBe('TU1')
    expect(url.searchParams.get('newName')).toBe('TU2')
    expect(await screen.findByText('User \'TU2\' is taken.')).toBeInTheDocument()
    expect(requestCount).toBe(2)
})

test('delete-user', async () => {
    const user = userEvent.setup()
    let deleteRequestUrl = null
    let requestCount = 0

    server.use(
      http.get('/users/get', () => {
          requestCount++
          return HttpResponse.json(USERS_GET_RESPONSE)
      }),
      http.get('/tasks/list', () => {
          requestCount++
          return HttpResponse.json({
              content: {elements: [], totalPageCount: 0, totalElementsCount: 0},
              errors: []
          })
      }),
      http.delete('/users/remove', ({request}) => {
          requestCount++
          deleteRequestUrl = request.url
          return HttpResponse.json({errors: []})
      })
    )

    render(
      <TestWrapper>
          <UsersPopup open={true} onClose={() => {
          }}/>
      </TestWrapper>
    )

    await screen.findByText('TU1')

    const deleteButton = screen.getByRole('button', {name: 'Delete TU1'})
    await user.click(deleteButton)

    expect(screen.getByText(/Are you sure you want to delete user/)).toBeInTheDocument()

    const confirmDeleteButton = screen.getByRole('button', {name: 'Delete'})
    await user.click(confirmDeleteButton)

    expect(new URL(deleteRequestUrl).searchParams.get('id')).toBe(USERS_GET_RESPONSE.content.elements[0].id)
    expect(requestCount).toBe(4)
})

test('add-user-empty-username', async () => {
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
          <UsersPopup open={true} onClose={() => {
          }}/>
      </TestWrapper>
    )

    await screen.findByText('TU1')

    const usernameInput = screen.getByLabelText('Username')
    await user.clear(usernameInput)

    const addButton = screen.getByRole('button', {name: /add user/i})
    await user.click(addButton)

    expect(screen.getByText('Please enter a user name')).toBeInTheDocument()
    expect(requestCount).toBe(1)
})

test('cancel-edit-user', async () => {
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
          <UsersPopup open={true} onClose={() => {
          }}/>
      </TestWrapper>
    )

    await screen.findByText('TU1')

    await user.click(screen.getByRole('button', {name: 'Edit TU1'}))
    await user.click(screen.getByRole('button', {name: 'Cancel edit'}))

    expect(screen.getByText('TU1')).toBeInTheDocument()
    expect(requestCount).toBe(1)
})

test('cancel-delete-user', async () => {
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
          <UsersPopup open={true} onClose={() => {
          }}/>
      </TestWrapper>
    )

    await screen.findByText('TU1')

    await user.click(screen.getByRole('button', {name: 'Delete TU1'}))
    expect(screen.getByText(/Are you sure you want to delete user/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', {name: 'Cancel'}))

    await waitFor(() => {
        expect(screen.queryByText(/Are you sure you want to delete user/)).not.toBeInTheDocument()
    })
    expect(requestCount).toBe(1)
})

test('load-users-empty-list', async () => {
    let requestCount = 0
    const emptyResponse = {
        content: {elements: [], totalPageCount: 0, totalElementsCount: 0},
        errors: []
    }
    server.use(
      http.get('/users/get', () => {
          requestCount++
          return HttpResponse.json(emptyResponse)
      })
    )

    render(
      <TestWrapper>
          <UsersPopup open={true} onClose={() => {}} />
      </TestWrapper>
    )

    expect(await screen.findByText('No users found. Add your first user below.')).toBeInTheDocument()
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /add user/i})).toBeInTheDocument()
    expect(requestCount).toBe(1)
})

test('add-user-enter-key', async () => {
    const user = userEvent.setup()
    let createRequestUrl = null
    let requestCount = 0

    server.use(
      http.get('/users/get', () => {
          requestCount++
          return HttpResponse.json(USERS_GET_RESPONSE)
      }),
      http.post('/users/create', ({request}) => {
          requestCount++
          createRequestUrl = request.url
          return HttpResponse.json({errors: []})
      })
    )

    render(
      <TestWrapper>
          <UsersPopup open={true} onClose={() => {}} />
      </TestWrapper>
    )

    await screen.findByText('TU1')

    const usernameInput = screen.getByLabelText('Username')
    await user.clear(usernameInput)
    await user.type(usernameInput, 'NewUser{Enter}')

    expect(createRequestUrl).not.toBeNull()
    expect(new URL(createRequestUrl).searchParams.get('name')).toBe('NewUser')
    expect(requestCount).toBe(3)
})

test('edit-user-enter-key', async () => {
    const user = userEvent.setup()
    let updateRequestUrl = null
    let requestCount = 0

    server.use(
      http.get('/users/get', () => {
          requestCount++
          return HttpResponse.json(USERS_GET_RESPONSE)
      }),
      http.patch('/users/update', ({request}) => {
          requestCount++
          updateRequestUrl = request.url
          return HttpResponse.json({errors: []})
      })
    )

    render(
      <TestWrapper>
          <UsersPopup open={true} onClose={() => {}} />
      </TestWrapper>
    )

    await screen.findByText('TU1')

    await user.click(screen.getByRole('button', {name: 'Edit TU1'}))
    const nameInput = screen.getByDisplayValue('TU1')
    await user.clear(nameInput)
    await user.type(nameInput, 'TU1-Edited{Enter}')

    expect(updateRequestUrl).not.toBeNull()
    const url = new URL(updateRequestUrl)
    expect(url.searchParams.get('originalName')).toBe('TU1')
    expect(url.searchParams.get('newName')).toBe('TU1-Edited')
    expect(requestCount).toBe(3)
})

test('delete-user-failure', async () => {
    const user = userEvent.setup()
    let requestCount = 0

    server.use(
      http.get('/users/get', () => {
          requestCount++
          return HttpResponse.json(USERS_GET_RESPONSE)
      }),
      http.delete('/users/remove', () => {
          requestCount++
          return HttpResponse.json(
            {errors: [{description: 'User is assigned to tasks.'}]},
            {status: 400}
          )
      })
    )

    render(
      <TestWrapper>
          <UsersPopup open={true} onClose={() => {}} />
      </TestWrapper>
    )

    await screen.findByText('TU1')

    await user.click(screen.getByRole('button', {name: 'Delete TU1'}))
    expect(screen.getByText(/Are you sure you want to delete user/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', {name: 'Delete'}))

    expect(await screen.findByText('User is assigned to tasks.')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete user/)).toBeInTheDocument()
    expect(requestCount).toBe(2)
})

test('dismiss-error-alert', async () => {
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
          <UsersPopup open={true} onClose={() => {}} />
      </TestWrapper>
    )

    await screen.findByText('TU1')

    const usernameInput = screen.getByLabelText('Username')
    await user.clear(usernameInput)
    await user.click(screen.getByRole('button', {name: /add user/i}))

    expect(screen.getByText('Please enter a user name')).toBeInTheDocument()

    const alert = screen.getByRole('alert')
    const closeButton = within(alert).getByRole('button')
    await user.click(closeButton)

    await waitFor(() => {
        expect(screen.queryByText('Please enter a user name')).not.toBeInTheDocument()
    })
    expect(requestCount).toBe(1)
})

test('cancel-edit-by-add-field-click', async () => {
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
          <UsersPopup open={true} onClose={() => {}} />
      </TestWrapper>
    )

    await screen.findByText('TU1')

    await user.click(screen.getByRole('button', {name: 'Edit TU1'}))
    expect(screen.getByDisplayValue('TU1')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Username'))

    expect(screen.queryByDisplayValue('TU1')).not.toBeInTheDocument()
    expect(screen.getByText('TU1')).toBeInTheDocument()
    expect(requestCount).toBe(1)
})

test('add-user-multiple-errors', async () => {
    const user = userEvent.setup()
    let requestCount = 0

    server.use(
      http.get('/users/get', () => {
          requestCount++
          return HttpResponse.json(USERS_GET_RESPONSE)
      }),
      http.post('/users/create', () => {
          requestCount++
          return HttpResponse.json(
            {
                errors: [
                    {description: 'Username too short.'},
                    {description: 'Invalid characters.'}
                ]
            },
            {status: 400}
          )
      })
    )

    render(
      <TestWrapper>
          <UsersPopup open={true} onClose={() => {}} />
      </TestWrapper>
    )

    await screen.findByText('TU1')

    const usernameInput = screen.getByLabelText('Username')
    await user.clear(usernameInput)
    await user.type(usernameInput, 'Ab')
    await user.click(screen.getByRole('button', {name: /add user/i}))

    expect(await screen.findByText('Username too short.')).toBeInTheDocument()
    expect(screen.getByText('Invalid characters.')).toBeInTheDocument()
    expect(requestCount).toBe(2)
})