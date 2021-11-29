import { useNavigate } from 'react-router'
import { useUser } from '../../../hooks/user'
import { handleLogin } from '../../../lib/firebase'
import Button from '../../atoms/button'
import Container from '../../atoms/container'
import styles from './styles.module.css'

export default function LandingPage() {
    const { user } = useUser()
    const navigate = useNavigate()

    return (
        <Container>
            <main className={styles.call_to_action_container}>
                <h1 className={styles.title}>Anchat</h1>
                <p className={styles.subtitle}>Chat with people, for free.</p>
                <Button label={!user ? "Join or login" : "Rooms"} style={{ marginTop: 'var(--sp-300)' }}
                    buttonProps={{ onClick: () => { !user ? handleLogin() : navigate('rooms', { state: '/' }) } }}>
                    {!user ? "Join/Login" : "Rooms"}
                </Button>
            </main>
            <aside className={styles.background_container} />
            <p className={styles.bg_credit}>
                <a href='https://www.freepik.com/vectors/banner'>Background art by svstudioart</a>
            </p>
        </Container>
    )
}