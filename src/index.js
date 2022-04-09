import { toHaveStyle } from '@testing-library/jest-dom/dist/matchers';
import React from 'react';
import ReactDOM from 'react-dom';
import * as uuid from 'uuid';

class Dashboard extends React.Component {
  state = {
    elements: JSON.parse(localStorage.getItem("elements")) || [
      {
        "text": "Take a shower",
        "id": "0a4a79cb-b06d-4cb1-883d-549a1e3b66d7",
        "checked": false,
        "editFormOpen": false,
      },
      {
        "text": "Learn react",
        "id": "2c43306e-5b44-4ff8-8753-33c35adbd06f",
        "checked": true,
        "editFormOpen": false,
      },
      {
        "text": "Do the project",
        "id": "79cfc644-8b85-4f56-a3d6-36d11fb8591a",
        "checked": false,
        "editFormOpen": false,
      }
    ],
  };


  handleCheckboxChange = (changedElement) => {
    this.setState({
      elements: this.state.elements.map((element) => {
        if (element.id === changedElement.id) {
          return Object.assign({}, element, {
            text: changedElement.text,
            checked: changedElement.isChecked,
          });
        } else {
          return element;
        }
      }),
    })
  }

  handleAddClick = () => {
    const newElement = {
      text: "",
      id: uuid.v4(),
      checked: false,
      editFormOpen: true,
    }
    this.setState({
      elements: this.state.elements.concat(newElement)
    })
  }

  handleSubmitClick = (changedElement) => {
    this.setState({
      elements: this.state.elements.map((element) => {
        if (element.id === changedElement.id) {
          return Object.assign({}, element, {
            text: changedElement.text,
            editFormOpen: changedElement.isEditFormOpen,
          });
        } else {
          return element;
        }
      }),
    })
  }

  handleTrashClick = (deletedElementId) => {
    this.setState({
      elements: this.state.elements.filter(element => element.id !== deletedElementId),
    })
  }

  handleEditClick = (editedElementId) => {
    this.setState({
      elements: this.state.elements.map((element) => {
        if(element.id === editedElementId){
          return Object.assign({}, element, {editFormOpen: true})
        }else{
          return element
        }
      })
    })
  }

  updateElementsInStorage = () => {
      localStorage.setItem("elements", JSON.stringify(this.state.elements));
  }

  render() {
    this.updateElementsInStorage()
    console.log(this.state.elements);
    return <ListOfElements
      elements={this.state.elements}
      onCheckBoxChange={this.handleCheckboxChange}
      onAddClick={this.handleAddClick}
      onInputChange={this.handleInputChange}
      onSubmitClick={this.handleSubmitClick}
      onTrashClick={this.handleTrashClick}
      onEditClick={this.handleEditClick}
    />
  }
}

class ListOfElements extends React.Component {

  render() {
    const elements = this.props.elements.map((element) => {
      return (
        <EditableElement
          key={element.id}
          id={element.id}
          text={element.text}
          isChecked={element.checked}
          onCheckBoxChange={this.props.onCheckBoxChange}
          isEditFormOpen={element.editFormOpen}
          onInputChange={this.props.onInputChange}
          onSubmitClick={this.props.onSubmitClick}
          onTrashClick={this.props.onTrashClick}
          onEditClick={this.props.onEditClick}
        />
      )
    })
    return (
      <div className='ui centered card' id="elements">
        <div className='content'>
          <div className="ui one cards">
            {elements}
            <AddElementButton onAddClick={this.props.onAddClick} />
          </div>
        </div>
      </div>
    )
  }
}

//An element can be edited so we divide it to separate components:
//1. Element - displays the text of to do element 
//2. ElementForm - allows to edit the text of to do element
class EditableElement extends React.Component {
  state = {
    isChecked: false,
  };

  handleCheckboxChange = () => {
    const newState = !this.state.isChecked
    this.props.onCheckBoxChange({
      id: this.props.id,
      text: this.props.text,
      isChecked: newState,
    })
    this.setState({ isChecked: newState })
  }

  render() {
    if (this.props.isEditFormOpen) {
      return (
        <ElementForm id={this.props.id} text={this.props.text} isEditFormOpen={this.props.isEditFormOpen} onSubmitClick={this.props.onSubmitClick} />
      )
    } else {
      return (
        <Element id={this.props.id} 
        text={this.props.text} 
        isChecked={this.state.isChecked}
        onCheckBoxChange={this.handleCheckboxChange} 
        onTrashClick={this.props.onTrashClick} 
        onEditClick={this.props.onEditClick}
        />
      )
    }
  }
}

class Element extends React.Component {

  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id);
  }

  handleEditClick = () => {
    this.props.onEditClick(this.props.id);
  }

  render() {
    return (
      <a className="gray card">
        <div className="image">
          <div className="ui checkbox">
            <input type="checkbox" name="example" defaultChecked={this.props.isChecked} onChange={this.props.onCheckBoxChange} />
            <label>{this.props.text}</label>
          </div>
          <div className='extra content'>
            <span
              className='right floated trash alternate outline icon'
              onClick={this.handleTrashClick}
            >
              <i className='trash alternate outline icon' />
            </span>
            <span
              className='right floated edit icon'
              onClick={this.handleEditClick}
            >
              <i className='edit outline icon' />
            </span>
          </div>
        </div>
      </a>
    )
  }
}

class ElementForm extends React.Component {
  state = {
    id: this.props.id,
    text: this.props.text,
    isEditFormOpen: this.props.isEditFormOpen
  }

  handleInputChange = (e) => {
    this.setState({
      text: e.target.value,
    })
  }

  handleSubmitClick = () => {
    this.props.onSubmitClick({
      id: this.state.id,
      text: this.state.text,
      isEditFormOpen: false,
    })
  }

  render() {
    return (
      <a className="gray card">
        <div className="ui action input">
          <input type="text" placeholder="To do..." defaultValue={this.state.text || ''} onChange={this.handleInputChange} />
          <button className="ui icon button" onClick={this.handleSubmitClick}>
            <i className="check icon"></i>
          </button>
        </div>
      </a>
    )
  }
}

class AddElementButton extends React.Component {

  render() {
    return (
      <a className="gray card">
      <div className="ui animated button" onClick={this.props.onAddClick}>
        <div className="visible content">
          <i className="plus icon"></i>
        </div>
        <div className="hidden content">
          Add
        </div>
      </div>
      </a>
    )
  }
}

ReactDOM.render(
  <Dashboard />,
  document.getElementById('content')
);