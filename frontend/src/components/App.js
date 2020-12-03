import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/api.js";
import * as mestoAuth from '../mestoAuth.js';
import { getToken, setToken, removeToken } from '../utils/token';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);  
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');   
  const history = useHistory();

  
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);    
    if (!isLiked) {
      const jwt = getToken();
      api.putLike(card._id, jwt).then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      });
    } else {
      const jwt = getToken();
      api.putDislike(card._id,jwt).then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      });
    }
  }

  function handleCardDelete(card) {
    const jwt = getToken();
    api.removeCard(card._id,jwt).then(() => {
      const newCards = cards.filter((c) => c._id !== card._id);
      setCards(newCards);
    });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleTrashClick() {
    setIsTrashOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleInfoTooltipOpen() {
    setIsInfoTooltipOpen(true);
  }

 
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsTrashOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);
  }

  function handleUpdateUser({ name, about }) {
    const jwt = getToken();
    api.editUserInfo({ name, about },jwt).then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    });
  }

  function handleUpdateAvatar(avatar) {
    const jwt = getToken();
    api.editAvatar(avatar, jwt).then((res) => {
      setCurrentUser(res);
      closeAllPopups();
    });
  }

  function handleAddPlace({ name, link }) {
    const jwt = getToken();
    api.addNewCard({ name, link }, jwt).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    });
  }

  function onRegister (data) {
  const { email, password } = data;    
  mestoAuth.register( email, password ).then((res) => {        
    if(res.statusCode !== 400){  
      setStatus('sucess');
      handleInfoTooltipOpen();      
      history.push('/signin'); 
    }                
  })
  .catch((err) => {
    console.log(err);
      if(err.status === 400) {
        setStatus('unsucess');
        handleInfoTooltipOpen();
        return console.log('Некорректно заполнено одно из полей');          
      } else if (err.status === 500) {
        setStatus('unsucess');
        handleInfoTooltipOpen();
        return console.log('Ошибка сервера');
      }
    });
  }
  

  const onLogin = (data) => {
    const { email, password } = data;       
      mestoAuth.authorize(email, password)  
      .then((data) => {                        
        if (data.token) {
          setToken(data.token);
          setEmail(email);      
          setLoggedIn(true)         
          history.push('/');
        }        
      })
      .catch((err) => {
      console.log(err);
        if(err.status === 400) {
          return console.log('Не передано одно из полей');
        } else if(err.status === 401) {
          return console.log('Пользователь с email не найден');
        } else if (err.status === 500) {
          return console.log('Ошибка сервера');
        }
      });
  }

  const onSignOut = ( ) => {
    removeToken();
    setLoggedIn(false);
    history.push('/signin');
  }

    
   useEffect(() => {           
    const jwt = getToken();
      if (jwt) {     
      mestoAuth.getContent(jwt)
        .then((res) => {
          if (res) {           
        setLoggedIn(true);   
        setEmail(email);    
        setStatus(res);
        history.push('/')
        }
      }).catch((err) => {
        console.log(err.status);
        if(err.status === 401) {
          removeToken();
          return console.log('Переданный токен некорректен');
        } else if(!jwt) {
          removeToken();
          return console.log('Токен не передан или передан не в том формате');
        } else if (err.status === 500) {
          removeToken();
          return console.log('Ошибка сервера');
        }
      });
    }           
  }, []);

  
  
  useEffect(() => {      
    if (!loggedIn) {  
      return
    } 
    const jwt = getToken();  
    api.getAppInfo(jwt)
      .then((res) => {
        const [cards, info] = res;
        setCurrentUser(info);
        setCards(cards);        
      }).catch((err) => {
        console.log(err.message);
      });       
    }, [loggedIn]);    


  return (
    <CurrentUserContext.Provider value={currentUser}>          
        <div className="page">
          <div className="page__container">
            <Header 
              email={email}
              loggedIn={loggedIn} 
              onSignOut={onSignOut} 
            />
            <Switch>
            <Route path="/signup">
              <Register  onRegister={onRegister}  />
            </Route>
            <Route path="/signin">
             <Login onLogin={onLogin} />
           </Route>           
           <ProtectedRoute exact path="/"
              loggedIn={loggedIn}            
              cards={cards}
              onEditProfile={handleEditProfileClick}
              onEditAvatar={handleEditAvatarClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              onTrashClick={handleTrashClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              email={email}
              component={Main}
            /> 
             <Route  path="/"  >
               {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
             </Route >              
                                        
            </Switch>  
            <Route exact path="/"  >
            <Footer/>
            </Route>           
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlace}
            />
            <PopupWithForm
              name="confirm"
              isOpen={isTrashOpen}
              title="Вы уверены?"
              buttonText="Да"
              onClose={closeAllPopups}
            />
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />  
            < InfoTooltip  onClose={closeAllPopups}  isOpen={isInfoTooltipOpen} status={status}/>    
          </div>
        </div>     
    </CurrentUserContext.Provider>
  );
}

export default App;
