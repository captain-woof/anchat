import Button from "../../atoms/button";
import Dialog from "../../atoms/dialog";
import styles from './styles.module.css'
import { FaCopy as CopyIcon } from 'react-icons/fa'

interface IInviteDialog {
    roomId: string
    roomExists: boolean
    inviteDialogVisible: boolean
    setInviteDialogVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export default function InviteDialog({ roomId, roomExists, inviteDialogVisible, setInviteDialogVisible }: IInviteDialog) {
    return (
        roomExists
            ? <Dialog isOpen={inviteDialogVisible} setIsOpen={setInviteDialogVisible}>
                <figure className={styles.invite_dialog}>
                    <h3 className={styles.invite_dialog_heading}>Invite others</h3>
                    <Button label="Copy invite link" buttonProps={{
                        onClick: () => {
                            navigator.clipboard.writeText(`${import.meta.env.VITE_APP_ORIGIN}/room/${roomId}`)
                            setInviteDialogVisible(false)
                        }
                    }}>
                        Click to copy invite link <CopyIcon />
                    </Button>
                </figure>
            </Dialog>
            : null
    )
}