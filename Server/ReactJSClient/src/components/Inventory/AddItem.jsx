import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup, HelpBlock
} from 'react-bootstrap';

export default class AddItem extends Component {
   constructor(props) {
      super(props);
      this.state = {
         itemName: '',
         quantity: 0,
         url: ''
      }
   }

   close = (result) => {
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         itemName: this.state.itemName,
         quantity: this.state.quantity,
         url: this.state.url
      });
      this.setState({
         itemName: '',
         quantity: 0,
         url: ''
      });
   }


   handleChange = (ev) => {
      let newState = {};
      newState[ev.target.id] = ev.target.value;
      this.setState(newState);
   }

   formValid() {
      let s = this.state;
      return s.quantity && s.itemName && s.url;
   }

   render() {
      return (
         <Modal show={this.props.showModal} 
          onHide={() => this.close("Cancel")}>
            <Modal.Header closeButton>
               <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form onSubmit={(e) =>
                  e.preventDefault() || this.state.cnvTitle.length ?
                     this.close("Ok") : this.close("Cancel")}>
                  <FormGroup>
                     <ControlLabel>Item Name</ControlLabel>
                     <FormControl
                        id="itemName"
                        type="text"
                        value={this.state.itemName}
                        placeholder="Enter name of item"
                        onChange={this.handleChange}
                     />
                  <br />
                  <ControlLabel>Quantity</ControlLabel>
                     <FormControl
                        id="quantity"
                        type="number"
                        value={this.state.quantity}
                        placeholder="Enter quantity"
                        onChange={this.handleChange}
                     />
                  <br />
                  <ControlLabel>URL to image</ControlLabel>
                     <FormControl
                        id="url"
                        type="text"
                        value={this.state.url}
                        placeholder="Enter URL"
                        onChange={this.handleChange}
                     />
                  </FormGroup>
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button 
                  disabled={!this.formValid()} 
                  onClick={() => this.close("Ok")}>
                  Add
               </Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>
      );
   }
}