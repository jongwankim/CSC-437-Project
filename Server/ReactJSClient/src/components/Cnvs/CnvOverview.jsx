import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, ListGroupItem, Col, Row, Button, 
 Glyphicon, Alert } from 'react-bootstrap';
import CnvModal from './CnvModal';
import { ConfDialog } from '../index';
import './CnvOverview.css';

export default class CnvOverview extends Component {
   constructor(props) {
      super(props);
      this.props.updateCnvs();
      this.state = {
         showModal: false,
         showConfirmation: false,
         delCnv: '',
         showModError: false,
         showNewError: false
      };
   }

   componentDidMount() {
      this.props.updateCnvs();
   }

   // Open a model with a |cnv| (optional)
   openModal = (cnv, edit) => {
      const newState = { showModal: true };

      if (cnv)
         newState.cnv = cnv;
      if (edit)
         newState.editCnv = true;
      this.setState(newState);
   }

   modalDismiss = (result) => {
      if (result.status === "Ok") {
         if (this.state.editCnv) {
            this.modCnv(this.state.cnv.id, result.title);
         }
         else
            this.newCnv(result);
      }
      this.setState({ showModal: false, editCnv: null });
   }

   modCnv(id, title) {
      this.props.modCnv(id, title, null, 
      () => this.setState({ showModError: true }));
   }

   newCnv(result) {
      this.props.addCnv({ title: result.title }, null,
      () => this.setState({ showNewError: true }));
   }

   confirmationDismiss = (result) => {
      if (result === "Ok") {
         this.props.delCnv(this.state.delCnv.id);
      }

      this.setState({ delCnv: '', showConfirmation: false });
   }

   openConfirmation = (cnv) => {
      this.setState({ delCnv: cnv, showConfirmation: true });
   }

   errorModDismiss = (result) => {
      this.setState({ showModError: false });
   }

   errorNewDismiss = (result) => {
      this.setState({ showNewError: false });
   }

   componentWillUnmount() {
      this.props.clearErrs();
   }

   componentWillReceiveProps(nextProps) {
      if (this.props.userOnly !== nextProps.userOnly)
         this.props.clearErrs();
   }

   render() {
      const Errs = this.props.Errs.length ? this.props.Errs.map((err, i) => {
         return (<Alert type="danger" key={i} >{err}</Alert>);
      }) : '';

      var cnvItems = [];
      this.props.Cnvs.forEach(cnv => {
         if (!this.props.userOnly || this.props.Prss.id === cnv.ownerId)
            cnvItems.push(<CnvItem
               key={cnv.id}
               id={cnv.id}
               title={cnv.title}
               lastMessage={cnv.lastMessage}
               showControls={cnv.ownerId === this.props.Prss.id || 
                this.props.Prss.role === 1}
               onDelete={() => this.openConfirmation(cnv)}
               onEdit={() => this.openModal(cnv, true)} 
            />);
      });

      return (
         <section className="container">
            <h1>Cnv Overview</h1>
            <ListGroup>
               {cnvItems}
            </ListGroup>
            <Button bsStyle="primary" onClick={() => this.openModal()}>
               New Conversation
            </Button>
            {/* Modal for creating and change cnv */}
            <CnvModal
               showModal={this.state.showModal}
               title={this.state.editCnv ? "Edit title" : "New Conversation"}
               cnv={this.state.cnv}
               modalTitle={"Conversation Title"}
               smallText={"Conversation"}
               onDismiss={this.modalDismiss} />
            <ConfDialog
               show={this.state.showConfirmation} 
               title={"Are you sure you want to delete this conversation?"}
               body={this.state.delCnv.title} 
               onClose={this.confirmationDismiss} />
            {/*<ConfDialog
               show={this.state.showModError} 
               title={"Error Notice"}
               body={Errs} 
               isErr={true}
               onClose={this.errorModDismiss} />
            <ConfDialog
               show={this.state.showNewError} 
               title={"Error Notice"}
               body={Errs} 
               isErr={true}
               onClose={this.errorNewDismiss} />*/}
         </section>
      );
   }
}

// A Cnv list item
const CnvItem = function (props) {
   return (
      <ListGroupItem>
         <Row>
            <Col sm={4}>
               <Link to={"/CnvDetail/" + props.id}>{props.title}</Link></Col>
            {props.lastMessage ? <Col sm={4}>{new Intl.DateTimeFormat('us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(new Date(props.lastMessage))}</Col> : 'N/A'}
            {props.showControls ?
               <div className="pull-right">
                  <Button bsSize="small" onClick={props.onDelete}>
                     <Glyphicon glyph="trash" /></Button>
                  <Button bsSize="small" onClick={props.onEdit}>
                     <Glyphicon glyph="edit" /></Button>
               </div>
               : ''}
         </Row>
      </ListGroupItem>
   );
};
