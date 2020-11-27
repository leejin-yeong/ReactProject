import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import SproutIcon from '../../../components/icon.png';
import title from '../../../components/title.png';
import { io } from 'socket.io-client'


/* Styled */
import styled from 'styled-components';

/* Sub Components */
import SideBarNav from './SideBarNav';
import SideBarNavItem from './SideBarNav/SideBarNavItem';

/* Styled Components */
const Container = styled.div`
  position: fixed;
  left: 0;
  height: 100%;
  width: 200px;
  background-color: #D9CA9C;
`;

/* Constant Variables */
export const items = [
  { label: "", href: "" },
  { label: "Map", href: "/home" },
  { label: "Chat", href: "/chat" }
];

/* Main Compoent */
const SideBar = props => {
  /* Props */
  const {
    className,
  } = props;

  const [id, setId] = useState('');

  const socket = useRef(io('http://localhost:3005')).current
  
  useEffect(() => {
    console.log("Sidebar")
    socket.on('getUserId', (data) => {
        console.log("sidebar id: " + data)
        if(data !== ""){
          items[0].label = "My Page"
          items[0].href = "/mypage"
        }
        else{
          items[0].label = "Login"
          items[0].href = "/login"
        }
        setId(data);
    })
  }, [socket])

  /* Renderer */
  return (
    <Container className={ className }>
        <div>
          <form type="submit">
            <p>
            
            <img src={ SproutIcon } width='50px' height='32px' padding-left='100px' padding-top='10px' alt=""/>
            <span>
              {"   "}
            </span>
            <img src ={title} width='130px' height='32px' alt=""/>
            
            </p>
          </form>
        </div>
      <SideBarNav items={ items }/>
    </Container>
  );
}

/* Main Component Settings */
SideBar.propTypes = {
  className: PropTypes.string,
}

/* Exports */
export default SideBar;