import React, { PureComponent } from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Properties expected:
 * show: boolean
 * body: string
 * buttons: Array<string>
 */
export default class ConfirmDelete extends PureComponent {
   constructor(props) {
      super(props);
   }

   close = (result) => {
      this.props.onClose(result);
   }

   render() {
      return (
         <Modal show={this.props.show} onHide={() => this.close("Dismissed")}>
            <Modal.Header closeButton>
               <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {this.props.message}
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={() => this.close("Ok")}>Ok</Button>
               <Button onClick={() => this.close("Cancel")}>Cancel</Button>
            </Modal.Footer>
         </Modal>
      );
   }
}
/*

            <Modal.Body>
               {this.props.body}
            </Modal.Body>
            */