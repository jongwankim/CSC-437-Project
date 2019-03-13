import React, { Component } from 'react';
import Item from './Item';
import { Row, Col, Form, FormGroup, 
   FormControl, ControlLabel, Button,
   ListGroup, ListGroupItem } from 'react-bootstrap';
import AddItem from './AddItem';
import ConfirmDelete from './ConfirmDelete';
import CheckOutModal from '../CheckedOut/CheckOutModal';
import './Inventory.css';

class Inventory extends Component {

   constructor(props) {
      super(props);
      this.props.getInvt();
      this.state = {
         searchItem: "",
         showModal: false,
         showConfirmDelete: false,
         showCheckOut: false
      }

      this.handleChange = this.handleChange.bind(this);
   }

   handleChange(event) {
      const newState = {};
      newState[event.target.name] = event.target.value;
      this.setState(newState);
   }

   openModal = () => {
      const newState = { showModal: true };
      this.setState(newState);
   }

   modalDismiss = (result) => {
      const newState = this.state;
      if (result.status === "Ok") {
         this.props.addInvt({
            itemName: result.itemName,
            quantity: result.quantity,
            url: result.url
         });
      }
      this.setState({ showModal: false });
   }

   deleteItem = (item) => {
      this.setState({ showConfirmDelete: true, itemDel: item });
   }

   deleteDismiss = (result) => {
      var prevItems = this.state.items;
      if (result === "Ok") {
         console.log("DELETING: ", this.state.itemDel);
         this.props.delInvt(this.state.itemDel.id);
         //prevItems = prevItems.filter(item => item.id !== this.state.itemDel.id);
      }
      this.setState({ showConfirmDelete: false, itemDel: '', items: prevItems });
   }

   openCheckOut = (item) => {
      this.setState({ showCheckOut: true, itemCheckOut: item });
   }

   closeCheckOut = (result) => {
      console.log("RESULT: ", result);
      if (result.status === "Ok") {
         this.props.addChkd({
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email
         }, 
         result.item.id,
         () => {
            this.props.updateQuantity(result.item.id, result.item.quantity-1);
         });
      }
      this.setState({ showCheckOut: false, itemCheckOut: '' });
   }

   render() {

      var Items = this.props.Invt
      .filter(item => {
         if (this.state.searchItem === "") return true;
         else if (item.itemName.toLowerCase().includes(this.state.searchItem.toLowerCase())) return true;
         else return false;
      })
      .sort((a, b) => {
            var A = a.itemName.toLowerCase();
            var B = b.itemName.toLowerCase();
            if (A < B) return -1;
            else if (A > B) return  1;
            else return 0;
      })
      .map((item, index) => {
         return (
            <Col key={index} md={4} xs={6}>
               <Item 
                  item={item} 
                  deleteItem={this.deleteItem}
                  openCheckOut={this.openCheckOut} />
            </Col>
         );
      });
      
      return (
         <div className="container">
         <Row>
         <Col xs={10}>
         <Form horizontal>
            <FormGroup controlId="formHorizontalEmail">
               <Col componentClass={ControlLabel} sm={2}>
                  Search
               </Col>
               <Col sm={10}>
                  <FormControl
                   type="searchItem"
                   name="searchItem"
                   placeholder="Item to search"
                   value={this.state.searchItem}
                   onChange={this.handleChange}
                   />
               </Col>
            </FormGroup>
         </Form>
         </Col>
         <Col xs={2}>
            <div>
               <Button onClick={() => this.openModal()}>
                  Add Item
               </Button>
            </div>
         </Col>
         </Row>
         {Items.length ? Items : <h4>No items found</h4>}  
         <AddItem
               showModal={this.state.showModal}
               title={this.state.editItem ? "Edit Item" : "New Item"}
               modalTitle={"Item"}
               smallText={"Item"}
               onDismiss={this.modalDismiss} /> 
         <ConfirmDelete
               show={this.state.showConfirmDelete} 
               title={"Delete Item"}
               message={"Are you sure you would like to delete " + 
               (this.state.itemDel && this.state.itemDel.itemName) + "?"} 
               onClose={this.deleteDismiss} />
         <CheckOutModal
               showModal={this.state.showCheckOut}
               title={"Checkout " + 
                (this.state.itemCheckOut && 
                 this.state.itemCheckOut.itemName)}
               item={this.state.itemCheckOut}
               modalTitle={"Item"}
               smallText={"Item"}
               onDismiss={this.closeCheckOut} /> 
         </div>
      );
   }
}

export default Inventory;
