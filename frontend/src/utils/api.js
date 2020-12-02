import { getToken }  from './token';;

export class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  resFetch(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
 

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
      headers: {
        ...this.headers,
        'authorization': `Bearer ${getToken()}`
      }
    }).then(this.resFetch);
  }

  getUserInfo() {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: {
        ...this.headers,
        'authorization': `Bearer ${getToken()}`
      }
    }).then(this.resFetch);
  }

  addNewCard({ name, link }) {
    return fetch(`${this.baseUrl}/cards`, {
      method: "POST",
      headers: {
        ...this.headers,
        'authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ name, link }),
    }).then(this.resFetch);
  }

  removeCard(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        ...this.headers,
        'authorization': `Bearer ${getToken()}`
      }
    }).then(this.resFetch);
  }

  editUserInfo({ name, about }) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        ...this.headers,
        'authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ name, about }),
    }).then(this.resFetch);
  }

  editAvatar(avatar) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        ...this.headers,
        'authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(avatar),
    }).then(this.resFetch);
  }

  putLike(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: {
        ...this.headers,
        'authorization': `Bearer ${getToken()}`
      }
    }).then(this.resFetch);
  }

  putDislike(cardId) {
    return fetch(`${this.baseUrl}/cards//${cardId}/likes/`, {
      method: "DELETE",
      headers: {
        ...this.headers,
        'authorization': `Bearer ${getToken()}`
      }
    }).then(this.resFetch);
  }
}

export const api = new Api({
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  headers: {
    "Content-Type": "application/json"
  },
});
