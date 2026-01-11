import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import '../css/index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {ErrorMessagesProvider} from "../contexts/ErrorMessagesProvider.jsx";
import {TaskChangedMessageProvider} from "../contexts/TaskChangedMessageProvider.jsx";
import {TasksProvider} from "../contexts/TasksProvider.jsx";
import {UsersProvider} from "../contexts/UsersProvider.jsx";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ErrorMessagesProvider>
          <TaskChangedMessageProvider>
              <UsersProvider>
                  <TasksProvider>
                      <App/>
                  </TasksProvider>
              </UsersProvider>
          </TaskChangedMessageProvider>
      </ErrorMessagesProvider>
  </StrictMode>,
)
