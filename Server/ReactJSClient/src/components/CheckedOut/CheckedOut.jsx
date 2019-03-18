import React, { Component } from 'react';
import './CheckedOut.css';
import { ConfDialog } from '../index';
import { Row, Col, Form, FormGroup, 
   FormControl, ControlLabel, Button,
   ListGroup, ListGroupItem } from 'react-bootstrap';

class CheckedOut extends Component {
   constructor(props) {
      super(props);
      this.state = {
         searchItem: "",
         searchEmail: "",
         showConfDialog: false
      };
      this.props.getChkd();
      this.props.getInvt();

      this.closeConfDialog = this.closeConfDialog.bind(this);
      this.openConfDialog = this.openConfDialog.bind(this);
      this.handleChange = this.handleChange.bind(this);
   }

   handleChange(event) {
      const newState = {};
      newState[event.target.name] = event.target.value;
      this.setState(newState);
   }

   openConfDialog(chkdToReturn, itemToReturn) {
      this.setState({
         showConfDialog: true, 
         chkdToReturn: chkdToReturn, 
         itemToReturn: itemToReturn
      });
   }

   closeConfDialog(result) {
      if (result === 'Ok') {
         this.props.delChkd(this.state.chkdToReturn.id, 
          this.state.itemToReturn.id, this.state.itemToReturn.quantity,
          () => {this.props.getChkd(); this.props.getInvt();});
      }
      this.setState({ showConfDialog: false });
   }



   render() {
      var c = this.props.Chkd.filter(item => {
         if (this.state.searchEmail === "") return true;
         else if (item.email.toLowerCase().includes(this.state.searchEmail.toLowerCase())) return true;
         else return false;
      });

      var i = this.props.Invt.filter(item => {
         if (this.state.searchItem === "") return true;
         else if (item.itemName.toLowerCase().includes(this.state.searchItem.toLowerCase())) return true;
         else return false;
      });

      var display = i.map((item, index) => {
         var itemsCheckedOut = c.filter(chkd => {
            return chkd.invtId === item.id;
         });

         var itemsToShow = itemsCheckedOut.map((its, index) => {
            console.log("ADDING: ", its.firstName);
            return (
               <ListGroupItem key={index}>
               <Row>
                  <Col xs={3}>{its.firstName} {its.lastName}</Col>
                  <Col xs={3}>{its.email}</Col>
                  <Col xs={4}>
                     {new Intl.DateTimeFormat('us',
                     {
                        year: "numeric", month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit", second: "2-digit"
                     })
                     .format(new Date(its.whenChecked))}
                  </Col>
                  <Col xs={2}>
                     <Button onClick={() => this.openConfDialog(its, item)}>
                        Return
                     </Button>
                  </Col>
               </Row>
               </ListGroupItem>
            );
         });
         if (itemsToShow.length) {
            return (
               <div key={index}>
               <h3>{item.itemName}</h3>
               <ListGroup>
                  {itemsToShow.length ? itemsToShow : null}
               </ListGroup>
               </div>
            )
         } else {
            return null;
         };

      })

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
            <Col xs={10}>
            <Form horizontal>
               <FormGroup controlId="formHorizontalEmail">
                  <Col componentClass={ControlLabel} sm={2}>
                     Search
                  </Col>
                  <Col sm={10}>
                     <FormControl
                     type="searchEmail"
                     name="searchEmail"
                     placeholder="Email to search"
                     value={this.state.searchEmail}
                     onChange={this.handleChange}
                     />
                  </Col>
               </FormGroup>
            </Form>
            </Col>
            </Row>
            <ul>
               {display}
            </ul>
            <ConfDialog show={this.state.showConfDialog} title={"Return Item"} 
               body={'Are you sure you want to return the item "' + 
                (this.state.itemToReturn && this.state.itemToReturn.itemName) + 
                '"?'}
               onClose={this.closeConfDialog} />
         </div>
      );
   }
}

export default CheckedOut;
