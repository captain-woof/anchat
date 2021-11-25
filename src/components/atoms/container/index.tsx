import { CSSProperties, ReactNode } from 'react'
import styles from './styles.module.css'

interface IContainer {
    children: ReactNode
    style?: CSSProperties
}

export default function Container({ children, style }: IContainer) {
    return (
        <div className={styles.container} style={style}>
            {children}
        </div>
    )
}

export const CenteredContainer = ({ children, style }: IContainer) => {
    return (
        <div className={styles.centered_container} style={style}>
            {children}
        </div>
    )
}