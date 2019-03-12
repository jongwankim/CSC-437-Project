import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col, 
 Row, Button, Alert } from 'react-bootstrap';
import $ from 'jquery';
import CnvModal from './CnvModal';
import './CnvOverview.css';

export default class CnvOverview extends Component {

   constructor(props) {
      super(props);
      let loc = this.props.location.pathname.split("/");
      let id = loc[loc.length-1];
      this.props.getMsgs(id);
      this.state = {
         cnvId: id,
         showModal: false,
         showConfirmation: false,
         title: this.getCnv(id)
      };

      this.getCnv = this.getCnv.bind(this);
   }

   getCnv = (id) => {
      return this.props.Cnvs
       .filter(cnv => cnv.id.toString() === id.toString())[0].title;
   }


   openModal = (cnv) => {
      const newState = { showModal: true };

      if (cnv)
         newState.cnv = cnv;
      this.setState(newState);
   }

   modalDismiss = (result) => {
      if (result.status === "Ok" && result.title) {
         this.addMsg(result);
      }
      this.setState({ showModal: false });
   }

   addMsg = (result) => {
      this.props.addMsg({content: result.title}, this.state.cnvId);
   }

   render() {
      const Errs = this.props.Errs.length ? this.props.Errs.map((err, i) => {
         return (<Alert type="danger" key={i} >{err}</Alert>);
      }) : '';

      var cnvItems = [];
      this.props.Msgs.forEach((msg, i) => {
         if (!this.props.userOnly || this.props.Prss.id === msg.ownerId)
            cnvItems.push(
            <div key={i}>
            <MsgItem
               key={i}
               msgIndex={i}
               msgId={msg.id}
               email={msg.email}
               content={msg.content}
               whenMade={msg.whenMade}
               isSender={msg.email === this.props.Prss.email}
            />
            <div className="clear"></div></div>
            );
      });

      return (
         <section className="container">
            <h1>{this.state.title}</h1>
            <ListGroup>
               {cnvItems}
            </ListGroup>
            {Errs}
            <Button bsStyle="primary" onClick={() => this.openModal()}>
               New Message
            </Button>
            <CnvModal
               showModal={this.state.showModal}
               title={"New Message"}
               modalTitle={"Message"}
               smallText={"Message"}
               onDismiss={this.modalDismiss} />
         </section>
      )
   }
}


const MsgItem = function (props) {
   return (
      <div className={"cnv-detail " + 
       (props.isSender ? "is-sender" : "not-sender")}>
         <ListGroupItem >
            <Row>
               <Col className="pointer" sm={10} 
                onClick={
                () => {$(".user-info-" + props.msgIndex)
                 .toggle('fast');}}>{props.content}</Col>
            </Row>
         </ListGroupItem>
         <div className={"user-info-" + props.msgIndex}>
            <p>{new Intl.DateTimeFormat('us',
               {
                  year: "numeric", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit", second: "2-digit"
               })
               .format(new Date(props.whenMade))}
               <span>, {props.email} </span>
            </p>
         </div>
      </div>
   )
}