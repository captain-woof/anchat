import { useUser } from '../../../hooks/user'
import { Suspense } from 'react'
import { CenteredContainer } from '../../atoms/container'
import Button from '../../atoms/button'
import { handleLogin } from '../../../lib/firebase'
import { BsGoogle } from 'react-icons/bs'
import { lazy } from 'react'

// Code splitting
const MessagesLazy = lazy(() => import('../../molecules/messages'))

export default function Home() {
    const { user } = useUser()

    return (
        <Suspense fallback={<div>Loading...</div>}>
            {!!user
                ? <MessagesLazy />
                : <Login />
            }
        </Suspense>
    )
}

// Components used here
const Login = () => {
    return (
        <CenteredContainer>
            <Button icon={<BsGoogle />} buttonProps={{
                onClick: () => { handleLogin() },
                name: "Login"
            }} label="Login button">
                Login
            </Button>
        </CenteredContainer>
    )
}