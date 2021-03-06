import React from 'react';
import CreateCard from './create-card';
import ReviewCards from './review-cards';
import ViewCards from './view-cards';
import Nav from './nav';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'view-cards',
      cards: [],
      cardToDeleteIndex: 0,
      modalOff: true
    };

    this.setView = this.setView.bind(this);
    this.saveCards = this.saveCards.bind(this);
    this.addCard = this.addCard.bind(this);
    this.getCards = this.getCards.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.handleModalCancel = this.handleModalCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  setView(currentView) {
    this.setState({
      view: currentView
    });
  }

  getView() {
    switch (this.state.view) {
      case 'create-card':
        return <CreateCard addCard={this.addCard}/>;
      case 'review-cards':
        return <ReviewCards cards={this.state.cards} />;
      case 'view-cards':
        return <ViewCards cardList={this.state.cards} onClick={this.getCards} deleteCard={this.deleteCard}/>;
      default:
        return null;
    }
  }

  componentDidMount() {
    this.getCards();
  }

  getCards() {
    const savedCardList = JSON.parse(localStorage.getItem('flash-cards'));
    if (savedCardList) {
      this.setState({
        cards: savedCardList
      });
    } else {
      this.setState({
        cards: []
      });
    }
  }

  saveCards() {
    const cardsList = JSON.stringify(this.state.cards);
    localStorage.setItem('flash-cards', cardsList);
    this.getCards();
  }

  addCard(card) {
    const cardsList = [...this.state.cards];
    cardsList.push(card);
    this.setState({
      cards: cardsList
    }, () => this.saveCards());
  }

  deleteCard(index) {
    this.setState({
      cardToDeleteIndex: index,
      modalOff: false
    });
  }

  handleDelete() {
    const index = this.state.cardToDeleteIndex;
    const cardsList = [...this.state.cards];
    cardsList.splice(index, 1);
    this.setState({
      cards: cardsList,
      modalOff: true
    }, () => this.saveCards());
  }

  renderModal() {
    const index = this.state.cardToDeleteIndex;
    const cardsList = [...this.state.cards];
    const cardToDelete = cardsList[index];

    return (
      <div id='modal-container'
        className={this.state.modalOff ? 'd-none' : 'visible'}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Do you really want to delete this card?
              </h5>
              <button
                className="close"
                data-dismiss='modal'>
                <span>&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <p>{cardToDelete ? `Question: ${cardToDelete.question}` : null}</p>
              <p>{cardToDelete ? `Answer: ${cardToDelete.answer}` : null}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={this.handleDelete}>Delete</button>
              <button className="btn btn-secondary" onClick={this.handleModalCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleModalCancel() {
    this.setState({
      modalOff: true
    });
  }

  render() {
    return (
      <div>
        {this.renderModal()}
        <Nav setView={this.setView}/>
        <div className='col-12'>
          {this.getView()}
        </div>
      </div>
    );
  }

}
