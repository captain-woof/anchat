import { handleLogin } from '../../../lib/firebase'
import Button from '../../atoms/button'
import { CenteredContainer } from '../../atoms/container'
import styles from './styles.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../../../hooks/user'
import { useEffect } from 'react'

export default function LoginPage() {
    const { state: relativeUrlArrivedFrom } = useLocation()
    const { user, userPending } = useUser()
    const navigate = useNavigate()

    useEffect(() => {
        if (!!user && !userPending) {
            navigate(relativeUrlArrivedFrom ?? '/rooms',
                { state: '/login' })
        }
    }, [user, userPending])

    return (
        <CenteredContainer>
            <div className={styles.login_container}>
                <h3>
                    {!user
                        ? "Login to continue"
                        : "Logged in!"
                    }
                </h3>
                {!!user &&
                    <p className={styles.login_caption}>You're being redirected...</p>
                }
                {!user &&
                    <Button label="Login to continue" buttonProps={{ onClick: () => { handleLogin() } }}>
                        Login
                    </Button>
                }
            </div>
        </CenteredContainer>
    )
}