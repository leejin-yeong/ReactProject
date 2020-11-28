import React, { FC, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { io } from 'socket.io-client'
import { firestore } from '../components/firebase';
import './styles.css'
import {items} from '../layouts/Main/SideBar/SideBar.js'

import $ from 'jquery';


type FormData = {
  id: string
  pw: string
}

type ChatData = {
  msg: string
}

var socketId = "";
var roomId = "";
var userId = "";

const ChatForm: FC<{
  handleChat: (msg: string) => void
  handleRoom: (roomId: string) => void
}> = (props) => {
  const socket = useRef(io('http://localhost:3005')).current
  const { handleChat } = props
  const { handleRoom } = props
  const { register, handleSubmit } = useForm<ChatData>()
  const history = useHistory();
  const onSubmit = handleSubmit(({ msg }) => {
    
    console.log(msg)
    if (!msg) {
      alert('check validation')
      return false
    }

    handleChat(msg);
    
  })

  const [roomList, setRoomList] = useState([]);
  let tempList = []
  //

  const handleLogout = () => {
    if(window.confirm("로그아웃 하시겠습니까?") === true){
      items.map((item)=>{
          if(item.label == "My Page"){
              item.label = "Login"
              item.href = "/login"
          }
      })
      userId = ''
      socket.emit('userInfo', '');
      history.push('/home');
    }
  }


  const roomSelect = () => {
    handleRoom('1');
  }


  useEffect(()=>{
    socket.on('getUserId', (data: string) => {
      if(userId === ''){
          console.log("My page: " + data)
          userId = data
          firestore.collection("users")
          .where("id", "==", data).get()
          .then((docs) => {
              docs.forEach((doc) => {
                  tempList = doc.data().list.map((el: number) => (
                      <div className="roomName">
                          <div className="roomEl active" data-id={el}>Chat {el}</div>
                          <button id="out">나가기</button>
                      </div>
                  ))
                  setRoomList(tempList)
              })   
          })
      }
    })
  }, [socket])

  return (
    <body> 
      <nav>
        <button className="btn" onClick={() => {handleLogout()}}>
          Logout
        </button>
      </nav>
      
      <div id="contentCover">
        <div id="roomWrap">
          <div id="roomList">
            <div id="roomHeader">채팅 방 목록</div>

            <span id="roomSelect">
              {roomList}

            </span>
          </div>
        </div>
        <div id="chatWrap">  
          <div id="chatHeader">Please enter the room</div>      
          <div id="chatLog" >
            <div className="anotherMsg msgEl"><span className="anotherName">운영자</span><span className="msg">환영합니다</span></div>
            <div className="myMsg msgEl"><div className="msg">안녕하세요</div></div>
          </div>
          <form onSubmit={onSubmit} id="chatForm">
            <input ref={ register } type="text" autoComplete="off" name="msg" id="message" placeholder="메시지를 입력하세요"/>
            <input type="submit" value="보내기"/>
          </form>
        </div>
        <div id="memberWrap">
            <div id="memberList">
                <div id="memberHeader">참여자</div>
                <div id="memberSelect"></div>
                    
            </div>
        </div>   
      </div>
    </body>
  )
}

const NewChat: FC = (props) => {
  const socket = useRef(io('http://localhost:3005')).current

  const handleChat = (msg: string) => {
    let m = $("#message");
    console.log('handleChat')
    socket.emit(
      'new message',
      { msg },
      (res: any) => {
        console.log('emit')
      }
    );
    m.val("");
  }

  const handleRoom = (roomId : string) => {
    
  }

  useEffect(() => {
    var $chatLog = $('#chatLog');
    var $memberSelect = $('#memberSelect');
    var $chatWrap = $('#chatWrap');
    var $roomSelect = $('#roomSelect');

    socket.on('room', (data: FormData, cb?: Function) => {
      console.log('room')
    })

    socket.on('userlist', (data: any) => {
      let html = "";
      data.forEach((el: { socketId: string; name: any }) => {
          if (el.socketId === socketId) {
              html += `<div class="memberEl">${el.name} (me)</div>`
          } else {
              html += `<div class="memberEl">${el.name}</div>`
          }
      });
      $memberSelect.html(html);
    });

    socket.on('lefted room', (data: string) => {
      $chatLog.append(`<div class="notice"><strong>${data}</strong> lefted the room</div>`)
    });

    socket.on('joined room', (data: string) => {
        $chatLog.append(`<div class="notice"><strong>${data}</strong> joined the room</div>`)
    });

    socket.on('new message',  (data: any) => {
      $chatWrap.show();
      console.log(data)

      $chatLog.append(`<div class="myMsg msgEl"><div class="msg">${data.msg}</div></div>`)
      /*
      if (data.socketId === socketId) {
        $chatLog.append(`<div class="myMsg msgEl"><span class="msg">${data.msg}</span></div>`)
      }else {
        $chatLog.append(`<div class="anotherMsg msgEl"><span class="anotherName">${data.name}</span><span class="msg">${data.msg}</span></div>`)
      }
      */
      $chatLog.scrollTop($chatLog[0].scrollHeight - $chatLog[0].clientHeight);
    });

    $roomSelect.on("click", "div", function () {
      if(roomId == ''){
        roomId = $(this).data('id');
      } else if(roomId !== $(this).data('id')) {
        console.log(roomId)
      } 
      //$(this).parents().children().removeClass("active");
      //$(this).addClass("active");
      console.log($(this).data().id);
      $('#chatHeader').html(`${roomId}`);
      console.log(userId)
      socket.emit('joined room', userId);
      socket.emit('join room', {
        roomId
      });
    
    });

  }, [socket])

  return (
    <div className="NewChat">

      <ChatForm handleChat={handleChat} handleRoom = {handleRoom}/>

    </div>
  )
}

export default NewChat
