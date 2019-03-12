import React, { PureComponent } from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Properties expected:
 * show: boolean
 * body: string
 * buttons: Array<string>
 */
export default class ConfDialog extends PureComponent {
   constructor(props) {
      super(props);
      console.log("Constructing ConfDialog w/ ", props);
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
               {this.props.body}
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={() => this.close("Ok")}>Ok</Button>
               {this.props.isErr ? '' :
                <Button onClick={() => this.close("Cancel")}>Cancel</Button>}
            </Modal.Footer>
         </Modal>
      );
   }
}