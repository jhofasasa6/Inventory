import React, { Component } from "react";
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Container,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { connect } from "react-redux";
import {
  getItems,
  addItem,
  deleteItem,
  updateItem
} from "../../actions/itemAction";
import PropTypes from "prop-types";
import { presentation } from "../../actions/types";

class Presentation extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      name: "",
      quantity: 0,
      update: false,
      modal: false,
      _id: ""
    };
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
  }

  componentDidMount() {    
    this.props.getItems(presentation);    
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
    this.setState({ modal: !this.state.modal });
  }

  toggleFade() {
    this.setState(prevState => {
      return { fadeIn: !prevState };
    });
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newItem = {
      name: this.state.name,
      quantity: this.state.quantity
    };

    if (!this.state.update) {
      this.props.addItem(newItem, presentation);
    } else {
      this.props.updateItem(this.state._id, newItem, presentation);
      this.props.getItems(presentation);
      this.onCancelClick();
    }

    this.setState({ name: "" });
    this.setState({ quantity: 0 });
  };

  onEditClick(_id) {
    const { items } = this.props.item;
    var item = items.filter(item => item._id === _id);
    this.setState({ update: true });
    this.setState({ name: item[0].name });
    this.setState({ quantity: item[0].quantity });
    this.setState({ _id: _id });
  }

  onCancelClick() {
    this.setState({ update: false });
    this.setState({ name: "" });
    this.setState({ quantity: 0 });
  }

  onDeleteClick() {
    this.setState({ modal: !this.state.modal });
    this.props.deleteItem(this.state._id, presentation);
  }

  onShowModalClick(_id) {
    this.setState({ modal: !this.state.modal });
    this.setState({ _id: _id });
  }

  render() {
    const { items } = this.props.item;
    let button;
    let buttonCancel;
    if (this.state.update) {
      button = (
        <Button type="submit" size="sm" color="success">
          Editar
        </Button>
      );
      buttonCancel = (
        <Button onClick={this.onCancelClick} size="sm" color="warning">
          Cancelar
        </Button>
      );
    } else {
      button = (
        <Button type="submit" size="sm" color="success">
          Guardar
        </Button>
      );
      buttonCancel = "";
    }

    return (
      <div className="animated fadeIn">
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>?</ModalHeader>
          <ModalBody>Desea eliminar el registro?</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onDeleteClick}>
              Aceptar
            </Button>{" "}
          </ModalFooter>
        </Modal>
        <Row>
          <Col xs="12" sm="4">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Card>
                <CardHeader>
                  <i className="fa icon-settings" />
                  <strong>Presentación de Productos</strong>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id="collapseExample">
                  <CardBody>
                    <Form className="was-validated" onSubmit={this.onSubmit}>
                      <FormGroup>
                        <Label htmlFor="name">
                          <strong>Tipo Presentación</strong>
                          <small> (Unidad, Caja, Paca, etc..)</small>
                        </Label>
                        <Input
                          type="text"
                          id="namePresentation"
                          name="name"
                          required
                          onChange={this.onChange}
                          className="form-control-warning"
                          value={this.state.name}
                        />
                        <FormFeedback className="help-block">
                          Ingrese un tipo de presentación
                        </FormFeedback>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="name">
                          <strong>Cantidad X Presentación</strong>
                        </Label>
                        <Input
                          type="number"
                          name="quantity"
                          id="quantityPresentation"
                          required
                          onChange={this.onChange}
                          className="form-control-warning"
                          value={this.state.quantity}
                        />
                        <FormFeedback className="help-block">
                          Ingrese una cantidad para la presentación
                        </FormFeedback>
                      </FormGroup>
                      {button} {buttonCancel}
                    </Form>
                  </CardBody>
                </Collapse>
              </Card>
            </Fade>
          </Col>
          <Col xs="12" sm="8">
            <Card>
              <CardHeader>
                <i className="fa icon-social-dropbox" />
                <strong>Tabla Presentacion</strong>
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Presentacion</th>
                      <th>Cantidad x Presentacion</th>
                      <th>Opciones</th>
                    </tr>
                  </thead>
                  {items.map(({ _id, name, quantity }) => (
                    <tbody key={_id}>
                      <tr>
                        <td>{name}</td>
                        <td>{quantity}</td>
                        <td>
                          <Button
                            onClick={this.onEditClick.bind(this, _id)}
                            size="sm"
                            color="primary"
                            tootip="Editar"
                          >
                            <i className="fa fa-edit" />
                          </Button>{" "}
                          <Button
                            onClick={this.onShowModalClick.bind(this, _id)}
                            size="sm"
                            color="danger"
                            tooltip="Eliminar"
                          >
                            <i className="fa icon-trash" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </Table>
                <Pagination>
                  <PaginationItem disabled>
                    <PaginationLink previous tag="button">
                      Prev
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem active>
                    <PaginationLink tag="button">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink tag="button">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink tag="button">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink tag="button">4</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink next tag="button">
                      Next
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

Presentation.PropTypes = {
  getItems: PropTypes.func.isRequired,
  addItems: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  item: state.item
});

export default connect(
  mapStateToProps,
  { getItems, addItem, deleteItem, updateItem }
)(Presentation); 
