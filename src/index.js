import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import './index.css';
import jkrowling from './images/authors/jkrowling.jpg';
import stephenking from './images/authors/stephenking.jpg';
import charlesdickens from './images/authors/charlesdickens.jpg';
import josephconrad from './images/authors/josephconrad.jpg';
import marktwain from './images/authors/marktwain.jpg';
import williamshakespeare from './images/authors/williamshakespeare.jpg';
import AuthorQuiz from './AuthorQuiz';
import AddAuthorForm from './AddAuthorForm';
import { shuffle, sample } from 'underscore';

const authors = [
  {
    name: 'J.K. Rowling',
    imageUrl: jkrowling,
    imageSource: 'Wikimedia Commons',
    imageAttribution: 'Daniel Ogren',
    books: ['Harry Potter and the Sorcerers Stone'],
  },
  {
    name: 'Stephen King',
    imageUrl: stephenking,
    imageSource: 'Wikimedia Commons',
    imageAttribution: 'Pinguino',
    books: ['The Shining', 'IT'],
  },
  {
    name: 'Charles Dickens',
    imageUrl: charlesdickens,
    imageSource: 'Wikimedia Commons',
    books: ['David Copperfield', 'A Tale of Two Cities'],
  },
  {
    name: 'Joseph Conrad',
    imageUrl: josephconrad,
    imageSource: 'Wikimedia Commons',
    books: ['Heart of Darkness'],
  },
  {
    name: 'Mark Twain',
    imageUrl: marktwain,
    imageSource: 'Wikimedia Commons',
    books: [
      'The Adventures of Huckleberry Finn',
      'The Adventures of Tom Sawyer',
      'A Connecticut Yankee in King Arthurs Court',
      'The Prince and the Pauper',
      'Life on the Mississippi',
      'Roughing It',
    ],
  },
  {
    name: 'William Shakespeare',
    imageUrl: williamshakespeare,
    imageSource: 'Wikimedia Commons',
    books: ['Hamlet', 'Macbeth', 'Romeo and Juliet'],
  },
];

function getTurnData(authors) {
  const allBooks = authors.reduce(function (p, c, i) {
    return p.concat(c.books);
  }, []);

  const fourRandomBooks = shuffle(allBooks).slice(0, 4);
  const answer = sample(fourRandomBooks);

  return {
    books: fourRandomBooks,
    author: authors.find((author) =>
      author.books.some((title) => title === answer),
    ),
  };
}

function reducer(
  state = { authors, turnData: getTurnData(authors), highlight: '' },
  action,
) {
  switch (action.type) {
    case 'ANSWER_SELECTED':
      const isCorrect = state.turnData.author.books.some(
        (book) => book === action.answer,
      );
      return Object.assign({}, state, {
        highlight: isCorrect ? 'correct' : 'wrong',
      });
    case 'CONTINUE':
      return Object.assign({}, state, {
        highlight: '',
        turnData: getTurnData(state.authors),
      });
    case 'ADD_AUTHOR':
      return Object.assign({}, state, {
        authors: state.authors.concat([action.author]),
      });
    default:
      return state;
  }
}

let store = Redux.createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

ReactDOM.render(
  <HashRouter>
    <ReactRedux.Provider store={store}>
      <React.Fragment>
        <Route exact path="/" component={AuthorQuiz} />
        <Route path="/add" component={AddAuthorForm} />
      </React.Fragment>
    </ReactRedux.Provider>
  </HashRouter>,
  document.getElementById('root'),
);
