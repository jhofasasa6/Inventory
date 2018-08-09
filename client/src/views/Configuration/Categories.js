import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
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
  getItemsCategories,
  addItem,
  deleteItem,
  updateItem
} from "../../actions/categoryAction";
import PropTypes from "prop-types";
import { categories } from "../../actions/types";
import { getItemsProducts } from "../../actions/productAction";
import { products } from "../../actions/types";
import html from "react-inner-html";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      name: "",
      description: "",
      update: false,
      modal: false,
      _id: "",
      classModal: "",
      headerModal: "",
      message: "",
      buttons: ""
    };
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.cellButtons = this.cellButtons.bind(this);
    this.onClickShowProducts = this.onClickShowProducts.bind(this);
  }

  componentDidMount() {
    this.props.getItemsCategories(categories);
    this.props.getItemsProducts(products);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
    this.setState({ modal: !this.state.modal });
  }

  toggleModal() {
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

  configModal = (style, title, message, Button) => {
    this.setState({ classModal: style + this.props.className });
    this.setState({ headerModal: `.:: ${title} ::.` });
    this.setState({ message: message });
    this.setState({ buttons: Button });
    this.toggleModal();
  };

  onSubmit = e => {
    e.preventDefault();
    if (this.state.name === "") {
      this.configModal(
        "modal-danger ",
        "Categorias",
        "Debe ingresar la Categoria a crear",
        <Button color="primary" onClick={this.toggleModal}>
          Aceptar
        </Button>
      );
      return;
    }

    const newItem = {
      name: this.state.name,
      description: this.state.description
    };

    if (!this.state.update) {
      this.props.addItem(newItem, categories);
    } else {
      this.props.updateItem(this.state._id, newItem, categories);
      this.props.getItemsCategories(categories);
      this.onCancelClick();
    }

    this.setState({ name: "" });
    this.setState({ description: "" });
  };

  onEditClick(_id) {
    const { items } = this.props.item;
    var item = items.filter(item => item._id === _id);
    this.setState({ update: true });
    this.setState({ name: item[0].name });
    this.setState({ description: item[0].description });
    this.setState({ _id: _id });
  }

  onCancelClick() {
    this.setState({ update: false });
    this.setState({ name: "" });
    this.setState({ description: "" });
  }

  onDeleteClick(_id) {
    this.setState({ modal: !this.state.modal });
    this.props.deleteItem(_id, categories);
  }

  onShowModalClick(_id) {
    this.configModal(
      "modal-warning ",
      "Presentación",
      "Desea eliminar esta categoria",
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
        </Button>{" "}
        <Button
          onClick={this.onShowModalClick.bind(this, row._id)}
          size="sm"
          color="danger"
          tooltip="Eliminar"
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
            this.props.product.filter(x => x.category._id === row._id).length >
            0
              ? false
              : true
          }
        >
          <i className="fa fa-cubes" />
        </Button>
      </div>
    );
  }
  onClickShowProducts(_id) {
    let rows = [];
    const { items } = this.props.item;
    this.props.product.forEach(element => {
      if (element.category._id === _id && element.enable) {
        rows.push(
          `<tr>
            <td><li>${element.name} - ${element.presentation.name} x ${
            element.presentation.quantity
          } </li></td>
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
              <th>${items.find(x => x._id === _id).name} </th>
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
                  <strong>Categorias</strong>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id="collapseExample">
                  <CardBody>
                    <Form onSubmit={this.onSubmit}>
                      <FormGroup>
                        <Label htmlFor="name">
                          <strong>Tipo Categoria</strong>
                        </Label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          onChange={this.onChange}
                          className="form-control-warning"
                          value={this.state.name}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="name">
                          <strong>Descripción de la Categoria</strong>
                        </Label>
                        <Input
                          type="textarea"
                          name="description"
                          id="description"
                          onChange={this.onChange}
                          className="form-control-warning"
                          value={this.state.description}
                        />
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
                <i className="fa icon-tag" />
                <strong>Tabla Categorias</strong>{" "}<Badge color="success" className="float-right">{items.length}</Badge>
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
                    Categoria
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="description"
                    dataAlign="center"
                    dataSort={true}
                  >
                    Descripción
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

Categories.propTypes = {
  getItemsCategories: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  getItemsProducts: PropTypes.func.isRequired,
  product: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  item: state.category,
  product: state.product.items
});

export default connect(
  mapStateToProps,
  { getItemsCategories, addItem, deleteItem, updateItem, getItemsProducts }
)(Categories);
