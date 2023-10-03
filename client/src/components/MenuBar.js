import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

function MenuBar() {
    const currentPath = window.location.pathname;
    const activeItemName = currentPath === '/' ? 'Home' : currentPath.substr(1);
    const [activeItem, setActiveItem] = useState(activeItemName);

    
    
   const handleItemClick = (e, { name }) => setActiveItem(name)

    return (
        <Menu pointing secondary size="massive" color='purple'>
            <Menu.Item
                name='Home'
                active={activeItem === 'home'}
                onClick={handleItemClick}
                as={Link}
                to="/"
            />

            <Menu.Menu position='right'>
                <Menu.Item
                    name='Login'
                    active={activeItem === 'login'}
                    onClick={handleItemClick}
                    as={Link}
                    to="/login"
                />
                <Menu.Item
                    name='Register'
                    active={activeItem === 'register'}
                    onClick={handleItemClick}
                    as={Link}
                    to="/register"
                />
            </Menu.Menu>
        </Menu>

    )
}



export default MenuBar;