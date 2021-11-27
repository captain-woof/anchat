import styles from './styles.module.css'
import { AiOutlineLoading3Quarters as SpinnerIcon } from 'react-icons/ai'
import { CenteredContainer } from '../../atoms/container'

export default function Loading() {
    return (
        <CenteredContainer>
            <SpinnerIcon className={styles.spinner}/>
        </CenteredContainer>
    )
}