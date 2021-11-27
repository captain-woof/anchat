import { Dispatch, SetStateAction } from 'react'
import Button from '../../atoms/button'
import Dialog from '../../atoms/dialog'
import styles from './styles.module.css'

interface IRoomsDialog {
    buttonText: string
    title: string
    inputTextPlaceholder?: string
    label?: string
    buttonClickFunc: () => any
    inputText?: string
    inputTextRequired?: boolean
    setInputText?: Dispatch<SetStateAction<string>>
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    caption?: string
    captionNeeded?: boolean
}

export default function RoomsDialog({ buttonClickFunc, buttonText, title, inputTextPlaceholder, label, inputText, setInputText, inputTextRequired = true, isOpen, setIsOpen, caption, captionNeeded=false }: IRoomsDialog) {

    return (
        <Dialog isOpen={isOpen} setIsOpen={setIsOpen} dialogBoxStyle={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div className={styles.dialog}>
                <h4 className={styles.dialog_title}>{title}</h4>
                {captionNeeded &&
                    <p className={styles.dialog_caption}>{caption}</p>
                }
                {inputTextRequired &&
                    <>
                        <label className={styles.dialog_label} htmlFor={title}>{label}</label>
                        <input id={title} className={styles.dialog_input} placeholder={inputTextPlaceholder} value={inputText} onChange={(e) => setInputText && setInputText(e.target.value)} />
                    </>
                }
                <Button label={title} buttonProps={{
                    onClick: buttonClickFunc
                }} style={{
                    alignSelf: 'flex-end',
                    marginTop: '0.5rem'
                }}>
                    {buttonText}
                </Button>
            </div>
        </Dialog>
    )
}