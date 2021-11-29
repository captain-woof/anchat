import { CenteredContainer } from '../../atoms/container'
import styles from './styles.module.css'

export default function NotFound(){
    return (
        <CenteredContainer>
            <h3 className={styles.heading}>Error 404</h3>
            <p>This page does not exist!</p>
        </CenteredContainer>
    )
}