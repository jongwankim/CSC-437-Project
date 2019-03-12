import React, { Component } from 'react';
import {
   Modal, Button, FormControl, ControlLabel, FormGroup, HelpBlock
} from 'react-bootstrap';

export default class CheckOutModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         firstName: '',
         lastName: '',
         email: ''
      }
   }

   close = (result) => {
      this.props.onDismiss && this.props.onDismiss({
         status: result,
         firstName: this.state.firstName,
         lastName: this.state.lastName,
         email: this.state.email,
         item: this.props.item
      });
      this.setState({
         firstName: '',
         lastName: '',
         email: ''
      });
   }


   handleChange = (ev) => {
      let newState = {};
      newState[ev.target.id] = ev.target.value;
      this.setState(newState);
   }

   formValid() {
      let s = this.state;
      return s.firstName && s.lastName && s.email;
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
                     <ControlLabel>First Name</ControlLabel>
                     <FormControl
                        id="firstName"
                        type="text"
                        value={this.state.firstName}
                        placeholder="Enter first name"
                        onChange={this.handleChange}
                     />
                  <br />
                  <ControlLabel>Last Name</ControlLabel>
                     <FormControl
                        id="lastName"
                        type="text"
                        value={this.state.lastName}
                        placeholder="Enter quantity"
                        onChange={this.handleChange}
                     />
                  <br />
                  <ControlLabel>Email</ControlLabel>
                     <FormControl
                        id="email"
                        type="text"
                        value={this.state.email}
                        placeholder="Enter email"
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
         </Modal>)
   }
}