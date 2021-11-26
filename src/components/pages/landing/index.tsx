import { handleLogin } from '../../../lib/firebase'
import Button from '../../atoms/button'
import Container from '../../atoms/container'
import styles from './styles.module.css'

export default function LandingPage() {
    return (
        <Container>
            <main className={styles.call_to_action_container}>
                <h1 className={styles.title}>Anchat</h1>
                <p className={styles.subtitle}>Chat with people, for free.</p>
                <Button label="Join or login" style={{ marginTop: 'var(--sp-300)' }}
                    buttonProps={{ onClick: () => { handleLogin() } }}>
                    Join/Login
                </Button>
            </main>
        </Container>
    )
}