import styles from './styles.module.css'
import { CSSProperties, useCallback, ReactNode, Dispatch, SetStateAction } from "react"

interface IDialog {
    children: ReactNode
    backdropStyle?: CSSProperties
    dialogBoxStyle?: CSSProperties
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

export default function Dialog({ children, backdropStyle, dialogBoxStyle, isOpen, setIsOpen }: IDialog) {
    const handleClose = useCallback((e) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false)
        }
    }, [setIsOpen])

    return (
        isOpen &&
        <div className={styles.wrapper}>
            <div style={backdropStyle} className={styles.backdrop} onClick={handleClose}/>
            <div style={dialogBoxStyle} className={styles.dialog_box}>
                {children}
            </div>
        </div>
        || null
    )
}