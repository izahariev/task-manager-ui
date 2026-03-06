import {render, screen} from '@testing-library/react'
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
          expect(url.searchParams.get('size')).toBe('10')

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