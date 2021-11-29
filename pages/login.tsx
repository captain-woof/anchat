/* eslint-disable react-hooks/exhaustive-deps */
import router from 'next/router'
import { useEffect } from 'react'
import Button from '../components/atoms/button'
import { CenteredContainer } from '../components/atoms/container'
import { useUser } from '../hooks/user'
import { handleLogin } from '../lib/firebase'
import styles from '../styles/login.module.css'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    return ({
        props: {
            from: 'from' in query ? decodeURIComponent(query.from as string) : '/'
        }
    })
}

// /login?from=SOME_PAGE
export default function LoginPage({ from }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { user, userPending } = useUser()

    useEffect(() => {
        if (!!user && !userPending) {
            router.push(from as string)
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
                    <p className={styles.login_caption}>You&apos;re being redirected...</p>
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