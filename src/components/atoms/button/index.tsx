import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './styles.module.css'

interface IButton {
    children?: ReactNode
    buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>
    icon?: ReactNode
    label: string,
    style?: React.CSSProperties
}

export default function Button({ children, buttonProps, icon, label, style }: IButton) {
    return (
        <button {...buttonProps} className={styles.button} aria-labelledby={label} style={style}>
            {children ?? null}
            {icon ?? null}
        </button>
    )
}