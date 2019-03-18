import React, { Component } from 'react';
import { Modal, Button, FormControl, ControlLabel, FormGroup } 
 from 'react-bootstrap';

export default class AddItem extends Component {
   constructor(props) {
      super(props);
      this.state = {
         itemName: '',
         quantity: 0,
         file: null
      }
      this.onChange = this.onChange.bind(this);
   }

   onChange = (e) => {
      e.preventDefault();
      this.setState({ file: e.target.files[0] });
   }

   close = (result) => {
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         itemName: this.state.itemName,
         quantity: this.state.quantity,
         file: this.state.file
      });
      this.setState({
         itemName: '',
         quantity: 0,
         file: null
      });
   }

   handleChange = (ev) => {
      let newState = {};
      newState[ev.target.id] = ev.target.value;
      this.setState(newState);
   }

   formValid() {
      let s = this.state;
      return s.quantity && s.itemName && s.file;
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
                  <ControlLabel>Select image</ControlLabel>
                  </FormGroup>
               </form>
               <input name="file" type="file" onChange={this.onChange} />
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