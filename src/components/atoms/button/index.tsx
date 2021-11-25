import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './styles.module.css'

interface IButton {
    children?: ReactNode
    buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>
    icon?: ReactNode
    label: string
}

export default function Button({ children, buttonProps, icon, label }: IButton) {
    return (
        <button {...buttonProps} className={styles.button} aria-labelledby={label}>
            {children ?? null}
            {icon ?? null}
        </button>
    )
}