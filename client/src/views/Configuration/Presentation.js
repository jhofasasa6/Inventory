import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Fade,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge
} from "reactstrap";
import { connect } from "react-redux";
import {
  getItemsPresentations,
  addItem,
  deleteItem,
  updateItem
} from "../../actions/presentationAction";
import PropTypes from "prop-types";
import { presentation } from "../../actions/types";
import { getItemsProducts } from "../../actions/productAction";
import { products } from "../../actions/types";
import html from "react-inner-html";

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
      classModal: "",
      headerModal: "",
      message: "",
      buttons: ""
    };
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.cellButtons = this.cellButtons.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.onClickShowProducts = this.onClickShowProducts.bind(this);
  }

  componentDidMount() {
    this.props.getItemsPresentations(presentation);
    this.props.getItemsProducts(products);
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
    if (this.state.name === "") {
      this.configModal(
        "modal-danger ",
        "Presentación",
        "Debe ingresar la presentación a crear",
        <Button color="primary" onClick={this.toggleModal}>
          Aceptar
        </Button>
      );
      return;
    }

    const newItem = {
      name: this.state.name,
      quantity: this.state.quantity
    };

    if (!this.state.update) {
      this.props.addItem(newItem, presentation);
    } else {
      this.props.updateItem(this.state._id, newItem, presentation);
      this.props.getItemsPresentations(presentation);
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

  onDeleteClick(_id) {
    this.setState({ modal: !this.state.modal });
    this.props.deleteItem(_id, presentation);
  }

  onShowModalClick(_id) {
    this.configModal(
      "modal-warning ",
      "Presentación",
      "Desea elimnar esta presentación",
      <div>
        <Button color="danger" onClick={this.onDeleteClick.bind(this, _id)}>
          Sí
        </Button>
        {"  "}
        <Button color="primary" onClick={this.toggleModal}>
          No
        </Button>
      </div>
    );
  }

  cellButtons(cell, row, enumObject, rowIndex) {
    return (
      <div>
        <Button
          onClick={this.onEditClick.bind(this, row._id)}
          size="sm"
          color="primary"
          tootip="Editar"
        >
          <i className="fa fa-edit" />
        </Button>
        {"  "}
        <Button
          onClick={this.onShowModalClick.bind(this, row._id)}
          size="sm"
          color="danger"
          tooltip="Eliminar"
          disabled={
            this.props.product.filter(x => x.presentation._id === row._id)
              .length > 0
              ? true
              : false
          }
        >
          <i className="fa icon-trash" />
        </Button>
        {"  "}
        <Button
          onClick={this.onClickShowProducts.bind(this, row._id)}
          size="sm"
          color="primary"
          tootip="Productos"
          disabled={
            this.props.product.filter(x => x.presentation._id === row._id)
              .length > 0
              ? false
              : true
          }
        >
          <i className="fa fa-cubes" />
        </Button>
      </div>
    );
  }
  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  configModal = (style, title, message, Button) => {
    this.setState({ classModal: style + this.props.className });
    this.setState({ headerModal: `.:: ${title} ::.` });
    this.setState({ message: message });
    this.setState({ buttons: Button });
    this.toggleModal();
  };

  onClickShowProducts(_id) {
    let rows = [];
    const { items } = this.props.item;
    this.props.product.forEach(element => {
      if (element.presentation._id === _id && element.enable) {
        rows.push(
          `<tr>
            <td><li>${element.name} </li></td>
            <td align="center">${element.ActualAmount}</td>
          </tr>`
        );
      }
    });

    this.configModal(
      "modal-primary ",
      `Porductos x Presentación`,
      `<div>
        <Table>
          <thead>
            <tr>
              <th>${items.find(x => x._id === _id).name} x ${
        items.find(x => x._id === _id).quantity
      }</th>
        <th>Disponible</th>
            </tr>
          </thead>
          <tbody>` +
        rows.join("") +
        `</tbody>
        </Table>
      </div>`,
      <Button color="primary" onClick={this.toggleModal}>
        Aceptar
      </Button>
    );
  }

  render() {
    const { items } = this.props.item;
    let button;
    let buttonCancel;
    const ReactBsTable = require("react-bootstrap-table");
    const BootstrapTable = ReactBsTable.BootstrapTable;
    const TableHeaderColumn = ReactBsTable.TableHeaderColumn;
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
          size="lg"
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className={this.state.classModal}
        >
          <ModalHeader toggle={this.toggleModal}>
            <div {...html(this.state.headerModal)} />
          </ModalHeader>
          <ModalBody>
            <div {...html(this.state.message)} />
          </ModalBody>
          <ModalFooter>{this.state.buttons}</ModalFooter>
        </Modal>
        <Row>
          <Col xs="12" sm="4">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Card>
                <CardHeader>
                  <i className="fa icon-settings" />
                  <strong>Presentación de Productos</strong>
                </CardHeader>

                <CardBody>
                  <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                      <Label htmlFor="name">
                        <strong>Tipo Presentación</strong>
                        <small> (Unidad, Caja, Paca, etc..)</small>
                      </Label>
                      <Input
                        type="text"
                        id="namePresentation"
                        name="name"
                        onChange={this.onChange}
                        value={this.state.name}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="name">
                        <strong>Cantidad X Presentación</strong>
                      </Label>
                      <Input
                        type="number"
                        name="quantity"
                        id="quantityPresentation"
                        onChange={this.onChange}
                        value={this.state.quantity}
                        min="0"
                      />
                    </FormGroup>
                    {button} {buttonCancel}
                  </Form>
                </CardBody>
              </Card>
            </Fade>
          </Col>
          <Col xs="12" sm="8">
            <Card>
              <CardHeader>
                <i className="fa icon-social-dropbox" />
                <strong>Tabla Presentacion</strong>{" "}
                <Badge color="success" className="float-right">
                  {items.length}
                </Badge>
              </CardHeader>
              <CardBody>
                <BootstrapTable data={items} striped hover pagination>
                  <TableHeaderColumn isKey dataField="_id" hidden>
                    Product ID
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="name"
                    filter={{ type: "TextFilter", delay: 1000 }}
                    dataSort={true}
                  >
                    Presentación
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="quantity"
                    dataAlign="center"
                    dataSort={true}
                  >
                    Cantidad
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="buttons"
                    dataFormat={this.cellButtons.bind(this)}
                    width="150"
                    dataAlign="center"
                  />
                </BootstrapTable>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

Presentation.propTypes = {
  getItemsPresentations: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  getItemsProducts: PropTypes.func.isRequired,
  product: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  item: state.item,
  product: state.product.items
});

export default connect(
  mapStateToProps,
  { getItemsPresentations, addItem, deleteItem, updateItem, getItemsProducts }
)(Presentation);
