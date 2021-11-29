import styles from '../styles/about.module.css'
import { CenteredContainer } from '../components/atoms/container'
import Image from 'next/image'
import MainSeo from '../components/seo/main'

export default function AboutPage() {
    return (
        <>
            <MainSeo />
            <CenteredContainer>
                <div className={styles.about_container}>
                    <div className={styles.logo_container}>
                        <Image src="/logo.png" alt="Anchat logo" layout='fill' />
                    </div>
                    <p>
                        Anchat is a free platform to meet and chat with people from all across the world. You can also create your own chat rooms, and join others&apos; rooms if you are invited.
                    </p>
                    <p>
                        Anchat is created by <span className={styles.my_name}><a href="https://sohail-saha.in" target="_blank" rel="noreferrer">Sohail Saha.</a></span>
                    </p>
                </div>
            </CenteredContainer>
        </>
    )
}