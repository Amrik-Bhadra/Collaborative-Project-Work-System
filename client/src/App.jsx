import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import LoginForm from './pages/Forms/LoginForm';
import RegistrationForm from './pages/Forms/RegistrationForm';
import HomePage from './pages/HomePage/Home';
import CreateProjectPage from './pages/CreateProject/CreateProjectPage';
import JoinProjectPage from './pages/JoinProject/JoinProjectPage';
import ProjectRoomPage from './pages/CreateProject/ProjectRoomPage';
import CodeRoom from './pages/CodeRoom/CodeRoom';
import JoinCodeRoom from './pages/CodeRoom/JoinCodeRoom';
import { Toaster } from 'react-hot-toast';

const routes = createBrowserRouter([
    { path: '/', element: <LoginForm /> },
    { path: '/registration', element: <RegistrationForm /> },
    { path: '/home', element: <HomePage /> },
    { path: '/createProject', element: <CreateProjectPage /> },
    { path: '/joinProject', element: <JoinProjectPage /> },
    { path: '/projectRoom/:roomCode', element: <ProjectRoomPage /> },
    { path: '/joinCodeRoom', element: <JoinCodeRoom /> },
    { path: '/codeRoom/:roomid', element: <CodeRoom /> },
]);

const App = () => (
    <>
        <Toaster position="top-center" />
        <AuthProvider>
            <RouterProvider router={routes} />
        </AuthProvider>
    </>
);

export default App;
