import styles from './styles.module.css'
import { RiWechat2Line as Logo } from 'react-icons/ri'
import { HiMenu as MenuIcon } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import cx from 'classnames'
import { useUser } from '../../../hooks/user'
import { handleLogin, handleLogout } from '../../../lib/firebase'
import { usePageProgress } from '../../../hooks/page_progress'

export default function Navbar() {
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const { user } = useUser()
    const { progress } = usePageProgress()    

    return (
        <div className={styles.header_and_progress}>
            <header className={styles.header}>
                <Link to='' className={styles.title_container}>
                    <h5 className={styles.title}>
                        <Logo />
                        Anchat
                    </h5>
                </Link>
                <nav className={styles.navbar}>
                    <div className={styles.menu_icon_container}
                        onClick={() => { setShowMenu(prev => !prev) }}>
                        <MenuIcon className={styles.menu_icon} />
                    </div>
                    <ul className={cx(styles.menu_items, showMenu ? null : styles.closed)}>
                        <Link to="about">
                            <li className={styles.menu_item}>About</li>
                        </Link>

                        {!!user &&
                            <Link to="">
                                <li className={styles.menu_item}>Rooms</li>
                            </Link>
                        }

                        <li className={styles.menu_item} onClick={!!user ? handleLogout : handleLogin}>
                            {!!user ? 'Logout' : 'Login'}
                        </li>
                    </ul>
                </nav>
            </header>
            <div className={styles.progress_bar_container}>
                <div className={cx(styles.progress_bar, progress && styles.show)} />
            </div>
        </div>
    )
}