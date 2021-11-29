import Button from '../components/atoms/button'
import Container from '../components/atoms/container'
import { useUser } from '../hooks/user'
import { handleLogin } from '../lib/firebase'
import styles from '../styles/home.module.css'
import router from 'next/router'
import MainSeo from '../components/seo/main'

const Homepage = () => {
    const { user } = useUser()

    return (
        <>
            <MainSeo />
            <Container>
                <main className={styles.call_to_action_container}>
                    <h1 className={styles.title}>Anchat</h1>
                    <p className={styles.subtitle}>Chat with people, for free.</p>
                    <Button label={!user ? "Join or login" : "Rooms"} style={{ marginTop: 'var(--sp-300)' }}
                        buttonProps={{ onClick: () => { !user ? handleLogin() : router.push('/rooms') } }}>
                        {!user ? "Join/Login" : "Rooms"}
                    </Button>
                </main>
                <aside className={styles.background_container} />
                <p className={styles.bg_credit}>
                    <a href='https://www.freepik.com/vectors/banner'>Background art by svstudioart</a>
                </p>
            </Container>
        </>
    )
}

export default Homepage
